import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateProviderLocationDetailsAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateProviderLocationDetails" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track duplicates by External ID + External ID Type combination
        const duplicateTracker = new Map<string, FlatfileRecord[]>();

        records.forEach((record: FlatfileRecord) => {
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          
          if (externalId && externalIdType) {
            const key = `${externalIdType}:${externalId}`;
            
            if (!duplicateTracker.has(key)) {
              duplicateTracker.set(key, []);
            }
            duplicateTracker.get(key)!.push(record);
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

        const validatedRecords = records.map((record: FlatfileRecord) => {
          // Get field values for business rule validation
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const locationKey = record.get("locationKey") as string;
          const credentialingOverride = record.get("credentialingOverride") as string;
          const endDate = record.get("endDate") as string;
          const pendingDate = record.get("pendingDate") as string;
          const taxonomy = record.get("taxonomy") as string;
          const contractedHours = record.get("contractedHours") as string;
          const minAgeSeen = record.get("minAgeSeen") as string;
          const maxAgeSeen = record.get("maxAgeSeen") as string;
          const membershipCapacity = record.get("membershipCapacity") as string;
          const seesPatients = record.get("seesPatients") as string;
          const providerLocationArchived = record.get("providerLocationArchived") as string;
          const acceptingNewPatients = record.get("acceptingNewPatients") as string;
          const pcpOrSpecialist = record.get("pcpOrSpecialist") as string;
          const payerDirectory = record.get("payerDirectory") as string;
          const virtualCare = record.get("virtualCare") as string;
          const telephonicCare = record.get("telephonicCare") as string;
          const remoteMonitoring = record.get("remoteMonitoring") as string;

          // Additional batch-level validations
          // Note: Most validations are handled in the record hook, but some require full dataset context

          // Business rule: Validate that External ID + External ID Type combination is unique
          // (Already handled above in duplicate detection)

          // Business rule: Location Key GUID validation with enhanced checking
          if (locationKey?.trim()) {
            const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
            if (!guidRegex.test(locationKey)) {
              record.addError("locationKey", "Location Key must be a valid GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)");
            }
          }

          // Business rule: Enhanced conditional validations for Credentialing Override
          if (credentialingOverride === "End Date" && !endDate?.trim()) {
            record.addError("endDate", "End Date is required when Credentialing Override is 'End Date'");
          }
          
          if (credentialingOverride === "Pending" && !pendingDate?.trim()) {
            record.addError("pendingDate", "Pending Date is required when Credentialing Override is 'Pending'");
          }

          // Business rule: Character limit validations
          if (taxonomy && taxonomy.length > 100) {
            record.addError("taxonomy", "Taxonomy exceeds character limit of 100");
          }

          if (contractedHours && contractedHours.length > 10) {
            record.addError("contractedHours", "Contracted Hours exceeds character limit of 10");
          }

          if (minAgeSeen && minAgeSeen.length > 120) {
            record.addError("minAgeSeen", "Min Age Seen exceeds character limit of 120");
          }

          if (maxAgeSeen && maxAgeSeen.length > 120) {
            record.addError("maxAgeSeen", "Max Age Seen exceeds character limit of 120");
          }

          if (membershipCapacity && membershipCapacity.length > 4) {
            record.addError("membershipCapacity", "Membership Capacity exceeds character limit of 9999");
          }

          // Business rule: Y/N validations
          const validateYesNo = (value: string, fieldName: string, fieldLabel: string) => {
            if (value?.trim() && !["Y", "N"].includes(value)) {
              record.addError(fieldName, `${fieldLabel} must be Y or N`);
            }
          };

          validateYesNo(seesPatients, "seesPatients", "Sees Patients?");
          validateYesNo(providerLocationArchived, "providerLocationArchived", "Provider Location Archived?");
          validateYesNo(acceptingNewPatients, "acceptingNewPatients", "Accepting New Patients");
          validateYesNo(payerDirectory, "payerDirectory", "Payer Directory");
          validateYesNo(virtualCare, "virtualCare", "Virtual Care");
          validateYesNo(telephonicCare, "telephonicCare", "Telephonic Care");
          validateYesNo(remoteMonitoring, "remoteMonitoring", "Remote Monitoring");

          // Business rule: PCP or Specialist validation
          if (pcpOrSpecialist?.trim() && !["", "PCP", "Specialist"].includes(pcpOrSpecialist)) {
            record.addError("pcpOrSpecialist", "PCP/Specialist must be 'Blank', 'PCP' or 'Specialist'");
          }

          // Validate User Defined Fields (X1-X10) character limits
          for (let i = 1; i <= 10; i++) {
            const fieldName = `x${i}`;
            const fieldValue = record.get(fieldName) as string;
            if (fieldValue && fieldValue.length > 50) {
              record.addError(fieldName, `${fieldName.toUpperCase()} exceeds character limit of 50`);
            }
          }

          return record;
        });

        return validatedRecords;

      } catch (error) {
        console.error("Error in Provider Location Details validation:", error);
        throw error;
      }
    }
  );
};