import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const personalReferenceValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("personal_reference", (record) => {
      // Get all field values
      const providerName = record.get("provider_name") as string;
      const externalId = record.get("external_id") as string;
      const externalIdType = record.get("external_id_type") as string;
      const fullName = record.get("full_name") as string;
      const relationship = record.get("relationship") as string;
      const phoneNumber = record.get("phone_number") as string;
      const ext = record.get("ext") as string;
      const email = record.get("email") as string;
      const fax = record.get("fax") as string;
      const addressLine1 = record.get("address_line_1") as string;
      const addressLine2 = record.get("address_line_2") as string;
      const city = record.get("city") as string;
      const county = record.get("county") as string;
      const state = record.get("state") as string;
      const zip = record.get("zip") as string;
      const country = record.get("country") as string;
      const recordViewableByProvider = record.get("record_viewable_by_provider") as string;
      const fileViewableByProvider = record.get("file_viewable_by_provider") as string;
      const fileKey = record.get("file_key") as string;
      const fromDate = record.get("from") as string;
      const toDate = record.get("to") as string;
      const active = record.get("active") as string;

      // Required field validations - Red text fields
      if (!externalId?.trim()) {
        record.addError("external_id", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("external_id_type", "External Id Type required");
      }

      if (!fullName?.trim()) {
        record.addError("full_name", "Full Name required");
      }

      // Character limit validations
      if (fullName && fullName.length > 100) {
        record.addError("full_name", "Full Name exceeds character limit of 100");
      }

      if (relationship && relationship.length > 100) {
        record.addError("relationship", "Relationship exceeds character limit of 100");
      }

      if (ext && ext.length > 20) {
        record.addError("ext", "Ext. must be a number up to 20 digits in length");
      }

      if (addressLine1 && addressLine1.length > 100) {
        record.addError("address_line_1", "Address Line 1 exceeds character limit of 100");
      }

      if (addressLine2 && addressLine2.length > 50) {
        record.addError("address_line_2", "Address Line 2 exceeds character limit of 50");
      }

      if (city && city.length > 50) {
        record.addError("city", "City exceeds character limit of 50");
      }

      if (county && county.length > 100) {
        record.addError("county", "County exceeds character limit of 100");
      }

      if (state && state.length > 50) {
        record.addError("state", "State exceeds character limit of 50");
      }

      if (zip && zip.length > 10) {
        record.addError("zip", "Zip exceeds 10 characters");
      }

      // Phone number validation (9, 10, or 12 digits only)
      if (phoneNumber && phoneNumber.trim()) {
        const phoneRegex = /^\d{9}$|^\d{10}$|^\d{12}$/;
        if (!phoneRegex.test(phoneNumber.trim())) {
          record.addError("phone_number", "Phone Number must be 9, 10, or 12-digit number");
        }
      }

      // Extension validation (must be numeric)
      if (ext && ext.trim()) {
        const extRegex = /^\d+$/;
        if (!extRegex.test(ext.trim()) || ext.trim().length > 20) {
          record.addError("ext", "Ext. must be a number up to 20 digits in length");
        }
      }

      // Email validation
      if (email && email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          record.addError("email", "'Email' is not a valid email address");
        }
      }

      // Fax validation (9, 10, or 12 digits only)
      if (fax && fax.trim()) {
        const faxRegex = /^\d{9}$|^\d{10}$|^\d{12}$/;
        if (!faxRegex.test(fax.trim())) {
          record.addError("fax", "Fax must be 9, 10, or 12-digit number");
        }
      }

      // State validation (no non-ASCII characters)
      if (state && state.trim()) {
        const asciiRegex = /^[\x00-\x7F]*$/;
        if (!asciiRegex.test(state.trim())) {
          record.addError("state", "State not supported");
        }
      }

      // Zip validation (alphanumeric only, max 10 characters)
      if (zip && zip.trim()) {
        const zipRegex = /^[a-zA-Z0-9]{1,10}$/;
        if (!zipRegex.test(zip.trim())) {
          record.addError("zip", "Zip exceeds 10 characters");
        }
      }

      // T/F validation for viewability fields
      if (recordViewableByProvider && recordViewableByProvider.trim() && !["T", "F"].includes(recordViewableByProvider.trim())) {
        record.addError("record_viewable_by_provider", "Viewable by Provider must be T or F");
      }

      if (fileViewableByProvider && fileViewableByProvider.trim() && !["T", "F"].includes(fileViewableByProvider.trim())) {
        record.addError("file_viewable_by_provider", "Viewable by Provider must be T or F");
      }

      // Active field validation
      if (active && active.trim() && !["T", "F"].includes(active.trim())) {
        record.addError("active", "Active must be T or F");
      }

      // Cross-field validation for viewability
      const hasRecordViewable = recordViewableByProvider && recordViewableByProvider.trim();
      const hasFileViewable = fileViewableByProvider && fileViewableByProvider.trim();
      
      if ((hasRecordViewable && !hasFileViewable) || (!hasRecordViewable && hasFileViewable)) {
        record.addError("record_viewable_by_provider", "If one of Record Viewable by Provider or File Viewable by Provider are imported, the other must also be imported");
      }

      // Business rule warning: File Viewable must be F when Record Viewable is F
      if (recordViewableByProvider === "F" && fileViewableByProvider === "T") {
        record.addWarning("file_viewable_by_provider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
      }

      // GUID format validation for File Key
      if (fileKey && fileKey.trim()) {
        const guidRegex = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
        if (!guidRegex.test(fileKey.trim())) {
          record.addError("file_key", "File Key must be a valid GUID");
        }
      }

      // Date format validation (m/d/yyyy)
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

      if (fromDate && fromDate.trim() && !dateRegex.test(fromDate.trim())) {
        record.addError("from", "From must be formatted as m/d/yyyy");
      }

      if (toDate && toDate.trim() && !dateRegex.test(toDate.trim())) {
        record.addError("to", "To must be formatted as m/d/yyyy");
      }

      // Date validation - check if dates are valid
      const validateDateValue = (dateStr: string, fieldKey: string, fieldName: string) => {
        if (dateStr && dateRegex.test(dateStr)) {
          const [month, day, year] = dateStr.split('/').map(Number);
          const dateObj = new Date(year, month - 1, day);
          
          if (dateObj.getFullYear() !== year || 
              dateObj.getMonth() !== month - 1 || 
              dateObj.getDate() !== day) {
            record.addError(fieldKey, `${fieldName} must be formatted as m/d/yyyy`);
          }
        }
      };

      validateDateValue(fromDate, "from", "From");
      validateDateValue(toDate, "to", "To");

      // Cross-field date validation - From must be <= To
      if (fromDate && toDate && dateRegex.test(fromDate) && dateRegex.test(toDate)) {
        const [fromMonth, fromDay, fromYear] = fromDate.split('/').map(Number);
        const [toMonth, toDay, toYear] = toDate.split('/').map(Number);
        
        const fromDateObj = new Date(fromYear, fromMonth - 1, fromDay);
        const toDateObj = new Date(toYear, toMonth - 1, toDay);
        
        if (fromDateObj > toDateObj) {
          record.addError("from", "From must be less than or equal to To");
        }
      }

      // TODO: Additional validations that would be implemented in production:
      // - Country validation against company settings
      // - State validation against country subdivisions
      // - Import-level validations for existing records

      return record;
    })
  );
};