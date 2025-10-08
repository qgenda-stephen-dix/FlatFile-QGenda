import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateOtherCertificationAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateOtherCertification" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        const validatedRecords = records.map((record: FlatfileRecord) => {
          const external_id = record.get("external_id") as string;
          const external_id_type = record.get("external_id_type") as string;
          const certification = record.get("certification") as string;
          const certification_number = record.get("certification_number") as string;
          const classification = record.get("classification") as string;
          const status = record.get("status") as string;
          const issue_date = record.get("issue_date") as string;
          const expires_on = record.get("expires_on") as string;
          const monitor_expiration_date = record.get("monitor_expiration_date") as string;
          const record_viewable_by_provider = record.get("record_viewable_by_provider") as string;
          const ignore_required_fields_validation = record.get("ignore_required_fields_validation") as string;
          const file_viewable_by_provider = record.get("file_viewable_by_provider") as string;
          const file_key = record.get("file_key") as string;
          const note = record.get("note") as string;
          const user = record.get("user") as string;
          const timestamp = record.get("timestamp") as string;

          // Required field validations
          if (!external_id?.trim()) {
            record.addError("external_id", "External Id required");
          }

          if (!external_id_type?.trim()) {
            record.addError("external_id_type", "External Id Type required");
          } else if (!["InternalID", "BillingSystemID"].includes(external_id_type)) {
            record.addError("external_id_type", "External ID Type not valid");
          }

          if (!certification?.trim()) {
            record.addError("certification", "Certification required");
          }

          if (!status?.trim()) {
            record.addError("status", "Status required");
          } else if (!["Active", "Inactive", "Pending", "Expired", "Suspended"].includes(status)) {
            record.addError("status", "Status not supported");
          }

          // Character limit validations
          if (certification_number && certification_number.length > 50) {
            record.addError("certification_number", "Certification Number exceeds character limit of 50");
          }

          if (classification && classification.length > 200) {
            record.addError("classification", "Classification exceeds character limit of 200");
          }

          if (note && note.length > 10000) {
            record.addError("note", "Note exceeds character limit of 10000");
          }

          // Date validations
          if (issue_date && expires_on) {
            const issueDate = new Date(issue_date);
            const expirationDate = new Date(expires_on);
            if (issueDate >= expirationDate) {
              record.addError("issue_date", "Issue Date must be before Expiration Date");
            }
          }

          // Date format validation (basic check)
          const dateFields = [
            { key: "issue_date", label: "Issue Date", value: issue_date },
            { key: "expires_on", label: "Expiration Date", value: expires_on },
            { key: "timestamp", label: "Timestamp", value: timestamp }
          ];

          dateFields.forEach(({ key, label, value }) => {
            if (value && value.trim()) {
              const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
              if (!dateRegex.test(value)) {
                record.addError(key, `${label} must be formatted as m/d/yyyy`);
              } else {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                  record.addError(key, `${label} must be formatted as m/d/yyyy`);
                }
              }
            }
          });

          // T/F field validations
          const tfFields = [
            { key: "monitor_expiration_date", label: "Monitor Expiration Date", value: monitor_expiration_date },
            { key: "record_viewable_by_provider", label: "Record Viewable by Provider", value: record_viewable_by_provider },
            { key: "file_viewable_by_provider", label: "File Viewable by Provider", value: file_viewable_by_provider }
          ];

          tfFields.forEach(({ key, label, value }) => {
            if (value && value.trim() && !["T", "F"].includes(value)) {
              record.addError(key, `${label} must be T or F`);
            }
          });

          // Y/N field validation
          if (ignore_required_fields_validation && ignore_required_fields_validation.trim() && !["Y", "N"].includes(ignore_required_fields_validation)) {
            record.addError("ignore_required_fields_validation", "Ignore Required Fields Validation? must be Y or N");
          }

          // Cross-field validations
          if (record_viewable_by_provider === "F" && file_viewable_by_provider === "T") {
            record.addWarning("file_viewable_by_provider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
          }

          // Both or neither validation
          const hasRecordViewable = record_viewable_by_provider && record_viewable_by_provider.trim();
          const hasFileViewable = file_viewable_by_provider && file_viewable_by_provider.trim();
          if ((hasRecordViewable && !hasFileViewable) || (!hasRecordViewable && hasFileViewable)) {
            record.addError("record_viewable_by_provider", "If one of Record Viewable by Provider or File Viewable by Provider are imported, the other must also be imported");
            record.addError("file_viewable_by_provider", "If one of Record Viewable by Provider or File Viewable by Provider are imported, the other must also be imported");
          }

          // File Key GUID validation
          if (file_key && file_key.trim()) {
            const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!guidRegex.test(file_key)) {
              record.addError("file_key", "File Key must be a valid GUID");
            }
          }

          // User validation warning
          if (!user || !user.trim()) {
            record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
          }

          return record;
        });

        // Submit the validated records
        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Other Certification validation:", error);
        throw error;
      }
    }
  );
};