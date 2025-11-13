import { Flatfile } from "@flatfile/api";

export const personalReferenceSheet: Flatfile.SheetConfig = {
  name: "Personal Reference Import Format",
  slug: "personal_reference",
  access: ["*"],
  fields: [
    // Key Identity Fields
    {
      key: "provider_name",
      type: "string",
      label: "Provider Name",
      description: "Dummy Field - Provider identification field"
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
      key: "full_name",
      type: "string",
      label: "Full Name",
      description: "Key field for updating, Required field - Maximum 100 characters",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "relationship",
      type: "string",
      label: "Relationship",
      description: "Key field for updating - Maximum 100 characters"
    },

    // Contact Information
    {
      key: "phone_number",
      type: "string",
      label: "Phone Number",
      description: "Must be 9, 10, or 12 digits only - no formatting allowed"
    },
    {
      key: "ext",
      type: "string",
      label: "Ext.",
      description: "Extension - Must be a number up to 20 digits in length"
    },
    {
      key: "email",
      type: "string",
      label: "Email",
      description: "Must adhere to username@domain.com format"
    },
    {
      key: "fax",
      type: "string",
      label: "Fax",
      description: "Must be 9, 10, or 12 digits only - no formatting allowed"
    },

    // Address Information
    {
      key: "address_line_1",
      type: "string",
      label: "Address Line 1",
      description: "Maximum 100 characters"
    },
    {
      key: "address_line_2",
      type: "string",
      label: "Address Line 2",
      description: "Maximum 50 characters"
    },
    {
      key: "city",
      type: "string",
      label: "City",
      description: "Maximum 50 characters"
    },
    {
      key: "county",
      type: "string",
      label: "County",
      description: "Maximum 100 characters"
    },
    {
      key: "state",
      type: "string",
      label: "State",
      description: "Maximum 50 characters - must be valid for country, no non-ASCII characters"
    },
    {
      key: "zip",
      type: "string",
      label: "Zip",
      description: "Maximum 10 alphanumeric characters"
    },
    {
      key: "country",
      type: "string",
      label: "Country",
      description: "Must appear in company settings with Display = 'y'"
    },

    // Viewability Configuration
    {
      key: "record_viewable_by_provider",
      type: "enum",
      label: "Record Viewable by Provider",
      description: "T or F only if provided - consumes company default if blank on ADD",
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
      description: "T or F only if provided - consumes company default if blank on ADD",
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

    // Date Range
    {
      key: "from",
      type: "date",
      label: "From",
      description: "Must be m/d/yyyy format and <= To date"
    },
    {
      key: "to",
      type: "date",
      label: "To",
      description: "Must be m/d/yyyy format and >= From date"
    },

    // Status
    {
      key: "active",
      type: "enum",
      label: "Active",
      description: "T or F only if provided - defaults to T if blank on ADD",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
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
      operation: "validatePersonalReference",
      mode: "foreground",
      label: "Validate Personal Reference Data",
      description: "Comprehensive validation of personal reference information with duplicate detection"
    }
  ]
};