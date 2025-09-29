import { recordHook } from "@flatfile/plugin-record-hook";

export const demographicV2ValidationHook = recordHook('demographic_v2', (record) => {
  // External ID and Type validation
  const externalId = record.get("external_id") as string;
  const externalIdType = record.get("external_id_type") as string;
  
  // Both External ID and Type must be provided together or not at all
  if ((externalId && !externalIdType) || (!externalId && externalIdType)) {
    record.addError("external_id", "Must provide both External ID and External ID Type");
    record.addError("external_id_type", "Must provide both External ID and External ID Type");
  }

  // Required fields validation for new providers
  const firstName = record.get("first_name") as string;
  const lastName = record.get("last_name") as string;
  
  if (!firstName || firstName.trim() === "") {
    record.addError("first_name", "First Name required");
  }
  
  if (!lastName || lastName.trim() === "") {
    record.addError("last_name", "Last Name required");
  }

  // Character limit validations
  if (firstName && firstName.length > 50) {
    record.addError("first_name", "First Name exceeds character limit of 50");
  }
  
  const middleName = record.get("middle_name") as string;
  if (middleName && middleName.length > 50) {
    record.addError("middle_name", "Middle Name exceeds character limit of 50");
  }
  
  if (lastName && lastName.length > 50) {
    record.addError("last_name", "Last Name exceeds character limit of 50");
  }

  // Alternate name character limits
  const altFirstName = record.get("alternate_first_name") as string;
  if (altFirstName && altFirstName.length > 50) {
    record.addError("alternate_first_name", "Alternate First Name exceeds character limit of 50");
  }
  
  const altMiddleName = record.get("alternate_middle_name") as string;
  if (altMiddleName && altMiddleName.length > 50) {
    record.addError("alternate_middle_name", "Alternate Middle Name exceeds character limit of 50");
  }
  
  const altLastName = record.get("alternate_last_name") as string;
  if (altLastName && altLastName.length > 50) {
    record.addError("alternate_last_name", "Alternate Last Name exceeds character limit of 50");
  }

  // NPI validation - must be exactly 10 digits
  const npi = record.get("npi") as string;
  if (npi && !/^[0-9]{10}$/.test(npi)) {
    record.addError("npi", "NPI must be exactly 10 digits");
  }

  // SSN validation - must be exactly 9 digits
  const ssn = record.get("ssn") as string;
  if (ssn && !/^[0-9]{9}$/.test(ssn.replace(/[-]/g, ''))) {
    record.addError("ssn", "Must be a 9 digit SSN");
  }

  // UPIN validation - must be exactly 6 alphanumeric characters
  const upin = record.get("upin") as string;
  if (upin && (upin.length !== 6 || !/^[a-zA-Z0-9]{6}$/.test(upin))) {
    record.addError("upin", "UPIN must be a 6 character alphanumeric value");
  }

  // Phone number validations - must be 9, 10, or 12 digits
  const phoneRegex = /^[0-9]{9}$|^[0-9]{10}$|^[0-9]{12}$/;
  
  const homePhone = record.get("home_phone") as string;
  if (homePhone && !phoneRegex.test(homePhone)) {
    record.addError("home_phone", "Home Phone must be 9, 10, or 12-digit number");
  }
  
  const mobilePhone = record.get("mobile_phone") as string;
  if (mobilePhone && !phoneRegex.test(mobilePhone)) {
    record.addError("mobile_phone", "Mobile Phone must be 9, 10, or 12-digit number");
  }
  
  const pager = record.get("pager") as string;
  if (pager && !phoneRegex.test(pager)) {
    record.addError("pager", "Pager must be 9, 10, or 12-digit number");
  }
  
  const emergencyPhone = record.get("emergency_contact_phone_number") as string;
  if (emergencyPhone && !phoneRegex.test(emergencyPhone)) {
    record.addError("emergency_contact_phone_number", "Emergency Contact Phone must be 9, 10, or 12-digit number");
  }
  
  const spousePhone = record.get("spouse_phone_number") as string;
  if (spousePhone && !phoneRegex.test(spousePhone)) {
    record.addError("spouse_phone_number", "Spouse Phone Number must be 9, 10, or 12-digit number");
  }
  
  const assistantPhone = record.get("assistant_phone") as string;
  if (assistantPhone && !phoneRegex.test(assistantPhone)) {
    record.addError("assistant_phone", "Assistant Phone must be 9, 10, or 12-digit number");
  }

  // Email validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const loginEmail = record.get("login_email") as string;
  if (loginEmail && !emailRegex.test(loginEmail)) {
    record.addError("login_email", "Login Email/Contact Email not a valid email");
  }
  if (loginEmail && loginEmail.length > 128) {
    record.addError("login_email", "Login Email exceeds character limit of 128");
  }
  
  const otherEmail = record.get("other_email") as string;
  if (otherEmail && !emailRegex.test(otherEmail)) {
    record.addError("other_email", "Other Email not a valid email");
  }
  if (otherEmail && otherEmail.length > 100) {
    record.addError("other_email", "Other Email exceeds character limit of 100");
  }
  
  const emergencyEmail = record.get("emergency_contact_email") as string;
  if (emergencyEmail && !emailRegex.test(emergencyEmail)) {
    record.addError("emergency_contact_email", "Emergency Contact Email not a valid email");
  }
  if (emergencyEmail && emergencyEmail.length > 100) {
    record.addError("emergency_contact_email", "Emergency Contact Email exceeds character limit of 100");
  }
  
  const assistantEmail = record.get("assistant_email") as string;
  if (assistantEmail && !emailRegex.test(assistantEmail)) {
    record.addError("assistant_email", "Assistant Email not a valid email");
  }
  if (assistantEmail && assistantEmail.length > 100) {
    record.addError("assistant_email", "Assistant Email exceeds character limit of 100");
  }
  
  const credentialingEmail = record.get("primary_credentialing_specialist_email") as string;
  if (credentialingEmail && !emailRegex.test(credentialingEmail)) {
    record.addError("primary_credentialing_specialist_email", "Primary Credentialing Specialist Email not a valid email");
  }
  if (credentialingEmail && credentialingEmail.length > 200) {
    record.addError("primary_credentialing_specialist_email", "Primary Credentialing Specialist Email exceeds character limit of 200");
  }

  // Character limit validations for various fields
  const internalId = record.get("internal_id") as string;
  if (internalId && internalId.length > 100) {
    record.addError("internal_id", "Internal ID exceeds character limit of 100");
  }
  
  const countryOfBirth = record.get("country_of_birth") as string;
  if (countryOfBirth && countryOfBirth.length > 100) {
    record.addError("country_of_birth", "Country of Birth exceeds character limit of 100");
  }
  
  const cityOfBirth = record.get("city_of_birth") as string;
  if (cityOfBirth && cityOfBirth.length > 100) {
    record.addError("city_of_birth", "City of Birth exceeds character limit of 100");
  }
  
  // Note: citizenship is now a reference field, so no character limit validation needed
  
  const visaNumber = record.get("visa_number") as string;
  if (visaNumber && visaNumber.length > 20) {
    record.addError("visa_number", "Visa Number exceeds character limit of 20");
  }
  
  const spouseFullName = record.get("spouse_full_name") as string;
  if (spouseFullName && spouseFullName.length > 256) {
    record.addError("spouse_full_name", "Spouse Full Name exceeds character limit of 256");
  }
  
  const supervisingPhysician = record.get("supervising_physician_name") as string;
  if (supervisingPhysician && supervisingPhysician.length > 100) {
    record.addError("supervising_physician_name", "Supervising Physician's Name exceeds character limit of 100");
  }
  
  const specialty = record.get("specialty") as string;
  if (specialty && specialty.length > 100) {
    record.addError("specialty", "Specialty exceeds character limit of 100");
  }
  
  const subspecialty = record.get("subspecialty") as string;
  if (subspecialty && subspecialty.length > 100) {
    record.addError("subspecialty", "Subspecialty exceeds character limit of 100");
  }
  
  const taxonomy = record.get("taxonomy") as string;
  if (taxonomy && taxonomy.length > 100) {
    record.addError("taxonomy", "Taxonomy exceeds character limit of 100");
  }
  
  const medicareNumber = record.get("medicare_number") as string;
  if (medicareNumber && medicareNumber.length > 50) {
    record.addError("medicare_number", "Medicare Number exceeds character limit of 50");
  }
  
  const medicaidNumber = record.get("medicaid_number") as string;
  if (medicaidNumber && medicaidNumber.length > 50) {
    record.addError("medicaid_number", "Medicaid Number exceeds character limit of 50");
  }
  
  const addressLine1 = record.get("address_line_1") as string;
  if (addressLine1 && addressLine1.length > 100) {
    record.addError("address_line_1", "Address Line 1 exceeds character limit of 100");
  }
  
  const addressLine2 = record.get("address_line_2") as string;
  if (addressLine2 && addressLine2.length > 50) {
    record.addError("address_line_2", "Address Line 2 exceeds character limit of 50");
  }
  
  const city = record.get("city") as string;
  if (city && city.length > 50) {
    record.addError("city", "City exceeds character limit of 50");
  }
  
  const country = record.get("country") as string;
  if (country && country.length > 100) {
    record.addError("country", "Country exceeds character limit of 100");
  }
  
  const emergencyFirstName = record.get("emergency_contact_first_name") as string;
  if (emergencyFirstName && emergencyFirstName.length > 100) {
    record.addError("emergency_contact_first_name", "Emergency Contact First Name exceeds character limit of 100");
  }
  
  const emergencyLastName = record.get("emergency_contact_last_name") as string;
  if (emergencyLastName && emergencyLastName.length > 100) {
    record.addError("emergency_contact_last_name", "Emergency Contact Last Name exceeds character limit of 100");
  }
  
  const taxId = record.get("tax_id") as string;
  if (taxId && taxId.length > 100) {
    record.addError("tax_id", "Tax ID exceeds character limit of 100");
  }
  
  const taxName = record.get("tax_name") as string;
  if (taxName && taxName.length > 100) {
    record.addError("tax_name", "Tax Name exceeds character limit of 100");
  }
  
  const providerId = record.get("provider_id") as string;
  if (providerId && providerId.length > 64) {
    record.addError("provider_id", `Provider ID exceeds character limit of 64. You entered ${providerId.length} characters.`);
  }
  
  const emrId = record.get("emr_id") as string;
  if (emrId && emrId.length > 64) {
    record.addError("emr_id", `EMR ID exceeds character limit of 64. You entered ${emrId.length} characters.`);
  }
  
  const stateOfBirth = record.get("state_of_birth") as string;
  if (stateOfBirth && stateOfBirth.length > 50) {
    record.addError("state_of_birth", "State of Birth exceeds character limit of 50");
  }
  
  const preferredName = record.get("preferred_name") as string;
  if (preferredName && preferredName.length > 256) {
    record.addError("preferred_name", "Preferred Name exceeds character limit of 256");
  }
  
  const countyOfBirth = record.get("county_of_birth") as string;
  if (countyOfBirth && countyOfBirth.length > 100) {
    record.addError("county_of_birth", "County of Birth exceeds character limit of 100");
  }
  
  const militaryTitle = record.get("military_title") as string;
  if (militaryTitle && militaryTitle.length > 200) {
    record.addError("military_title", "Military Title exceeds character limit of 200");
  }
  
  const county = record.get("county") as string;
  if (county && county.length > 100) {
    record.addError("county", "County exceeds character limit of 100");
  }
  
  const assistantName = record.get("assistant_name") as string;
  if (assistantName && assistantName.length > 256) {
    record.addError("assistant_name", "Assistant Name exceeds character limit of 256");
  }
  
  const preferredCredentials = record.get("preferred_credentials") as string;
  if (preferredCredentials && preferredCredentials.length > 50) {
    record.addError("preferred_credentials", "Preferred Credentials exceeds character limit of 50");
  }

  // ZIP code validation - must be 10 or fewer alphanumeric characters
  const zip = record.get("zip") as string;
  if (zip && (zip.length > 10 || !/^[a-zA-Z0-9]+$/.test(zip))) {
    record.addError("zip", "Zip exceeds character limit of 10");
  }

  // Visa validation dependencies
  const workVisaType = record.get("work_visa_type") as string;
  const visaExpiration = record.get("visa_expiration") as string;
  
  if (visaExpiration && !workVisaType) {
    record.addError("work_visa_type", "Work Visa Type is required when importing Visa Expiration");
  }
  
  if (visaNumber && !workVisaType) {
    record.addError("work_visa_type", "Work Visa Type is required when importing Visa Number");
  }

  // Date range validations
  const altNameStart = record.get("alternate_name_start_date") as string;
  const altNameEnd = record.get("alternate_name_end_date") as string;
  if (altNameStart && altNameEnd) {
    const startDate = new Date(altNameStart);
    const endDate = new Date(altNameEnd);
    if (startDate > endDate) {
      record.addError("alternate_name_end_date", "End date must be after start date");
    }
  }

  const positionStart = record.get("time_in_position_start_date") as string;
  const positionEnd = record.get("time_in_position_end_date") as string;
  if (positionStart && positionEnd) {
    const startDate = new Date(positionStart);
    const endDate = new Date(positionEnd);
    if (startDate > endDate) {
      record.addError("time_in_position_end_date", "End date must be after start date");
    }
  }

  const militaryStart = record.get("military_start_date") as string;
  const militaryEnd = record.get("military_end_date") as string;
  if (militaryStart && militaryEnd) {
    const startDate = new Date(militaryStart);
    const endDate = new Date(militaryEnd);
    if (startDate > endDate) {
      record.addError("military_end_date", "End date must be after start date");
    }
  }

  // Handle "None" values - clear field if "None" appears (case-insensitive)
  const fieldsToCheckForNone = [
    'first_name', 'middle_name', 'last_name', 'alternate_first_name', 
    'alternate_middle_name', 'alternate_last_name', 'preferred_name',
    'spouse_full_name', 'supervising_physician_name'
  ];
  
  fieldsToCheckForNone.forEach(fieldKey => {
    const value = record.get(fieldKey) as string;
    if (value && value.toLowerCase() === 'none') {
      record.set(fieldKey, '');
    }
  });

  return record;
});
