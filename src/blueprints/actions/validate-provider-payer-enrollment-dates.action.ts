import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateProviderPayerEnrollmentDatesAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateProviderPayerEnrollmentDates" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track duplicates by External ID + External ID Type combination
        const duplicateTracker = new Map<string, FlatfileRecord[]>();

        // Track Payer Provider ID consistency within Provider + Location + Payer combinations
        const payerProviderIdTracker = new Map<string, { records: FlatfileRecord[], payerProviderIds: Set<string> }>();

        records.forEach((record: FlatfileRecord) => {
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const locationKey = record.get("locationKey") as string;
          const payerKey = record.get("payerKey") as string;
          const payerProviderId = record.get("payerProviderId") as string;
          
          // Duplicate detection by External ID + External ID Type
          if (externalId && externalIdType) {
            const duplicateKey = `${externalIdType}:${externalId}`;
            
            if (!duplicateTracker.has(duplicateKey)) {
              duplicateTracker.set(duplicateKey, []);
            }
            duplicateTracker.get(duplicateKey)!.push(record);
          }

          // Track Payer Provider ID consistency for same Provider + Location + Payer
          if (externalId && externalIdType && locationKey && payerKey) {
            const consistencyKey = `${externalIdType}:${externalId}:${locationKey}:${payerKey}`;
            
            if (!payerProviderIdTracker.has(consistencyKey)) {
              payerProviderIdTracker.set(consistencyKey, { records: [], payerProviderIds: new Set() });
            }
            
            const tracker = payerProviderIdTracker.get(consistencyKey)!;
            tracker.records.push(record);
            if (payerProviderId?.trim()) {
              tracker.payerProviderIds.add(payerProviderId);
            }
          }
        });

        // Process duplicate detection
        duplicateTracker.forEach((duplicateRecords, key) => {
          if (duplicateRecords.length > 1) {
            duplicateRecords.forEach((record) => {
              record.addError("externalId", `Duplicate records exist in file with same External ID Type and External ID combination`);
            });
          }
        });

        // Process Payer Provider ID consistency warnings
        payerProviderIdTracker.forEach((tracker, key) => {
          if (tracker.payerProviderIds.size > 1) {
            // Multiple different Payer Provider IDs for same Provider + Location + Payer
            tracker.records.forEach((record) => {
              record.addWarning("payerProviderId", "Payer Provider ID is not the same for all import records with same Provider, Location, and Payer");
            });
          }
        });

        const validatedRecords = records.map((record: FlatfileRecord) => {
          // Get field values for business rule validation
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const locationKey = record.get("locationKey") as string;
          const payerKey = record.get("payerKey") as string;
          const workflowKey = record.get("workflowKey") as string;
          const resolution = record.get("resolution") as string;
          const effectiveDate = record.get("effectiveDate") as string;
          const reEnrollmentDate = record.get("reEnrollmentDate") as string;
          const payerProviderId = record.get("payerProviderId") as string;

          // Additional batch-level validations
          // Note: Most validations are handled in the record hook, but some require full dataset context

          // Business rule: GUID validations with enhanced checking
          const validateGUID = (guidValue: string, fieldName: string, fieldLabel: string) => {
            if (guidValue?.trim()) {
              const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
              if (!guidRegex.test(guidValue)) {
                record.addError(fieldName, `${fieldLabel} must be a valid GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)`);
              }
            }
          };

          validateGUID(locationKey, "locationKey", "Location Key");
          validateGUID(payerKey, "payerKey", "Payer Key");
          validateGUID(workflowKey, "workflowKey", "Workflow Key");

          // Business rule: Resolution validation
          if (resolution?.trim()) {
            const validResolutions = ["Approved", "Participating", "Rejected", "Denied", "Withdrawn", "Non-Participating", "Non-Billing", "Terminated"];
            if (!validResolutions.includes(resolution)) {
              record.addError("resolution", "Resolution must be Approved, Participating, Rejected, Denied, Withdrawn, Non-Participating, Non-Billing, or Terminated");
            }
          }

          // Business rule: Date format validation
          const validateDate = (dateValue: string, fieldName: string, fieldLabel: string) => {
            if (dateValue?.trim()) {
              const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
              if (!dateRegex.test(dateValue)) {
                record.addError(fieldName, `${fieldLabel} must be formatted as m/d/yyyy`);
                return null;
              } else {
                const [month, day, year] = dateValue.split('/').map(Number);
                const date = new Date(year, month - 1, day);
                if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
                  record.addError(fieldName, `${fieldLabel} must be a valid date`);
                  return null;
                }
                return date;
              }
            }
            return null;
          };

          const effectiveDateObj = validateDate(effectiveDate, "effectiveDate", "Effective Date");
          const reEnrollmentDateObj = validateDate(reEnrollmentDate, "reEnrollmentDate", "Re-Enrollment Date");

          // Business rule: Resolution-dependent date validations
          if (resolution?.trim()) {
            const approvedParticipatingResolutions = ["Approved", "Participating"];
            
            if (effectiveDate?.trim() && !approvedParticipatingResolutions.includes(resolution)) {
              record.addError("effectiveDate", "Effective Date can only be input if Resolution is Approved or Participating");
            }

            if (reEnrollmentDate?.trim() && !approvedParticipatingResolutions.includes(resolution)) {
              record.addError("reEnrollmentDate", "Re-enrollment Date can only be input if Resolution is Approved or Participating");
            }
          }

          // Business rule: Re-Enrollment Date must be after Effective Date
          if (effectiveDateObj && reEnrollmentDateObj) {
            if (reEnrollmentDateObj <= effectiveDateObj) {
              record.addError("reEnrollmentDate", "Re-enrollment Date must be after Effective Date");
            }
          }

          // Business rule: Payer Provider ID character limit
          if (payerProviderId && payerProviderId.length > 50) {
            record.addError("payerProviderId", "Payer Provider ID exceeds character limit of 50");
          }

          // Business rule: External ID Type validation
          if (externalIdType?.trim() && !["NPI", "InternalID", "ProviderID", "EmrID", "BillingSystemID"].includes(externalIdType)) {
            record.addError("externalIdType", "External ID Type must be NPI, InternalID, ProviderID, EmrID, or BillingSystemID");
          }

          // Business rule: External ID and External ID Type dependency
          if ((externalId?.trim() && !externalIdType?.trim()) || (!externalId?.trim() && externalIdType?.trim())) {
            record.addError("externalId", "Must provide both External ID and External ID Type");
            record.addError("externalIdType", "Must provide both External ID and External ID Type");
          }

          return record;
        });

        return validatedRecords;

      } catch (error) {
        console.error("Error in Provider Payer Enrollment Dates validation:", error);
        throw error;
      }
    }
  );
};