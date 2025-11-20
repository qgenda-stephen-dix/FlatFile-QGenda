import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const providerDemographicImportValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("provider-demographic-import", (record) => {
      // Get all field values
      const externalId = record.get("External ID") as string;
      const externalIdType = record.get("External ID Type") as string;
      const salutation = record.get("Salutation") as string;
      const pronouns = record.get("Pronouns") as string;
      const firstName = record.get("First Name") as string;
      const middleName = record.get("Middle Name") as string;
      const lastName = record.get("Last Name") as string;
      const alternateFirstName = record.get("Alternate First Name") as string;
      const alternateMiddleName = record.get("Alternate Middle Name") as string;
      const alternateLastName = record.get("Alternate Last Name") as string;
      const alternateNameStartDate = record.get("Alternate Name Start Date") as string;
      const alternateNameEndDate = record.get("Alternate Name End Date") as string;
      const providerType = record.get("Provider Type") as string;
      const npi = record.get("National Provider Identification Number (NPI)") as string;
      const autoVerifyNpi = record.get("Auto-Verify NPI?") as string;
      const ssn = record.get("Social Security Number (SSN)") as string;
      const birthDate = record.get("Birth Date") as string;
      const countryOfBirth = record.get("Country of Birth") as string;
      const stateOfBirth = record.get("State of Birth") as string;
      const cityOfBirth = record.get("City of Birth") as string;
      const countyOfBirth = record.get("County of Birth") as string;
      const gender = record.get("Gender") as string;
      const ethnicity = record.get("Ethnicity") as string;
      const race = record.get("Race") as string;
      const citizenship = record.get("Citizenship") as string;
      const workVisaType = record.get("Work Visa Type") as string;
      const visaExpiration = record.get("Visa Expiration") as string;
      const visaNumber = record.get("Visa Number") as string;
      const acceptingNewPatients = record.get("Accepting New Patients") as string;
      const languagesSpoken = record.get("Languages Spoken") as string;
      const maritalStatus = record.get("Marital Status") as string;
      const spouseFullName = record.get("Spouse Full Name") as string;
      const spousePhoneNumber = record.get("Spouse Phone Number") as string;
      const corporateEmploymentType = record.get("Corporate Employment Type") as string;
      const supervisingPhysiciansName = record.get("Supervising Physician's Name") as string;
      const timeInPositionStartDate = record.get("Time in this Position Start Date") as string;
      const timeInPositionEndDate = record.get("Time in this Position End Date") as string;
      const specialty = record.get("Specialty") as string;
      const subspecialty = record.get("Subspecialty") as string;
      const taxonomy = record.get("Taxonomy") as string;
      const medicareNumber = record.get("Medicare Number") as string;
      const medicaidNumber = record.get("Medicaid Number") as string;
      const loginEmail = record.get("Login Email/Contact Email") as string;
      const otherEmail = record.get("Other Email") as string;
      const homePhone = record.get("Home Phone") as string;
      const mobilePhone = record.get("Mobile Phone") as string;
      const pager = record.get("Pager") as string;
      const preferredContactMethod = record.get("Preferred Contact Method") as string;
      const addressLine1 = record.get("Address Line 1") as string;
      const addressLine2 = record.get("Address Line 2") as string;
      const city = record.get("City") as string;
      const state = record.get("State") as string;
      const zip = record.get("Zip") as string;
      const country = record.get("Country") as string;
      const county = record.get("County") as string;
      const emergencyContactFirstName = record.get("Emergency Contact First Name") as string;
      const emergencyContactLastName = record.get("Emergency Contact Last Name") as string;
      const emergencyContactPhoneNumber = record.get("Emergency Contact Phone Number") as string;
      const emergencyContactEmail = record.get("Emergency Contact Email") as string;
      const taxId = record.get("Tax ID") as string;
      const taxName = record.get("Tax Name") as string;
      const providerId = record.get("Provider ID") as string;
      const internalId = record.get("Internal ID") as string;
      const emrId = record.get("EMR ID") as string;
      const ssoId = record.get("SSO ID") as string;
      const suffix = record.get("Suffix") as string;
      const preferredName = record.get("Preferred Name") as string;
      const alternateNameSuffix = record.get("Alternate Name Suffix") as string;
      const upin = record.get("UPIN") as string;
      const militaryStartDate = record.get("Military Start Date") as string;
      const militaryEndDate = record.get("Military End Date") as string;
      const militaryBranch = record.get("Military Branch") as string;
      const militaryStatus = record.get("Military Status") as string;
      const militaryTitle = record.get("Military Title") as string;
      const assistantName = record.get("Assistant Name") as string;
      const assistantEmail = record.get("Assistant Email") as string;
      const assistantPhone = record.get("Assistant Phone") as string;
      const preferredCredentials = record.get("Preferred Credentials") as string;
      const affiliationVerificationAvailable = record.get("Affiliation Verification Available") as string;
      const primaryCredentialingSpecialistEmail = record.get("Primary Credentialing Specialist Email") as string;
      const disableExpiringNotifications = record.get("Disable Expiring Notifications") as string;

      // Basic required field validation
      if (!firstName?.trim()) {
        record.addError("First Name", "First Name required");
      }

      if (!lastName?.trim()) {
        record.addError("Last Name", "Last Name required");
      }

      // External ID validation for updates
      if (externalId?.trim() && !externalIdType?.trim()) {
        record.addWarning("External ID Type", "External ID Type required when External ID is provided");
      }

      if (externalIdType?.trim() && !externalId?.trim()) {
        record.addWarning("External ID", "External ID required when External ID Type is provided");
      }

      // Character limit validations
      if (firstName && firstName.length > 50) {
        record.addError("First Name", "First Name exceeds character limit of 50");
      }

      if (middleName && middleName.length > 50) {
        record.addError("Middle Name", "Middle Name exceeds character limit of 50");
      }

      if (lastName && lastName.length > 50) {
        record.addError("Last Name", "Last Name exceeds character limit of 50");
      }

      if (alternateFirstName && alternateFirstName.length > 50) {
        record.addError("Alternate First Name", "Alternate First Name exceeds character limit of 50");
      }

      if (alternateMiddleName && alternateMiddleName.length > 50) {
        record.addError("Alternate Middle Name", "Alternate Middle Name exceeds character limit of 50");
      }

      if (alternateLastName && alternateLastName.length > 50) {
        record.addError("Alternate Last Name", "Alternate Last Name exceeds character limit of 50");
      }

      if (providerType && providerType.length > 100) {
        record.addError("Provider Type", "Provider Type exceeds character limit of 100");
      }

      if (countryOfBirth && countryOfBirth.length > 100) {
        record.addError("Country of Birth", "Country of Birth exceeds character limit of 100");
      }

      if (stateOfBirth && stateOfBirth.length > 50) {
        record.addError("State of Birth", "State of Birth exceeds character limit of 50");
      }

      if (cityOfBirth && cityOfBirth.length > 100) {
        record.addError("City of Birth", "City of Birth exceeds character limit of 100");
      }

      if (countyOfBirth && countyOfBirth.length > 100) {
        record.addError("County of Birth", "County of Birth exceeds character limit of 100");
      }

      if (citizenship && citizenship.length > 100) {
        record.addError("Citizenship", "Citizenship exceeds character limit of 100");
      }

      if (visaNumber && visaNumber.length > 20) {
        record.addError("Visa Number", "Visa Number exceeds character limit of 20");
      }

      if (languagesSpoken && languagesSpoken.length > 256) {
        record.addError("Languages Spoken", "Languages Spoken exceeds character limit of 256");
      }

      if (spouseFullName && spouseFullName.length > 256) {
        record.addError("Spouse Full Name", "Spouse Full Name exceeds character limit of 256");
      }

      if (corporateEmploymentType && corporateEmploymentType.length > 100) {
        record.addError("Corporate Employment Type", "Corporate Employment Type exceeds character limit of 100");
      }

      if (supervisingPhysiciansName && supervisingPhysiciansName.length > 100) {
        record.addError("Supervising Physician's Name", "Supervising Physician's Name exceeds character limit of 100");
      }

      if (specialty && specialty.length > 100) {
        record.addError("Specialty", "Specialty exceeds character limit of 100");
      }

      if (subspecialty && subspecialty.length > 100) {
        record.addError("Subspecialty", "Subspecialty exceeds character limit of 100");
      }

      if (taxonomy && taxonomy.length > 100) {
        record.addError("Taxonomy", "Taxonomy exceeds character limit of 100");
      }

      if (medicareNumber && medicareNumber.length > 50) {
        record.addError("Medicare Number", "Medicare Number exceeds character limit of 50");
      }

      if (medicaidNumber && medicaidNumber.length > 50) {
        record.addError("Medicaid Number", "Medicaid Number exceeds character limit of 50");
      }

      if (loginEmail && loginEmail.length > 128) {
        record.addError("Login Email/Contact Email", "Login Email/Contact Email exceeds character limit of 128");
      }

      if (otherEmail && otherEmail.length > 100) {
        record.addError("Other Email", "Other Email exceeds character limit of 100");
      }

      if (addressLine1 && addressLine1.length > 100) {
        record.addError("Address Line 1", "Address Line 1 exceeds character limit of 100");
      }

      if (addressLine2 && addressLine2.length > 50) {
        record.addError("Address Line 2", "Address Line 2 exceeds character limit of 50");
      }

      if (city && city.length > 50) {
        record.addError("City", "City exceeds character limit of 50");
      }

      if (state && state.length > 50) {
        record.addError("State", "State exceeds character limit of 50");
      }

      if (zip && zip.length > 10) {
        record.addError("Zip", "Zip exceeds character limit of 10");
      }

      if (country && country.length > 100) {
        record.addError("Country", "Country exceeds character limit of 100");
      }

      if (county && county.length > 100) {
        record.addError("County", "County exceeds character limit of 100");
      }

      if (emergencyContactFirstName && emergencyContactFirstName.length > 100) {
        record.addError("Emergency Contact First Name", "Emergency Contact First Name exceeds character limit of 100");
      }

      if (emergencyContactLastName && emergencyContactLastName.length > 100) {
        record.addError("Emergency Contact Last Name", "Emergency Contact Last Name exceeds character limit of 100");
      }

      if (emergencyContactEmail && emergencyContactEmail.length > 100) {
        record.addError("Emergency Contact Email", "Emergency Contact Email exceeds character limit of 100");
      }

      if (taxId && taxId.length > 100) {
        record.addError("Tax ID", "Tax ID exceeds character limit of 100");
      }

      if (taxName && taxName.length > 100) {
        record.addError("Tax Name", "Tax Name exceeds character limit of 100");
      }

      if (providerId && providerId.length > 64) {
        record.addError("Provider ID", "Provider ID exceeds character limit of 64");
      }

      if (internalId && internalId.length > 100) {
        record.addError("Internal ID", "Internal ID exceeds character limit of 100");
      }

      if (emrId && emrId.length > 64) {
        record.addError("EMR ID", "EMR ID exceeds character limit of 64");
      }

      if (preferredName && preferredName.length > 256) {
        record.addError("Preferred Name", "Preferred Name exceeds character limit of 256");
      }

      if (upin && upin.length !== 6) {
        record.addError("UPIN", "UPIN must be exactly 6 characters");
      }

      if (militaryTitle && militaryTitle.length > 200) {
        record.addError("Military Title", "Military Title exceeds character limit of 200");
      }

      if (assistantName && assistantName.length > 256) {
        record.addError("Assistant Name", "Assistant Name exceeds character limit of 256");
      }

      if (assistantEmail && assistantEmail.length > 100) {
        record.addError("Assistant Email", "Assistant Email exceeds character limit of 100");
      }

      if (preferredCredentials && preferredCredentials.length > 50) {
        record.addError("Preferred Credentials", "Preferred Credentials exceeds character limit of 50");
      }

      if (primaryCredentialingSpecialistEmail && primaryCredentialingSpecialistEmail.length > 200) {
        record.addError("Primary Credentialing Specialist Email", "Primary Credentialing Specialist Email exceeds character limit of 200");
      }

      // Date format validation (m/d/yyyy)
      const dateFields = [
        { field: alternateNameStartDate, key: "Alternate Name Start Date" },
        { field: alternateNameEndDate, key: "Alternate Name End Date" },
        { field: birthDate, key: "Birth Date" },
        { field: visaExpiration, key: "Visa Expiration" },
        { field: timeInPositionStartDate, key: "Time in this Position Start Date" },
        { field: timeInPositionEndDate, key: "Time in this Position End Date" },
        { field: militaryStartDate, key: "Military Start Date" },
        { field: militaryEndDate, key: "Military End Date" }
      ];

      dateFields.forEach(({ field, key }) => {
        if (field && field.trim()) {
          const dateRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/;
          if (!dateRegex.test(field.trim())) {
            record.addError(key, `${key} must be formatted as m/d/yyyy`);
          }
        }
      });

      // Phone number validation (9, 10, or 12 digits)
      const phoneFields = [
        { field: homePhone, key: "Home Phone" },
        { field: mobilePhone, key: "Mobile Phone" },
        { field: pager, key: "Pager" },
        { field: spousePhoneNumber, key: "Spouse Phone Number" },
        { field: emergencyContactPhoneNumber, key: "Emergency Contact Phone Number" },
        { field: assistantPhone, key: "Assistant Phone" }
      ];

      phoneFields.forEach(({ field, key }) => {
        if (field && field.trim()) {
          const phoneRegex = /^\d{9}$|^\d{10}$|^\d{12}$/;
          if (!phoneRegex.test(field.replace(/\D/g, ''))) {
            record.addError(key, `${key} must be 9, 10, or 12 digits without formatting`);
          }
        }
      });

      // Email format validation
      const emailFields = [
        { field: loginEmail, key: "Login Email/Contact Email" },
        { field: otherEmail, key: "Other Email" },
        { field: emergencyContactEmail, key: "Emergency Contact Email" },
        { field: assistantEmail, key: "Assistant Email" },
        { field: primaryCredentialingSpecialistEmail, key: "Primary Credentialing Specialist Email" }
      ];

      emailFields.forEach(({ field, key }) => {
        if (field && field.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.trim())) {
            record.addError(key, `${key} must be a valid email format`);
          }
        }
      });

      // NPI validation (exactly 10 digits)
      if (npi && npi.trim()) {
        const npiRegex = /^\d{10}$/;
        if (!npiRegex.test(npi.replace(/\D/g, ''))) {
          record.addError("National Provider Identification Number (NPI)", "NPI must be exactly 10 digits");
        }
      }

      // SSN validation (9 digits)
      if (ssn && ssn.trim()) {
        const ssnRegex = /^\d{9}$/;
        if (!ssnRegex.test(ssn.replace(/\D/g, ''))) {
          record.addError("Social Security Number (SSN)", "SSN must be 9 digits");
        }
      }

      // Cross-field business rules
      
      // Visa validations
      if (visaExpiration?.trim() && !workVisaType?.trim()) {
        record.addWarning("Work Visa Type", "Work Visa Type required when Visa Expiration is provided");
      }

      if (visaNumber?.trim() && !workVisaType?.trim()) {
        record.addWarning("Work Visa Type", "Work Visa Type required when Visa Number is provided");
      }

      if (workVisaType?.trim() && (!visaExpiration?.trim() && !visaNumber?.trim())) {
        record.addWarning("Visa Expiration", "Either Visa Expiration or Visa Number should be provided when Work Visa Type is specified");
      }

      // Clear "None" values for consistency
      const fieldsToCheckForNone = [
        "First Name", "Middle Name", "Last Name", "Alternate First Name", "Alternate Middle Name", 
        "Alternate Last Name", "Provider Type", "National Provider Identification Number (NPI)", "Social Security Number (SSN)", "Birth Date", 
        "Country of Birth", "State of Birth", "City of Birth", "County of Birth", "Gender", "Ethnicity", "Race", 
        "Citizenship", "Work Visa Type", "Visa Expiration", "Visa Number", "Accepting New Patients", 
        "Languages Spoken", "Marital Status", "Spouse Full Name", "Spouse Phone Number", "Corporate Employment Type", 
        "Supervising Physician's Name", "Time in this Position Start Date", "Time in this Position End Date", 
        "Specialty", "Subspecialty", "Taxonomy", "Medicare Number", "Medicaid Number", "Login Email/Contact Email", 
        "Other Email", "Home Phone", "Mobile Phone", "Pager", "Preferred Contact Method", "Address Line 1", 
        "Address Line 2", "City", "State", "Zip", "Country", "County", "Emergency Contact First Name", 
        "Emergency Contact Last Name", "Emergency Contact Phone Number", "Emergency Contact Email", "Tax ID", 
        "Tax Name", "Provider ID", "Internal ID", "EMR ID", "SSO ID", "Suffix", "Preferred Name", 
        "Alternate Name Suffix", "UPIN", "Military Start Date", "Military End Date", "Military Branch", 
        "Military Status", "Military Title", "Assistant Name", "Assistant Email", "Assistant Phone", 
        "Preferred Credentials", "Affiliation Verification Available", "Primary Credentialing Specialist Email", 
        "Disable Expiring Notifications"
      ];

      fieldsToCheckForNone.forEach(fieldKey => {
        const value = record.get(fieldKey) as string;
        if (value && value.trim().toLowerCase() === "none") {
          record.set(fieldKey, "");
        }
      });

      return record;
    })
  );
};