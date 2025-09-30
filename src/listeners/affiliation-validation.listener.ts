import { recordHook } from "@flatfile/plugin-record-hook";

export const affiliationValidationHook = recordHook('affiliation', (record) => {
  // Validate External ID and External ID Type are both provided or both empty
  const externalId = record.get("external_id") as string;
  const externalIdType = record.get("external_id_type") as string;
  
  if ((externalId && !externalIdType) || (!externalId && externalIdType)) {
    record.addError("external_id", "Must provide both External ID and External ID Type");
    record.addError("external_id_type", "Must provide both External ID and External ID Type");
  }

  // Validate External ID Type values
  if (externalIdType && !["NPI", "InternalID", "ProviderID", "EmrID", "BillingSystemID"].includes(externalIdType)) {
    record.addError("external_id_type", "External ID Type not valid");
  }

  // Validate Facility/Employer Name (required field)
  const facilityName = record.get("facility_employer_name") as string;
  if (!facilityName || facilityName.trim() === "") {
    record.addError("facility_employer_name", "Facility Or Employer Name must not be empty.");
  }
  if (facilityName && facilityName.length > 150) {
    record.addError("facility_employer_name", "Facility Or Employer Name exceeds character limit of 150");
  }

  // Validate Title/Position length
  const titlePosition = record.get("title_position") as string;
  if (titlePosition && titlePosition.length > 100) {
    record.addError("title_position", "Title Or Position exceeds character limit of 100");
  }

  // Validate Department length
  const department = record.get("department") as string;
  if (department && department.length > 100) {
    record.addError("department", "Department exceeds character limit of 100");
  }

  // Validate Medical Director length
  const medicalDirector = record.get("medical_director") as string;
  if (medicalDirector && medicalDirector.length > 100) {
    record.addError("medical_director", "Medical Director exceeds character limit of 100");
  }

  // Validate Specialty length
  const specialty = record.get("specialty") as string;
  if (specialty && specialty.length > 100) {
    record.addError("specialty", "Specialty exceeds character limit of 100");
  }

  // Validate Primary Affiliation values
  const primaryAffiliation = record.get("primary_affiliation") as string;
  if (primaryAffiliation && !["Y", "N"].includes(primaryAffiliation)) {
    record.addError("primary_affiliation", "Primary Affiliation must be Y or N");
  }

  // Validate Admitting Privileges values
  const admittingPrivileges = record.get("admitting_privileges") as string;
  if (admittingPrivileges && !["Y", "N"].includes(admittingPrivileges)) {
    record.addError("admitting_privileges", "Admitting Privileges must be Y or N");
  }

  // Validate Start Date format
  const startDate = record.get("start_date") as string;
  if (startDate) {
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (!dateRegex.test(startDate)) {
      record.addError("start_date", "Start Date must be formatted as m/d/yyyy");
    } else {
      // Validate it's a real date
      const date = new Date(startDate);
      if (isNaN(date.getTime())) {
        record.addError("start_date", "Start Date must be formatted as m/d/yyyy");
      }
    }
  }

  // Validate End Date format
  const endDate = record.get("end_date") as string;
  if (endDate) {
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (!dateRegex.test(endDate)) {
      record.addError("end_date", "End Date must be formatted as m/d/yyyy");
    } else {
      // Validate it's a real date
      const date = new Date(endDate);
      if (isNaN(date.getTime())) {
        record.addError("end_date", "End Date must be formatted as m/d/yyyy");
      }
    }
  }

  // Validate Medical Office Contact Person length
  const contactPerson = record.get("medical_office_contact_person") as string;
  if (contactPerson && contactPerson.length > 100) {
    record.addError("medical_office_contact_person", "Medical Office Contact Person exceeds character limit of 100");
  }

  // Validate Address Line 1 length
  const addressLine1 = record.get("address_line_1") as string;
  if (addressLine1 && addressLine1.length > 100) {
    record.addError("address_line_1", "Address Line 1 exceeds character limit of 100");
  }

  // Validate Address Line 2 length
  const addressLine2 = record.get("address_line_2") as string;
  if (addressLine2 && addressLine2.length > 50) {
    record.addError("address_line_2", "Address Line 2 exceeds character limit of 50");
  }

  // Validate City length
  const city = record.get("city") as string;
  if (city && city.length > 50) {
    record.addError("city", "City exceeds character limit of 50");
  }

  // Validate County length
  const county = record.get("county") as string;
  if (county && county.length > 100) {
    record.addError("county", "County exceeds character limit of 100");
  }

  // Validate State length and characters
  const state = record.get("state") as string;
  if (state) {
    if (state.length > 50) {
      record.addError("state", "State exceeds character limit of 50");
    }
    // Check for non-ASCII characters
    if (!/^[\x00-\x7F]*$/.test(state)) {
      record.addError("state", "State not supported");
    }
  }

  // Validate Zip Code format (max 10 alphanumeric)
  const zip = record.get("zip") as string;
  if (zip) {
    if (zip.length > 10) {
      record.addError("zip", "Zip code exceeds 10 characters.");
    }
    if (!/^[a-zA-Z0-9]+$/.test(zip)) {
      record.addError("zip", "Zip code exceeds 10 characters.");
    }
  }

  // Validate Country length
  const country = record.get("country") as string;
  if (country && country.length > 100) {
    record.addError("country", "Country exceeds character limit of 100");
  }

  // Validate Phone Number format (9, 10, or 12 digits only)
  const phoneNumber = record.get("phone_number") as string;
  if (phoneNumber) {
    const phoneDigits = phoneNumber.replace(/\D/g, "");
    if (![9, 10, 12].includes(phoneDigits.length) || phoneDigits !== phoneNumber) {
      record.addError("phone_number", "Phone Number must be 9, 10, or 12-digit number");
    }
  }

  // Validate Extension (numbers only, max 20 digits)
  const ext = record.get("ext") as string;
  if (ext) {
    if (!/^\d+$/.test(ext) || ext.length > 20) {
      record.addError("ext", "Ext.' must be a number up to 20 digits in length");
    }
  }

  // Validate Fax format (9, 10, or 12 digits only)
  const fax = record.get("fax") as string;
  if (fax) {
    const faxDigits = fax.replace(/\D/g, "");
    if (![9, 10, 12].includes(faxDigits.length) || faxDigits !== fax) {
      record.addError("fax", "Fax must be 9, 10, or 12-digit number");
    }
  }

  // Validate Website length
  const website = record.get("website") as string;
  if (website && website.length > 500) {
    record.addError("website", "Website exceeds character limit of 500");
  }

  // Validate Institution Email format and length
  const institutionEmail = record.get("institution_email") as string;
  if (institutionEmail) {
    if (institutionEmail.length > 100) {
      record.addError("institution_email", "Institution Email exceeds character limit of 100");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(institutionEmail)) {
      record.addError("institution_email", "'Institution Email' is not a valid email address.");
    }
  }

  // Validate Record/File Viewable settings
  const recordViewable = record.get("record_viewable_by_provider") as string;
  const fileViewable = record.get("file_viewable_by_provider") as string;
  
  if (recordViewable && !["T", "F"].includes(recordViewable)) {
    record.addError("record_viewable_by_provider", "Record Viewable by Provider must be T or F");
  }
  
  if (fileViewable && !["T", "F"].includes(fileViewable)) {
    record.addError("file_viewable_by_provider", "File Viewable by Provider must be T or F");
  }

  // Validate File Viewable logic (warning)
  if (recordViewable === "F" && fileViewable === "T") {
    record.addWarning("file_viewable_by_provider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
  }

  // Validate File Key GUID format
  const fileKey = record.get("file_key") as string;
  if (fileKey) {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(fileKey)) {
      record.addError("file_key", "File Key must be a valid GUID");
    }
  }

  // Validate Note length
  const note = record.get("note") as string;
  if (note && note.length > 10000) {
    record.addError("note", "Note exceeds character limit of 10000");
  }

  // Validate Timestamp format
  const timestamp = record.get("timestamp") as string;
  if (timestamp) {
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (!dateRegex.test(timestamp)) {
      record.addError("timestamp", "Timestamp must be formatted as m/d/yyyy");
    } else {
      // Validate it's a real date
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        record.addError("timestamp", "Timestamp must be formatted as m/d/yyyy");
      }
    }
  }

  // User field warning
  const user = record.get("user") as string;
  if (!user || user.trim() === "") {
    record.addWarning("user", "No User listed, so 'Credentialing System' will be listed");
  }

  // Validate date logic (start before end)
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start > end) {
      record.addError("end_date", "End Date must be after Start Date");
    }
  }
});