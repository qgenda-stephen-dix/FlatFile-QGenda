import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const providerPayerEnrollmentDatesValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("provider-payer-enrollment-dates", (record) => {
      // Get all field values
      const externalId = record.get("externalId") as string;
      const externalIdType = record.get("externalIdType") as string;
      const locationKey = record.get("locationKey") as string;
      const payerKey = record.get("payerKey") as string;
      const workflowKey = record.get("workflowKey") as string;
      const resolution = record.get("resolution") as string;
      const effectiveDate = record.get("effectiveDate") as string;
      const reEnrollmentDate = record.get("reEnrollmentDate") as string;
      const payerProviderId = record.get("payerProviderId") as string;

      // Required field validations
      if (!externalId?.trim()) {
        record.addError("externalId", "External ID is required");
      }

      if (!externalIdType?.trim()) {
        record.addError("externalIdType", "External ID Type is required");
      }

      if (!locationKey?.trim()) {
        record.addError("locationKey", "Location Key is required");
      }

      if (!payerKey?.trim()) {
        record.addError("payerKey", "Payer Key is required");
      }

      if (!workflowKey?.trim()) {
        record.addError("workflowKey", "Workflow Key is required");
      }

      if (!resolution?.trim()) {
        record.addError("resolution", "Resolution is required");
      }

      // External ID Type validation - must be one of specific values
      if (externalIdType?.trim() && !["NPI", "InternalID", "ProviderID", "EmrID", "BillingSystemID"].includes(externalIdType)) {
        record.addError("externalIdType", "External ID Type must be NPI, InternalID, ProviderID, EmrID, or BillingSystemID");
      }

      // External ID and External ID Type dependency validation
      if ((externalId?.trim() && !externalIdType?.trim()) || (!externalId?.trim() && externalIdType?.trim())) {
        record.addError("externalId", "Must provide both External ID and External ID Type");
        record.addError("externalIdType", "Must provide both External ID and External ID Type");
      }

      // GUID format validation helper function
      const validateGUID = (guidValue: string, fieldName: string, fieldLabel: string) => {
        if (guidValue?.trim()) {
          const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
          if (!guidRegex.test(guidValue)) {
            record.addError(fieldName, `${fieldLabel} must be a valid GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)`);
          }
        }
      };

      // GUID field validations
      validateGUID(locationKey, "locationKey", "Location Key");
      validateGUID(payerKey, "payerKey", "Payer Key");
      validateGUID(workflowKey, "workflowKey", "Workflow Key");

      // Resolution validation
      if (resolution?.trim()) {
        const validResolutions = ["Approved", "Participating", "Rejected", "Denied", "Withdrawn", "Non-Participating", "Non-Billing", "Terminated"];
        if (!validResolutions.includes(resolution)) {
          record.addError("resolution", "Resolution must be Approved, Participating, Rejected, Denied, Withdrawn, Non-Participating, Non-Billing, or Terminated");
        }
      }

      // Date format validation helper function
      const validateDate = (dateValue: string, fieldName: string, fieldLabel: string) => {
        if (dateValue?.trim()) {
          // Basic date format validation - Flatfile will handle detailed date parsing
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
          if (!dateRegex.test(dateValue)) {
            record.addError(fieldName, `${fieldLabel} must be formatted as m/d/yyyy`);
            return null;
          } else {
            // Additional validation for invalid dates like 2/31/2023
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

      // Date field validations
      const effectiveDateObj = validateDate(effectiveDate, "effectiveDate", "Effective Date");
      const reEnrollmentDateObj = validateDate(reEnrollmentDate, "reEnrollmentDate", "Re-Enrollment Date");

      // Resolution-dependent date validations
      if (resolution?.trim()) {
        const approvedParticipatingResolutions = ["Approved", "Participating"];
        
        // Effective Date can only be input if Resolution is Approved or Participating
        if (effectiveDate?.trim() && !approvedParticipatingResolutions.includes(resolution)) {
          record.addError("effectiveDate", "Effective Date can only be input if Resolution is Approved or Participating");
        }

        // Re-Enrollment Date can only be input if Resolution is Approved or Participating
        if (reEnrollmentDate?.trim() && !approvedParticipatingResolutions.includes(resolution)) {
          record.addError("reEnrollmentDate", "Re-enrollment Date can only be input if Resolution is Approved or Participating");
        }
      }

      // Re-Enrollment Date must be after Effective Date
      if (effectiveDateObj && reEnrollmentDateObj) {
        if (reEnrollmentDateObj <= effectiveDateObj) {
          record.addError("reEnrollmentDate", "Re-enrollment Date must be after Effective Date");
        }
      }

      // Payer Provider ID character limit validation
      if (payerProviderId && payerProviderId.length > 50) {
        record.addError("payerProviderId", "Payer Provider ID exceeds character limit of 50");
      }

      return record;
    })
  );
};