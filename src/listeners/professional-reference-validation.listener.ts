import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const professionalReferenceValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("professional-reference", (record) => {
      // Get all field values
      const externalId = record.get("externalId") as string;
      const externalIdType = record.get("externalIdType") as string;
      const fullName = record.get("fullName") as string;
      const relationship = record.get("relationship") as string;
      const specialty = record.get("specialty") as string;
      const degreeProviderType = record.get("degreeProviderType") as string;
      const workedTogetherDuration = record.get("workedTogetherDuration") as string;
      const facility = record.get("facility") as string;
      const phoneNumber = record.get("phoneNumber") as string;
      const ext = record.get("ext") as string;
      const email = record.get("email") as string;
      const fax = record.get("fax") as string;
      const addressLine1 = record.get("addressLine1") as string;
      const addressLine2 = record.get("addressLine2") as string;
      const city = record.get("city") as string;
      const county = record.get("county") as string;
      const state = record.get("state") as string;
      const zip = record.get("zip") as string;
      const country = record.get("country") as string;
      const recordViewableByProvider = record.get("recordViewableByProvider") as string;
      const fileViewableByProvider = record.get("fileViewableByProvider") as string;
      const fileKey = record.get("fileKey") as string;
      const fromDate = record.get("from") as string;
      const toDate = record.get("to") as string;
      const active = record.get("active") as string;

      // Required field validations
      if (!externalId?.trim()) {
        record.addError("externalId", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("externalIdType", "External Id Type required");
      }

      if (!fullName?.trim()) {
        record.addError("fullName", "Full Name required");
      }

      // Character limit validations
      if (fullName && fullName.length > 100) {
        record.addError("fullName", "Full Name exceeds character limit of 100");
      }

      if (relationship && relationship.length > 100) {
        record.addError("relationship", "Relationship exceeds character limit of 100");
      }

      if (workedTogetherDuration && workedTogetherDuration.length > 50) {
        record.addError("workedTogetherDuration", "Worked together for how long? exceeds character limit of 50");
      }

      if (facility && facility.length > 100) {
        record.addError("facility", "Facility exceeds character limit of 100");
      }

      if (addressLine1 && addressLine1.length > 100) {
        record.addError("addressLine1", "Address Line 1 exceeds character limit of 100");
      }

      if (addressLine2 && addressLine2.length > 50) {
        record.addError("addressLine2", "Address Line 2 exceeds character limit of 50");
      }

      if (city && city.length > 50) {
        record.addError("city", "City exceeds character limit of 50");
      }

      if (county && county.length > 100) {
        record.addError("county", "County exceeds character limit of 100");
      }

      if (state && state.length > 50) {
        record.addWarning("state", `${state} is not a valid subdivision for Country.`);
      }

      if (country && country.length > 100) {
        record.addError("country", "Country exceeds character limit of 100");
      }

      // Phone and Fax number validations (9, 10, or 12 digits only)
      if (phoneNumber) {
        const phoneRegex = /^\d{9}$|^\d{10}$|^\d{12}$/;
        if (!phoneRegex.test(phoneNumber)) {
          record.addError("phoneNumber", "Phone Number must be 9, 10, or 12-digit number");
        }
      }

      if (fax) {
        const faxRegex = /^\d{9}$|^\d{10}$|^\d{12}$/;
        if (!faxRegex.test(fax)) {
          record.addError("fax", "Fax must be 9, 10, or 12-digit number");
        }
      }

      // Extension validation (up to 20 digits)
      if (ext) {
        const extRegex = /^\d{1,20}$/;
        if (!extRegex.test(ext)) {
          record.addError("ext", "'Ext.' must be a number up to 20 digits in length");
        }
      }

      // Email validation
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          record.addError("email", "'Email' is not a valid email address.");
        }
      }

      // Zip code validation (≤ 10 alphanumeric characters)
      if (zip && zip.length > 10) {
        record.addError("zip", "Zip exceeds 10 characters.");
      }

      // Record and File Viewable by Provider validations
      if (recordViewableByProvider && !["T", "F"].includes(recordViewableByProvider)) {
        record.addError("recordViewableByProvider", "Viewable by Provider must be T or F");
      }

      if (fileViewableByProvider && !["T", "F"].includes(fileViewableByProvider)) {
        record.addError("fileViewableByProvider", "Viewable by Provider must be T or F");
      }

      // Cross-field validation: File Viewable cannot be T if Record Viewable is F
      if (recordViewableByProvider === "F" && fileViewableByProvider === "T") {
        record.addWarning("fileViewableByProvider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
      }

      // File Key GUID validation
      if (fileKey) {
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(fileKey)) {
          record.addError("fileKey", "File Key must be a valid GUID");
        }
      }

      // Date format validation (m/d/yyyy)
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      
      if (fromDate && !dateRegex.test(fromDate)) {
        record.addError("from", "From must be formatted as m/d/yyyy");
      }

      if (toDate && !dateRegex.test(toDate)) {
        record.addError("to", "To must be formatted as m/d/yyyy");
      }

      // Date range validation (From ≤ To)
      if (fromDate && toDate && dateRegex.test(fromDate) && dateRegex.test(toDate)) {
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);
        
        if (fromDateObj > toDateObj) {
          record.addError("from", "From must be less than or equal to To.");
        }
      }

      // Active field validation
      if (active && !["T", "F"].includes(active)) {
        record.addError("active", "Active must be T or F");
      }

      return record;
    })
  );
};