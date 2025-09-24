import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const deaLicenseValidationHook = recordHook("dea_license", (record) => {
  // Get field values and cast to strings for validation
  const auto_verify = record.get("auto_verify") as string;
  const license_number = record.get("license_number") as string;
  const state = record.get("state") as string;
  const issue_date = record.get("issue_date") as string;
  const expiration_date = record.get("expiration_date") as string;
  const monitor_expiration_date = record.get("monitor_expiration_date") as string;
  const status = record.get("status") as string;
  const schedule = record.get("schedule") as string;
  const waiver_requested = record.get("waiver_requested") as string;
  const waiver_granted = record.get("waiver_granted") as string;
  const record_viewable_by_provider = record.get("record_viewable_by_provider") as string;
  const file_viewable_by_provider = record.get("file_viewable_by_provider") as string;
  const ignore_required_fields_validation = record.get("ignore_required_fields_validation") as string;
  const external_id = record.get("external_id") as string;
  const external_id_type = record.get("external_id_type") as string;
  const file_key = record.get("file_key") as string;
  const note = record.get("note") as string;
  const timestamp = record.get("timestamp") as string;
  const user = record.get("user") as string;

  // Validate Auto-Verify field
  if (auto_verify && !["Y", "N"].includes(auto_verify)) {
    record.addError("auto_verify", "Auto-Verify? must be Y or N");
  }

  // Validate License Number
  if (!license_number) {
    record.addError("license_number", "License Number required");
  } else if (license_number.length !== 9) {
    record.addError("license_number", "License number must be exactly 9 characters in length");
  }

  // Validate State
  if (!state) {
    record.addError("state", "State required");
  }

  // Validate Date fields
  if (issue_date && expiration_date) {
    const issueDate = new Date(issue_date);
    const expirationDate = new Date(expiration_date);
    
    if (issueDate >= expirationDate) {
      record.addError("issue_date", "Issue Date must be before Expiration Date");
    }
  }

  if (!expiration_date) {
    record.addError("expiration_date", "Expiration Date required");
  }

  // Validate date formats (basic check for valid dates)
  if (issue_date) {
    const issueDate = new Date(issue_date);
    if (isNaN(issueDate.getTime())) {
      record.addError("issue_date", "Issue Date must be formatted as m/d/yyyy");
    }
  }

  if (expiration_date) {
    const expirationDate = new Date(expiration_date);
    if (isNaN(expirationDate.getTime())) {
      record.addError("expiration_date", "Expiration Date must be formatted as m/d/yyyy");
    }
  }

  // Validate Monitor Expiration Date
  if (monitor_expiration_date && !["T", "F"].includes(monitor_expiration_date)) {
    record.addError("monitor_expiration_date", "Monitor Expiration Date must be T or F");
  }

  // Validate Waiver fields
  if (waiver_requested && !["Y", "N"].includes(waiver_requested)) {
    record.addError("waiver_requested", "Waiver Requested? must be Y or N");
  }

  if (waiver_granted && !["Y", "N"].includes(waiver_granted)) {
    record.addError("waiver_granted", "Waiver Granted? must be Y or N");
  }

  // Validate Provider Viewability fields
  if (record_viewable_by_provider && !["T", "F"].includes(record_viewable_by_provider)) {
    record.addError("record_viewable_by_provider", "Viewable by Provider must be T or F");
  }

  if (file_viewable_by_provider && !["T", "F"].includes(file_viewable_by_provider)) {
    record.addError("file_viewable_by_provider", "File Viewable by Provider must be T or F");
  }

  // Cross-validation for viewability fields
  if (record_viewable_by_provider === "F" && file_viewable_by_provider === "T") {
    record.addWarning("file_viewable_by_provider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
  }

  // Both viewability fields must be provided together
  if ((record_viewable_by_provider && !file_viewable_by_provider) || 
      (!record_viewable_by_provider && file_viewable_by_provider)) {
    record.addError("record_viewable_by_provider", "If one of Record Viewable by Provider or File Viewable by Provider are imported, the other must also be imported");
    record.addError("file_viewable_by_provider", "If one of Record Viewable by Provider or File Viewable by Provider are imported, the other must also be imported");
  }

  // Validate Ignore Required Fields Validation
  if (ignore_required_fields_validation && !["Y", "N"].includes(ignore_required_fields_validation)) {
    record.addError("ignore_required_fields_validation", "Ignore Required Fields Validation? must be Y or N");
  }

  // Validate External ID fields
  if (!external_id) {
    record.addError("external_id", "External Id required");
  }

  if (!external_id_type) {
    record.addError("external_id_type", "External Id Type required");
  }

  // Validate File Key format (GUID)
  if (file_key) {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(file_key)) {
      record.addError("file_key", "File Key must be a valid GUID");
    }
  }

  // Validate Note character limit
  if (note && note.length > 10000) {
    record.addError("note", "Note exceeds character limit of 10000");
  }

  // Validate Timestamp format
  if (timestamp) {
    // Basic validation for m/d/yyyy h:mm:ss format
    const timestampRegex = /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2}$/;
    if (!timestampRegex.test(timestamp)) {
      record.addError("timestamp", "Timestamp must be formatted as m/d/yyyy h:mm:ss");
    } else {
      // Validate the actual date
      const datePart = timestamp.split(' ')[0];
      const timePart = timestamp.split(' ')[1];
      const [month, day, year] = datePart.split('/').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);
      
      const date = new Date(year, month - 1, day, hour, minute, second);
      if (isNaN(date.getTime()) || 
          date.getMonth() !== month - 1 || 
          date.getDate() !== day || 
          date.getFullYear() !== year) {
        record.addError("timestamp", "Timestamp must be formatted as m/d/yyyy h:mm:ss");
      }
    }
  }

  // Warning for empty User field
  if (!user) {
    record.addInfo("user", "No User listed, so \"Credentialing System\" will be listed");
  }

  return record;
});