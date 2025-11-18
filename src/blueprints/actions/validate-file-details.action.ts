import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateFileDetailsAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateFileDetails" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track duplicates and cross-record validations
        const externalIdMap = new Map<string, number>();
        const fileKeyMap = new Map<string, number>();

        const validatedRecords = records.map((record: FlatfileRecord, index: number) => {
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const fileName = record.get("fileName") as string;
          const fileKey = record.get("fileKey") as string;
          const fileCategory = record.get("fileCategory") as string;
          const fileType = record.get("fileType") as string;
          const fileDescription = record.get("fileDescription") as string;

          // Duplicate External ID detection
          if (externalId && externalIdType) {
            const externalIdKey = `${externalId}|${externalIdType}`;
            if (externalIdMap.has(externalIdKey)) {
              const previousRow = externalIdMap.get(externalIdKey)! + 1;
              record.addError("externalId", `Duplicate External ID and Type combination found. Previously used on row ${previousRow}`);
            } else {
              externalIdMap.set(externalIdKey, index);
            }
          }

          // File Key uniqueness validation
          if (fileKey) {
            if (fileKeyMap.has(fileKey)) {
              const previousRow = fileKeyMap.get(fileKey)! + 1;
              record.addWarning("fileKey", `File Key already processed on row ${previousRow}. This may overwrite previous file details.`);
            } else {
              fileKeyMap.set(fileKey, index);
            }
          }

          // Provider matching validation (simulated - would check against actual provider database)
          if (externalId && externalIdType) {
            // Simulate provider not found scenario
            if (externalId === "NOTFOUND123") {
              record.addError("externalId", "No matching provider found");
            }
            
            // Simulate inactive provider scenario
            if (externalId.startsWith("INACTIVE")) {
              record.addWarning("externalId", "Provider was updated but is inactive");
            }

            // Simulate different provider warning for File Key
            if (fileKey && externalId.includes("DIFFERENT")) {
              record.addWarning("fileKey", "File was updated but belongs to different Provider than entered External ID");
            }
          }

          // File Key existence validation (simulated CRED system check)
          if (fileKey) {
            // Simulate file not found in CRED system
            if (fileKey.startsWith("00000000")) {
              record.addError("fileKey", "File not found");
            }
            
            // Simulate file key format validation scenarios
            if (fileKey.endsWith("INVALID")) {
              record.addError("fileKey", "File Key must be a valid GUID");
            }
          }

          // File Type "Signable Document" PDF validation
          if (fileType === "Signable Document") {
            // In a real implementation, this would check the actual file type
            // For simulation, we'll check if filename suggests non-PDF
            if (fileName) {
              const lowerFileName = fileName.toLowerCase();
              if (lowerFileName.includes(".doc") || lowerFileName.includes(".txt") || 
                  lowerFileName.includes(".xls") || lowerFileName.includes(".jpg") ||
                  lowerFileName.includes(".png")) {
                record.addError("fileType", "File must be a .pdf for selected File Type");
              }
            }
          }

          // File management business rules
          if (fileName && fileKey) {
            // Check for potentially problematic file names
            if (fileName.length < 3) {
              record.addWarning("fileName", "File name is very short - ensure this is correct");
            }
            
            // Check for file extension best practices
            if (fileName.includes(".")) {
              record.addWarning("fileName", "Best Practice: Leave off file type extension (.pdf/.txt/.docx/etc) when inputting new File Name, type extension will be appended on update");
            }
          }

          // File Category and Type consistency validation
          if (fileCategory && fileType) {
            // Additional business rule validations
            if (fileCategory === "Legal Documents" && fileType === "Signable Document") {
              // This combination requires special handling
              record.addInfo("fileType", "Signable Document in Legal Documents category requires PDF format and electronic signature capability");
            }
            
            if (fileCategory === "Credentials" && !fileType.includes("License") && !fileType.includes("Certification")) {
              record.addWarning("fileType", "File Type may not be appropriate for Credentials category");
            }
          }

          // File Description validation for special cases
          if (fileDescription) {
            // Check for clearing value
            if (fileDescription.toLowerCase() === "none") {
              record.addInfo("fileDescription", "File Description will be cleared (set to 'None')");
            }
            
            // Check for very long descriptions
            if (fileDescription.length > 5000) {
              record.addWarning("fileDescription", "File Description is very long - consider summarizing");
            }
          }

          // Apply same individual record validations as the listener
          // (This ensures consistency between real-time and batch validation)
          
          // Required field validations
          if (!externalId?.trim()) {
            record.addError("externalId", "External Id required");
          }

          if (!externalIdType?.trim()) {
            record.addError("externalIdType", "External Id Type required");
          }

          if (!fileKey?.trim()) {
            record.addError("fileKey", "File Key required");
          }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in File Details validation:", error);
        throw error;
      }
    }
  );
};