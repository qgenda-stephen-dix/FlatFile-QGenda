import { Flatfile } from "@flatfile/api";

// External ID Type enumeration for Professional Training Import Format
export const externalIdTypeEnum = [
  { value: "NPI", label: "NPI" },
  { value: "InternalID", label: "InternalID" },
  { value: "ProviderID", label: "ProviderID" },
  { value: "EmrID", label: "EmrID" },
  { value: "BillingSystemID", label: "BillingSystemID" }
];

// Training Type enumeration
export const trainingTypeEnum = [
  { value: "Internship", label: "Internship" },
  { value: "Residency", label: "Residency" },
  { value: "Internship/Residency", label: "Internship/Residency" },
  { value: "Chief Residency", label: "Chief Residency" },
  { value: "Fellowship", label: "Fellowship" },
  { value: "Post Doctoral Fellowship", label: "Post Doctoral Fellowship" },
  { value: "Faculty Position/Academic Employment", label: "Faculty Position/Academic Employment" },
  { value: "Other", label: "Other" }
];

// Training Status enumeration
export const trainingStatusEnum = [
  { value: "", label: "" },
  { value: "Completed", label: "Completed" },
  { value: "Enrolled", label: "Enrolled" },
  { value: "In Progress", label: "In Progress" },
  { value: "Not Completed", label: "Not Completed" }
];

// T/F enumeration for viewability and ACGME fields
export const trueFalseEnum = [
  { value: "", label: "" },
  { value: "T", label: "T" },
  { value: "F", label: "F" }
];

// Y/N enumeration for Ignore Required Fields Validation
export const yesNoEnum = [
  { value: "", label: "" },
  { value: "Y", label: "Y" },
  { value: "N", label: "N" }
];

// Professional Training Import Format sheet configuration
export const professionalTrainingSheet: Flatfile.SheetConfig = {
  name: "Professional Training Import Format",
  slug: "professional_training",
  access: ["*"],
  fields: [
    // Key Fields - Required
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
      key: "training_type",
      type: "enum",
      label: "Training Type",
      description: "Required field - Key field for updating. Must match dropdown values",
      constraints: [
        {
          type: "required"
        }
      ],
      config: {
        options: trainingTypeEnum
      }
    },
    {
      key: "department_program",
      type: "string",
      label: "Department / Program",
      description: "Key field for updating - Max 100 characters"
    },
    {
      key: "specialty",
      type: "string",
      label: "Specialty",
      description: "Key field for updating - Max 100 characters. Must exist in Setup > List Management > Specialty"
    },

    // Institution Information
    {
      key: "institution_hospital_name",
      type: "string",
      label: "Institution / Hospital Name",
      description: "Key field for updating"
    },
    {
      key: "institution_email",
      type: "string",
      label: "Institution Email",
      description: "Must adhere to username@domain.com format"
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
      key: "state",
      type: "string",
      label: "State",
      description: "Max 50 characters, no non-ASCII characters, must match subdivision dropdown"
    },
    {
      key: "zip",
      type: "string",
      label: "Zip",
      description: "Must be 5, 6, or 9 digits"
    },
    {
      key: "country",
      type: "string",
      label: "Country",
      description: "Max 100 characters, must match Country dropdown"
    },

    // Contact Information
    {
      key: "institution_phone_number",
      type: "string",
      label: "Institution Phone Number",
      description: "Must be 9, 10, or 12 digits only (no formatting)"
    },
    {
      key: "ext",
      type: "string",
      label: "Ext.",
      description: "Must be a number up to 20 digits in length"
    },
    {
      key: "fax",
      type: "string",
      label: "Fax",
      description: "Must be 9, 10, or 12 digits only (no formatting)"
    },

    // Director Information
    {
      key: "directors_name",
      type: "string",
      label: "Director's Name",
      description: "Key field for updating - Max 100 characters"
    },
    {
      key: "phone_number",
      type: "string",
      label: "Phone Number",
      description: "Key field for updating - Must be 9, 10, or 12 digits only (no formatting)"
    },
    {
      key: "email",
      type: "string",
      label: "Email",
      description: "Must adhere to username@domain.com format"
    },

    // Training Dates and Status
    {
      key: "start_date",
      type: "string",
      label: "Start Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "end_date",
      type: "string",
      label: "End Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "training_status",
      type: "enum",
      label: "Training Status",
      description: "Optional - Must be: Completed / Enrolled / In Progress / Not Completed",
      config: {
        options: trainingStatusEnum
      }
    },
    {
      key: "anticipated_completion_date",
      type: "string",
      label: "Anticipated Completion Date",
      description: "Must be formatted as m/d/yyyy"
    },

    // Configuration Fields
    {
      key: "record_viewable_by_provider",
      type: "enum",
      label: "Record Viewable by Provider",
      description: "Must be T or F if provided",
      config: {
        options: trueFalseEnum
      }
    },
    {
      key: "acgme",
      type: "enum",
      label: "ACGME",
      description: "Must be T, F, or NULL if provided",
      config: {
        options: trueFalseEnum
      }
    },
    {
      key: "website",
      type: "string",
      label: "Website",
      description: "Must be valid URL format - Max 500 characters"
    },
    {
      key: "file_viewable_by_provider",
      type: "enum",
      label: "File Viewable by Provider",
      description: "Must be T or F if provided",
      config: {
        options: trueFalseEnum
      }
    },
    {
      key: "ignore_required_fields_validation",
      type: "enum",
      label: "Ignore Required Fields Validation?",
      description: "Must be Y or N if provided",
      config: {
        options: yesNoEnum
      }
    },

    // File and System Fields
    {
      key: "file_key",
      type: "string",
      label: "File Key",
      description: "Must be valid GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)"
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
      label: "User",
      description: "Must validate against Cred Spec emails. Defaults to 'Credentialing System' if empty"
    },
    {
      key: "timestamp",
      type: "string",
      label: "TimeStamp",
      description: "Must be formatted as m/d/yyyy"
    }
  ],
  actions: [
    {
      operation: "professionalTrainingValidateAction",
      mode: "background",
      label: "Validate Professional Training Data",
      description: "Run comprehensive validation on Professional Training Import Format data including provider matching, specialty validation, and training type verification"
    }
  ]
};