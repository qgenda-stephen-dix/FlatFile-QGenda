import { Flatfile } from "@flatfile/api";

export const demographicV2Sheet: Flatfile.SheetConfig = {
  name: "Demographic V2",
  slug: "demographic_v2",
  fields: [
    // Key Identity Fields
    {
      key: "external_id",
      type: "string",
      label: "External ID",
      description: "Leave blank to create new provider"
    },
    {
      key: "external_id_type",
      type: "enum",
      label: "External ID Type", 
      description: "Leave blank to create new provider",
      config: {
        options: [
          { value: "NPI", label: "NPI" },
          { value: "InternalID", label: "Internal ID" },
          { value: "ProviderID", label: "Provider ID" },
          { value: "EmrID", label: "EMR ID" }
        ]
      }
    },

    // Personal Information - Required Fields
    {
      key: "salutation",
      type: "enum",
      label: "Salutation",
      config: {
        options: [
          { value: "Mr.", label: "Mr." },
          { value: "Ms.", label: "Ms." },
          { value: "Mrs.", label: "Mrs." },
          { value: "Dr.", label: "Dr." }
        ]
      }
    },
    {
      key: "pronouns",
      type: "enum",
      label: "Pronouns",
      config: {
        options: [
          { value: "She/Her/Hers", label: "She/Her/Hers" },
          { value: "He/Him/His", label: "He/Him/His" },
          { value: "They/Them/Theirs", label: "They/Them/Theirs" },
          { value: "Ze/Hir/Hirs", label: "Ze/Hir/Hirs" }
        ]
      }
    },
    {
      key: "first_name",
      type: "string",
      label: "First Name",
      constraints: [{ type: "required" }]
    },
    {
      key: "middle_name",
      type: "string",
      label: "Middle Name"
    },
    {
      key: "last_name",
      type: "string",
      label: "Last Name",
      constraints: [{ type: "required" }]
    },
    {
      key: "suffix",
      type: "enum",
      label: "Suffix",
      config: {
        options: [
          { value: "Sr", label: "Sr" },
          { value: "Jr", label: "Jr" },
          { value: "II", label: "II" },
          { value: "III", label: "III" },
          { value: "IV", label: "IV" }
        ]
      }
    },
    {
      key: "preferred_name",
      type: "string",
      label: "Preferred Name"
    },

    // Alternate Name Information
    {
      key: "alternate_first_name",
      type: "string",
      label: "Alternate First Name"
    },
    {
      key: "alternate_middle_name",
      type: "string",
      label: "Alternate Middle Name"
    },
    {
      key: "alternate_last_name",
      type: "string",
      label: "Alternate Last Name"
    },
    {
      key: "alternate_name_suffix",
      type: "enum",
      label: "Alternate Name Suffix",
      config: {
        options: [
          { value: "Sr", label: "Sr" },
          { value: "Jr", label: "Jr" },
          { value: "II", label: "II" },
          { value: "III", label: "III" },
          { value: "IV", label: "IV" }
        ]
      }
    },
    {
      key: "alternate_name_start_date",
      type: "date",
      label: "Alternate Name Start Date"
    },
    {
      key: "alternate_name_end_date",
      type: "date",
      label: "Alternate Name End Date"
    },

    // Professional Information
    {
      key: "provider_type",
      type: "string",
      label: "Provider Type",
      description: "Required for new providers"
    },
    {
      key: "npi",
      type: "string",
      label: "National Provider Identification Number (NPI)",
      description: "Must be exactly 10 digits"
    },
    {
      key: "auto_verify_npi",
      type: "boolean",
      label: "Auto-Verify NPI?"
    },
    {
      key: "specialty",
      type: "string",
      label: "Specialty"
    },
    {
      key: "subspecialty",
      type: "string",
      label: "Subspecialty"
    },
    {
      key: "taxonomy",
      type: "string",
      label: "Taxonomy"
    },
    {
      key: "preferred_credentials",
      type: "string",
      label: "Preferred Credentials"
    },

    // Personal Demographics
    {
      key: "ssn",
      type: "string",
      label: "Social Security Number (SSN)",
      description: "Must be exactly 9 digits"
    },
    {
      key: "birth_date",
      type: "date",
      label: "Birth Date"
    },
    {
      key: "gender",
      type: "enum",
      label: "Gender",
      config: {
        options: [
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Transgender", label: "Transgender" },
          { value: "Not Specified", label: "Not Specified" }
        ]
      }
    },
    {
      key: "ethnicity",
      type: "enum",
      label: "Ethnicity",
      config: {
        options: [
          { value: "American Indian or Alaska Native", label: "American Indian or Alaska Native" },
          { value: "Black or African American", label: "Black or African American" },
          { value: "Hispanic or Latino", label: "Hispanic or Latino" },
          { value: "Native Hawaiian or Pacific Islander", label: "Native Hawaiian or Pacific Islander" },
          { value: "White", label: "White" }
        ]
      }
    },

    // Birth Location
    {
      key: "country_of_birth",
      type: "string",
      label: "Country of Birth"
    },
    {
      key: "state_of_birth",
      type: "string",
      label: "State of Birth"
    },
    {
      key: "city_of_birth",
      type: "string",
      label: "City of Birth"
    },
    {
      key: "county_of_birth",
      type: "string",
      label: "County of Birth"
    },

    // Immigration Information
    {
      key: "citizenship",
      type: "reference",
      label: "Citizenship",
      config: {
        ref: "demographic_reference",
        key: "demographic_id",
        relationship: "has-one"
      }
    },
    {
      key: "citizenship_name",
      type: "string",
      label: "Citizenship Name",
      constraints: [{ type: "computed" }],
      readonly: true,
      description: "Auto-populated based on selected citizenship"
    },
    {
      key: "work_visa_type",
      type: "enum",
      label: "Work Visa Type",
      config: {
        options: [
          { value: "H-1B", label: "H-1B" },
          { value: "H-2B", label: "H-2B" },
          { value: "H-3B", label: "H-3B" },
          { value: "L", label: "L" },
          { value: "O", label: "O" },
          { value: "P", label: "P" },
          { value: "R", label: "R" },
          { value: "TN", label: "TN" }
        ]
      }
    },
    {
      key: "visa_expiration",
      type: "date",
      label: "Visa Expiration"
    },
    {
      key: "visa_number",
      type: "string",
      label: "Visa Number"
    },

    // Professional Preferences
    {
      key: "accepting_new_patients",
      type: "enum",
      label: "Accepting New Patients",
      config: {
        options: [
          { value: "None", label: "None" },
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" }
        ]
      }
    },
    {
      key: "languages_spoken",
      type: "string",
      label: "Languages Spoken",
      description: "Pipe-delimited list (|)"
    },

    // Personal Information
    {
      key: "marital_status",
      type: "enum",
      label: "Marital Status",
      config: {
        options: [
          { value: "Single", label: "Single" },
          { value: "Married", label: "Married" },
          { value: "Divorced", label: "Divorced" },
          { value: "Separated", label: "Separated" },
          { value: "Widowed", label: "Widowed" }
        ]
      }
    },
    {
      key: "spouse_full_name",
      type: "string",
      label: "Spouse Full Name"
    },
    {
      key: "spouse_phone_number",
      type: "string",
      label: "Spouse Phone Number",
      description: "9, 10, or 12 digits only"
    },

    // Employment Information
    {
      key: "corporate_employment_type",
      type: "string",
      label: "Corporate Employment Type"
    },
    {
      key: "supervising_physician_name",
      type: "string",
      label: "Supervising Physician's Name"
    },
    {
      key: "time_in_position_start_date",
      type: "date",
      label: "Time in this Position Start Date"
    },
    {
      key: "time_in_position_end_date",
      type: "date",
      label: "Time in this Position End Date"
    },

    // Government IDs
    {
      key: "medicare_number",
      type: "string",
      label: "Medicare Number"
    },
    {
      key: "medicaid_number",
      type: "string",
      label: "Medicaid Number"
    },
    {
      key: "upin",
      type: "string",
      label: "UPIN",
      description: "Must be exactly 6 alphanumeric characters"
    },

    // Contact Information
    {
      key: "login_email",
      type: "string",
      label: "Login Email/Contact Email"
    },
    {
      key: "other_email",
      type: "string",
      label: "Other Email"
    },
    {
      key: "home_phone",
      type: "string",
      label: "Home Phone",
      description: "9, 10, or 12 digits only"
    },
    {
      key: "mobile_phone",
      type: "string",
      label: "Mobile Phone",
      description: "9, 10, or 12 digits only"
    },
    {
      key: "pager",
      type: "string",
      label: "Pager",
      description: "9, 10, or 12 digits only"
    },
    {
      key: "preferred_contact_method",
      type: "enum",
      label: "Preferred Contact Method",
      config: {
        options: [
          { value: "Login Email", label: "Login Email" },
          { value: "Other Email", label: "Other Email" },
          { value: "Home Phone", label: "Home Phone" },
          { value: "Mobile Phone", label: "Mobile Phone" },
          { value: "Pager", label: "Pager" }
        ]
      }
    },

    // Address Information
    {
      key: "address_line_1",
      type: "string",
      label: "Address Line 1"
    },
    {
      key: "address_line_2",
      type: "string",
      label: "Address Line 2"
    },
    {
      key: "city",
      type: "string",
      label: "City"
    },
    {
      key: "state",
      type: "string",
      label: "State"
    },
    {
      key: "zip",
      type: "string",
      label: "Zip"
    },
    {
      key: "country",
      type: "string",
      label: "Country"
    },
    {
      key: "county",
      type: "string",
      label: "County"
    },

    // Emergency Contact
    {
      key: "emergency_contact_first_name",
      type: "string",
      label: "Emergency Contact First Name"
    },
    {
      key: "emergency_contact_last_name",
      type: "string",
      label: "Emergency Contact Last Name"
    },
    {
      key: "emergency_contact_phone_number",
      type: "string",
      label: "Emergency Contact Phone Number",
      description: "9, 10, or 12 digits only"
    },
    {
      key: "emergency_contact_email",
      type: "string",
      label: "Emergency Contact Email"
    },

    // Tax Information
    {
      key: "tax_id",
      type: "string",
      label: "Tax ID"
    },
    {
      key: "tax_name",
      type: "string",
      label: "Tax Name"
    },

    // System IDs
    {
      key: "provider_id",
      type: "string",
      label: "Provider ID"
    },
    {
      key: "internal_id",
      type: "string",
      label: "Internal ID"
    },
    {
      key: "emr_id",
      type: "string",
      label: "EMR ID"
    },
    {
      key: "sso_id",
      type: "string",
      label: "SSO ID"
    },

    // Military Information
    {
      key: "military_start_date",
      type: "date",
      label: "Military Start Date"
    },
    {
      key: "military_end_date",
      type: "date",
      label: "Military End Date"
    },
    {
      key: "military_branch",
      type: "enum",
      label: "Military Branch",
      config: {
        options: [
          { value: "Air Force", label: "Air Force" },
          { value: "Army", label: "Army" },
          { value: "Coast Guard", label: "Coast Guard" },
          { value: "Marine Corps", label: "Marine Corps" },
          { value: "Military Resident", label: "Military Resident" },
          { value: "Navy", label: "Navy" },
          { value: "Other Government Provider", label: "Other Government Provider" },
          { value: "Space Force", label: "Space Force" }
        ]
      }
    },
    {
      key: "military_status",
      type: "enum",
      label: "Military Status",
      config: {
        options: [
          { value: "Active", label: "Active" },
          { value: "Government Civilian", label: "Government Civilian" },
          { value: "Guard", label: "Guard" },
          { value: "Inactive", label: "Inactive" },
          { value: "Reserve", label: "Reserve" },
          { value: "Retired", label: "Retired" }
        ]
      }
    },
    {
      key: "military_title",
      type: "string",
      label: "Military Title"
    },

    // Assistant Information
    {
      key: "assistant_name",
      type: "string",
      label: "Assistant Name"
    },
    {
      key: "assistant_email",
      type: "string",
      label: "Assistant Email"
    },
    {
      key: "assistant_phone",
      type: "string",
      label: "Assistant Phone",
      description: "9, 10, or 12 digits only"
    },

    // Credentialing
    {
      key: "affiliation_verification_available",
      type: "enum",
      label: "Affiliation Verification Available",
      config: {
        options: [
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" }
        ]
      }
    },
    {
      key: "primary_credentialing_specialist_email",
      type: "string",
      label: "Primary Credentialing Specialist Email"
    },
    {
      key: "disable_expiring_notifications",
      type: "enum",
      label: "Disable Expiring Notifications",
      config: {
        options: [
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" }
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
      operation: "validateDemographicV2",
      mode: "foreground",
      label: "Validate Provider Demographics",
      description: "Comprehensive validation of provider demographic information"
    }
  ]
};
