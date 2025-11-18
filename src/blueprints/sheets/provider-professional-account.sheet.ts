import { Flatfile } from "@flatfile/api";

// Provider Professional Account Import Format sheet configuration
export const providerProfessionalAccountSheet: Flatfile.SheetConfig = {
  name: "Provider Professional Account Import Format",
  slug: "provider_professional_account",
  access: ["*"],
  fields: [
    // Core Required Fields (Key fields for updating)
    {
      key: "provider_name",
      type: "string",
      label: "Provider Name",
      description: "Dummy Field - Key field for updating"
    },
    {
      key: "external_id",
      type: "string",
      label: "External ID",
      description: "Required field - Key field for updating",
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
      description: "Required field - Key field for updating. Must be one of: NPI, InternalID, ProviderID, EmrID, BillingSystemID",
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
      key: "account_name",
      type: "string",
      label: "Account Name",
      description: "Required field - Key field for updating. Must match existing company-level Account Name",
      constraints: [
        {
          type: "required"
        }
      ]
    },

    // Account Details
    {
      key: "username",
      type: "string",
      label: "Username",
      description: "Optional - Max 50 characters"
    },
    {
      key: "password",
      type: "string",
      label: "Password",
      description: "Optional - Max 50 characters"
    },
    {
      key: "expiration_date",
      type: "string",
      label: "Expiration Date",
      description: "Optional - Date must be formatted as m/d/yyyy"
    },
    {
      key: "id",
      type: "string",
      label: "ID",
      description: "Key field for updating - Max 250 characters"
    },
    {
      key: "notes",
      type: "string",
      label: "Notes",
      description: "Optional - Max 500 characters"
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
      operation: "validateProviderProfessionalAccount",
      mode: "foreground",
      label: "Validate Provider Professional Account Data",
      description: "Validate provider professional account data with comprehensive business rules including account name verification and duplicate prevention"
    }
  ]
};