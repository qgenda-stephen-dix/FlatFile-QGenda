import { Flatfile } from "@flatfile/api";

export const affiliationSheet: Flatfile.SheetConfig = {
  name: "Affiliation",
  slug: "affiliation",
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

    // Facility Information
    {
      key: "facility_employer_name",
      type: "string",
      label: "Name of Facility / Employer",
      description: "Required Field, max 150 characters",
      constraints: [{ type: "required" }]
    },
    {
      key: "title_position",
      type: "string",
      label: "Title/Position",
      description: "Max 100 characters"
    },
    {
      key: "department",
      type: "string",
      label: "Department",
      description: "Key field for updating, max 100 characters"
    },
    {
      key: "staff_category",
      type: "string",
      label: "Staff Category",
      description: "Must match Staff Category drop-down values"
    },
    {
      key: "medical_director",
      type: "string",
      label: "Medical Director",
      description: "Max 100 characters"
    },
    {
      key: "specialty",
      type: "string",
      label: "Specialty",
      description: "Max 100 characters"
    },

    // Affiliation Details
    {
      key: "primary_affiliation",
      type: "enum",
      label: "Primary Affiliation?",
      config: {
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" }
        ]
      }
    },
    {
      key: "admitting_privileges",
      type: "enum",
      label: "Admitting Privileges?",
      config: {
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" }
        ]
      }
    },

    // Date Fields
    {
      key: "start_date",
      type: "date",
      label: "Start Date",
      description: "Key field for updating"
    },
    {
      key: "end_date",
      type: "date",
      label: "End Date",
      description: "Key field for updating"
    },

    // Contact Information
    {
      key: "medical_office_contact_person",
      type: "string",
      label: "Medical Office Contact Person",
      description: "Max 100 characters"
    },
    {
      key: "address_line_1",
      type: "string",
      label: "Address Line 1",
      description: "Max 100 characters"
    },
    {
      key: "address_line_2",
      type: "string",
      label: "Address Line 2",
      description: "Max 50 characters"
    },
    {
      key: "city",
      type: "string",
      label: "City",
      description: "Max 50 characters"
    },
    {
      key: "county",
      type: "string",
      label: "County",
      description: "Max 100 characters"
    },
    {
      key: "state",
      type: "string",
      label: "State",
      description: "Max 50 characters"
    },
    {
      key: "zip",
      type: "string",
      label: "Zip",
      description: "Max 10 alphanumeric characters"
    },
    {
      key: "country",
      type: "string",
      label: "Country",
      description: "Max 100 characters"
    },
    {
      key: "phone_number",
      type: "string",
      label: "Phone Number",
      description: "Must be 9, 10, or 12 digits only"
    },
    {
      key: "ext",
      type: "string",
      label: "Ext.",
      description: "Numbers only, max 20 digits"
    },
    {
      key: "fax",
      type: "string",
      label: "Fax",
      description: "Must be 9, 10, or 12 digits only"
    },
    {
      key: "website",
      type: "string",
      label: "Website",
      description: "Max 500 characters"
    },
    {
      key: "institution_email",
      type: "string",
      label: "Institution Email",
      description: "Max 100 characters, valid email format"
    },

    // Visibility Settings
    {
      key: "record_viewable_by_provider",
      type: "enum",
      label: "Record Viewable by Provider",
      config: {
        options: [
          { value: "T", label: "True" },
          { value: "F", label: "False" }
        ]
      }
    },
    {
      key: "file_viewable_by_provider",
      type: "enum",
      label: "File Viewable by Provider",
      config: {
        options: [
          { value: "T", label: "True" },
          { value: "F", label: "False" }
        ]
      }
    },

    // System Fields
    {
      key: "file_key",
      type: "string",
      label: "File Key",
      description: "Must be valid GUID format"
    },
    {
      key: "note",
      type: "string",
      label: "Note",
      description: "Max 10,000 characters"
    },
    {
      key: "user",
      type: "string",
      label: "User"
    },
    {
      key: "timestamp",
      type: "date",
      label: "TimeStamp"
    }
  ],
  actions: [
    {
      operation: "validateAffiliation",
      mode: "foreground",
      label: "Validate Affiliation Data",
      description: "Validate affiliation records against business rules"
    }
  ]
};