import { Flatfile } from "@flatfile/api";

export const demographicSheet: Flatfile.SheetConfig = {
  name: "Demographic",
  slug: "demographic",
  fields: [
    // Identity Fields
    {
      key: "external_id",
      type: "string",
      label: "External ID",
      description: "External identifier for the provider"
    },
    {
      key: "external_id_type",
      type: "string",
      label: "External ID Type",
      description: "Type of external identifier"
    },
    {
      key: "provider_id",
      type: "string",
      label: "Provider ID",
      description: "Internal provider identifier"
    },
    {
      key: "internal_id",
      type: "string",
      label: "Internal ID",
      description: "Internal system identifier"
    },
    {
      key: "npi",
      type: "string",
      label: "NPI",
      description: "National Provider Identification Number",
      constraints: [
        { type: "required" }
      ]
    },

    // Personal Information
    {
      key: "salutation",
      type: "enum",
      label: "Salutation",
      config: {
        options: [
          { value: "Dr.", label: "Dr." },
          { value: "Mr.", label: "Mr." },
          { value: "Mrs.", label: "Mrs." },
          { value: "Ms.", label: "Ms." },
          { value: "Prof.", label: "Prof." }
        ]
      }
    },
    {
      key: "pronouns",
      type: "string",
      label: "Pronouns",
      description: "Preferred pronouns (e.g., he/him, she/her, they/them)"
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
      type: "string",
      label: "Suffix",
      description: "Name suffix (Jr., Sr., III, etc.)"
    },
    {
      key: "preferred_name",
      type: "string",
      label: "Preferred Name",
      description: "Name the provider prefers to be called"
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
      type: "string",
      label: "Alternate Name Suffix"
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

    // Demographics
    {
      key: "birth_date",
      type: "date",
      label: "Birth Date",
      constraints: [{ type: "required" }]
    },
    {
      key: "gender",
      type: "enum",
      label: "Gender",
      config: {
        options: [
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Non-binary", label: "Non-binary" },
          { value: "Other", label: "Other" },
          { value: "Prefer not to say", label: "Prefer not to say" }
        ]
      }
    },
    {
      key: "ethnicity",
      type: "string",
      label: "Ethnicity"
    },
    {
      key: "ssn",
      type: "string",
      label: "SSN",
      description: "Social Security Number"
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

    // Professional Information
    {
      key: "provider_type",
      type: "enum",
      label: "Provider Type",
      config: {
        options: [
          { value: "Physician", label: "Physician" },
          { value: "Nurse Practitioner", label: "Nurse Practitioner" },
          { value: "Physician Assistant", label: "Physician Assistant" },
          { value: "Therapist", label: "Therapist" },
          { value: "Other", label: "Other" }
        ]
      }
    },
    {
      key: "specialty",
      type: "string",
      label: "Specialty",
      description: "Primary medical specialty"
    },
    {
      key: "subspecialty",
      type: "string",
      label: "Subspecialty",
      description: "Medical subspecialty"
    },
    {
      key: "taxonomy",
      type: "string",
      label: "Taxonomy",
      description: "Healthcare Provider Taxonomy Code"
    },
    {
      key: "preferred_credentials",
      type: "string",
      label: "Preferred Credentials",
      description: "Professional credentials to display"
    },

    // Employment Information
    {
      key: "corporate_employment_type",
      type: "enum",
      label: "Employment Type",
      config: {
        options: [
          { value: "Full-time", label: "Full-time" },
          { value: "Part-time", label: "Part-time" },
          { value: "Contract", label: "Contract" },
          { value: "Locum Tenens", label: "Locum Tenens" },
          { value: "Consulting", label: "Consulting" }
        ]
      }
    },
    {
      key: "supervising_physician_name",
      type: "string",
      label: "Supervising Physician Name"
    },
    {
      key: "time_in_position_start_date",
      type: "date",
      label: "Position Start Date"
    },
    {
      key: "time_in_position_end_date",
      type: "date",
      label: "Position End Date"
    },

    // Contact Information
    {
      key: "login_email",
      type: "string",
      label: "Login/Contact Email",
      constraints: [
        { type: "required" }
      ]
    },
    {
      key: "other_email",
      type: "string",
      label: "Other Email"
    },
    {
      key: "home_phone",
      type: "string",
      label: "Home Phone"
    },
    {
      key: "mobile_phone",
      type: "string",
      label: "Mobile Phone"
    },
    {
      key: "pager",
      type: "string",
      label: "Pager"
    },
    {
      key: "preferred_contact_method",
      type: "enum",
      label: "Preferred Contact Method",
      config: {
        options: [
          { value: "Email", label: "Email" },
          { value: "Phone", label: "Phone" },
          { value: "Mobile", label: "Mobile" },
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
      label: "ZIP Code"
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

    // Insurance/Government IDs
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
      description: "Unique Physician Identification Number"
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

    // Additional IDs
    {
      key: "emr_id",
      type: "string",
      label: "EMR ID",
      description: "Electronic Medical Record ID"
    },
    {
      key: "sso_id",
      type: "string",
      label: "SSO ID",
      description: "Single Sign-On ID"
    },

    // Personal Details
    {
      key: "citizenship",
      type: "string",
      label: "Citizenship"
    },
    {
      key: "work_visa_type",
      type: "string",
      label: "Work Visa Type"
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
    {
      key: "marital_status",
      type: "enum",
      label: "Marital Status",
      config: {
        options: [
          { value: "Single", label: "Single" },
          { value: "Married", label: "Married" },
          { value: "Divorced", label: "Divorced" },
          { value: "Widowed", label: "Widowed" },
          { value: "Separated", label: "Separated" },
          { value: "Domestic Partnership", label: "Domestic Partnership" }
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
      label: "Spouse Phone Number"
    },

    // Professional Preferences
    {
      key: "accepting_new_patients",
      type: "boolean",
      label: "Accepting New Patients"
    },
    {
      key: "languages_spoken",
      type: "string",
      label: "Languages Spoken",
      description: "Comma-separated list of languages"
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
      key: "emergency_contact_phone",
      type: "string",
      label: "Emergency Contact Phone"
    },
    {
      key: "emergency_contact_email",
      type: "string",
      label: "Emergency Contact Email"
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
          { value: "Army", label: "Army" },
          { value: "Navy", label: "Navy" },
          { value: "Air Force", label: "Air Force" },
          { value: "Marines", label: "Marines" },
          { value: "Coast Guard", label: "Coast Guard" },
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
          { value: "Reserve", label: "Reserve" },
          { value: "Veteran", label: "Veteran" },
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
      label: "Assistant Phone"
    },

    // Credentialing
    {
      key: "affiliation_verification_available",
      type: "boolean",
      label: "Affiliation Verification Available"
    },
    {
      key: "primary_credentialing_specialist_email",
      type: "string",
      label: "Primary Credentialing Specialist Email"
    }
  ],
  actions: [
    {
      operation: "validateProvider",
      mode: "foreground",
      label: "Validate Provider",
      description: "Validate provider demographic information"
    }
  ]
};
