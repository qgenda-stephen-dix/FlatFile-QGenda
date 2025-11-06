import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const cmeValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("cme", (record) => {
      // Get all field values
      const name = record.get("name") as string;
      const externalId = record.get("externalId") as string;
      const externalIdType = record.get("externalIdType") as string;
      const category = record.get("category") as string;
      const cmeContents = record.get("cmeContents") as string;
      const credits = record.get("credits") as string;
      const cmeDescription = record.get("cmeDescription") as string;
      const completedOn = record.get("completedOn") as string;
      const validUntil = record.get("validUntil") as string;
      const states = record.get("states") as string;
      const recordViewableByProvider = record.get("recordViewableByProvider") as string;
      const frequency = record.get("frequency") as string;
      const hoursRequired = record.get("hoursRequired") as string;
      const fileViewableByProvider = record.get("fileViewableByProvider") as string;
      const fileKey = record.get("fileKey") as string;
      const note = record.get("note") as string;
      const user = record.get("user") as string;
      const timestamp = record.get("timestamp") as string;

      // Required field validations
      if (!name?.trim()) {
        record.addError("name", "Name required");
      }

      if (!externalId?.trim()) {
        record.addError("externalId", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("externalIdType", "External Id Type required");
      }

      // Character limit validations
      if (name && name.length > 100) {
        record.addError("name", "Name exceeds character limit of 100");
      }

      if (cmeContents && cmeContents.length > 100) {
        record.addError("cmeContents", "CME Contents exceeds character limit of 100");
      }

      if (cmeDescription && cmeDescription.length > 500) {
        record.addError("cmeDescription", "CME Description exceeds character limit of 500");
      }

      if (note && note.length > 10000) {
        record.addError("note", "Note exceeds character limit of 10000");
      }

      // Credits validation
      if (credits) {
        // Check for non-numeral characters
        const creditsNumeric = /^\d*\.?\d*$/.test(credits);
        if (!creditsNumeric) {
          record.addError("credits", "Credits must be a number");
        }
        
        // Check character limit
        if (credits.length > 6) {
          record.addError("credits", "Credits exceeds character limit of 6");
        }
      }

      // Date format validations
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      
      if (completedOn) {
        if (!dateRegex.test(completedOn)) {
          record.addError("completedOn", "Completed On must be formatted as m/d/yyyy");
        } else {
          // Validate actual date
          const [month, day, year] = completedOn.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          if (date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year) {
            record.addError("completedOn", "Completed On must be formatted as m/d/yyyy");
          }
        }
      }

      if (validUntil) {
        if (!dateRegex.test(validUntil)) {
          record.addError("validUntil", "Valid Until must be formatted as m/d/yyyy");
        } else {
          // Validate actual date
          const [month, day, year] = validUntil.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          if (date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year) {
            record.addError("validUntil", "Valid Until must be formatted as m/d/yyyy");
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

      // T/F field validations
      if (recordViewableByProvider && recordViewableByProvider !== "T" && recordViewableByProvider !== "F") {
        record.addError("recordViewableByProvider", "Viewable by Provider must be T or F");
      }

      if (fileViewableByProvider && fileViewableByProvider !== "T" && fileViewableByProvider !== "F") {
        record.addError("fileViewableByProvider", "File Viewable by Provider must be T or F");
      }

      // Hours Required validation
      if (hoursRequired) {
        const hoursNum = parseInt(hoursRequired);
        if (isNaN(hoursNum) || hoursNum < 1 || hoursNum > 50 || !Number.isInteger(hoursNum)) {
          record.addError("hoursRequired", "Hours Required must be a whole number 1-50");
        }
      }

      // GUID format validation for File Key
      if (fileKey) {
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(fileKey)) {
          record.addError("fileKey", "File Key must be a valid GUID");
        }
      }

      // States validation (would need actual state list validation in real implementation)
      if (states) {
        // Basic validation - check if pipe-delimited format is used
        const stateList = states.split('|');
        // In real implementation, validate each state against dropdown values
      }

      // Category validation (would need actual category list validation in real implementation)
      if (category) {
        // In real implementation, validate against dropdown values
      }

      // Frequency validation (would need actual frequency list validation in real implementation)
      if (frequency) {
        // In real implementation, validate against dropdown values
      }

      // User validation warning
      if (!user?.trim()) {
        record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
      }

      return record;
    })
  );
};