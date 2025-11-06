import { Flatfile } from "@flatfile/api";

export const stateLicenseSheet: Flatfile.SheetConfig = {
  name: "State License",
  slug: "state_license",
  access: ["add", "edit", "delete", "import"],
  fields: [
    // Key Identity Fields - 
    {
      key: "provider_name",
      type: "string",
      label: "Provider Name",
      description: "Dummy field - do not omit from CSV file"
    },
    {
      key: "external_id",
      type: "string",
      label: "External ID",
      description: "Key field for updating, Required field",
      constraints: [{ type: "required" }]
    },
    {
      key: "external_id_type",
      type: "enum",
      label: "External ID Type",
      description: "Key field for updating, Required field",
      constraints: [{ type: "required" }],
      config: {
        options: [
          { value: "NPI", label: "NPI" },
          { value: "InternalID", label: "Internal ID" },
          { value: "ProviderID", label: "Provider ID" },
          { value: "EmrID", label: "EMR ID" },
          { value: "BillingSystemID", label: "Billing System ID" }
        ]
      }
    },
    {
      key: "auto_verify",
      type: "enum",
      label: "Auto-Verify?",
      description: "Required field",
      constraints: [{ type: "required" }],
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },

    // License Location and Type
    {
      key: "state",
      type: "string",
      label: "State",
      description: "Key field for updating, Required field - must match state abbreviation",
      constraints: [{ type: "required" }]
    },
    {
      key: "specialty_license",
      type: "string",
      label: "Specialty License",
      description: "Must match specialty license drop-down values"
    },
    {
      key: "currently_practicing",
      type: "enum",
      label: "Currently Practicing?",
      description: "Required field for manual license",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },

    // License Details
    {
      key: "license_number",
      type: "string",
      label: "License Number",
      description: "Key field for updating, Required field - max 200 characters",
      constraints: [{ type: "required" }]
    },
    {
      key: "license_type",
      type: "string",
      label: "License Type",
      description: "Key field for updating, Required field - must match License Type drop-down for provided State",
      constraints: [{ type: "required" }]
    },
    {
      key: "npdb_field_of_licensure",
      type: "string",
      label: "NPDB Field of Licensure",
      description: "Max 3 characters"
    },
    {
      key: "submit_to_npdb",
      type: "enum",
      label: "Submit to NPDB",
      description: "Must be Y, N, or blank",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
          { value: "", label: "Blank" }
        ]
      }
    },
    {
      key: "endorsements",
      type: "string",
      label: "Endorsements",
      description: "Max 100 characters"
    },

    // Status and Dates
    {
      key: "status",
      type: "string",
      label: "Status",
      description: "Required field for manual license - must match status drop-down",
      constraints: [{ type: "required" }]
    },
    {
      key: "issue_date",
      type: "date",
      label: "Issue Date",
      description: "Required field for manual license - format m/d/yyyy"
    },
    {
      key: "expiration_date",
      type: "date",
      label: "Expiration Date",
      description: "Required field - format m/d/yyyy",
      constraints: [{ type: "required" }]
    },

    // Monitoring and Visibility
    {
      key: "monitor_expiration_date",
      type: "enum",
      label: "Monitor Expiration Date",
      description: "Must be T or F",
      config: {
        options: [
          { value: "T", label: "True" },
          { value: "F", label: "False" }
        ]
      }
    },
    {
      key: "record_viewable_by_provider",
      type: "enum",
      label: "Record Viewable by Provider",
      description: "Must be T or F",
      config: {
        options: [
          { value: "T", label: "True" },
          { value: "F", label: "False" }
        ]
      }
    },
    {
      key: "ignore_required_fields_validation",
      type: "enum",
      label: "Ignore Required Fields Validation?",
      description: "Must be Y or N",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },
    {
      key: "file_viewable_by_provider",
      type: "enum",
      label: "File Viewable by Provider",
      description: "Must be T or F",
      config: {
        options: [
          { value: "T", label: "True" },
          { value: "F", label: "False" }
        ]
      }
    },
    {
      key: "file_key",
      type: "string",
      label: "File Key"
    },

    // Administrative Fields
    {
      key: "note",
      type: "string",
      label: "Note",
      description: "Max 10,000 characters"
    },
    {
      key: "user",
      type: "string",
      label: "User",
      description: "If empty, 'Credentialing System' will be used"
    },
    {
      key: "timestamp",
      type: "date",
      label: "TimeStamp",
      description: "Format m/d/yyyy"
    },

    // Standard X1-X10 Custom Fields
    {
      key: 'x1',
      type: 'string',
      label: 'X1',
      description: 'Custom field 1 for extensibility'
    },
    {
      key: 'x2',
      type: 'string',
      label: 'X2',
      description: 'Custom field 2 for extensibility'
    },
    {
      key: 'x3',
      type: 'string',
      label: 'X3',
      description: 'Custom field 3 for extensibility'
    },
    {
      key: 'x4',
      type: 'string',
      label: 'X4',
      description: 'Custom field 4 for extensibility'
    },
    {
      key: 'x5',
      type: 'string',
      label: 'X5',
      description: 'Custom field 5 for extensibility'
    },
    {
      key: 'x6',
      type: 'string',
      label: 'X6',
      description: 'Custom field 6 for extensibility'
    },
    {
      key: 'x7',
      type: 'string',
      label: 'X7',
      description: 'Custom field 7 for extensibility'
    },
    {
      key: 'x8',
      type: 'string',
      label: 'X8',
      description: 'Custom field 8 for extensibility'
    },
    {
      key: 'x9',
      type: 'string',
      label: 'X9',
      description: 'Custom field 9 for extensibility'
    },
    {
      key: 'x10',
      type: 'string',
      label: 'X10',
      description: 'Custom field 10 for extensibility'
    }
  ],
  actions: [
    {
      operation: "validateStateLicense",
      mode: "foreground",
      label: "Validate State License Data",
      description: "Validate state license records against business rules"
    },
    {
      operation: "dedupeStateLicense",
      mode: "foreground",
      label: "Remove Duplicate State Licenses",
      description: "Identify and flag duplicate state license records for the same provider and state"
    }
  ]
};