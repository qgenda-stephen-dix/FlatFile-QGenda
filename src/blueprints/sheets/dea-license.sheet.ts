import { Flatfile } from "@flatfile/api";

export const deaLicenseSheet: Flatfile.SheetConfig = {
  name: "DEA License",
  slug: "dea_license",
  access: ["add", "edit", "delete", "import"],
  fields: [
    // Key Identity Fields
    {
      key: "provider_name",
      type: "string",
      label: "Provider Name",
      description: "Dummy field - for reference only"
    },
    {
      key: "external_id",
      type: "string",
      label: "External ID",
      description: "Key field for updating",
      constraints: [{ type: "required" }]
    },
    {
      key: "external_id_type",
      type: "enum",
      label: "External ID Type",
      description: "Key field for updating",
      constraints: [{ type: "required" }],
      config: {
        options: [
          { value: "NPI", label: "NPI" },
          { value: "ProviderKey", label: "ProviderKey" },
          { value: "InternalID", label: "InternalID" },
          { value: "ProviderID", label: "ProviderID" },
          { value: "EmrID", label: "EmrID" }
        ]
      }
    },

    // License Information - Required Fields
    {
      key: "auto_verify",
      type: "enum",
      label: "Auto-Verify?",
      constraints: [{ type: "required" }],
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },
    {
      key: "license_number",
      type: "string",
      label: "License Number",
      description: "Must be exactly 9 characters",
      constraints: [
        { type: "required" }
      ]
    },
    {
      key: "state",
      type: "enum",
      label: "State",
      description: "Key field for updating, Required field for manual license",
      constraints: [{ type: "required" }],
      config: {
        options: [
          { value: "AL", label: "AL" }, 
          { value: "AK", label: "AK" }, 
          { value: "AZ", label: "AZ" }, 
          { value: "AR", label: "AR" }, 
          { value: "CA", label: "CA" }, 
          { value: "CO", label: "CO" }, 
          { value: "CT", label: "CT" }, 
          { value: "DE", label: "DE" }, 
          { value: "FL", label: "FL" }, 
          { value: "GA", label: "GA" }, 
          { value: "HI", label: "HI" }, 
          { value: "ID", label: "ID" }, 
          { value: "IL", label: "IL" }, 
          { value: "IN", label: "IN" }, 
          { value: "IA", label: "IA" }, 
          { value: "KS", label: "KS" }, 
          { value: "KY", label: "KY" }, 
          { value: "LA", label: "LA" }, 
          { value: "ME", label: "ME" }, 
          { value: "MD", label: "MD" }, 
          { value: "MA", label: "MA" }, 
          { value: "MI", label: "MI" }, 
          { value: "MN", label: "MN" }, 
          { value: "MS", label: "MS" }, 
          { value: "MO", label: "MO" }, 
          { value: "MT", label: "MT" }, 
          { value: "NE", label: "NE" }, 
          { value: "NV", label: "NV" }, 
          { value: "NH", label: "NH" }, 
          { value: "NJ", label: "NJ" }, 
          { value: "NM", label: "NM" }, 
          { value: "NY", label: "NY" }, 
          { value: "NC", label: "NC" }, 
          { value: "ND", label: "ND" }, 
          { value: "OH", label: "OH" }, 
          { value: "OK", label: "OK" }, 
          { value: "OR", label: "OR" }, 
          { value: "PA", label: "PA" }, 
          { value: "RI", label: "RI" }, 
          { value: "SC", label: "SC" }, 
          { value: "SD", label: "SD" }, 
          { value: "TN", label: "TN" }, 
          { value: "TX", label: "TX" }, 
          { value: "UT", label: "UT" }, 
          { value: "VT", label: "VT" }, 
          { value: "VA", label: "VA" }, 
          { value: "WA", label: "WA" }, 
          { value: "WV", label: "WV" }, 
          { value: "WI", label: "WI" }, 
          { value: "WY", label: "WY" },
          { value: "DC", label: "DC" }
        ]
      }
    },

    // Date Fields
    {
      key: "issue_date",
      type: "date",
      label: "Issue Date",
      description: "Must be before Expiration Date, format: m/d/yyyy"
    },
    {
      key: "expiration_date",
      type: "date",
      label: "Expiration Date",
      description: "Required field, format: m/d/yyyy",
      constraints: [{ type: "required" }]
    },
    {
      key: "monitor_expiration_date",
      type: "enum",
      label: "Monitor Expiration Date",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },

    // Status and Schedule
    {
      key: "status",
      type: "enum",
      label: "Status",
      config: {
        options: [
          { value: "Active", label: "Active" },
          { value: "Active - Inoperable", label: "Active - Inoperable" },
          { value: "Cessation of Practice", label: "Cessation of Practice" },
          { value: "Conditioned", label: "Conditioned" },
          { value: "Exempt", label: "Exempt" },
          { value: "Expired", label: "Expired" },
          { value: "Inactive", label: "Inactive" },
          { value: "Not Applicable", label: "Not Applicable" }
        ]
      }
    },
    {
      key: "schedule",
      type: "string",
      label: "Schedule",
      description: "Use | character to separate multiple values (e.g., '3|3N|5')"
    },

    // Waiver Information
    {
      key: "waiver_requested",
      type: "enum",
      label: "Waiver Requested?",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },
    {
      key: "waiver_granted",
      type: "enum",
      label: "Waiver Granted?",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },

    // Viewability Settings
    {
      key: "record_viewable_by_provider",
      type: "enum",
      label: "Record Viewable by Provider",
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
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },

    // File and Notes
    {
      key: "file_key",
      type: "string",
      label: "File Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    },
    {
      key: "note",
      type: "string",
      label: "Note",
      description: "Maximum 10,000 characters"
    },

    // System Fields
    {
      key: "user",
      type: "string",
      label: "User",
      description: "If empty, 'Credentialing System' will be used"
    },
    {
      key: "timestamp",
      type: "string",
      label: "TimeStamp",
      description: "Format: m/d/yyyy h:mm:ss"
    },

    // Custom Fields
    {
      key: "x1",
      type: "string",
      label: "x1"
    },
    {
      key: "x2",
      type: "string",
      label: "x2"
    },
    {
      key: "x3",
      type: "string",
      label: "x3"
    },
    {
      key: "x4",
      type: "string",
      label: "x4"
    },
    {
      key: "x5",
      type: "string",
      label: "x5"
    },
    {
      key: "x6",
      type: "string",
      label: "x6"
    },
    {
      key: "x7",
      type: "string",
      label: "x7"
    },
    {
      key: "x8",
      type: "string",
      label: "x8"
    },
    {
      key: "x9",
      type: "string",
      label: "x9"
    },
    {
      key: "x10",
      type: "string",
      label: "x10"
    }
  ],
  actions: [
    {
      operation: "validateDEALicense",
      mode: "foreground",
      label: "Validate DEA License",
      description: "Comprehensive validation of DEA License information per specification"
    },
    {
      operation: "dedupeDEALicense",
      mode: "foreground",
      label: "Remove Duplicate DEA Licenses",
      description: "Identify and flag duplicate DEA license records for the same provider"
    }
  ]
};