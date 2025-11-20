import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const providerDemographicImportValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("provider-demographic-import", (record) => {
      // Get all field values
      const externalId = record.get("external_id") as string;
      const externalIdType = record.get("external_id_type") as string;
      const salutation = record.get("salutation") as string;
      const pronouns = record.get("pronouns") as string;
      const firstName = record.get("first_name") as string;
      const middleName = record.get("middle_name") as string;
      const lastName = record.get("last_name") as string;
      const alternateFirstName = record.get("alternate_first_name") as string;
      const alternateMiddleName = record.get("alternate_middle_name") as string;
      const alternateLastName = record.get("alternate_last_name") as string;
      const alternateNameStartDate = record.get("alternate_name_start_date") as string;
      const alternateNameEndDate = record.get("alternate_name_end_date") as string;
      const providerType = record.get("provider_type") as string;
      const npi = record.get("npi") as string;
      const autoVerifyNpi = record.get("auto_verify_npi") as string;
      const ssn = record.get("ssn") as string;
      const birthDate = record.get("birth_date") as string;
      const countryOfBirth = record.get("country_of_birth") as string;
      const stateOfBirth = record.get("state_of_birth") as string;
      const cityOfBirth = record.get("city_of_birth") as string;
      const countyOfBirth = record.get("county_of_birth") as string;
      const gender = record.get("gender") as string;
      const ethnicity = record.get("ethnicity") as string;
      const race = record.get("race") as string;
      const citizenship = record.get("citizenship") as string;
      const workVisaType = record.get("work_visa_type") as string;
      const visaExpiration = record.get("visa_expiration") as string;
      const visaNumber = record.get("visa_number") as string;
      const acceptingNewPatients = record.get("accepting_new_patients") as string;
      const languagesSpoken = record.get("languages_spoken") as string;
      const maritalStatus = record.get("marital_status") as string;
      const spouseFullName = record.get("spouse_full_name") as string;
      const spousePhoneNumber = record.get("spouse_phone_number") as string;
      const corporateEmploymentType = record.get("corporate_employment_type") as string;
      const supervisingPhysiciansName = record.get("supervising_physicians_name") as string;
      const timeInPositionStartDate = record.get("time_in_position_start_date") as string;
      const timeInPositionEndDate = record.get("time_in_position_end_date") as string;
      const specialty = record.get("specialty") as string;
      const subspecialty = record.get("subspecialty") as string;
      const taxonomy = record.get("taxonomy") as string;
      const medicareNumber = record.get("medicare_number") as string;
      const medicaidNumber = record.get("medicaid_number") as string;
      const loginEmail = record.get("login_email") as string;
      const otherEmail = record.get("other_email") as string;
      const homePhone = record.get("home_phone") as string;
      const mobilePhone = record.get("mobile_phone") as string;
      const pager = record.get("pager") as string;
      const preferredContactMethod = record.get("preferred_contact_method") as string;
      const addressLine1 = record.get("address_line_1") as string;
      const addressLine2 = record.get("address_line_2") as string;
      const city = record.get("city") as string;
      const state = record.get("state") as string;
      const zip = record.get("zip") as string;
      const country = record.get("country") as string;
      const county = record.get("county") as string;
      const emergencyContactFirstName = record.get("emergency_contact_first_name") as string;
      const emergencyContactLastName = record.get("emergency_contact_last_name") as string;
      const emergencyContactPhoneNumber = record.get("emergency_contact_phone_number") as string;
      const emergencyContactEmail = record.get("emergency_contact_email") as string;
      const taxId = record.get("tax_id") as string;
      const taxName = record.get("tax_name") as string;
      const providerId = record.get("provider_id") as string;
      const internalId = record.get("internal_id") as string;
      const emrId = record.get("emr_id") as string;
      const ssoId = record.get("sso_id") as string;
      const suffix = record.get("suffix") as string;
      const preferredName = record.get("preferred_name") as string;
      const alternateNameSuffix = record.get("alternate_name_suffix") as string;
      const upin = record.get("upin") as string;
      const militaryStartDate = record.get("military_start_date") as string;
      const militaryEndDate = record.get("military_end_date") as string;
      const militaryBranch = record.get("military_branch") as string;
      const militaryStatus = record.get("military_status") as string;
      const militaryTitle = record.get("military_title") as string;
      const assistantName = record.get("assistant_name") as string;
      const assistantEmail = record.get("assistant_email") as string;
      const assistantPhone = record.get("assistant_phone") as string;
      const preferredCredentials = record.get("preferred_credentials") as string;
      const affiliationVerificationAvailable = record.get("affiliation_verification_available") as string;
      const primaryCredentialingSpecialistEmail = record.get("primary_credentialing_specialist_email") as string;
      const disableExpiringNotifications = record.get("disable_expiring_notifications") as string;

      // Required field validations
      if (!firstName?.trim()) {
        record.addError("first_name", "First Name required");
      }

      if (!lastName?.trim()) {
        record.addError("last_name", "Last Name required");
      }

      // External ID and Type validation (both required if either is provided)
      if ((externalId?.trim() && !externalIdType?.trim()) || (!externalId?.trim() && externalIdType?.trim())) {
        record.addError("external_id", "Must provide both External ID and External ID Type");
        record.addError("external_id_type", "Must provide both External ID and External ID Type");
      }

      // For new providers, Provider Type is required
      if (!externalId?.trim() && !providerType?.trim()) {
        record.addError("provider_type", "Provider Type is required");
      }

      // External ID Type validation
      const validExternalIdTypes = ["NPI", "InternalID", "ProviderID", "EmrID"];
      if (externalIdType && !validExternalIdTypes.includes(externalIdType)) {
        record.addError("external_id_type", "External ID Type not valid");
      }

      // Character limit validations
      if (firstName && firstName.length > 50) {
        record.addError("first_name", "First Name exceeds character limit of 50");
      }

      if (middleName && middleName.length > 50) {
        record.addError("middle_name", "Middle Name exceeds character limit of 50");
      }

      if (lastName && lastName.length > 50) {
        record.addError("last_name", "Last Name exceeds character limit of 50");
      }

      if (alternateFirstName && alternateFirstName.length > 50) {
        record.addError("alternate_first_name", "Alternate First Name exceeds character limit of 50");
      }

      if (alternateMiddleName && alternateMiddleName.length > 50) {
        record.addError("alternate_middle_name", "Alternate Middle Name exceeds character limit of 50");
      }

      if (alternateLastName && alternateLastName.length > 50) {
        record.addError("alternate_last_name", "Alternate Last Name exceeds character limit of 50");
      }

      if (internalId && internalId.length > 100) {
        record.addError("internal_id", "Internal ID exceeds character limit of 100");
      }

      if (countryOfBirth && countryOfBirth.length > 100) {
        record.addError("country_of_birth", "Country of Birth exceeds character limit of 100");
      }

      if (cityOfBirth && cityOfBirth.length > 100) {
        record.addError("city_of_birth", "City of Birth exceeds character limit of 100");
      }

      if (countyOfBirth && countyOfBirth.length > 100) {
        record.addError("county_of_birth", "County of Birth exceeds character limit of 100");
      }

      if (citizenship && citizenship.length > 100) {
        record.addError("citizenship", "Citizenship exceeds character limit of 100");
      }

      if (visaNumber && visaNumber.length > 20) {
        record.addError("visa_number", "Visa Number exceeds character limit of 20");
      }

      if (spouseFullName && spouseFullName.length > 256) {
        record.addError("spouse_full_name", "Spouse Full Name exceeds character limit of 256");
      }

      if (supervisingPhysiciansName && supervisingPhysiciansName.length > 100) {
        record.addError("supervising_physicians_name", "Supervising Physician's Name exceeds character limit of 100");
      }

      if (specialty && specialty.length > 100) {
        record.addError("specialty", "Specialty exceeds character limit of 100");
      }

      if (subspecialty && subspecialty.length > 100) {
        record.addError("subspecialty", "Subspecialty exceeds character limit of 100");
      }

      if (taxonomy && taxonomy.length > 100) {
        record.addError("taxonomy", "Taxonomy exceeds character limit of 100");
      }

      if (medicareNumber && medicareNumber.length > 50) {
        record.addError("medicare_number", "Medicare Number exceeds character limit of 50");
      }

      if (medicaidNumber && medicaidNumber.length > 50) {
        record.addError("medicaid_number", "Medicaid Number exceeds character limit of 50");
      }

      if (loginEmail && loginEmail.length > 128) {
        record.addError("login_email", "Login Email exceeds character limit of 128");
      }

      if (otherEmail && otherEmail.length > 100) {
        record.addError("other_email", "Other Email exceeds character limit of 100");
      }

      if (primaryCredentialingSpecialistEmail && primaryCredentialingSpecialistEmail.length > 200) {
        record.addError("primary_credentialing_specialist_email", "Primary Credentialing Specialist Email exceeds character limit of 200");
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

      if (country && country.length > 100) {
        record.addError("country", "Country exceeds character limit of 100");
      }

      if (county && county.length > 100) {
        record.addError("county", "County exceeds character limit of 100");
      }

      if (emergencyContactFirstName && emergencyContactFirstName.length > 100) {
        record.addError("emergency_contact_first_name", "Emergency Contact First Name exceeds character limit of 100");
      }

      if (emergencyContactLastName && emergencyContactLastName.length > 100) {
        record.addError("emergency_contact_last_name", "Emergency Contact Last Name exceeds character limit of 100");
      }

      if (emergencyContactEmail && emergencyContactEmail.length > 100) {
        record.addError("emergency_contact_email", "Emergency Contact Email exceeds character limit of 100");
      }

      if (taxId && taxId.length > 100) {
        record.addError("tax_id", "Tax ID exceeds character limit of 100");
      }

      if (taxName && taxName.length > 100) {
        record.addError("tax_name", "Tax Name exceeds character limit of 100");
      }

      if (providerId && providerId.length > 64) {
        record.addError("provider_id", `Provider ID exceeds character limit of 64. You entered ${providerId.length} characters.`);
      }

      if (emrId && emrId.length > 64) {
        record.addError("emr_id", `EMR ID exceeds character limit of 64. You entered ${emrId.length} characters.`);
      }

      if (stateOfBirth && stateOfBirth.length > 50) {
        record.addError("state_of_birth", "State of Birth exceeds character limit of 50");
      }

      if (preferredName && preferredName.length > 256) {
        record.addError("preferred_name", "Preferred Name exceeds character limit of 256");
      }

      if (militaryTitle && militaryTitle.length > 200) {
        record.addError("military_title", "Military Title exceeds character limit of 200");
      }

      if (assistantName && assistantName.length > 256) {
        record.addError("assistant_name", "Assistant Name exceeds character limit of 256");
      }

      if (assistantEmail && assistantEmail.length > 100) {
        record.addError("assistant_email", "Assistant Email exceeds character limit of 100");
      }

      if (preferredCredentials && preferredCredentials.length > 50) {
        record.addError("preferred_credentials", "Preferred Credentails exceeds character limit of 50");
      }

      // Date format validations (m/d/yyyy)
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

      if (alternateNameStartDate && !dateRegex.test(alternateNameStartDate)) {
        record.addError("alternate_name_start_date", "Alternate Name Start Date must be formatted as m/d/yyyy");
      }

      if (alternateNameEndDate && !dateRegex.test(alternateNameEndDate)) {
        record.addError("alternate_name_end_date", "Alternate Name End Date must be formatted as m/d/yyyy");
      }

      if (birthDate && !dateRegex.test(birthDate)) {
        record.addError("birth_date", "Date of Birth must be formatted as m/d/yyyy");
      }

      if (visaExpiration && !dateRegex.test(visaExpiration)) {
        record.addError("visa_expiration", "Visa Expiration must be formatted as m/d/yyyy");
      }

      if (timeInPositionStartDate && !dateRegex.test(timeInPositionStartDate)) {
        record.addError("time_in_position_start_date", "Time in Position Start Date must be formatted as m/d/yyyy");
      }

      if (timeInPositionEndDate && !dateRegex.test(timeInPositionEndDate)) {
        record.addError("time_in_position_end_date", "Time in Position End Date must be formatted as m/d/yyyy");
      }

      if (militaryStartDate && !dateRegex.test(militaryStartDate)) {
        record.addError("military_start_date", "Military Start Date must be formatted as m/d/yyyy");
      }

      if (militaryEndDate && !dateRegex.test(militaryEndDate)) {
        record.addError("military_end_date", "Military End Date must be formatted as m/d/yyyy");
      }

      // Visa-related cross-field validations
      if (visaExpiration && !workVisaType?.trim()) {
        record.addError("work_visa_type", "Work Visa Type is required when importing Visa Expiration");
      }

      if (visaNumber && !workVisaType?.trim()) {
        record.addError("work_visa_type", "Work Visa Type is required when importing Visa Number");
      }

      // SSN validation (9 digits)
      if (ssn) {
        const ssnDigitsOnly = ssn.replace(/\D/g, '');
        if (ssnDigitsOnly.length !== 9) {
          record.addError("ssn", "Must be a 9 digit SSN (###-##-####)");
        }
      }

      // NPI validation (10 digits)
      if (npi) {
        const npiDigitsOnly = npi.replace(/\D/g, '');
        if (npiDigitsOnly.length !== 10) {
          record.addError("npi", "NPI must be exactly 10 digits");
        }
      }

      // Phone number validations (9, 10, or 12 digits without formatting)
      const validatePhoneNumber = (phoneValue: string, fieldName: string, displayName: string) => {
        if (phoneValue) {
          const phoneDigitsOnly = phoneValue.replace(/\D/g, '');
          if (phoneDigitsOnly.length !== 9 && phoneDigitsOnly.length !== 10 && phoneDigitsOnly.length !== 12) {
            record.addError(fieldName, `${displayName} must be 9, 10, or 12-digit number`);
          }
          // Check if original contains formatting
          if (phoneValue !== phoneDigitsOnly) {
            record.addError(fieldName, `${displayName} must be 9, 10, or 12-digit number`);
          }
        }
      };

      validatePhoneNumber(homePhone, "home_phone", "Home Phone");
      validatePhoneNumber(mobilePhone, "mobile_phone", "Mobile Phone");
      validatePhoneNumber(pager, "pager", "Pager");
      validatePhoneNumber(spousePhoneNumber, "spouse_phone_number", "Spouse Phone Number");
      validatePhoneNumber(emergencyContactPhoneNumber, "emergency_contact_phone_number", "Emergency Contact Phone");
      validatePhoneNumber(assistantPhone, "assistant_phone", "Assistant Phone");

      // Email validations
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (loginEmail && !emailRegex.test(loginEmail)) {
        record.addError("login_email", "Login Email/Contact Email not a valid email");
      }

      if (otherEmail && !emailRegex.test(otherEmail)) {
        record.addError("other_email", "Other Email not a valid email");
      }

      if (emergencyContactEmail && !emailRegex.test(emergencyContactEmail)) {
        record.addError("emergency_contact_email", "Emergency Contact Email not a valid email");
      }

      if (assistantEmail && !emailRegex.test(assistantEmail)) {
        record.addError("assistant_email", "Assistant Email not a valid email");
      }

      if (primaryCredentialingSpecialistEmail && !emailRegex.test(primaryCredentialingSpecialistEmail)) {
        record.addError("primary_credentialing_specialist_email", "Primary Credentialing Specialist Email not a valid email");
      }

      // Zip code validation (alphanumeric, max 10 characters)
      if (zip && (zip.length > 10 || !/^[a-zA-Z0-9]*$/.test(zip))) {
        record.addError("zip", "Zip exceeds character limit of 10");
      }

      // UPIN validation (6 character alphanumeric)
      if (upin && (upin.length !== 6 || !/^[a-zA-Z0-9]{6}$/.test(upin))) {
        record.addError("upin", "UPIN must be a 6 character alphanumeric value");
      }

      // Enum validations (already handled by field config, but adding custom validation for unsupported values)
      const validSalutations = ["Mr.", "Ms.", "Mrs.", "Dr."];
      if (salutation && !validSalutations.includes(salutation)) {
        record.addError("salutation", "Salutation not supported");
      }

      const validPronouns = ["She/Her/Hers", "He/Him/His", "They/Them/Theirs", "Ze/Hir/Hirs"];
      if (pronouns && !validPronouns.includes(pronouns)) {
        record.addError("pronouns", "Pronouns not supported");
      }

      const validWorkVisaTypes = ["H-1B", "H-2B", "H-3B", "L", "O", "P", "R", "TN"];
      if (workVisaType && !validWorkVisaTypes.includes(workVisaType)) {
        record.addError("work_visa_type", "Work Visa Type Unsupported");
      }

      const validAcceptingNewPatients = ["None", "Yes", "No", ""];
      if (acceptingNewPatients && !validAcceptingNewPatients.includes(acceptingNewPatients)) {
        record.addError("accepting_new_patients", "Accepting New Patients must be 'None', 'Yes', 'No' or blank");
      }

      const validMaritalStatus = ["Single", "Married", "Divorced", "Separated", "Widowed"];
      if (maritalStatus && !validMaritalStatus.includes(maritalStatus)) {
        record.addError("marital_status", "Marital Status Unsupported");
      }

      const validGenders = ["Male", "Female", "Transgender", "Not Specified"];
      if (gender && !validGenders.includes(gender)) {
        record.addError("gender", "Gender not supported");
      }

      const validEthnicities = ["American Indian or Alaska Native", "Black or African American", "Hispanic or Latino", "Native Hawaiian or Pacific Islander", "White"];
      if (ethnicity && !validEthnicities.includes(ethnicity)) {
        record.addError("ethnicity", "Ethnicity not supported");
      }

      const validPreferredContactMethods = ["Login Email", "Other Email", "Home Phone", "Mobile Phone", "Pager"];
      if (preferredContactMethod && !validPreferredContactMethods.includes(preferredContactMethod)) {
        record.addError("preferred_contact_method", "Preferred Contact Method not supported, value defaulted to null");
      }

      const validSuffixes = ["Sr", "Jr", "II", "III", "IV"];
      if (suffix && !validSuffixes.includes(suffix)) {
        record.addWarning("suffix", `Suffix value ${suffix} not supported.`);
      }

      if (alternateNameSuffix && !validSuffixes.includes(alternateNameSuffix)) {
        record.addWarning("alternate_name_suffix", `Alternate Name Suffix value ${alternateNameSuffix} not supported.`);
      }

      const validMilitaryBranches = ["Air Force", "Army", "Coast Guard", "Marine Corps", "Military Resident", "Navy", "Other Government Provider", "Space Force"];
      if (militaryBranch && !validMilitaryBranches.includes(militaryBranch)) {
        record.addError("military_branch", "Military Branch not supported.");
      }

      const validMilitaryStatuses = ["Active", "Government Civilian", "Guard", "Inactive", "Reserve", "Retired"];
      if (militaryStatus && !validMilitaryStatuses.includes(militaryStatus)) {
        record.addError("military_status", "Military Status not supported.");
      }

      const validAffiliationVerification = ["Yes", "No", ""];
      if (affiliationVerificationAvailable && !validAffiliationVerification.includes(affiliationVerificationAvailable)) {
        record.addError("affiliation_verification_available", "Affiliation Verification Available must be 'Yes', 'No', or blank.");
      }

      const validDisableNotifications = ["Yes", "No", ""];
      if (disableExpiringNotifications && !validDisableNotifications.includes(disableExpiringNotifications)) {
        record.addError("disable_expiring_notifications", "Disable Expiring Notifications must be 'Yes' or 'No'");
      }

      // Handle "None" value clearing (case-insensitive)
      const fieldsToCheckForNone = [
        "first_name", "middle_name", "last_name", "alternate_first_name", "alternate_middle_name", 
        "alternate_last_name", "provider_type", "npi", "ssn", "country_of_birth", "state_of_birth",
        "city_of_birth", "gender", "ethnicity", "citizenship", "work_visa_type", "visa_number",
        "languages_spoken", "marital_status", "spouse_full_name", "corporate_employment_type",
        "specialty", "subspecialty", "taxonomy"
      ];

      fieldsToCheckForNone.forEach(fieldKey => {
        const fieldValue = record.get(fieldKey) as string;
        if (fieldValue && fieldValue.toLowerCase().trim() === "none") {
          record.set(fieldKey, "");
        }
      });

      return record;
    })
  );
};