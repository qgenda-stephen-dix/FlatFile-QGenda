import { Flatfile } from "@flatfile/api";

// External ID Type enumeration for Provider Privileges Import Format
export const externalIdTypeEnum = [
  { value: "NPI", label: "NPI" },
  { value: "InternalID", label: "InternalID" },
  { value: "ProviderID", label: "ProviderID" },
  { value: "EmrID", label: "EmrID" },
  { value: "BillingSystemID", label: "BillingSystemID" }
];

// Y/N enumeration for Ignore Required Fields Validation
export const yesNoEnum = [
  { value: "Y", label: "Y" },
  { value: "N", label: "N" }
];

// Provider Privileges Import Format sheet configuration
export const providerPrivilegesSheet: Flatfile.SheetConfig = {
  name: "Provider Privileges Import Format",
  slug: "provider_privileges",
  access: ["*"],
  fields: [
    // Dummy and Key Fields
    {
      key: "provider_name",
      type: "string",
      label: "Provider Name",
      description: "Dummy field for provider identification"
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
        options: externalIdTypeEnum
      }
    },
    {
      key: "location_name",
      type: "string",
      label: "Location Name",
      description: "Dummy field for location identification"
    },
    {
      key: "location_key",
      type: "string",
      label: "Location Key",
      description: "Required field - Key field for updating. Must be valid GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "privilege_name",
      type: "string",
      label: "Privilege Name",
      description: "Required field - Key field for updating. Must match existing Privilege Name within the Company",
      constraints: [
        {
          type: "required"
        }
      ]
    },

    // Optional Fields
    {
      key: "conditions",
      type: "string",
      label: "Conditions",
      description: "Optional - Max 10,000 characters"
    },
    {
      key: "appt_date",
      type: "string",
      label: "Appt. Date",
      description: "Required when Status is 'Approved'. Must be formatted as m/d/yyyy"
    },
    {
      key: "reappt_date",
      type: "string",
      label: "Reappt. Date",
      description: "Required when Status is 'Approved'. Must be formatted as m/d/yyyy and after Appt. Date"
    },
    {
      key: "status",
      type: "string",
      label: "Status",
      description: "Optional - Must match a value in the company's Privilege Status configurable list"
    },
    {
      key: "granted_by",
      type: "string",
      label: "Granted By",
      description: "Optional - Must match a name in the Privileges Granted By configurable list"
    },
    {
      key: "ignore_required_fields_validation",
      type: "enum",
      label: "Ignore Required Fields Validation?",
      description: "Optional - Must be Y or N if provided",
      config: {
        options: [
          { value: "", label: "" },
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    }
  ],
  actions: [
    {
      operation: "providerPrivilegesValidateAction",
      mode: "background",
      label: "Validate Provider Privileges Data",
      description: "Run comprehensive validation on Provider Privileges Import Format data including provider matching, location validation, and privilege assignment verification"
    }
  ]
};