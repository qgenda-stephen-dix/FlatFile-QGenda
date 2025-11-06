import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

/**
 * Education Gap Validation Listener
 * CRED-34567
 * 
 * Validates education gap records including:
 * - Required fields (external_id, external_id_type, start_date, end_date)
 * - Character limits (reason: 200, explanation: 1000)
 * - Date format validation (m/d/yyyy)
 * - Viewability field cross-validation
 * - GUID format validation for file_key
 */
export const educationGapValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("education-gap", (record) => {
      // Get all field values
      const externalId = record.get("external_id") as string;
      const externalIdType = record.get("external_id_type") as string;
      const reason = record.get("reason") as string;
      const startDate = record.get("start_date") as string;
      const endDate = record.get("end_date") as string;
      const explanation = record.get("explanation") as string;
      const recordViewable = record.get("record_viewable_by_provider") as string;
      const fileViewable = record.get("file_viewable_by_provider") as string;
      const fileKey = record.get("file_key") as string;

      // ===== REQUIRED FIELD VALIDATIONS =====
      
      if (!externalId?.trim()) {
        record.addError("external_id", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("external_id_type", "External Id Type required");
      }

      if (!startDate) {
        record.addError("start_date", "Start Date is required");
      }

      if (!endDate) {
        record.addError("end_date", "End Date is required");
      }

      // ===== CHARACTER LIMIT VALIDATIONS =====
      
      if (reason && reason.length > 200) {
        record.addError("reason", "Reason exceeds character limit of 200");
      }

      if (explanation && explanation.length > 1000) {
        record.addError("explanation", "Explanation exceeds character limit of 1000");
      }

      // ===== DATE FORMAT VALIDATIONS =====
      
      if (startDate) {
        const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!datePattern.test(startDate)) {
          record.addError("start_date", "Start Date must be formatted as m/d/yyyy");
        } else {
          // Validate it's a real date
          const [month, day, year] = startDate.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
          ) {
            record.addError("start_date", "Start Date must be formatted as m/d/yyyy");
          }
        }
      }

      if (endDate) {
        const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!datePattern.test(endDate)) {
          record.addError("end_date", "End Date must be formatted as m/d/yyyy");
        } else {
          // Validate it's a real date
          const [month, day, year] = endDate.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
          ) {
            record.addError("end_date", "End Date must be formatted as m/d/yyyy");
          }
        }
      }

      // ===== VIEWABILITY FIELD VALIDATIONS =====
      
      // Validate enum values (T or F only if provided)
      if (recordViewable && recordViewable !== "" && recordViewable !== "T" && recordViewable !== "F") {
        record.addError("record_viewable_by_provider", "Record Viewable by Provider must be T or F");
      }

      if (fileViewable && fileViewable !== "" && fileViewable !== "T" && fileViewable !== "F") {
        record.addError("file_viewable_by_provider", "File Viewable by Provider must be T or F");
      }

      // Cross-validation: if one viewability field is provided, both must be provided
      const recordViewableProvided = recordViewable && recordViewable !== "";
      const fileViewableProvided = fileViewable && fileViewable !== "";

      if (recordViewableProvided !== fileViewableProvided) {
        record.addError(
          "record_viewable_by_provider",
          "If one of Record Viewable by Provider or File Viewable by Provider are imported, the other must also be imported"
        );
        record.addError(
          "file_viewable_by_provider",
          "If one of Record Viewable by Provider or File Viewable by Provider are imported, the other must also be imported"
        );
      }

      // Warning: File Viewable should be F when Record Viewable is F
      if (recordViewable === "F" && fileViewable === "T") {
        record.addWarning(
          "file_viewable_by_provider",
          "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'"
        );
      }

      // ===== FILE KEY GUID VALIDATION =====
      
      if (fileKey && fileKey.trim()) {
        // GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (8-4-4-4-12)
        const guidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidPattern.test(fileKey.trim())) {
          record.addError("file_key", "File Key must be a valid GUID");
        }
      }

      return record;
    })
  );
};
