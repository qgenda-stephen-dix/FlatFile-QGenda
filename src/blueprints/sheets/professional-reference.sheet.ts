import { Flatfile } from "@flatfile/api";

export const professionalReferenceSheet: Flatfile.SheetConfig = {
  name: "Professional Reference",
  slug: "professional-reference",
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
      key: "fullName",
      type: "string",
      label: "Full Name",
      description: "Key field for updating, Required field - Reference provider's full name (max 100 characters)",
      constraints: [
        {
          type: "required"
        }
      ]
    },

    // Reference Information Fields
    {
      key: "relationship",
      type: "string",
      label: "Relationship",
      description: "Relationship to the provider (max 100 characters)"
    },
    {
      key: "specialty",
      type: "string",
      label: "Specialty",
      description: "Medical specialty - must match values in Settings > Configurable Lists > Specialty"
    },
    {
      key: "degreeProviderType",
      type: "string",
      label: "Degree/Provider Type",
      description: "Degree or provider type - must match abbreviation from dropdown list"
    },
    {
      key: "workedTogetherDuration",
      type: "string",
      label: "Worked together for how long?",
      description: "Duration of professional relationship (max 50 characters)"
    },
    {
      key: "facility",
      type: "string",
      label: "Facility",
      description: "Associated healthcare facility (max 100 characters)"
    },

    // Contact Information Fields
    {
      key: "phoneNumber",
      type: "string",
      label: "Phone Number",
      description: "Phone number - must be 9, 10, or 12 digits only (no formatting)"
    },
    {
      key: "ext",
      type: "string",
      label: "Ext.",
      description: "Phone extension - number up to 20 digits"
    },
    {
      key: "email",
      type: "string",
      label: "Email",
      description: "Email address - must follow username@domain.com format"
    },
    {
      key: "fax",
      type: "string",
      label: "Fax",
      description: "Fax number - must be 9, 10, or 12 digits only (no formatting)"
    },

    // Address Fields
    {
      key: "addressLine1",
      type: "string",
      label: "Address Line 1",
      description: "Primary address line (max 100 characters)"
    },
    {
      key: "addressLine2",
      type: "string",
      label: "Address Line 2",
      description: "Secondary address line (max 50 characters)"
    },
    {
      key: "city",
      type: "string",
      label: "City",
      description: "City name (max 50 characters)"
    },
    {
      key: "county",
      type: "string",
      label: "County",
      description: "County name (max 100 characters)"
    },
    {
      key: "state",
      type: "string",
      label: "State",
      description: "State abbreviation - must match state dropdown values"
    },
    {
      key: "zip",
      type: "string",
      label: "Zip",
      description: "Zip code - maximum 10 alphanumeric characters"
    },
    {
      key: "country",
      type: "string",
      label: "Country",
      description: "Country name - must appear in company settings with Display = 'Y' (max 100 characters)"
    },

    // Provider Visibility Fields
    {
      key: "recordViewableByProvider",
      type: "enum",
      label: "Record Viewable by Provider",
      description: "Whether the record is viewable by provider - T or F (defaults to company-level setting if blank)",
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
      description: "Whether the file is viewable by provider - T or F (defaults to company-level setting if blank)",
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

    // Date Range Fields
    {
      key: "from",
      type: "string",
      label: "From",
      description: "Start date in m/d/yyyy format"
    },
    {
      key: "to",
      type: "string",
      label: "To",
      description: "End date in m/d/yyyy format"
    },

    // Status Fields
    {
      key: "active",
      type: "enum",
      label: "Active",
      description: "Active status - T or F (defaults to T if blank on ADD)",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
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
      operation: "validateProfessionalReference",
      mode: "foreground",
      label: "Validate Professional Reference",
      description: "Validate professional reference data with comprehensive business rules and provider matching"
    }
  ]
};