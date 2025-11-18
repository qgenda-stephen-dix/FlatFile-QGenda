import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

/**
 * Other Record Validation Hook
 * 
 * Provides real-time validation for Other Record Import Format including:
 * - Required field validation (External ID, External ID Type, Type, Name)
 * - Character limit validation (Name: 100, Note: 10,000)
 * - Date format validation (m/d/yyyy)
 * - Cross-field date validation (Issue Date vs Expiration Date)
 * - Document type validation
 * - GUID format validation for File Key
 * - T/F validation for boolean fields
 * - TimeStamp format validation
 * - Business rule validations
 */
export const otherRecordValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("other-record", (record) => {
      // Get field values
      const externalId = record.get("externalId") as string;
      const externalIdType = record.get("externalIdType") as string;
      const type = record.get("type") as string;
      const name = record.get("name") as string;
      const issueDate = record.get("issueDate") as string;
      const expirationDate = record.get("expirationDate") as string;
      const monitorExpirationDate = record.get("monitorExpirationDate") as string;
      const recordViewableByProvider = record.get("recordViewableByProvider") as string;
      const fileViewableByProvider = record.get("fileViewableByProvider") as string;
      const fileKey = record.get("fileKey") as string;
      const note = record.get("note") as string;
      const user = record.get("user") as string;
      const timeStamp = record.get("timeStamp") as string;
      const classification = record.get("classification") as string;

      // Required field validations
      if (!externalId?.trim()) {
        record.addError("externalId", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("externalIdType", "External Id Type required");
      }

      if (!type?.trim()) {
        record.addError("type", "Type required");
      }

      if (!name?.trim()) {
        record.addError("name", "Name required");
      }

      // Character limit validations
      if (name && name.length > 100) {
        record.addError("name", "Other Document Name exceeds character limit of 100");
      }

      if (note && note.length > 10000) {
        record.addError("note", "Note exceeds character limit of 10000");
      }

      // Document type validation (validate against known categories)
      if (type && type.trim()) {
        const validCategories = [
          "Licenses and Certifications",
          "Education and Training", 
          "Continuing Medical Education",
          "Work History and Affiliations",
          "Employee Documents",
          "Sanctions and Exclusions",
          "References",
          "Payer Documents"
        ];
        
        // This is a simplified check - in reality would validate against actual document types
        // For now, we'll just ensure it's not obviously invalid
        const typeWords = type.toLowerCase().split(/\s+/);
        const hasValidKeywords = validCategories.some(category => 
          category.toLowerCase().split(/\s+/).some(word => 
            typeWords.some(typeWord => typeWord.includes(word.substring(0, 4)))
          )
        );
        
        if (!hasValidKeywords) {
          record.addError("type", "Document Category not supported");
        }
      }

      // Date format validations
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      
      if (issueDate && issueDate.trim()) {
        if (!dateRegex.test(issueDate)) {
          record.addError("issueDate", "Issue Date must be formatted as m/d/yyyy");
        } else {
          // Validate it's a real date
          const dateObj = new Date(issueDate);
          const parts = issueDate.split('/');
          const month = parseInt(parts[0]);
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          
          if (dateObj.getFullYear() !== year || 
              dateObj.getMonth() + 1 !== month || 
              dateObj.getDate() !== day) {
            record.addError("issueDate", "Issue Date must be formatted as m/d/yyyy");
          }
        }
      }

      if (expirationDate && expirationDate.trim()) {
        if (!dateRegex.test(expirationDate)) {
          record.addError("expirationDate", "Expiration Date? must be formatted as m/d/yyyy");
        } else {
          // Validate it's a real date
          const dateObj = new Date(expirationDate);
          const parts = expirationDate.split('/');
          const month = parseInt(parts[0]);
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          
          if (dateObj.getFullYear() !== year || 
              dateObj.getMonth() + 1 !== month || 
              dateObj.getDate() !== day) {
            record.addError("expirationDate", "Expiration Date? must be formatted as m/d/yyyy");
          }
        }
      }

      // Cross-field date validation
      if (issueDate && expirationDate && dateRegex.test(issueDate) && dateRegex.test(expirationDate)) {
        const issueDateObj = new Date(issueDate);
        const expirationDateObj = new Date(expirationDate);
        
        if (issueDateObj > expirationDateObj) {
          record.addError("issueDate", "Issue Date cannot be after Expiration Date");
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
      if (monitorExpirationDate && monitorExpirationDate.trim() && !["T", "F"].includes(monitorExpirationDate)) {
        record.addError("monitorExpirationDate", "Monitor Expiration Date must be T or F");
      }

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
        record.addError("externalId", "Must provide both External ID and External ID Type");
        record.addError("externalIdType", "Must provide both External ID and External ID Type");
      }

      return record;
    })
  );
};