import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const workHistoryValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("work-history", (record) => {
      // Get all field values
      const externalId = record.get("external_id") as string;
      const externalIdType = record.get("external_id_type") as string;
      const nameOfFacilityEmployer = record.get("name_of_facility_employer") as string;
      const department = record.get("department") as string;
      const role = record.get("role") as string;
      const startDate = record.get("start_date") as string;
      const endDate = record.get("end_date") as string;
      const reasonForLeaving = record.get("reason_for_leaving") as string;
      const addressLine1 = record.get("address_line_1") as string;
      const addressLine2 = record.get("address_line_2") as string;
      const city = record.get("city") as string;
      const county = record.get("county") as string;
      const state = record.get("state") as string;
      const zip = record.get("zip") as string;
      const country = record.get("country") as string;
      const contactName = record.get("contact_name") as string;
      const contactTitlePosition = record.get("contact_title_position") as string;
      const phoneNumber = record.get("phone_number") as string;
      const ext = record.get("ext") as string;
      const email = record.get("email") as string;
      const fax = record.get("fax") as string;
      const recordViewableByProvider = record.get("record_viewable_by_provider") as string;
      const fileViewableByProvider = record.get("file_viewable_by_provider") as string;
      const fileKey = record.get("file_key") as string;
      const note = record.get("note") as string;
      const user = record.get("user") as string;
      const timestamp = record.get("timestamp") as string;

      // Required field validations
      if (!externalId?.trim()) {
        record.addError("external_id", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("external_id_type", "External Id Type required");
      }

      if (!nameOfFacilityEmployer?.trim()) {
        record.addError("name_of_facility_employer", "Name of Practice/Employer required");
      }

      // External ID Type validation
      const validExternalIdTypes = ["NPI", "InternalID", "ProviderID", "EmrID", "BillingSystemID"];
      if (externalIdType && !validExternalIdTypes.includes(externalIdType)) {
        record.addError("external_id_type", "External ID Type not valid");
      }

      // Character limit validations
      if (nameOfFacilityEmployer && nameOfFacilityEmployer.length > 150) {
        record.addError("name_of_facility_employer", "Work History Name exceeds character limit of 150");
      }

      if (department && department.length > 100) {
        record.addError("department", "Department exceeds character limit of 100");
      }

      if (role && role.length > 100) {
        record.addError("role", "Role exceeds character limit of 100");
      }

      if (reasonForLeaving && reasonForLeaving.length > 100) {
        record.addError("reason_for_leaving", "Reason for Leaving exceeds character limit of 100");
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

      if (contactName && contactName.length > 100) {
        record.addError("contact_name", "Contact Name exceeds character limit of 100");
      }

      if (contactTitlePosition && contactTitlePosition.length > 100) {
        record.addError("contact_title_position", "Contact's Title/Position exceeds character limit of 100");
      }

      if (ext && ext.length > 20) {
        record.addError("ext", "Ext.' must be a number up to 20 digits in length");
      }

      if (note && note.length > 10000) {
        record.addError("note", "Note exceeds character limit of 10000");
      }

      // Date format validations (m/d/yyyy)
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      
      if (startDate && !dateRegex.test(startDate)) {
        record.addError("start_date", "Start Date must be formatted as m/d/yyyy");
      }

      if (endDate && !dateRegex.test(endDate)) {
        record.addError("end_date", "End Date must be formatted as m/d/yyyy");
      }

      if (timestamp && !dateRegex.test(timestamp)) {
        record.addError("timestamp", "Timestamp must be formatted as m/d/yyyy");
      }

      // State validation (non-ascii characters check)
      if (state && /[^\x00-\x7F]/.test(state)) {
        record.addError("state", "State not supported");
      }

      // Zip validation (alphanumeric, max 10 characters)
      if (zip && (zip.length > 10 || !/^[a-zA-Z0-9]*$/.test(zip))) {
        record.addError("zip", "Zip exceeds 10 characters.");
      }

      // Phone number validation (9, 10, or 12 digits only)
      if (phoneNumber) {
        const phoneDigitsOnly = phoneNumber.replace(/\D/g, '');
        if (phoneDigitsOnly.length !== 9 && phoneDigitsOnly.length !== 10 && phoneDigitsOnly.length !== 12) {
          record.addError("phone_number", "Phone Number must be 9, 10, or 12-digit number");
        }
        // Check if original contains formatting
        if (phoneNumber !== phoneDigitsOnly) {
          record.addError("phone_number", "Phone Number must be 9, 10, or 12-digit number");
        }
      }

      // Extension validation (must be numeric)
      if (ext && !/^\d+$/.test(ext)) {
        record.addError("ext", "Ext.' must be a number up to 20 digits in length");
      }

      // Email validation
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          record.addError("email", "Email not a valid email");
        }
      }

      // Fax validation (must be 10 digits without formatting)
      if (fax) {
        const faxDigitsOnly = fax.replace(/\D/g, '');
        if (faxDigitsOnly.length !== 10) {
          record.addError("fax", "Fax must be 10-digit number");
        }
        // Check if original contains formatting
        if (fax !== faxDigitsOnly) {
          record.addError("fax", "Fax must be 10-digit number");
        }
      }

      // Viewability field validations
      const validViewabilityValues = ["T", "F"];
      
      if (recordViewableByProvider && !validViewabilityValues.includes(recordViewableByProvider)) {
        record.addError("record_viewable_by_provider", "Record Viewable by Provider must be T or F");
      }

      if (fileViewableByProvider && !validViewabilityValues.includes(fileViewableByProvider)) {
        record.addError("file_viewable_by_provider", "File Viewable by Provider must be T or F");
      }

      // Cross-field validation: File Viewable by Provider logic
      if (recordViewableByProvider === "F" && fileViewableByProvider === "T") {
        record.addWarning("file_viewable_by_provider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
      }

      // File Key GUID validation
      if (fileKey) {
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(fileKey)) {
          record.addError("file_key", "File Key must be a valid GUID");
        }
      }

      // User field warning
      if (!user?.trim()) {
        record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
      }

      return record;
    })
  );
};