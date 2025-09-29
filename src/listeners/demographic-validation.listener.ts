import { recordHook } from "@flatfile/plugin-record-hook";

export const demographicValidationHook = recordHook('demographic', (record) => {
  // NPI validation - must be exactly 10 digits
  const npi = record.get("npi") as string;
  if (npi && !/^[0-9]{10}$/.test(npi)) {
    record.addError("npi", "NPI must be exactly 10 digits");
  }

  // SSN validation - format XXX-XX-XXXX or XXXXXXXXX
  const ssn = record.get("ssn") as string;
  if (ssn && !/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/.test(ssn)) {
    record.addError("ssn", "SSN must be in format XXX-XX-XXXX or XXXXXXXXX");
  }

  // Email validation
  const loginEmail = record.get("login_email") as string;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (loginEmail && !emailRegex.test(loginEmail)) {
    record.addError("login_email", "Must be a valid email address");
  }

  const otherEmail = record.get("other_email") as string;
  if (otherEmail && !emailRegex.test(otherEmail)) {
    record.addError("other_email", "Must be a valid email address");
  }

  // Phone number validation
  const phoneRegex = /^[+]?[1-9]?[0-9]{7,15}$/;
  
  const homePhone = record.get("home_phone") as string;
  if (homePhone && !phoneRegex.test(homePhone.replace(/[\s\-\(\)]/g, ''))) {
    record.addError("home_phone", "Please enter a valid phone number");
  }

  const mobilePhone = record.get("mobile_phone") as string;
  if (mobilePhone && !phoneRegex.test(mobilePhone.replace(/[\s\-\(\)]/g, ''))) {
    record.addError("mobile_phone", "Please enter a valid phone number");
  }

  // ZIP code validation - format 12345 or 12345-6789
  const zip = record.get("zip") as string;
  if (zip && !/^[0-9]{5}(-[0-9]{4})?$/.test(zip)) {
    record.addError("zip", "ZIP code must be in format 12345 or 12345-6789");
  }

  // Emergency contact email validation
  const emergencyEmail = record.get("emergency_contact_email") as string;
  if (emergencyEmail && !emailRegex.test(emergencyEmail)) {
    record.addError("emergency_contact_email", "Must be a valid email address");
  }

  // Assistant email validation
  const assistantEmail = record.get("assistant_email") as string;
  if (assistantEmail && !emailRegex.test(assistantEmail)) {
    record.addError("assistant_email", "Must be a valid email address");
  }

  // Primary credentialing specialist email validation
  const credentialingEmail = record.get("primary_credentialing_specialist_email") as string;
  if (credentialingEmail && !emailRegex.test(credentialingEmail)) {
    record.addError("primary_credentialing_specialist_email", "Must be a valid email address");
  }

  // Birth date validation - should not be in the future
  const birthDate = record.get("birth_date") as string;
  if (birthDate) {
    const birthDateObj = new Date(birthDate);
    if (birthDateObj > new Date()) {
      record.addError("birth_date", "Birth date cannot be in the future");
    }
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

  // Visa expiration should be in the future if provided
  const visaExpiration = record.get("visa_expiration") as string;
  if (visaExpiration) {
    const visaExpirationDate = new Date(visaExpiration);
    if (visaExpirationDate < new Date()) {
      record.addWarning("visa_expiration", "Visa expiration date appears to be in the past");
    }
  }

  return record;
});
