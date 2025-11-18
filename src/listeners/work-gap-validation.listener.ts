import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

/**
 * Work Gap Validation Hook
 * 
 * Provides real-time validation for Work Gap Import Format including:
 * - Required field validation (External ID, External ID Type, Start Date, End Date)
 * - Character limit validation (Reason: 200, Explanation: 1,000, Note: 10,000)
 * - Date format validation (m/d/yyyy)
 * - Cross-field date validation (Start Date vs End Date)
 * - GUID format validation for File Key
 * - T/F validation for boolean fields
 * - TimeStamp format validation
 * - Business rule validations
 */
export const workGapValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("work-gap", (record) => {
      // Get field values
      const externalId = record.get("externalId") as string;
      const externalIdType = record.get("externalIdType") as string;
      const reason = record.get("reason") as string;
      const startDate = record.get("startDate") as string;
      const endDate = record.get("endDate") as string;
      const explanation = record.get("explanation") as string;
      const recordViewableByProvider = record.get("recordViewableByProvider") as string;
      const fileViewableByProvider = record.get("fileViewableByProvider") as string;
      const fileKey = record.get("fileKey") as string;
      const note = record.get("note") as string;
      const user = record.get("user") as string;
      const timeStamp = record.get("timeStamp") as string;

      // Required field validations
      if (!externalId?.trim()) {
        record.addError("externalId", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("externalIdType", "External Id Type required");
      }

      if (!startDate?.trim()) {
        record.addError("startDate", "Start Date is required");
      }

      if (!endDate?.trim()) {
        record.addError("endDate", "End Date is required");
      }

      // Character limit validations
      if (reason && reason.length > 200) {
        record.addError("reason", "Reason exceeds character limit of 200");
      }

      if (explanation && explanation.length > 1000) {
        record.addError("explanation", "Explanation exceeds character limit of 1000");
      }

      if (note && note.length > 10000) {
        record.addError("note", "Note exceeds character limit of 10000");
      }

      // Date format validations
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      
      if (startDate && startDate.trim()) {
        if (!dateRegex.test(startDate)) {
          record.addError("startDate", "Start Date must be formatted as m/d/yyyy");
        } else {
          // Validate it's a real date
          const dateObj = new Date(startDate);
          const parts = startDate.split('/');
          const month = parseInt(parts[0]);
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          
          if (dateObj.getFullYear() !== year || 
              dateObj.getMonth() + 1 !== month || 
              dateObj.getDate() !== day) {
            record.addError("startDate", "Start Date must be formatted as m/d/yyyy");
          }
        }
      }

      if (endDate && endDate.trim()) {
        if (!dateRegex.test(endDate)) {
          record.addError("endDate", "End Date must be formatted as m/d/yyyy");
        } else {
          // Validate it's a real date
          const dateObj = new Date(endDate);
          const parts = endDate.split('/');
          const month = parseInt(parts[0]);
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          
          if (dateObj.getFullYear() !== year || 
              dateObj.getMonth() + 1 !== month || 
              dateObj.getDate() !== day) {
            record.addError("endDate", "End Date must be formatted as m/d/yyyy");
          }
        }
      }

      // Cross-field date validation
      if (startDate && endDate && dateRegex.test(startDate) && dateRegex.test(endDate)) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        
        if (startDateObj >= endDateObj) {
          record.addError("endDate", "End Date must be after Start Date");
        }
      }

      // TimeStamp format validation (m/d/yyyy h:mm:ss)
      if (timeStamp && timeStamp.trim()) {
        const timeStampRegex = /^\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}:\d{2}$/;
        if (!timeStampRegex.test(timeStamp)) {
          record.addError("timeStamp", "Timestamp must be formatted as m/d/yyyy h:mm:ss");
        }
      }

      // T/F validations for boolean fields
      if (recordViewableByProvider && recordViewableByProvider.trim() && !["T", "F"].includes(recordViewableByProvider)) {
        record.addError("recordViewableByProvider", "Record Viewable by Provider must be T or F");
      }

      if (fileViewableByProvider && fileViewableByProvider.trim() && !["T", "F"].includes(fileViewableByProvider)) {
        record.addError("fileViewableByProvider", "File Viewable by Provider must be T or F");
      }

      // Viewability consistency validation
      if (recordViewableByProvider === "F" && fileViewableByProvider === "T") {
        record.addWarning("fileViewableByProvider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
      }

      // Both viewability fields must be provided together validation
      const hasRecordViewable = recordViewableByProvider && recordViewableByProvider.trim();
      const hasFileViewable = fileViewableByProvider && fileViewableByProvider.trim();
      
      if ((hasRecordViewable && !hasFileViewable) || (!hasRecordViewable && hasFileViewable)) {
        if (!hasRecordViewable) {
          record.addError("recordViewableByProvider", "If one of Record Viewable by Provider or File Viewable by Provider are imported, the other must also be imported");
        }
        if (!hasFileViewable) {
          record.addError("fileViewableByProvider", "If one of Record Viewable by Provider or File Viewable by Provider are imported, the other must also be imported");
        }
      }

      // GUID format validation for File Key
      if (fileKey && fileKey.trim()) {
        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!guidRegex.test(fileKey)) {
          record.addError("fileKey", "File Key must be a valid GUID");
        }
      }

      // User validation warning
      if (!user || !user.trim()) {
        record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
      }

      // External ID and External ID Type must be provided together
      const hasExternalId = externalId && externalId.trim();
      const hasExternalIdType = externalIdType && externalIdType.trim();
      
      if ((hasExternalId && !hasExternalIdType) || (!hasExternalId && hasExternalIdType)) {
        if (!hasExternalId) {
          record.addError("externalId", "Must provide both External ID and External ID Type");
        }
        if (!hasExternalIdType) {
          record.addError("externalIdType", "Must provide both External ID and External ID Type");
        }
      }

      // Business logic validations for work gaps
      if (startDate && endDate && dateRegex.test(startDate) && dateRegex.test(endDate)) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const gapDuration = Math.floor((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24));

        // Check for extremely short gaps (less than 1 week)
        if (gapDuration < 7) {
          record.addWarning("endDate", "Work gap duration is less than 1 week - verify this is correct");
        }

        // Check for extremely long gaps (more than 5 years)
        if (gapDuration > 1825) { // 5 years
          record.addWarning("endDate", "Work gap duration is more than 5 years - verify this is correct");
        }

        // Check for future dates
        const currentDate = new Date();
        if (startDateObj > currentDate) {
          record.addWarning("startDate", "Start date is in the future - verify this is correct");
        }
        if (endDateObj > currentDate) {
          record.addWarning("endDate", "End date is in the future - verify this is correct");
        }
      }

      // Reason validation for common gap types
      if (reason && reason.trim()) {
        const commonReasons = [
          "maternity", "paternity", "medical", "sabbatical", "education", 
          "family", "personal", "military", "research", "fellowship",
          "unemployment", "between positions", "career break"
        ];
        
        const reasonLower = reason.toLowerCase();
        const hasCommonReason = commonReasons.some(commonReason => 
          reasonLower.includes(commonReason)
        );
        
        if (!hasCommonReason && reason.length > 50) {
          record.addInfo("reason", "Consider using standard work gap reasons for consistency");
        }
      }

      return record;
    })
  );
};