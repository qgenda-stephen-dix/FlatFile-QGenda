import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const professionalTrainingValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("professional_training", (record) => {
      // Get all field values
      const providerName = record.get("provider_name") as string;
      const externalId = record.get("external_id") as string;
      const externalIdType = record.get("external_id_type") as string;
      const trainingType = record.get("training_type") as string;
      const departmentProgram = record.get("department_program") as string;
      const specialty = record.get("specialty") as string;
      const institutionHospitalName = record.get("institution_hospital_name") as string;
      const institutionEmail = record.get("institution_email") as string;
      const addressLine1 = record.get("address_line_1") as string;
      const addressLine2 = record.get("address_line_2") as string;
      const city = record.get("city") as string;
      const state = record.get("state") as string;
      const zip = record.get("zip") as string;
      const country = record.get("country") as string;
      const institutionPhoneNumber = record.get("institution_phone_number") as string;
      const ext = record.get("ext") as string;
      const fax = record.get("fax") as string;
      const directorsName = record.get("directors_name") as string;
      const phoneNumber = record.get("phone_number") as string;
      const email = record.get("email") as string;
      const startDate = record.get("start_date") as string;
      const endDate = record.get("end_date") as string;
      const trainingStatus = record.get("training_status") as string;
      const anticipatedCompletionDate = record.get("anticipated_completion_date") as string;
      const recordViewableByProvider = record.get("record_viewable_by_provider") as string;
      const acgme = record.get("acgme") as string;
      const website = record.get("website") as string;
      const fileViewableByProvider = record.get("file_viewable_by_provider") as string;
      const ignoreRequiredFieldsValidation = record.get("ignore_required_fields_validation") as string;
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

      if (!trainingType?.trim()) {
        record.addError("training_type", "Training Type required");
      }

      // External ID and External ID Type cross-validation
      const hasExternalId = externalId && externalId.trim();
      const hasExternalIdType = externalIdType && externalIdType.trim();
      
      if ((hasExternalId && !hasExternalIdType) || (!hasExternalId && hasExternalIdType)) {
        record.addError("external_id", "Must provide both External ID and External ID Type");
        record.addError("external_id_type", "Must provide both External ID and External ID Type");
      }

      // Training Type validation (already handled by enum, but additional validation)
      if (trainingType && trainingType.trim()) {
        const validTrainingTypes = [
          "Internship", "Residency", "Internship/Residency", "Chief Residency", 
          "Fellowship", "Post Doctoral Fellowship", "Faculty Position/Academic Employment", "Other"
        ];
        if (!validTrainingTypes.includes(trainingType.trim())) {
          record.addError("training_type", "Training Type not supported");
        }
      }

      // Character limit validations
      if (departmentProgram && departmentProgram.length > 100) {
        record.addError("department_program", "Department / Program exceeds character limit of 100");
      }

      if (specialty && specialty.length > 100) {
        record.addError("specialty", "Specialty exceeds character limit of 100");
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

      if (state && state.length > 50) {
        record.addError("state", "State exceeds character limit of 50");
      }

      if (country && country.length > 100) {
        record.addError("country", "Country exceeds character limit of 100");
      }

      if (directorsName && directorsName.length > 100) {
        record.addError("directors_name", "Director's Name exceeds character limit of 100");
      }

      if (website && website.length > 500) {
        record.addError("website", "Website exceeds character limit of 500");
      }

      if (note && note.length > 10000) {
        record.addError("note", "Note exceeds character limit of 10000");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (institutionEmail && institutionEmail.trim() && !emailRegex.test(institutionEmail.trim())) {
        record.addError("institution_email", "'Institution Email' is not a valid email address.");
      }

      if (email && email.trim() && !emailRegex.test(email.trim())) {
        record.addError("email", "'Email' is not a valid email address.");
      }

      // Phone number validations (9, 10, or 12 digits only)
      const phoneRegex = /^\d{9}$|^\d{10}$|^\d{12}$/;

      if (institutionPhoneNumber && institutionPhoneNumber.trim() && !phoneRegex.test(institutionPhoneNumber.trim())) {
        record.addError("institution_phone_number", "Institution Phone Number must be 9, 10, or 12-digit number");
      }

      if (phoneNumber && phoneNumber.trim() && !phoneRegex.test(phoneNumber.trim())) {
        record.addError("phone_number", "Phone Number must be 9, 10, or 12-digit number");
      }

      if (fax && fax.trim() && !phoneRegex.test(fax.trim())) {
        record.addError("fax", "Fax must be 9, 10, or 12-digit number");
      }

      // Extension validation (must be numeric, max 20 digits)
      if (ext && ext.trim()) {
        const extRegex = /^\d{1,20}$/;
        if (!extRegex.test(ext.trim())) {
          record.addError("ext", "Ext.' must be a number up to 20 digits in length");
        }
      }

      // State validation (no non-ASCII characters)
      if (state && state.trim()) {
        const asciiRegex = /^[\x00-\x7F]*$/;
        if (!asciiRegex.test(state.trim())) {
          record.addError("state", "State not supported");
        }
      }

      // Zip validation (5, 6, or 9 digits)
      if (zip && zip.trim()) {
        const zipRegex = /^\d{5}$|^\d{6}$|^\d{9}$/;
        if (!zipRegex.test(zip.trim())) {
          record.addError("zip", "Zip is not 5, 6, or 9 digits");
        }
      }

      // Date format validation (m/d/yyyy)
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

      const validateDateValue = (dateStr: string, fieldKey: string, fieldName: string) => {
        if (dateStr && dateStr.trim()) {
          if (!dateRegex.test(dateStr.trim())) {
            record.addError(fieldKey, `${fieldName} must be formatted as m/d/yyyy`);
            return false;
          }
          
          const [month, day, year] = dateStr.trim().split('/').map(Number);
          const dateObj = new Date(year, month - 1, day);
          
          if (dateObj.getFullYear() !== year || 
              dateObj.getMonth() !== month - 1 || 
              dateObj.getDate() !== day) {
            record.addError(fieldKey, `${fieldName} must be formatted as m/d/yyyy`);
            return false;
          }
          return true;
        }
        return false;
      };

      validateDateValue(startDate, "start_date", "Start Date");
      validateDateValue(endDate, "end_date", "End Date");
      validateDateValue(anticipatedCompletionDate, "anticipated_completion_date", "Anticipated Completion Date");
      validateDateValue(timestamp, "timestamp", "Timestamp");

      // Training Status validation
      if (trainingStatus && trainingStatus.trim()) {
        const validStatuses = ["Completed", "Enrolled", "In Progress", "Not Completed"];
        if (!validStatuses.includes(trainingStatus.trim())) {
          record.addError("training_status", "Training Status must be: Completed / Enrolled / In Progress / Not Completed");
        }
      }

      // T/F validation for viewability and ACGME fields
      if (recordViewableByProvider && recordViewableByProvider.trim() && !["T", "F"].includes(recordViewableByProvider.trim())) {
        record.addError("record_viewable_by_provider", "Viewable by Provider must be T or F");
      }

      if (fileViewableByProvider && fileViewableByProvider.trim() && !["T", "F"].includes(fileViewableByProvider.trim())) {
        record.addError("file_viewable_by_provider", "File Viewable by Provider must be T or F");
      }

      if (acgme && acgme.trim() && !["T", "F"].includes(acgme.trim())) {
        record.addError("acgme", "ACGME must be T, F, or NULL");
      }

      // Y/N validation for Ignore Required Fields Validation
      if (ignoreRequiredFieldsValidation && ignoreRequiredFieldsValidation.trim() && !["Y", "N"].includes(ignoreRequiredFieldsValidation.trim())) {
        record.addError("ignore_required_fields_validation", "Ignore Required Fields Validation? must be Y or N");
      }

      // GUID format validation for File Key
      if (fileKey && fileKey.trim()) {
        const guidRegex = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
        if (!guidRegex.test(fileKey.trim())) {
          record.addError("file_key", "File Key must be a valid GUID");
        }
      }

      // URL validation for Website
      if (website && website.trim()) {
        try {
          new URL(website.trim());
        } catch {
          record.addError("website", "Website is not a valid URL");
        }
      }

      // User validation warning
      if (!user || !user.trim()) {
        record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
      }

      // External ID format validation based on type
      if (externalId && externalIdType && externalId.trim() && externalIdType.trim()) {
        const id = externalId.trim();
        const type = externalIdType.trim();
        
        switch (type) {
          case "NPI":
            // NPI should be 10 digits
            if (!/^\d{10}$/.test(id)) {
              record.addError("external_id", "NPI must be exactly 10 digits");
            }
            break;
          case "InternalID":
          case "ProviderID":
          case "EmrID":
          case "BillingSystemID":
            // Basic alphanumeric validation for other ID types
            if (!/^[A-Za-z0-9\-\_\.]+$/.test(id)) {
              record.addError("external_id", `${type} contains invalid characters. Use only letters, numbers, hyphens, underscores, and periods`);
            }
            break;
        }
      }

      // TODO: Production validations that would be implemented:
      // - Validate Specialty against Setup > List Management > Specialty
      // - Cross-reference External ID/Type with existing providers in company
      // - Validate Country against Country dropdown
      // - Validate State against subdivision dropdown for the country
      // - Country/State cross-validation for updates
      // - File Key validation against existing files in system
      // - User validation against Cred Spec emails
      // - Provider name matching validation

      return record;
    })
  );
};