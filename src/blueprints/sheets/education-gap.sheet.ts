import { Flatfile } from "@flatfile/api";

/**
 * Education Gap Sheet Blueprint
 * CRED-34567
 * 
 * Tracks education gaps/time off periods for providers with:
 * - Required external ID and date fields
 * - File linking capability with GUID validation
 * - Provider and file viewability controls
 * - Character limits and format validations
 */
export const educationGapSheet: Flatfile.SheetConfig = {
  name: "Education Gap",
  slug: "education-gap",
  access: ["*"],
  fields: [
    // Key Fields
    {
      key: "provider_name",
      type: "string",
      label: "Provider Name",
      description: "Dummy column for reference only"
    },
    {
      key: "external_id",
      type: "string",
      label: "External ID",
      description: "Key field for updating, Required field",
      constraints: [
        { type: "required" }
      ]
    },
    {
      key: "external_id_type",
      type: "string",
      label: "External ID Type",
      description: "Key field for updating, Required field",
      constraints: [
        { type: "required" }
      ]
    },

    // Education Gap Details
    {
      key: "reason",
      type: "string",
      label: "Reason",
      description: "Max 200 characters"
    },
    {
      key: "start_date",
      type: "date",
      label: "Start Date",
      description: "Key field for updating. Format: m/d/yyyy",
      constraints: [
        { type: "required" }
      ]
    },
    {
      key: "end_date",
      type: "date",
      label: "End Date",
      description: "Key field for updating. Format: m/d/yyyy",
      constraints: [
        { type: "required" }
      ]
    },
    {
      key: "explanation",
      type: "string",
      label: "Explanation",
      description: "Max 1000 characters"
    },

    // Viewability Controls
    {
      key: "record_viewable_by_provider",
      type: "enum",
      label: "Record Viewable by Provider",
      description: "Must be T or F if provided",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" },
          { value: "", label: "" }
        ]
      }
    },
    {
      key: "file_viewable_by_provider",
      type: "enum",
      label: "File Viewable by Provider",
      description: "Must be T or F if provided",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" },
          { value: "", label: "" }
        ]
      }
    },

    // File Linking
    {
      key: "file_key",
      type: "string",
      label: "File Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    },

    // Standard System Fields
    {
      key: "user",
      type: "string",
      label: "User",
      description: "User who created/modified the record"
    },
    {
      key: "timestamp",
      type: "date",
      label: "TimeStamp",
      description: "Timestamp in m/d/yyyy format"
    },

    // Standard X1-X10 Custom Fields
    {
      key: "x1",
      type: "string",
      label: "X1",
      description: "Custom field 1 for extensibility"
    },
    {
      key: "x2",
      type: "string",
      label: "X2",
      description: "Custom field 2 for extensibility"
    },
    {
      key: "x3",
      type: "string",
      label: "X3",
      description: "Custom field 3 for extensibility"
    },
    {
      key: "x4",
      type: "string",
      label: "X4",
      description: "Custom field 4 for extensibility"
    },
    {
      key: "x5",
      type: "string",
      label: "X5",
      description: "Custom field 5 for extensibility"
    },
    {
      key: "x6",
      type: "string",
      label: "X6",
      description: "Custom field 6 for extensibility"
    },
    {
      key: "x7",
      type: "string",
      label: "X7",
      description: "Custom field 7 for extensibility"
    },
    {
      key: "x8",
      type: "string",
      label: "X8",
      description: "Custom field 8 for extensibility"
    },
    {
      key: "x9",
      type: "string",
      label: "X9",
      description: "Custom field 9 for extensibility"
    },
    {
      key: "x10",
      type: "string",
      label: "X10",
      description: "Custom field 10 for extensibility"
    }
  ],
  actions: [
    {
      operation: "validateEducationGap",
      mode: "foreground",
      label: "Validate Education Gap Data",
      description: "Validate education gap records with comprehensive business rules"
    }
  ]
};
