import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateWorkGapAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateWorkGap" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track duplicates and cross-record validations
        const externalIdMap = new Map<string, number>();
        const fileKeyMap = new Map<string, number>();
        const gapPeriods = new Map<string, Array<{startDate: Date, endDate: Date, index: number}>>();

        const validatedRecords = records.map((record: FlatfileRecord, index: number) => {
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const reason = record.get("reason") as string;
          const startDate = record.get("startDate") as string;
          const endDate = record.get("endDate") as string;
          const explanation = record.get("explanation") as string;
          const fileKey = record.get("fileKey") as string;
          const user = record.get("user") as string;
          const recordViewableByProvider = record.get("recordViewableByProvider") as string;
          const fileViewableByProvider = record.get("fileViewableByProvider") as string;

          // Duplicate External ID detection (combining with Start Date and End Date as they are key fields)
          if (externalId && externalIdType && startDate && endDate) {
            const externalIdKey = `${externalId}|${externalIdType}|${startDate}|${endDate}`;
            if (externalIdMap.has(externalIdKey)) {
              const previousRow = externalIdMap.get(externalIdKey)! + 1;
              record.addError("externalId", `Duplicate External ID, Type, Start Date, and End Date combination found. Previously used on row ${previousRow}`);
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

            // Simulate duplicate ID scenarios
            if (externalId.includes("DUPLICATE")) {
              record.addError("externalId", `${externalIdType} matches the ${externalIdType} of an existing provider`);
            }
          }

          // Track overlapping work gap periods for the same provider
          if (externalId && externalIdType && startDate && endDate) {
            const providerKey = `${externalId}|${externalIdType}`;
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            
            if (dateRegex.test(startDate) && dateRegex.test(endDate)) {
              const startDateObj = new Date(startDate);
              const endDateObj = new Date(endDate);
              
              if (!gapPeriods.has(providerKey)) {
                gapPeriods.set(providerKey, []);
              }
              
              const periods = gapPeriods.get(providerKey)!;
              
              // Check for overlapping periods
              for (const period of periods) {
                if ((startDateObj <= period.endDate && endDateObj >= period.startDate)) {
                  const overlapRow = period.index + 1;
                  record.addWarning("startDate", `Work gap period overlaps with gap period on row ${overlapRow}`);
                  break;
                }
              }
              
              periods.push({ startDate: startDateObj, endDate: endDateObj, index });
            }
          }

          // File Key business rules validation
          if (fileKey) {
            // Track File Key usage for duplicate linking validation
            if (fileKeyMap.has(fileKey)) {
              const previousRow = fileKeyMap.get(fileKey)! + 1;
              record.addWarning("fileKey", `File Key linked successfully but unlinked from Work Gap - Row ${previousRow}`);
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

          // Work gap business logic validations
          if (reason && startDate && endDate) {
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            
            if (dateRegex.test(startDate) && dateRegex.test(endDate)) {
              const startDateObj = new Date(startDate);
              const endDateObj = new Date(endDate);
              const gapDuration = Math.floor((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24));

              // Validate gap duration against reason
              if (reason.toLowerCase().includes("maternity") || reason.toLowerCase().includes("paternity")) {
                if (gapDuration > 365) {
                  record.addWarning("reason", "Maternity/Paternity leave longer than 1 year - verify this is correct");
                }
              }
              
              if (reason.toLowerCase().includes("medical")) {
                if (gapDuration > 730) { // 2 years
                  record.addWarning("reason", "Medical leave longer than 2 years - verify this is correct");
                }
              }
              
              if (reason.toLowerCase().includes("sabbatical")) {
                if (gapDuration < 90 || gapDuration > 365) {
                  record.addInfo("reason", "Sabbatical periods typically range from 3 months to 1 year");
                }
              }

              // Check for gaps in distant past
              const currentDate = new Date();
              const yearsAgo = Math.floor((currentDate.getTime() - endDateObj.getTime()) / (1000 * 3600 * 24 * 365));
              
              if (yearsAgo > 20) {
                record.addWarning("endDate", "Work gap ended more than 20 years ago - verify this is relevant for current credentialing");
              }
            }
          }

          // Record and File Viewable consistency checks
          if (recordViewableByProvider === "F" && fileViewableByProvider === "T") {
            record.addWarning("fileViewableByProvider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
          }

          // Work gap completeness checks
          if (startDate && endDate && !reason) {
            record.addWarning("reason", "Consider providing a reason for the work gap for documentation purposes");
          }

          if (reason && reason.trim() && !explanation) {
            const reasonLower = reason.toLowerCase();
            if (reasonLower.includes("medical") || reasonLower.includes("personal") || reasonLower.includes("family")) {
              record.addInfo("explanation", "Consider providing additional explanation for sensitive gap reasons");
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

          if (!startDate?.trim()) {
            record.addError("startDate", "Start Date is required");
          }

          if (!endDate?.trim()) {
            record.addError("endDate", "End Date is required");
          }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Work Gap validation:", error);
        throw error;
      }
    }
  );
};