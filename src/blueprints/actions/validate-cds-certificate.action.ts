import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateCDSCertificateAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateCDSCertificate" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track License Number + State combinations for duplicate detection
        const seenCombinations = new Map<string, number>();

        const validatedRecords = records.map((record: FlatfileRecord, index: number) => {
          const externalId = record.get("external_id") as string;
          const externalIdType = record.get("external_id_type") as string;
          const autoVerify = record.get("auto_verify") as string;
          const licenseNumber = record.get("license_number") as string;
          const state = record.get("state") as string;
          const schedule = record.get("schedule") as string;
          const status = record.get("status") as string;
          const disciplineOnFile = record.get("discipline_on_file") as string;
          const issueDate = record.get("issue_date") as string;
          const expirationDate = record.get("expiration_date") as string;
          const monitorExpirationDate = record.get("monitor_expiration_date") as string;
          const recordViewableByProvider = record.get("record_viewable_by_provider") as string;
          const fileViewableByProvider = record.get("file_viewable_by_provider") as string;
          const ignoreRequiredFieldsValidation = record.get("ignore_required_fields_validation") as string;
          const fileKey = record.get("file_key") as string;
          const note = record.get("note") as string;
          const user = record.get("user") as string;
          const timestamp = record.get("timestamp") as string;

          const currentRowNumber = index + 1;

          // Duplicate checking on License Number and State
          if (licenseNumber?.trim() && state?.trim()) {
            const combination = `${licenseNumber.trim()}|${state.trim()}`;
            
            if (seenCombinations.has(combination)) {
              const firstOccurrence = seenCombinations.get(combination)!;
              record.addError(
                "license_number", 
                `Line ${currentRowNumber} failed because attempting to populate same record as Line ${firstOccurrence}.`
              );
            } else {
              seenCombinations.set(combination, currentRowNumber);
            }
          }

          // Apply all the same validations from the listener
          // Required field validations
          if (!externalId?.trim()) {
            record.addError("external_id", "External Id required");
          }

          if (!externalIdType?.trim()) {
            record.addError("external_id_type", "External Id Type required");
          }

          if (!autoVerify?.trim()) {
            record.addError("auto_verify", "Auto-Verify? must be Y or N");
          }

          if (!licenseNumber?.trim()) {
            record.addError("license_number", "License Number required");
          }

          if (!state?.trim()) {
            record.addError("state", "State required");
          }

          if (!expirationDate?.trim()) {
            record.addError("expiration_date", "Expiration Date required");
          }

          // Y/N validations
          if (autoVerify?.trim() && !["Y", "N"].includes(autoVerify.trim())) {
            record.addError("auto_verify", "Auto-Verify? must be Y or N");
          }

          if (disciplineOnFile?.trim() && !["Y", "N"].includes(disciplineOnFile.trim())) {
            record.addError("discipline_on_file", "Discipline on File? must be Y or N");
          }

          if (ignoreRequiredFieldsValidation?.trim() && !["Y", "N"].includes(ignoreRequiredFieldsValidation.trim())) {
            record.addError("ignore_required_fields_validation", "Ignore Required Fields Validation? must be Y or N");
          }

          // T/F validations
          if (monitorExpirationDate?.trim() && !["T", "F"].includes(monitorExpirationDate.trim())) {
            record.addError("monitor_expiration_date", "Monitor Expiration Date must be T or F");
          }

          if (recordViewableByProvider?.trim() && !["T", "F"].includes(recordViewableByProvider.trim())) {
            record.addError("record_viewable_by_provider", "Record Viewable by Provider must be T or F");
          }

          if (fileViewableByProvider?.trim() && !["T", "F"].includes(fileViewableByProvider.trim())) {
            record.addError("file_viewable_by_provider", "File Viewable by Provider must be T or F");
          }

          // Cross-field validation for viewable fields
          if ((recordViewableByProvider?.trim() || fileViewableByProvider?.trim())) {
            if (!recordViewableByProvider?.trim() || !fileViewableByProvider?.trim()) {
              record.addError("record_viewable_by_provider", "If one of Record Viewable by Provider or File Viewable by Provider are imported, the other must also be imported");
            }
          }

          // Warning for viewable fields logic
          if (recordViewableByProvider === "F" && fileViewableByProvider === "T") {
            record.addInfo("file_viewable_by_provider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
          }

          // Date format validation (m/d/yyyy)
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
          
          if (issueDate?.trim() && !dateRegex.test(issueDate.trim())) {
            record.addError("issue_date", "Issue Date must be formatted as m/d/yyyy");
          }

          if (expirationDate?.trim() && !dateRegex.test(expirationDate.trim())) {
            record.addError("expiration_date", "Expiration Date must be formatted as m/d/yyyy");
          }

          if (timestamp?.trim() && !dateRegex.test(timestamp.trim())) {
            record.addError("timestamp", "Timestamp must be formatted as m/d/yyyy");
          }

          // Date logic validation (issue date before expiration date)
          if (issueDate?.trim() && expirationDate?.trim()) {
            try {
              const issue = new Date(issueDate);
              const expiration = new Date(expirationDate);
              
              if (issue >= expiration) {
                record.addError("issue_date", "Issue Date must be before Expiration Date");
              }
            } catch {
              // Date parsing errors already handled by format validation
            }
          }

          // GUID format validation for File Key
          const guidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
          
          if (fileKey?.trim() && !guidRegex.test(fileKey.trim())) {
            record.addError("file_key", "File Key must be a valid GUID");
          }

          // Character limit validation
          if (note && note.length > 10000) {
            record.addError("note", "Note exceeds character limit of 10000");
          }

          // Warning for empty user field
          if (!user?.trim()) {
            record.addInfo("user", "No User listed, so 'Credentialing System' will be listed");
          }

          // TODO: Implement API-based validations:
          // 1. External ID Type validation against acceptable options
          // if (externalIdType?.trim()) {
          //   const validExternalIdTypes = ['NPI', 'SSN', 'Custom']; // Get from API
          //   if (!validExternalIdTypes.includes(externalIdType.trim())) {
          //     record.addError("external_id_type", "External ID Type not valid");
          //   }
          // }

          // 2. State validation against state dropdown
          // if (state?.trim()) {
          //   const validStates = ['AL', 'AK', 'AZ', ...]; // Get from API
          //   if (!validStates.includes(state.trim())) {
          //     record.addError("state", "State not supported");
          //   }
          // }

          // 3. Schedule validation
          // if (schedule?.trim()) {
          //   const scheduleValues = schedule.split('|').map(s => s.trim());
          //   const validSchedules = ['1', '2', '3', '3N', '4', '5']; // Get from API
          //   const invalidSchedules = scheduleValues.filter(s => !validSchedules.includes(s));
          //   if (invalidSchedules.length > 0) {
          //     record.addError("schedule", "At least one Schedule value not supported");
          //   }
          // }

          // 4. Status validation
          // if (status?.trim()) {
          //   const validStatuses = ['Active', 'Inactive', 'Pending']; // Get from API
          //   if (!validStatuses.includes(status.trim())) {
          //     record.addError("status", "Status not supported");
          //   }
          // }

          // 5. File Key business logic validations
          // 6. User validation against Cred Spec emails

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in CDS Certificate validation:", error);
        throw error;
      }
    }
  );
};