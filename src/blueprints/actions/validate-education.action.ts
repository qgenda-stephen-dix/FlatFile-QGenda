import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateEducationAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateEducation" },
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
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const educationType = record.get("educationType") as string;
          const foreignGraduate = record.get("foreignGraduate") as string;
          const ecfmgNumber = record.get("ecfmgNumber") as string;
          const ecfmgIssueDate = record.get("ecfmgIssueDate") as string;
          const fifthPathwayNumber = record.get("fifthPathwayNumber") as string;
          const fifthPathwayIssueDate = record.get("fifthPathwayIssueDate") as string;
          const degree = record.get("degree") as string;
          const areaOfStudy = record.get("areaOfStudy") as string;
          const schoolName = record.get("schoolName") as string;
          const institutionEmail = record.get("institutionEmail") as string;
          const addressLine1 = record.get("addressLine1") as string;
          const addressLine2 = record.get("addressLine2") as string;
          const city = record.get("city") as string;
          const state = record.get("state") as string;
          const zip = record.get("zip") as string;
          const country = record.get("country") as string;
          const phone = record.get("phone") as string;
          const ext = record.get("ext") as string;
          const fax = record.get("fax") as string;
          const startDate = record.get("startDate") as string;
          const endDate = record.get("endDate") as string;
          const didYouGraduate = record.get("didYouGraduate") as string;
          const viewableByProvider = record.get("viewableByProvider") as string;
          const website = record.get("website") as string;
          const fileViewableByProvider = record.get("fileViewableByProvider") as string;
          const ignoreRequiredFieldsValidation = record.get("ignoreRequiredFieldsValidation") as string;
          const fileKey = record.get("fileKey") as string;
          const note = record.get("note") as string;
          const user = record.get("user") as string;
          const timestamp = record.get("timestamp") as string;

          // Required field validations (same as listener)
          if (!externalId?.trim()) {
            record.addError("externalId", "External Id required");
          }

          if (!externalIdType?.trim()) {
            record.addError("externalIdType", "External Id Type required");
          }

          if (!educationType?.trim()) {
            record.addError("educationType", "Education Type not supported");
          }

          if (!degree?.trim()) {
            record.addError("degree", "Degree not supported");
          }

          // External ID validation - both must be provided together
          if ((externalId && !externalIdType) || (!externalId && externalIdType)) {
            record.addError("externalId", "Must provide both External ID and External ID Type");
            record.addError("externalIdType", "Must provide both External ID and External ID Type");
          }

          // Education Type validation
          const validEducationTypes = ["Bachelor's", "Master's", "Doctorate", "Medical School", "Professional School", "Fifth Pathway"];
          if (educationType && !validEducationTypes.includes(educationType)) {
            record.addError("educationType", "Education Type not supported");
          }

          // T/F validations
          if (foreignGraduate && foreignGraduate !== "T" && foreignGraduate !== "F") {
            record.addError("foreignGraduate", "Foreign Graduate must be T or F");
          }

          if (viewableByProvider && viewableByProvider !== "T" && viewableByProvider !== "F") {
            record.addError("viewableByProvider", "Viewable by Provider must be T or F");
          }

          if (fileViewableByProvider && fileViewableByProvider !== "T" && fileViewableByProvider !== "F") {
            record.addError("fileViewableByProvider", "File Viewable by Provider must be T or F");
          }

          // Y/N validations
          if (didYouGraduate && didYouGraduate !== "Y" && didYouGraduate !== "N") {
            record.addError("didYouGraduate", "Did you graduate must be Y or N");
          }

          if (ignoreRequiredFieldsValidation && ignoreRequiredFieldsValidation !== "Y" && ignoreRequiredFieldsValidation !== "N") {
            record.addError("ignoreRequiredFieldsValidation", "Ignore Required Fields Validation? must be Y or N");
          }

          // Character limit validations
          if (ecfmgNumber && ecfmgNumber.length > 8) {
            record.addError("ecfmgNumber", "ECFMG Number exceeds character limit of 8");
          }

          if (fifthPathwayNumber && fifthPathwayNumber.length > 50) {
            record.addError("fifthPathwayNumber", "Fifth Pathway Number exceeds character limit of 50");
          }

          if (areaOfStudy && areaOfStudy.length > 100) {
            record.addError("areaOfStudy", "Area of Study / Major exceeds character limit of 100");
          }

          if (schoolName && schoolName.length > 150) {
            record.addError("schoolName", "School Name exceeds character limit of 150");
          }

          // Date format validations
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
          
          if (ecfmgIssueDate && !dateRegex.test(ecfmgIssueDate)) {
            record.addError("ecfmgIssueDate", "ECFMG Issue Date must be formatted as m/d/yyyy");
          }

          if (fifthPathwayIssueDate && !dateRegex.test(fifthPathwayIssueDate)) {
            record.addError("fifthPathwayIssueDate", "Fifth Pathway Issue Date must be formatted as m/d/yyyy");
          }

          if (startDate && !dateRegex.test(startDate)) {
            record.addError("startDate", "Start Date must be formatted as m/d/yyyy");
          }

          if (endDate && !dateRegex.test(endDate)) {
            record.addError("endDate", "End Date must be formatted as m/d/yyyy");
          }

          // Email validation
          if (institutionEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(institutionEmail)) {
              record.addError("institutionEmail", "'Institution Email' is not a valid email address.");
            }
          }

          // URL validation
          if (website) {
            const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/i;
            if (!urlRegex.test(website)) {
              record.addError("website", "Website is not a valid URL");
            }
          }

          // Phone/Fax validations
          if (phone) {
            const phoneDigits = phone.replace(/\D/g, '');
            if (phone !== phoneDigits || ![9, 10, 12].includes(phoneDigits.length)) {
              record.addError("phone", "Phone Number must be 9, 10, or 12-digit number");
            }
          }

          if (fax) {
            const faxDigits = fax.replace(/\D/g, '');
            if (fax !== faxDigits || ![9, 10, 12].includes(faxDigits.length)) {
              record.addError("fax", "Fax must be 9, 10, or 12-digit number");
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
          
          // Date logic: End Date should be after Start Date
          if (startDate && endDate) {
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            
            if (endDateObj <= startDateObj) {
              record.addWarning("endDate", "End Date should be after Start Date");
            }
          }

          // Education Type and Degree relationship validation
          // This would require actual degree dropdown validation in real implementation

          // User warning
          if (!user?.trim()) {
            record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
          }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Education validation:", error);
        throw error;
      }
    }
  );
};