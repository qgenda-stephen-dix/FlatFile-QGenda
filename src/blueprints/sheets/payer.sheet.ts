import { Flatfile } from "@flatfile/api";

export const payerSheet: Flatfile.SheetConfig = {
  name: "Payer",
  slug: "payer",
  access: ["*"],
  fields: [
    // Core Payer Information
    {
      key: "payer_key",
      type: "string",
      label: "Payer Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX. Required for UPDATE only, leave blank for ADD"
    },
    {
      key: "payer_name",
      type: "string",
      label: "Payer Name", 
      description: "Name of the payer organization (max 100 characters)",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "plan_line_of_business",
      type: "string",
      label: "Plan/Line of Business",
      description: "Plan or line of business (max 100 characters)"
    },
    {
      key: "states",
      type: "string", 
      label: "State(s)",
      description: "Comma-delimited list of state values"
    },
    {
      key: "website",
      type: "string",
      label: "Website",
      description: "Payer website URL (max 2047 characters)"
    },

    // Primary Contact Information
    {
      key: "primary_contact_name",
      type: "string",
      label: "Primary Contact Name",
      description: "Name of primary contact (max 50 characters)"
    },
    {
      key: "primary_contact_email",
      type: "string",
      label: "Primary Contact Email",
      description: "Email address of primary contact (max 100 characters)"
    },
    {
      key: "primary_contact_phone",
      type: "string",
      label: "Primary Contact Phone",
      description: "Phone number - 9, 10, or 12 digits only (no formatting)"
    },
    {
      key: "primary_contact_phone_ext",
      type: "string",
      label: "Primary Contact Phone Ext.",
      description: "Phone extension - number up to 20 digits"
    },
    {
      key: "primary_contact_fax",
      type: "string",
      label: "Primary Contact Fax",
      description: "Fax number - 9, 10, or 12 digits only (no formatting)"
    },

    // Secondary Contact Information
    {
      key: "secondary_contact_name",
      type: "string",
      label: "Secondary Contact Name",
      description: "Name of secondary contact (max 50 characters)"
    },
    {
      key: "secondary_contact_email",
      type: "string",
      label: "Secondary Contact Email",
      description: "Email address of secondary contact (max 100 characters)"
    },
    {
      key: "secondary_contact_phone",
      type: "string",
      label: "Secondary Contact Phone",
      description: "Phone number - 9, 10, or 12 digits only (no formatting)"
    },
    {
      key: "secondary_contact_phone_ext",
      type: "string",
      label: "Secondary Contact Phone Ext.",
      description: "Phone extension - number up to 20 digits"
    },
    {
      key: "secondary_contact_fax",
      type: "string",
      label: "Secondary Contact Fax",
      description: "Fax number - 9, 10, or 12 digits only (no formatting)"
    },

    // Additional Information
    {
      key: "general_notes",
      type: "string",
      label: "General Notes",
      description: "General notes about the payer (max 10,000 characters)"
    },
    {
      key: "instructions",
      type: "string",
      label: "Instructions",
      description: "Instructions for the payer (max 10,000 characters)"
    },
    {
      key: "line_of_business_notes",
      type: "string",
      label: "Line of Business Notes",
      description: "Notes specific to line of business (max 10,000 characters)"
    },
    {
      key: "location_keys",
      type: "string",
      label: "Location Keys",
      description: "Comma-delimited list of location GUIDs (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX format)"
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
      operation: "validatePayer",
      mode: "foreground",
      label: "Validate Payer",
      description: "Validate payer data with comprehensive business rules, character limits, and format validation"
    }
  ]
};