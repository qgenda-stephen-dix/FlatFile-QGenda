import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const healthRecordValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("health-record", (record) => {
      // Get all field values
      const externalId = record.get("externalId") as string;
      const externalIdType = record.get("externalIdType") as string;
      const recordName = record.get("recordName") as string;
      const examName = record.get("examName") as string;
      const completionDate = record.get("completionDate") as string;
      const renewalDate = record.get("renewalDate") as string;
      const monitorExpirationDate = record.get("monitorExpirationDate") as string;
      const notes = record.get("notes") as string;
      const recordViewableByProvider = record.get("recordViewableByProvider") as string;
      const fileViewableByProvider = record.get("fileViewableByProvider") as string;
      const fileKey = record.get("fileKey") as string;
      const note = record.get("note") as string;
      const user = record.get("user") as string;
      const timeStamp = record.get("timeStamp") as string;

      // Required field validations
      if (!externalId?.trim()) {
        record.addError("externalId", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("externalIdType", "External Id Type required");
      }

      if (!recordName?.trim()) {
        record.addError("recordName", "Record Name required");
      }

      // Character limit validations
      if (recordName && recordName.length > 50) {
        record.addError("recordName", "Record Name exceeds character limit of 50");
      }

      if (notes && notes.length > 500) {
        record.addError("notes", "Notes exceeds character limit of 500");
      }

      if (note && note.length > 10000) {
        record.addError("note", "Note exceeds character limit of 10000");
      }

      // Date format validation (m/d/yyyy)
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      
      if (completionDate && !dateRegex.test(completionDate)) {
        record.addError("completionDate", "Completion Date must be formatted as m/d/yyyy");
      }

      if (renewalDate && !dateRegex.test(renewalDate)) {
        record.addError("renewalDate", "Renewal Date must be formatted as m/d/yyyy");
      }

      // Cross-field date validation (Completion Date must be before Renewal Date)
      if (completionDate && renewalDate && dateRegex.test(completionDate) && dateRegex.test(renewalDate)) {
        const completionDateObj = new Date(completionDate);
        const renewalDateObj = new Date(renewalDate);
        
        if (completionDateObj >= renewalDateObj) {
          record.addError("completionDate", "Completion Date must be before Renewal Date");
        }
      }

      // TimeStamp format validation (m/d/yyyy h:mm:ss)
      if (timeStamp) {
        const timeStampRegex = /^\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}:\d{2}$/;
        if (!timeStampRegex.test(timeStamp)) {
          record.addError("timeStamp", "TimeStamp must be formatted as m/d/yyyy h:mm:ss");
        }
      }

      // Monitor Expiration Date validation (T or F)
      if (monitorExpirationDate && !["T", "F"].includes(monitorExpirationDate)) {
        record.addError("monitorExpirationDate", "Monitor Expiration Date must be T or F");
      }

      // Record Viewable by Provider validation (T or F)
      if (recordViewableByProvider && !["T", "F"].includes(recordViewableByProvider)) {
        record.addError("recordViewableByProvider", "Record Viewable by Provider must be T or F");
      }

      // File Viewable by Provider validation (T or F)
      if (fileViewableByProvider && !["T", "F"].includes(fileViewableByProvider)) {
        record.addError("fileViewableByProvider", "File Viewable by Provider must be T or F");
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

      // User validation (warn if empty)
      if (!user?.trim()) {
        record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
      }

      // External ID Type validation (simulated valid types)
      if (externalIdType) {
        const validExternalIdTypes = [
          "NPI",
          "InternalID", 
          "ProviderID",
          "EmrID",
          "BillingSystemID",
          "LicenseNumber",
          "EmployeeID"
        ];
        
        if (!validExternalIdTypes.includes(externalIdType)) {
          record.addError("externalIdType", "External ID Type not valid");
        }
      }

      // Basic date validation (check for invalid dates like 9/31/2022)
      if (completionDate && dateRegex.test(completionDate)) {
        const dateObj = new Date(completionDate);
        const [month, day, year] = completionDate.split('/').map(Number);
        if (dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day || dateObj.getFullYear() !== year) {
          record.addError("completionDate", "Completion Date must be formatted as m/d/yyyy");
        }
      }

      if (renewalDate && dateRegex.test(renewalDate)) {
        const dateObj = new Date(renewalDate);
        const [month, day, year] = renewalDate.split('/').map(Number);
        if (dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day || dateObj.getFullYear() !== year) {
          record.addError("renewalDate", "Renewal Date must be formatted as m/d/yyyy");
        }
      }

      // TimeStamp date validation
      if (timeStamp && timeStamp.includes('/')) {
        const dateTimeParts = timeStamp.split(' ');
        if (dateTimeParts.length >= 1) {
          const datePart = dateTimeParts[0];
          if (dateRegex.test(datePart)) {
            const dateObj = new Date(datePart);
            const [month, day, year] = datePart.split('/').map(Number);
            if (dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day || dateObj.getFullYear() !== year) {
              record.addError("timeStamp", "TimeStamp must be formatted as m/d/yyyy h:mm:ss");
            }
          }
        }
      }

      return record;
    })
  );
};