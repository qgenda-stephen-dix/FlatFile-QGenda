import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const educationValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("education", (record) => {
      // Get all field values
      const externalId = record.get("externalId") as string;
      const externalIdType = record.get("externalIdType") as string;
      const educationType = record.get("educationType") as string;
      const foreignGraduate = record.get("foreignGraduate") as string;
      const ecfmgNumber = record.get("ecfmgNumber") as string;
      const ecfmgIssueDate = record.get("ecfmgIssueDate") as string;
      const fifthPathwayNumber = record.get("fifthPathwayNumber") as string;
      const fifthPathwayIssueDate = record.get("fifthPathwayIssueDate") as string;
      const degree = record.get("degree") as string;
      const areaOfStudy = record.get("areaOfStudy") as string;
      const schoolName = record.get("schoolName") as string;
      const institutionEmail = record.get("institutionEmail") as string;
      const addressLine1 = record.get("addressLine1") as string;
      const addressLine2 = record.get("addressLine2") as string;
      const city = record.get("city") as string;
      const state = record.get("state") as string;
      const zip = record.get("zip") as string;
      const country = record.get("country") as string;
      const phone = record.get("phone") as string;
      const ext = record.get("ext") as string;
      const fax = record.get("fax") as string;
      const startDate = record.get("startDate") as string;
      const endDate = record.get("endDate") as string;
      const didYouGraduate = record.get("didYouGraduate") as string;
      const viewableByProvider = record.get("viewableByProvider") as string;
      const website = record.get("website") as string;
      const fileViewableByProvider = record.get("fileViewableByProvider") as string;
      const ignoreRequiredFieldsValidation = record.get("ignoreRequiredFieldsValidation") as string;
      const fileKey = record.get("fileKey") as string;
      const note = record.get("note") as string;
      const user = record.get("user") as string;
      const timestamp = record.get("timestamp") as string;

      // Required field validations
      if (!externalId?.trim()) {
        record.addError("externalId", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("externalIdType", "External Id Type required");
      }

      if (!educationType?.trim()) {
        record.addError("educationType", "Education Type not supported");
      }

      if (!degree?.trim()) {
        record.addError("degree", "Degree not supported");
      }

      // External ID validation - both must be provided together
      if ((externalId && !externalIdType) || (!externalId && externalIdType)) {
        record.addError("externalId", "Must provide both External ID and External ID Type");
        record.addError("externalIdType", "Must provide both External ID and External ID Type");
      }

      // Education Type validation
      const validEducationTypes = ["Bachelor's", "Master's", "Doctorate", "Medical School", "Professional School", "Fifth Pathway"];
      if (educationType && !validEducationTypes.includes(educationType)) {
        record.addError("educationType", "Education Type not supported");
      }

      // T/F field validations
      if (foreignGraduate && foreignGraduate !== "T" && foreignGraduate !== "F") {
        record.addError("foreignGraduate", "Foreign Graduate must be T or F");
      }

      if (viewableByProvider && viewableByProvider !== "T" && viewableByProvider !== "F") {
        record.addError("viewableByProvider", "Viewable by Provider must be T or F");
      }

      if (fileViewableByProvider && fileViewableByProvider !== "T" && fileViewableByProvider !== "F") {
        record.addError("fileViewableByProvider", "File Viewable by Provider must be T or F");
      }

      // Y/N field validations
      if (didYouGraduate && didYouGraduate !== "Y" && didYouGraduate !== "N") {
        record.addError("didYouGraduate", "Did you graduate must be Y or N");
      }

      if (ignoreRequiredFieldsValidation && ignoreRequiredFieldsValidation !== "Y" && ignoreRequiredFieldsValidation !== "N") {
        record.addError("ignoreRequiredFieldsValidation", "Ignore Required Fields Validation? must be Y or N");
      }

      // Character limit validations
      if (ecfmgNumber && ecfmgNumber.length > 8) {
        record.addError("ecfmgNumber", "ECFMG Number exceeds character limit of 8");
      }

      if (fifthPathwayNumber && fifthPathwayNumber.length > 50) {
        record.addError("fifthPathwayNumber", "Fifth Pathway Number exceeds character limit of 50");
      }

      if (areaOfStudy && areaOfStudy.length > 100) {
        record.addError("areaOfStudy", "Area of Study / Major exceeds character limit of 100");
      }

      if (schoolName && schoolName.length > 150) {
        record.addError("schoolName", "School Name exceeds character limit of 150");
      }

      if (institutionEmail && institutionEmail.length > 100) {
        record.addError("institutionEmail", "Institution Email exceeds character limit of 100");
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

      if (state && state.length > 50) {
        record.addError("state", "State exceeds character limit of 50");
      }

      if (country && country.length > 100) {
        record.addError("country", "Country is not recognized");
      }

      if (ext && ext.length > 20) {
        record.addError("ext", "Ext.' must be a number up to 20 digits in length");
      }

      if (website && website.length > 500) {
        record.addError("website", "Website exceeds character limit of 500");
      }

      if (note && note.length > 10000) {
        record.addError("note", "Note exceeds character limit of 10000");
      }

      // Date format validations
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      
      if (ecfmgIssueDate) {
        if (!dateRegex.test(ecfmgIssueDate)) {
          record.addError("ecfmgIssueDate", "ECFMG Issue Date must be formatted as m/d/yyyy");
        } else {
          // Validate actual date
          const [month, day, year] = ecfmgIssueDate.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          if (date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year) {
            record.addError("ecfmgIssueDate", "ECFMG Issue Date must be formatted as m/d/yyyy");
          }
        }
      }

      if (fifthPathwayIssueDate) {
        if (!dateRegex.test(fifthPathwayIssueDate)) {
          record.addError("fifthPathwayIssueDate", "Fifth Pathway Issue Date must be formatted as m/d/yyyy");
        } else {
          // Validate actual date
          const [month, day, year] = fifthPathwayIssueDate.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          if (date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year) {
            record.addError("fifthPathwayIssueDate", "Fifth Pathway Issue Date must be formatted as m/d/yyyy");
          }
        }
      }

      if (startDate) {
        if (!dateRegex.test(startDate)) {
          record.addError("startDate", "Start Date must be formatted as m/d/yyyy");
        } else {
          // Validate actual date
          const [month, day, year] = startDate.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          if (date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year) {
            record.addError("startDate", "Start Date must be formatted as m/d/yyyy");
          }
        }
      }

      if (endDate) {
        if (!dateRegex.test(endDate)) {
          record.addError("endDate", "End Date must be formatted as m/d/yyyy");
        } else {
          // Validate actual date
          const [month, day, year] = endDate.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          if (date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year) {
            record.addError("endDate", "End Date must be formatted as m/d/yyyy");
          }
        }
      }

      // Timestamp format validation (m/d/yyyy h:mm:ss)
      if (timestamp) {
        const timestampRegex = /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2}$/;
        if (!timestampRegex.test(timestamp)) {
          record.addError("timestamp", "Timestamp must be formatted as m/d/yyyy h:mm:ss");
        } else {
          // Validate actual date/time
          const [datePart, timePart] = timestamp.split(' ');
          const [month, day, year] = datePart.split('/').map(Number);
          const [hour, minute, second] = timePart.split(':').map(Number);
          const date = new Date(year, month - 1, day, hour, minute, second);
          if (date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year) {
            record.addError("timestamp", "Timestamp must be formatted as m/d/yyyy h:mm:ss");
          }
        }
      }

      // Email validation
      if (institutionEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(institutionEmail)) {
          record.addError("institutionEmail", "'Institution Email' is not a valid email address.");
        }
      }

      // Website URL validation
      if (website) {
        const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/i;
        if (!urlRegex.test(website)) {
          record.addError("website", "Website is not a valid URL");
        }
      }

      // Phone number validation (9, 10, or 12 digits only)
      if (phone) {
        const phoneDigits = phone.replace(/\D/g, ''); // Remove all non-digits
        if (phone !== phoneDigits || ![9, 10, 12].includes(phoneDigits.length)) {
          record.addError("phone", "Phone Number must be 9, 10, or 12-digit number");
        }
      }

      // Fax number validation (9, 10, or 12 digits only)
      if (fax) {
        const faxDigits = fax.replace(/\D/g, ''); // Remove all non-digits
        if (fax !== faxDigits || ![9, 10, 12].includes(faxDigits.length)) {
          record.addError("fax", "Fax must be 9, 10, or 12-digit number");
        }
      }

      // Extension validation (must be numeric)
      if (ext) {
        const extNumeric = /^\d+$/.test(ext);
        if (!extNumeric) {
          record.addError("ext", "Ext.' must be a number up to 20 digits in length");
        }
      }

      // Zip validation (max 10 alphanumeric characters)
      if (zip) {
        const zipRegex = /^[a-zA-Z0-9]{1,10}$/;
        if (!zipRegex.test(zip)) {
          record.addError("zip", "Zip exceeds 10 characters.");
        }
      }

      // State validation (no non-ASCII characters)
      if (state) {
        const asciiRegex = /^[\x00-\x7F]*$/;
        if (!asciiRegex.test(state)) {
          record.addError("state", "State not supported");
        }
      }

      // GUID format validation for File Key
      if (fileKey) {
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(fileKey)) {
          record.addError("fileKey", "File Key must be a valid GUID");
        }
      }

      // User validation warning
      if (!user?.trim()) {
        record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
      }

      return record;
    })
  );
};