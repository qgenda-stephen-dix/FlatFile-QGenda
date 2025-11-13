import { Flatfile } from "@flatfile/api";

export const driversLicenseSheet: Flatfile.SheetConfig = {
  name: "Driver's License Import Format",
  slug: "drivers_license",
  access: ["*"],
  fields: [
    // Key Identity Fields
    {
      key: "provider_name",
      type: "string",
      label: "Provider Name",
      description: "Dummy Column - Provider identification field"
    },
    {
      key: "external_id",
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
      key: "external_id_type",
      type: "enum",
      label: "External ID Type",
      description: "Key field for updating, Required field",
      constraints: [
        {
          type: "required"
        }
      ],
      config: {
        options: [
          { value: "NPI", label: "NPI" },
          { value: "InternalID", label: "Internal ID" },
          { value: "ProviderID", label: "Provider ID" },
          { value: "EmrID", label: "EMR ID" }
        ]
      }
    },
    {
      key: "state_province",
      type: "string",
      label: "State/Province",
      description: "Key field for updating, Required field - State/province matches dropdown values",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "license_number",
      type: "string",
      label: "License Number",
      description: "Key field for updating - Maximum 50 characters"
    },

    // License Details
    {
      key: "name_as_appears_on_license",
      type: "string",
      label: "Name as Appears on License",
      description: "Key field for updating - Maximum 50 characters"
    },
    {
      key: "issue_date",
      type: "date",
      label: "Issue Date",
      description: "Key field for updating - Must be m/d/yyyy format and before Expires On date"
    },
    {
      key: "expires_on",
      type: "date",
      label: "Expires On",
      description: "Key field for updating - Must be m/d/yyyy format and after Issue Date"
    },

    // Configuration Options
    {
      key: "monitor_expiration_date",
      type: "enum",
      label: "Monitor Expiration Date",
      description: "T or F only if provided",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "record_viewable_by_provider",
      type: "enum",
      label: "Record Viewable by Provider",
      description: "T or F only if provided",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "file_viewable_by_provider",
      type: "enum",
      label: "File Viewable by Provider",
      description: "T or F only if provided",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },

    // File Management
    {
      key: "file_key",
      type: "string",
      label: "File Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (8,4,4,4,12 characters)"
    },

    // Additional Information
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
      key: "timestamp",
      type: "date",
      label: "TimeStamp",
      description: "Must be m/d/yyyy format"
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
      operation: "validateDriversLicense",
      mode: "foreground",
      label: "Validate Driver's License Data",
      description: "Comprehensive validation of driver's license information with duplicate detection"
    }
  ]
};