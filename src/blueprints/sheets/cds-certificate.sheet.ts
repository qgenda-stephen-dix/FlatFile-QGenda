import { Flatfile } from "@flatfile/api";

export const cdsCertificateSheet: Flatfile.SheetConfig = {
  name: "CDS Certificate",
  slug: "cds-certificate",
  access: ["*"],
  fields: [
    // Key Fields for Updates
    {
      key: "provider_name",
      type: "string",
      label: "Provider Name",
      description: "(Dummy Field)"
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
      key: "auto_verify",
      type: "enum",
      label: "Auto-Verify?",
      description: "Required field - must be Y or N",
      constraints: [
        {
          type: "required"
        }
      ],
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },

    // License Information
    {
      key: "license_number",
      type: "string",
      label: "License Number",
      description: "Key field for updating, Required field",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "state",
      type: "string",
      label: "State",
      description: "Key field for updating, Required field - state abbreviation",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "schedule",
      type: "string",
      label: "Schedule",
      description: "Use '|' character to separate multiple values (e.g., '3|3N|5')"
    },
    {
      key: "status",
      type: "string",
      label: "Status",
      description: "Status from dropdown options"
    },
    {
      key: "discipline_on_file",
      type: "enum",
      label: "Discipline on File?",
      description: "Must be Y or N",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },

    // Date Fields
    {
      key: "issue_date",
      type: "date",
      label: "Issue Date",
      description: "Key field for updating - format: m/d/yyyy"
    },
    {
      key: "expiration_date",
      type: "date",
      label: "Expiration Date",
      description: "Key field for updating, Required field - format: m/d/yyyy",
      constraints: [
        {
          type: "required"
        }
      ]
    },

    // Boolean/Flag Fields
    {
      key: "monitor_expiration_date",
      type: "enum",
      label: "Monitor Expiration Date",
      description: "Must be T or F (or blank)",
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
      description: "Must be T or F (or blank)",
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
      description: "Must be T or F (or blank)",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "ignore_required_fields_validation",
      type: "enum",
      label: "Ignore Required Fields Validation?",
      description: "Must be Y or N (or blank)",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },

    // File Management
    {
      key: "file_key",
      type: "string",
      label: "File Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    },

    // Administrative Fields
    {
      key: "note",
      type: "string",
      label: "Note",
      description: "Notes field (max 10,000 characters)"
    },
    {
      key: "user",
      type: "string",
      label: "User",
      description: "User field - if empty, 'Credentialing System' will be used"
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
      operation: "validateCDSCertificate",
      mode: "foreground",
      label: "Validate CDS Certificate",
      description: "Validate CDS certificate data with comprehensive business rules, date validation, and GUID format validation"
    }
  ]
};