import { Flatfile } from "@flatfile/api";

/**
 * Work Gap Sheet Blueprint
 * 
 * Manages work history gaps and time off periods for providers with:
 * - Required external ID and date fields (Start Date, End Date are key fields)
 * - Gap reason and explanation tracking
 * - File linking capability with GUID validation
 * - Provider and file viewability controls
 * - Character limits and format validations
 * - 2024.07 additions for Note, User, and TimeStamp
 */
export const workGapSheet: Flatfile.SheetConfig = {
  name: "Work Gap Import Format",
  slug: "work-gap",
  access: ["*"],
  fields: [
    // Key Fields
    {
      key: "providerName",
      type: "string",
      label: "Provider Name",
      description: "Dummy column for provider identification"
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

    // Gap Details
    {
      key: "reason",
      type: "string",
      label: "Reason",
      description: "Maximum 200 characters"
    },
    {
      key: "startDate",
      type: "date",
      label: "Start Date",
      description: "Key field for updating. Format: m/d/yyyy",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "endDate",
      type: "date",
      label: "End Date", 
      description: "Key field for updating. Format: m/d/yyyy",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "explanation",
      type: "string",
      label: "Explanation",
      description: "Maximum 1,000 characters"
    },

    // Visibility Controls
    {
      key: "recordViewableByProvider",
      type: "enum",
      label: "Record Viewable by Provider",
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
      key: "fileViewableByProvider",
      type: "enum",
      label: "File Viewable by Provider",
      description: "Must be T or F if not empty",
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
      operation: "validateWorkGap",
      mode: "foreground",
      label: "Validate Work Gap",
      description: "Validate work gap data with comprehensive business rules including date validation, character limits, and File Key business rules"
    }
  ]
};