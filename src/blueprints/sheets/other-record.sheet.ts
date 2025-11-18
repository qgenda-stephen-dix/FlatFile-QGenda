import { Flatfile } from "@flatfile/api";

/**
 * Other Record Sheet Blueprint
 * 
 * Manages general documentation and record imports for providers with:
 * - Required external ID and document type fields  
 * - Flexible document categorization system
 * - File linking capability with GUID validation
 * - Provider and file viewability controls
 * - Character limits and format validations
 * - Classification system for document organization
 * - 2024.07 additions for Note, User, and TimeStamp
 */
export const otherRecordSheet: Flatfile.SheetConfig = {
  name: "Other Record Import Format",
  slug: "other-record",
  access: ["*"],
  fields: [
    // Key Fields
    {
      key: "providerName",
      type: "string",
      label: "Provider Name",
      description: "Dummy field for provider identification"
    },
    {
      key: "externalId",
      type: "string",
      label: "External ID",
      description: "Key field for updating, Required field",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "externalIdType",
      type: "string",
      label: "External ID Type",
      description: "Key field for updating, Required field",
      constraints: [
        {
          type: "required"
        }
      ]
    },

    // Document Details
    {
      key: "type",
      type: "string",
      label: "Type",
      description: "Required field - Type matches a value on Document Types. Valid categories: Licenses and Certifications, Education and Training, Continuing Medical Education, Work History and Affiliations, Employee Documents, Sanctions and Exclusions, References, Payer Documents",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "name",
      type: "string",
      label: "Name", 
      description: "Required field - Maximum 100 characters",
      constraints: [
        {
          type: "required"
        }
      ]
    },

    // Date Fields
    {
      key: "issueDate",
      type: "date",
      label: "Issue Date",
      description: "Format: m/d/yyyy. Issue Date cannot be after Expiration Date"
    },
    {
      key: "expirationDate",
      type: "date",
      label: "Expiration Date?",
      description: "Format: m/d/yyyy. Must be after Issue Date if both dates are provided"
    },

    // Monitoring and Visibility
    {
      key: "monitorExpirationDate",
      type: "enum",
      label: "Monitor Expiration Date",
      description: "Must be T or F if not empty",
      config: {
        options: [
          { value: "", label: "" },
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "recordViewableByProvider",
      type: "enum",
      label: "Record Viewable by Provider",
      description: "Must be T or F if not empty. If blank on ADD, uses company-level default. If blank on UPDATE, no change to saved value",
      config: {
        options: [
          { value: "", label: "" },
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "fileViewableByProvider",
      type: "enum",
      label: "File Viewable by Provider", 
      description: "Must be T or F if not empty. If blank on ADD, uses company-level default. If blank on UPDATE, no change to saved value",
      config: {
        options: [
          { value: "", label: "" },
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },

    // File Management
    {
      key: "fileKey",
      type: "string",
      label: "File Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (8,4,4,4,12 characters)"
    },

    // 2024.07 Additions
    {
      key: "note",
      type: "string",
      label: "Note",
      description: "Maximum 10,000 characters"
    },
    {
      key: "user",
      type: "string",
      label: "User", 
      description: "If empty, 'Credentialing System' will be used - must match Cred Spec emails"
    },
    {
      key: "timeStamp",
      type: "string",
      label: "TimeStamp",
      description: "Format: m/d/yyyy h:mm:ss"
    },

    // Classification
    {
      key: "classification",
      type: "string",
      label: "Classification",
      description: "Must match value in Settings > Configurable Lists for the record Type"
    },

    // Standard X1-X10 Custom Fields
    {
      key: "x1",
      type: "string", 
      label: "X1",
      description: "Custom field X1"
    },
    {
      key: "x2",
      type: "string",
      label: "X2", 
      description: "Custom field X2"
    },
    {
      key: "x3",
      type: "string",
      label: "X3",
      description: "Custom field X3"
    },
    {
      key: "x4",
      type: "string",
      label: "X4",
      description: "Custom field X4"
    },
    {
      key: "x5",
      type: "string",
      label: "X5",
      description: "Custom field X5"
    },
    {
      key: "x6",
      type: "string",
      label: "X6",
      description: "Custom field X6"
    },
    {
      key: "x7",
      type: "string",
      label: "X7",
      description: "Custom field X7"
    },
    {
      key: "x8",
      type: "string",
      label: "X8",
      description: "Custom field X8"
    },
    {
      key: "x9",
      type: "string",
      label: "X9",
      description: "Custom field X9"
    },
    {
      key: "x10",
      type: "string",
      label: "X10",
      description: "Custom field X10"
    }
  ],
  actions: [
    {
      operation: "validateOtherRecord",
      mode: "foreground",
      label: "Validate Other Record",
      description: "Validate other record data with comprehensive business rules including document type validation, date cross-validation, and File Key business rules"
    }
  ]
};