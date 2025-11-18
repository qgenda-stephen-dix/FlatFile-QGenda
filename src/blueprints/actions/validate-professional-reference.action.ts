import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateProfessionalReferenceAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateProfessionalReference" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track duplicates and cross-record validations
        const externalIdMap = new Map<string, number>();
        const fileKeyMap = new Map<string, number>();

        const validatedRecords = records.map((record: FlatfileRecord, index: number) => {
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const fullName = record.get("fullName") as string;
          const fileKey = record.get("fileKey") as string;
          const recordViewableByProvider = record.get("recordViewableByProvider") as string;
          const fileViewableByProvider = record.get("fileViewableByProvider") as string;
          const fromDate = record.get("from") as string;
          const toDate = record.get("to") as string;
          const country = record.get("country") as string;
          const state = record.get("state") as string;

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
              record.addWarning("fileKey", `File Key linked successfully but unlinked from Professional Reference - Row ${previousRow}`);
            } else {
              fileKeyMap.set(fileKey, index);
            }
          }

          // Provider matching validation (simulated - would check against actual provider database)
          if (externalId && externalIdType) {
            // This would normally query the provider database
            // For now, we'll add a warning for demonstration
            if (externalId.startsWith("INACTIVE")) {
              record.addWarning("externalId", "Provider document updated, but provider is inactive");
            }
            
            // Simulate provider not found scenario
            if (externalId === "NOTFOUND123") {
              record.addError("externalId", "No matching provider found");
            }
          }

          // Date range business logic validation
          if (fromDate && toDate) {
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            
            if (dateRegex.test(fromDate) && dateRegex.test(toDate)) {
              const fromDateObj = new Date(fromDate);
              const toDateObj = new Date(toDate);
              
              if (fromDateObj > toDateObj) {
                record.addError("from", "From must be less than or equal to To.");
              }

              // Check for future dates (references should typically be historical)
              const currentDate = new Date();
              if (fromDateObj > currentDate) {
                record.addWarning("from", "Reference start date is in the future - please verify");
              }
            }
          }

          // Country and State consistency validation
          if (country && state) {
            // This would normally validate against actual country/state combinations
            // For demonstration, we'll check common scenarios
            if (country.toUpperCase() === "CANADA" && state.length === 2 && !/^[A-Z]{2}$/.test(state)) {
              record.addError("state", "Canadian provinces should use 2-letter abbreviations");
            }
            
            if (country.toUpperCase() === "UNITED STATES" && state.length !== 2) {
              record.addError("state", "US states should use 2-letter abbreviations");
            }
          }

          // Record and File Viewable consistency checks
          if (recordViewableByProvider === "F" && fileViewableByProvider === "T") {
            record.addWarning("fileViewableByProvider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
          }

          // Professional relationship validation
          if (fullName && externalId) {
            // Check for self-references (provider referencing themselves)
            if (fullName.toLowerCase().includes("self") || fullName.toLowerCase().includes("same")) {
              record.addWarning("fullName", "Self-references should be reviewed - ensure this is not the same provider");
            }
          }

          // File Key business rules validation
          if (fileKey) {
            // Simulate file key validation scenarios
            if (fileKey.startsWith("00000000")) {
              record.addError("fileKey", "File Key invalid - does not belong to this company or provider");
            }
            
            if (fileKey.endsWith("9999")) {
              record.addError("fileKey", "File not found");
            }
            
            if (fileKey.includes("LINKED")) {
              record.addError("fileKey", "File already linked to another record and unable to be linked to a new record");
            }
            
            if (fileKey.includes("NOTYPE")) {
              record.addError("fileKey", "File type not able to be linked");
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

          if (!fullName?.trim()) {
            record.addError("fullName", "Full Name required");
          }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Professional Reference validation:", error);
        throw error;
      }
    }
  );
};