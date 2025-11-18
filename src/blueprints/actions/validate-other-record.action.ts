import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateOtherRecordAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateOtherRecord" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track duplicates and cross-record validations
        const externalIdMap = new Map<string, number>();
        const fileKeyMap = new Map<string, number>();
        const documentTypes = new Set<string>();

        const validatedRecords = records.map((record: FlatfileRecord, index: number) => {
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const type = record.get("type") as string;
          const name = record.get("name") as string;
          const issueDate = record.get("issueDate") as string;
          const expirationDate = record.get("expirationDate") as string;
          const fileKey = record.get("fileKey") as string;
          const user = record.get("user") as string;
          const recordViewableByProvider = record.get("recordViewableByProvider") as string;
          const fileViewableByProvider = record.get("fileViewableByProvider") as string;
          const classification = record.get("classification") as string;

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

            // Simulate provider type validation
            if (externalIdType === "InvalidType") {
              record.addError("externalIdType", "Provider Type not defined for company");
            }

            // Simulate duplicate ID scenarios
            if (externalId.includes("DUPLICATE")) {
              record.addError("externalId", `${externalIdType} matches the ${externalIdType} of an existing provider`);
            }
          }

          // File Key business rules validation
          if (fileKey) {
            // Track File Key usage for duplicate linking validation
            if (fileKeyMap.has(fileKey)) {
              const previousRow = fileKeyMap.get(fileKey)! + 1;
              record.addWarning("fileKey", `File Key linked successfully but unlinked from Other Record - Row ${previousRow}`);
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

          // Document type validation (collect types for analysis)
          if (type && type.trim()) {
            documentTypes.add(type.trim());
            
            // Simulate document category validation
            const validDocumentCategories = [
              "Licenses and Certifications",
              "Education and Training",
              "Continuing Medical Education", 
              "Work History and Affiliations",
              "Employee Documents",
              "Sanctions and Exclusions",
              "References",
              "Payer Documents"
            ];

            // More sophisticated document type validation
            if (!type.toLowerCase().includes("license") && 
                !type.toLowerCase().includes("certificate") &&
                !type.toLowerCase().includes("education") &&
                !type.toLowerCase().includes("training") &&
                !type.toLowerCase().includes("employment") &&
                !type.toLowerCase().includes("reference") &&
                !type.toLowerCase().includes("payer") &&
                !type.toLowerCase().includes("document")) {
              record.addError("type", "Document Category not supported");
            }
          }

          // Classification validation (simulated)
          if (classification && classification.trim() && type && type.trim()) {
            // Simulate classification validation against configurable lists
            const validClassificationsByType = {
              "License": ["Medical License", "Professional License", "Specialty License"],
              "Certificate": ["Board Certification", "Training Certificate", "Continuing Education"],
              "Education": ["Medical Degree", "Residency", "Fellowship", "Continuing Education"],
              "Reference": ["Professional Reference", "Character Reference", "Academic Reference"]
            };

            // Simple validation based on type keywords
            let isValidClassification = false;
            for (const [typeKey, classifications] of Object.entries(validClassificationsByType)) {
              if (type.toLowerCase().includes(typeKey.toLowerCase())) {
                isValidClassification = classifications.some(c => 
                  classification.toLowerCase().includes(c.toLowerCase()) ||
                  c.toLowerCase().includes(classification.toLowerCase())
                );
                if (isValidClassification) break;
              }
            }

            if (!isValidClassification && classification !== "General" && classification !== "Other") {
              record.addError("classification", "Classification not supported");
            }
          }

          // Record and File Viewable consistency checks
          if (recordViewableByProvider === "F" && fileViewableByProvider === "T") {
            record.addWarning("fileViewableByProvider", "File Viewable by Provider must be set to 'F' on records where Record Viewable by Provider is set to 'F'");
          }

          // Document completeness validations
          if (name && issueDate) {
            // Check for common document naming patterns
            const commonDocumentTypes = ["License", "Certificate", "Degree", "Reference", "Report"];
            const hasCommonPattern = commonDocumentTypes.some(docType => 
              name.toLowerCase().includes(docType.toLowerCase()) ||
              (type && type.toLowerCase().includes(docType.toLowerCase()))
            );
            
            if (!hasCommonPattern) {
              record.addInfo("name", "Consider using standard document naming conventions for consistency");
            }

            // Check for future issue dates
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            if (dateRegex.test(issueDate)) {
              const issueDateObj = new Date(issueDate);
              const currentDate = new Date();
              
              if (issueDateObj > currentDate) {
                record.addWarning("issueDate", "Issue date is in the future - please verify");
              }
            }
          }

          // Expiration date business logic
          if (expirationDate && issueDate) {
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            
            if (dateRegex.test(expirationDate) && dateRegex.test(issueDate)) {
              const expirationDateObj = new Date(expirationDate);
              const issueDateObj = new Date(issueDate);
              const daysDifference = Math.floor((expirationDateObj.getTime() - issueDateObj.getTime()) / (1000 * 3600 * 24));
              
              // Check for unusually short or long validity periods
              if (daysDifference < 30) {
                record.addWarning("expirationDate", "Document validity period is less than 30 days - verify this is correct");
              } else if (daysDifference > 3650) { // 10 years
                record.addWarning("expirationDate", "Document validity period is more than 10 years - verify this is correct");
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

          if (!type?.trim()) {
            record.addError("type", "Type required");
          }

          if (!name?.trim()) {
            record.addError("name", "Name required");
          }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Other Record validation:", error);
        throw error;
      }
    }
  );
};