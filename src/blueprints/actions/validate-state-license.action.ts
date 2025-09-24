import { recordHook } from "@flatfile/plugin-record-hook";

export const stateLicenseValidationHook = recordHook('state_license', (record) => {
  // Required field validations
  const externalId = record.get("external_id") as string;
  if (!externalId) {
    record.addError("external_id", "External ID is required");
  }

  const externalIdType = record.get("external_id_type") as string;
  if (!externalIdType) {
    record.addError("external_id_type", "External ID Type is required");
  }

  const autoVerify = record.get("auto_verify") as string;
  if (!autoVerify) {
    record.addError("auto_verify", "Auto-Verify? is required");
  } else if (!["Y", "N"].includes(autoVerify)) {
    record.addError("auto_verify", "Auto-Verify? must be Y or N");
  }

  const state = record.get("state") as string;
  if (!state) {
    record.addError("state", "State is required");
  }

  const licenseNumber = record.get("license_number") as string;
  if (!licenseNumber) {
    record.addError("license_number", "License Number is required");
  } else if (licenseNumber.length > 200) {
    record.addError("license_number", "License Number exceeds character limit of 200");
  }

  const licenseType = record.get("license_type") as string;
  if (!licenseType) {
    record.addError("license_type", "License Type is required");
  }

  const status = record.get("status") as string;
  if (!status) {
    record.addError("status", "Status is required");
  }

  const expirationDate = record.get("expiration_date") as string;
  if (!expirationDate) {
    record.addError("expiration_date", "Expiration Date is required");
  }

  // Optional field validations
  const currentlyPracticing = record.get("currently_practicing") as string;
  if (currentlyPracticing && !["Y", "N"].includes(currentlyPracticing)) {
    record.addError("currently_practicing", "Currently Practicing? must be Y or N");
  }

  const submitToNpdb = record.get("submit_to_npdb") as string;
  if (submitToNpdb && !["Y", "N", ""].includes(submitToNpdb)) {
    record.addError("submit_to_npdb", "Submit to NPDB must be Y, N, or blank");
  }

  // Character limit validations
  const npdbField = record.get("npdb_field_of_licensure") as string;
  if (npdbField && npdbField.length > 3) {
    record.addError("npdb_field_of_licensure", "NPDB Field of Licensure exceeds character limit of 3");
  }

  const endorsements = record.get("endorsements") as string;
  if (endorsements && endorsements.length > 100) {
    record.addError("endorsements", "Endorsements exceeds character limit of 100");
  }

  const note = record.get("note") as string;
  if (note && note.length > 10000) {
    record.addError("note", "Note exceeds character limit of 10000");
  }

  // Boolean field validations (T/F)
  const monitorExpiration = record.get("monitor_expiration_date") as string;
  if (monitorExpiration && !["T", "F"].includes(monitorExpiration)) {
    record.addError("monitor_expiration_date", "Monitor Expiration Date must be T or F");
  }

  const recordViewable = record.get("record_viewable_by_provider") as string;
  if (recordViewable && !["T", "F"].includes(recordViewable)) {
    record.addError("record_viewable_by_provider", "Record Viewable by Provider must be T or F");
  }

  const fileViewable = record.get("file_viewable_by_provider") as string;
  if (fileViewable && !["T", "F"].includes(fileViewable)) {
    record.addError("file_viewable_by_provider", "File Viewable by Provider must be T or F");
  }

  const ignoreRequired = record.get("ignore_required_fields_validation") as string;
  if (ignoreRequired && !["Y", "N"].includes(ignoreRequired)) {
    record.addError("ignore_required_fields_validation", "Ignore Required Fields Validation? must be Y or N");
  }

  // Date validations
  const issueDate = record.get("issue_date") as string;
  if (issueDate && expirationDate) {
    const issue = new Date(issueDate);
    const expiration = new Date(expirationDate);
    
    if (issue > expiration) {
      record.addError("issue_date", "Issue Date cannot be after Expiration Date");
    }
  }

  // Record/File Viewable validation
  if (recordViewable === "F" && fileViewable === "T") {
    record.addWarning("file_viewable_by_provider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
  }

  // Both viewable fields must be provided together
  if ((recordViewable && !fileViewable) || (!recordViewable && fileViewable)) {
    record.addError("record_viewable_by_provider", "If one of Record Viewable by Provider or File Viewable by Provider are imported, the other must also be imported");
  }

  // User field warning
  const user = record.get("user") as string;
  if (!user) {
    record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
  }

  return record;
});