import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const driversLicenseValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("drivers_license", (record) => {
      // Get all field values
      const providerName = record.get("provider_name") as string;
      const externalId = record.get("external_id") as string;
      const externalIdType = record.get("external_id_type") as string;
      const stateProvince = record.get("state_province") as string;
      const licenseNumber = record.get("license_number") as string;
      const nameAsAppearsOnLicense = record.get("name_as_appears_on_license") as string;
      const issueDate = record.get("issue_date") as string;
      const expiresOn = record.get("expires_on") as string;
      const monitorExpirationDate = record.get("monitor_expiration_date") as string;
      const recordViewableByProvider = record.get("record_viewable_by_provider") as string;
      const fileViewableByProvider = record.get("file_viewable_by_provider") as string;
      const fileKey = record.get("file_key") as string;
      const note = record.get("note") as string;
      const user = record.get("user") as string;
      const timestamp = record.get("timestamp") as string;

      // Required field validations - Red text fields
      if (!externalId?.trim()) {
        record.addError("external_id", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("external_id_type", "External Id Type required");
      }

      if (!stateProvince?.trim()) {
        record.addError("state_province", "State required");
      }

      // Character limit validations
      if (licenseNumber && licenseNumber.length > 50) {
        record.addError("license_number", "License Number exceeds character limit of 50");
      }

      if (nameAsAppearsOnLicense && nameAsAppearsOnLicense.length > 50) {
        record.addError("name_as_appears_on_license", "Name as Appears on License exceeds character limit of 50");
      }

      if (note && note.length > 10000) {
        record.addError("note", "Note exceeds character limit of 10000");
      }

      // Date format validation (m/d/yyyy)
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

      if (issueDate && !dateRegex.test(issueDate)) {
        record.addError("issue_date", "Issue Date must be formatted as m/d/yyyy");
      }

      if (expiresOn && !dateRegex.test(expiresOn)) {
        record.addError("expires_on", "Expires On must be formatted as m/d/yyyy");
      }

      if (timestamp && !dateRegex.test(timestamp)) {
        record.addError("timestamp", "Timestamp must be formatted as m/d/yyyy");
      }

      // Date validation - check if dates are valid
      if (issueDate && dateRegex.test(issueDate)) {
        const [month, day, year] = issueDate.split('/').map(Number);
        const issueDateObj = new Date(year, month - 1, day);
        
        if (issueDateObj.getFullYear() !== year || 
            issueDateObj.getMonth() !== month - 1 || 
            issueDateObj.getDate() !== day) {
          record.addError("issue_date", "Issue Date must be formatted as m/d/yyyy");
        }
      }

      if (expiresOn && dateRegex.test(expiresOn)) {
        const [month, day, year] = expiresOn.split('/').map(Number);
        const expiresOnObj = new Date(year, month - 1, day);
        
        if (expiresOnObj.getFullYear() !== year || 
            expiresOnObj.getMonth() !== month - 1 || 
            expiresOnObj.getDate() !== day) {
          record.addError("expires_on", "Expires On must be formatted as m/d/yyyy");
        }
      }

      // Cross-field date validation - Issue Date must be before Expires On
      if (issueDate && expiresOn && dateRegex.test(issueDate) && dateRegex.test(expiresOn)) {
        const [issueMonth, issueDay, issueYear] = issueDate.split('/').map(Number);
        const [expiresMonth, expiresDay, expiresYear] = expiresOn.split('/').map(Number);
        
        const issueDateObj = new Date(issueYear, issueMonth - 1, issueDay);
        const expiresDateObj = new Date(expiresYear, expiresMonth - 1, expiresDay);
        
        if (issueDateObj >= expiresDateObj) {
          record.addError("issue_date", "Issue Date must be before Expiration Date");
        }
      }

      // T/F validation for boolean-style fields
      if (monitorExpirationDate && monitorExpirationDate.trim() && !["T", "F"].includes(monitorExpirationDate.trim())) {
        record.addError("monitor_expiration_date", "Monitor Expiration Date must be T or F");
      }

      if (recordViewableByProvider && recordViewableByProvider.trim() && !["T", "F"].includes(recordViewableByProvider.trim())) {
        record.addError("record_viewable_by_provider", "Record Viewable by Provider must be T or F");
      }

      if (fileViewableByProvider && fileViewableByProvider.trim() && !["T", "F"].includes(fileViewableByProvider.trim())) {
        record.addError("file_viewable_by_provider", "File Viewable by Provider must be T or F");
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

      // User validation warning
      if (!user?.trim()) {
        record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
      }

      // State/Province validation placeholder
      // TODO: In production, validate against actual state/province dropdown values
      if (stateProvince && stateProvince.trim()) {
        // Common US state abbreviations for basic validation
        const validStates = [
          "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
          "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
          "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
          "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
          "DC"
        ];
        
        if (!validStates.includes(stateProvince.trim().toUpperCase())) {
          record.addError("state_province", "State/province not supported");
        }
      }

      return record;
    })
  );
};