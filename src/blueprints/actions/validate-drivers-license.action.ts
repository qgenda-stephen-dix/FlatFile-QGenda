import api from "@flatfile/api";
import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateDriversLicenseAction = (listener: FlatfileListener) => {
  listener.filter({ job: "sheet:validateDriversLicense" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { jobId, sheetId } = event.context;

      try {
        await api.jobs.ack(jobId, {
          info: "Starting Driver's License validation...",
          progress: 10,
        });

        const records = await api.records.get(sheetId);

        let validRecords = 0;
        let errorRecords = 0;
        const duplicateExternalIds = new Set<string>();
        const externalIdCombinations = new Map<string, number>();

        // Track duplicate External ID combinations for validation
        records.data.records?.forEach((record, index) => {
          const externalId = record.values.external_id?.value as string;
          const externalIdType = record.values.external_id_type?.value as string;
          
          if (externalId?.trim() && externalIdType?.trim()) {
            const combination = `${externalId.trim()}|${externalIdType.trim()}`;
            if (externalIdCombinations.has(combination)) {
              duplicateExternalIds.add(combination);
            } else {
              externalIdCombinations.set(combination, index);
            }
          }
        });

        await api.jobs.ack(jobId, {
          info: "Validating Driver's License records...",
          progress: 50,
        });

        const updatedRecords = records.data.records?.map((record, index) => {
          const messages: any[] = [];

          // Get field values
          const externalId = record.values.external_id?.value as string;
          const externalIdType = record.values.external_id_type?.value as string;
          const stateProvince = record.values.state_province?.value as string;
          const licenseNumber = record.values.license_number?.value as string;
          const nameAsAppearsOnLicense = record.values.name_as_appears_on_license?.value as string;
          const issueDate = record.values.issue_date?.value as string;
          const expiresOn = record.values.expires_on?.value as string;
          const monitorExpirationDate = record.values.monitor_expiration_date?.value as string;
          const recordViewableByProvider = record.values.record_viewable_by_provider?.value as string;
          const fileViewableByProvider = record.values.file_viewable_by_provider?.value as string;
          const fileKey = record.values.file_key?.value as string;
          const note = record.values.note?.value as string;
          const user = record.values.user?.value as string;
          const timestamp = record.values.timestamp?.value as string;

          // Required field validations
          if (!externalId?.trim()) {
            messages.push({
              type: "error",
              field: "external_id",
              message: "External Id required"
            });
          }

          if (!externalIdType?.trim()) {
            messages.push({
              type: "error",
              field: "external_id_type",
              message: "External Id Type required"
            });
          }

          if (!stateProvince?.trim()) {
            messages.push({
              type: "error",
              field: "state_province",
              message: "State required"
            });
          }

          // Duplicate External ID validation
          if (externalId?.trim() && externalIdType?.trim()) {
            const combination = `${externalId.trim()}|${externalIdType.trim()}`;
            if (duplicateExternalIds.has(combination)) {
              messages.push({
                type: "error",
                field: "external_id",
                message: "Duplicate External ID and External ID Type combination found in file"
              });
            }
          }

          // Character limit validations
          if (licenseNumber && licenseNumber.length > 50) {
            messages.push({
              type: "error",
              field: "license_number",
              message: "License Number exceeds character limit of 50"
            });
          }

          if (nameAsAppearsOnLicense && nameAsAppearsOnLicense.length > 50) {
            messages.push({
              type: "error",
              field: "name_as_appears_on_license",
              message: "Name as Appears on License exceeds character limit of 50"
            });
          }

          if (note && note.length > 10000) {
            messages.push({
              type: "error",
              field: "note",
              message: "Note exceeds character limit of 10000"
            });
          }

          // Date format validation
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

          if (issueDate && !dateRegex.test(issueDate)) {
            messages.push({
              type: "error",
              field: "issue_date",
              message: "Issue Date must be formatted as m/d/yyyy"
            });
          }

          if (expiresOn && !dateRegex.test(expiresOn)) {
            messages.push({
              type: "error",
              field: "expires_on",
              message: "Expires On must be formatted as m/d/yyyy"
            });
          }

          if (timestamp && !dateRegex.test(timestamp)) {
            messages.push({
              type: "error",
              field: "timestamp",
              message: "Timestamp must be formatted as m/d/yyyy"
            });
          }

          // Date validation logic
          if (issueDate && expiresOn && dateRegex.test(issueDate) && dateRegex.test(expiresOn)) {
            const [issueMonth, issueDay, issueYear] = issueDate.split('/').map(Number);
            const [expiresMonth, expiresDay, expiresYear] = expiresOn.split('/').map(Number);
            
            const issueDateObj = new Date(issueYear, issueMonth - 1, issueDay);
            const expiresDateObj = new Date(expiresYear, expiresMonth - 1, expiresDay);
            
            if (issueDateObj >= expiresDateObj) {
              messages.push({
                type: "error",
                field: "issue_date",
                message: "Issue Date must be before Expiration Date"
              });
            }
          }

          // T/F validation
          if (monitorExpirationDate && monitorExpirationDate.trim() && !["T", "F"].includes(monitorExpirationDate.trim())) {
            messages.push({
              type: "error",
              field: "monitor_expiration_date",
              message: "Monitor Expiration Date must be T or F"
            });
          }

          if (recordViewableByProvider && recordViewableByProvider.trim() && !["T", "F"].includes(recordViewableByProvider.trim())) {
            messages.push({
              type: "error",
              field: "record_viewable_by_provider",
              message: "Record Viewable by Provider must be T or F"
            });
          }

          if (fileViewableByProvider && fileViewableByProvider.trim() && !["T", "F"].includes(fileViewableByProvider.trim())) {
            messages.push({
              type: "error",
              field: "file_viewable_by_provider",
              message: "File Viewable by Provider must be T or F"
            });
          }

          // Business rule warning
          if (recordViewableByProvider === "F" && fileViewableByProvider === "T") {
            messages.push({
              type: "warning",
              field: "file_viewable_by_provider",
              message: "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'"
            });
          }

          // GUID format validation
          if (fileKey && fileKey.trim()) {
            const guidRegex = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
            if (!guidRegex.test(fileKey.trim())) {
              messages.push({
                type: "error",
                field: "file_key",
                message: "File Key must be a valid GUID"
              });
            }
          }

          // User validation warning
          if (!user?.trim()) {
            messages.push({
              type: "warning",
              field: "user",
              message: "No User listed, so \"Credentialing System\" will be listed"
            });
          }

          // State validation (basic check)
          if (stateProvince && stateProvince.trim()) {
            const validStates = [
              "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
              "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
              "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
              "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
              "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
              "DC"
            ];
            
            if (!validStates.includes(stateProvince.trim().toUpperCase())) {
              messages.push({
                type: "error",
                field: "state_province",
                message: "State/province not supported"
              });
            }
          }

          // TODO: Additional import-level validations would include:
          // - External ID matching against existing providers
          // - File Key validation against actual file database
          // - User email validation against Cred Spec emails
          // - Provider active/inactive status checks

          if (messages.some(m => m.type === "error")) {
            errorRecords++;
          } else {
            validRecords++;
          }

          return {
            ...record,
            messages: messages
          };
        }) || [];

        await api.records.update(sheetId, updatedRecords);

        await api.jobs.complete(jobId, {
          outcome: {
            message: `Driver's License validation completed. ${validRecords} valid records, ${errorRecords} records with errors. Found ${duplicateExternalIds.size} duplicate External ID combinations.`,
          },
        });

      } catch (error) {
        console.error("Error in Driver's License validation:", error);
        
        await api.jobs.fail(jobId, {
          outcome: {
            message: `Driver's License validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        });
      }
    });
  });
};