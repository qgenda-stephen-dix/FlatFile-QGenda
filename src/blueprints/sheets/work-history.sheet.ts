import { Flatfile } from "@flatfile/api";

export const workHistorySheet: Flatfile.SheetConfig = {
  name: "Work History Import Format",
  slug: "work-history",
  access: ["*"],
  fields: [
    // Key fields for updating (Required)
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
          { value: "InternalID", label: "InternalID" },
          { value: "ProviderID", label: "ProviderID" },
          { value: "EmrID", label: "EmrID" },
          { value: "BillingSystemID", label: "BillingSystemID" }
        ]
      }
    },
    {
      key: "name_of_facility_employer",
      type: "string",
      label: "Name of Facility / Employer",
      description: "Key field for updating, Required Field - Maximum 150 characters",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "department",
      type: "string",
      label: "Department",
      description: "Key field for updating - Maximum 100 characters"
    },
    {
      key: "role",
      type: "string",
      label: "Role",
      description: "Key field for updating - Maximum 100 characters"
    },
    {
      key: "start_date",
      type: "date",
      label: "Start Date",
      description: "Key field for updating - Must be formatted as m/d/yyyy"
    },
    {
      key: "end_date",
      type: "date",
      label: "End Date",
      description: "Key field for updating - Must be formatted as m/d/yyyy. Current Position checkbox unchecked only if valid End Date imported"
    },
    
    // Additional work history details
    {
      key: "reason_for_leaving",
      type: "string",
      label: "Reason for Leaving",
      description: "Maximum 100 characters"
    },
    
    // Address information
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
      description: "Maximum 50 characters, must be valid subdivision value for Country"
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
      description: "Must match value in Settings > Configurable Lists > Countries where Display = 'y'"
    },
    
    // Contact information
    {
      key: "contact_name",
      type: "string",
      label: "Contact Name",
      description: "Maximum 100 characters"
    },
    {
      key: "contact_title_position",
      type: "string",
      label: "Contact's Title/Position",
      description: "Maximum 100 characters"
    },
    {
      key: "phone_number",
      type: "string",
      label: "Phone Number",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "ext",
      type: "string",
      label: "Ext.",
      description: "Extension - must be a number up to 20 digits in length"
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
      description: "Must be 10-digit number without formatting"
    },
    
    // Visibility controls
    {
      key: "record_viewable_by_provider",
      type: "enum",
      label: "Record Viewable by Provider",
      description: "Must be T or F if provided",
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
      description: "Must be T or F if provided. Must be F if Record Viewable by Provider is F",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    
    // File management
    {
      key: "file_key",
      type: "string",
      label: "File Key",
      description: "Must be valid GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)"
    },
    
    // 2024.07 additions - tracking fields
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
      description: "Must validate against Cred Spec emails. 'Credentialing System' used if empty"
    },
    {
      key: "timestamp",
      type: "date",
      label: "TimeStamp",
      description: "Must be formatted as m/d/yyyy"
    },
    
    // Standard X1-X10 custom fields (required for all sheets)
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
      operation: "validateWorkHistory",
      mode: "foreground",
      label: "Validate Work History",
      description: "Validate work history data with comprehensive business rules including cross-field validations, duplicate detection, and file key management"
    }
  ]
};