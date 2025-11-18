import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateHealthRecordAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateHealthRecord" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track duplicates and cross-record validations
        const externalIdMap = new Map<string, number>();
        const fileKeyMap = new Map<string, number>();

        const validatedRecords = records.map((record: FlatfileRecord, index: number) => {
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const recordName = record.get("recordName") as string;
          const fileKey = record.get("fileKey") as string;
          const user = record.get("user") as string;
          const recordViewableByProvider = record.get("recordViewableByProvider") as string;
          const fileViewableByProvider = record.get("fileViewableByProvider") as string;
          const completionDate = record.get("completionDate") as string;
          const renewalDate = record.get("renewalDate") as string;

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
          }

          // File Key business rules validation
          if (fileKey) {
            // Track File Key usage for duplicate linking validation
            if (fileKeyMap.has(fileKey)) {
              const previousRow = fileKeyMap.get(fileKey)! + 1;
              record.addWarning("fileKey", `File Key linked successfully but unlinked from Health Record - Row ${previousRow}`);
            } else {
              fileKeyMap.set(fileKey, index);
            }

            // File Key business rule validations (simulated scenarios)
            
            // File Key belongs to different company/provider
            if (fileKey.startsWith("00000000")) {
              record.addError("fileKey", "File Key invalid - does not belong to this company or provider");
            }
            
            // File Key not found in database
            if (fileKey.endsWith("NOTFOUND")) {
              record.addError("fileKey", "File not found");
            }
            
            // File type not able to be linked
            if (fileKey.includes("NOTYPE")) {
              record.addError("fileKey", "File type not able to be linked");
            }
            
            // Signable Document already linked
            if (fileKey.includes("SIGNED")) {
              record.addError("fileKey", "File already linked to another record and unable to be linked to a new record");
            }
            
            // Previous file unlinked scenario
            if (fileKey.includes("PREVIOUS")) {
              record.addWarning("fileKey", `File Key linked successfully but record's previous File Key (Previous_Document.pdf) has been unlinked`);
            }
          }

          // User validation against Cred Spec emails (simulated)
          if (user && user.trim()) {
            // Simulate valid email addresses in the system
            const validCredSpecEmails = [
              "admin@hospital.com",
              "credentialing@hospital.com",
              "hr@hospital.com",
              "compliance@hospital.com",
              "medical.staff@hospital.com",
              "quality@hospital.com",
              "records@hospital.com",
              "system@hospital.com"
            ];
            
            // Check if user matches any valid email format or is in the valid list
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(user) || !validCredSpecEmails.includes(user.toLowerCase())) {
              record.addError("user", "No User matches found");
            }
          } else {
            // Set default warning for empty user
            record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
          }

          // Record and File Viewable consistency checks
          if (recordViewableByProvider === "F" && fileViewableByProvider === "T") {
            record.addWarning("fileViewableByProvider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
          }

          // Health record business logic validations
          if (recordName && completionDate) {
            // Check for common health record types and date logic
            const healthRecordTypes = ["Physical Exam", "TB Test", "Drug Screen", "Background Check", "Immunization Record"];
            const isCommonType = healthRecordTypes.some(type => 
              recordName.toLowerCase().includes(type.toLowerCase())
            );
            
            if (!isCommonType) {
              record.addInfo("recordName", "Consider using standard health record types for consistency");
            }

            // Check for future completion dates
            if (completionDate) {
              const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
              if (dateRegex.test(completionDate)) {
                const completionDateObj = new Date(completionDate);
                const currentDate = new Date();
                
                if (completionDateObj > currentDate) {
                  record.addWarning("completionDate", "Completion date is in the future - please verify");
                }
              }
            }
          }

          // Renewal date business logic
          if (renewalDate && completionDate) {
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            
            if (dateRegex.test(renewalDate) && dateRegex.test(completionDate)) {
              const renewalDateObj = new Date(renewalDate);
              const completionDateObj = new Date(completionDate);
              const daysDifference = Math.floor((renewalDateObj.getTime() - completionDateObj.getTime()) / (1000 * 3600 * 24));
              
              // Check for unusually short or long renewal periods
              if (daysDifference < 30) {
                record.addWarning("renewalDate", "Renewal period is less than 30 days - verify this is correct");
              } else if (daysDifference > 1095) { // 3 years
                record.addWarning("renewalDate", "Renewal period is more than 3 years - verify this is correct");
              }
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

          if (!recordName?.trim()) {
            record.addError("recordName", "Record Name required");
          }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Health Record validation:", error);
        throw error;
      }
    }
  );
};