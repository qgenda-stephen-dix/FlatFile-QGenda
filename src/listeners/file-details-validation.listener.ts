import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const fileDetailsValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("file-details", (record) => {
      // Get all field values
      const externalId = record.get("externalId") as string;
      const externalIdType = record.get("externalIdType") as string;
      const fileName = record.get("fileName") as string;
      const fileKey = record.get("fileKey") as string;
      const fileCategory = record.get("fileCategory") as string;
      const fileType = record.get("fileType") as string;
      const fileDescription = record.get("fileDescription") as string;

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

      // File Key GUID format validation
      if (fileKey) {
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(fileKey)) {
          record.addError("fileKey", "File Key must be a valid GUID");
        }
      }

      // File Name validations
      if (fileName) {
        // Cannot be "None"
        if (fileName.trim().toLowerCase() === "none") {
          record.addError("fileName", "File Name cannot be \"None\"");
        }

        // Character limit validation (250 characters)
        if (fileName.length > 250) {
          record.addError("fileName", "File Name exceeds character limit of 250");
        }
      }

      // File Description character limit validation (10000 characters)
      if (fileDescription && fileDescription.length > 10000) {
        record.addError("fileDescription", "File Description exceeds character limit of 10000");
      }

      // File Category validation (simulated dropdown values)
      if (fileCategory) {
        const validFileCategories = [
          "Credentials",
          "Licenses", 
          "Certifications",
          "Education",
          "Training",
          "References",
          "Insurance",
          "Legal Documents",
          "Medical Records",
          "Administrative",
          "None" // Special value to clear existing information
        ];
        
        if (!validFileCategories.includes(fileCategory)) {
          record.addError("fileCategory", "File Category not supported");
        }
      }

      // File Type validation (must have File Category if File Type is provided)
      if (fileType && !fileCategory) {
        record.addError("fileType", "File Type not valid for selected File Category");
      }

      // File Type validation (simulated dropdown values per category)
      if (fileType && fileCategory) {
        const validFileTypes: { [key: string]: string[] } = {
          "Credentials": ["Medical License", "DEA License", "Board Certification", "Specialty Certificate"],
          "Licenses": ["State License", "Federal License", "Specialty License", "Temporary License"],
          "Certifications": ["Board Certification", "Continuing Education", "Training Certificate", "Competency Certificate"],
          "Education": ["Degree", "Transcript", "Diploma", "Certificate of Completion"],
          "Training": ["Residency", "Fellowship", "Continuing Education", "Skills Training"],
          "References": ["Professional Reference", "Personal Reference", "Academic Reference", "Employment Reference"],
          "Insurance": ["Malpractice Insurance", "Liability Insurance", "Professional Insurance", "General Insurance"],
          "Legal Documents": ["Contract", "Agreement", "Compliance Document", "Regulatory Filing", "Signable Document"],
          "Medical Records": ["Patient Records", "Clinical Notes", "Test Results", "Imaging"],
          "Administrative": ["Forms", "Applications", "Reports", "Correspondence"]
        };

        const categoryTypes = validFileTypes[fileCategory];
        if (categoryTypes && !categoryTypes.includes(fileType) && fileType !== "None") {
          record.addError("fileType", "File Type not valid for selected File Category");
        }

        // Special validation for Signable Document type
        if (fileType === "Signable Document") {
          // Note: In a real implementation, this would check the actual file extension
          // For this validation, we'll add a warning about PDF requirement
          record.addWarning("fileType", "File must be a .pdf for selected File Type 'Signable Document'");
        }
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

      return record;
    })
  );
};