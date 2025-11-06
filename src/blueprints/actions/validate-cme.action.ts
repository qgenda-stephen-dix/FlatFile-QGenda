import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateCMEAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateCME" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track duplicates by External ID + External ID Type combination
        const duplicateTracker = new Map<string, FlatfileRecord[]>();

        records.forEach((record: FlatfileRecord) => {
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          
          if (externalId && externalIdType) {
            const key = `${externalIdType}:${externalId}`;
            
            if (!duplicateTracker.has(key)) {
              duplicateTracker.set(key, []);
            }
            duplicateTracker.get(key)!.push(record);
          }
        });

        // Process duplicate detection
        duplicateTracker.forEach((duplicateRecords, key) => {
          if (duplicateRecords.length > 1) {
            duplicateRecords.forEach((record) => {
              record.addError("externalId", `Duplicate records exist in file with same External ID Type and External ID combination`);
            });
          }
        });

        const validatedRecords = records.map((record: FlatfileRecord) => {
          // Get field values for business rule validation
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

          // Required field validations (same as listener)
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
            const creditsNumeric = /^\d*\.?\d*$/.test(credits);
            if (!creditsNumeric) {
              record.addError("credits", "Credits must be a number");
            }
            
            if (credits.length > 6) {
              record.addError("credits", "Credits exceeds character limit of 6");
            }
          }

          // Date validations
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
          
          if (completedOn) {
            if (!dateRegex.test(completedOn)) {
              record.addError("completedOn", "Completed On must be formatted as m/d/yyyy");
            }
          }

          if (validUntil) {
            if (!dateRegex.test(validUntil)) {
              record.addError("validUntil", "Valid Until must be formatted as m/d/yyyy");
            }
          }

          // T/F validations
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

          // GUID format validation
          if (fileKey) {
            const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
            if (!guidRegex.test(fileKey)) {
              record.addError("fileKey", "File Key must be a valid GUID");
            }
          }

          // Timestamp validation
          if (timestamp) {
            const timestampRegex = /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2}$/;
            if (!timestampRegex.test(timestamp)) {
              record.addError("timestamp", "Timestamp must be formatted as m/d/yyyy h:mm:ss");
            }
          }

          // Business logic validations
          
          // Date logic: Valid Until should be after Completed On
          if (completedOn && validUntil) {
            const completedDate = new Date(completedOn);
            const validUntilDate = new Date(validUntil);
            
            if (validUntilDate <= completedDate) {
              record.addWarning("validUntil", "Valid Until date should be after Completed On date");
            }
          }

          // User warning
          if (!user?.trim()) {
            record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
          }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in CME validation:", error);
        throw error;
      }
    }
  );
};