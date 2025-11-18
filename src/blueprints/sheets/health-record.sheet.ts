import { Flatfile } from "@flatfile/api";

export const healthRecordSheet: Flatfile.SheetConfig = {
  name: "Health Record",
  slug: "health-record",
  access: ["*"],
  fields: [
    // Dummy Field (per specification)
    {
      key: "providerName",
      type: "string",
      label: "Provider Name",
      description: "Dummy field - Provider Name (required for template structure)"
    },

    // Key Fields (Required)
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
    {
      key: "recordName",
      type: "string",
      label: "Record Name",
      description: "Key field for updating, Required field - Name of the health record (max 50 characters)",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "examName",
      type: "string",
      label: "Exam Name",
      description: "Key field for updating - Name of the examination or health screening"
    },
    {
      key: "completionDate",
      type: "string",
      label: "Completion Date",
      description: "Key field for updating - Date when the health record was completed (m/d/yyyy format). Must be before Renewal Date."
    },

    // Health Record Details
    {
      key: "renewalDate",
      type: "string",
      label: "Renewal Date",
      description: "Date when the health record needs to be renewed (m/d/yyyy format)"
    },
    {
      key: "monitorExpirationDate",
      type: "enum",
      label: "Monitor Expiration Date",
      description: "Whether to monitor expiration date - T or F",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "notes",
      type: "string",
      label: "Notes",
      description: "Additional notes about the health record (max 500 characters)"
    },

    // Provider Visibility Fields
    {
      key: "recordViewableByProvider",
      type: "enum",
      label: "Record Viewable by Provider",
      description: "Whether the record is viewable by provider - T or F",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "fileViewableByProvider",
      type: "enum",
      label: "File Viewable by Provider",
      description: "Whether the file is viewable by provider - T or F",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },

    // File Management Fields
    {
      key: "fileKey",
      type: "string",
      label: "File Key",
      description: "File Key in GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)"
    },

    // Additional Information Fields (added in 2024.07)
    {
      key: "note",
      type: "string",
      label: "Note",
      description: "Additional note field (max 10000 characters) - added in 2024.07"
    },
    {
      key: "user",
      type: "string",
      label: "User",
      description: "User associated with the record - must match Cred Spec emails. Defaults to 'Credentialing System' if empty"
    },
    {
      key: "timeStamp",
      type: "string",
      label: "TimeStamp",
      description: "Timestamp in m/d/yyyy h:mm:ss format"
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
      operation: "validateHealthRecord",
      mode: "foreground",
      label: "Validate Health Record",
      description: "Validate health record data with comprehensive business rules and provider matching"
    }
  ]
};