import { Flatfile } from "@flatfile/api";

export const providerDemographicImportSheet: Flatfile.SheetConfig = {
  name: "Provider Demographic Import Format",
  slug: "provider-demographic-import",
  access: ["*"],
  fields: [
    // Following exact specification order
    {
      key: "External ID",
      type: "string",
      label: "External ID",
      description: "Leave blank to create new provider. Required for updates."
    },
    {
      key: "External ID Type",
      type: "enum",
      label: "External ID Type",
      description: "Leave blank to create new provider. Required for updates.",
      config: {
        options: [
          { value: "NPI", label: "NPI" },
          { value: "InternalID", label: "InternalID" },
          { value: "ProviderID", label: "ProviderID" },
          { value: "EmrID", label: "EmrID" }
        ]
      }
    },
    {
      key: "Salutation",
      type: "enum",
      label: "Salutation",
      description: "Salutation prefix",
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
      key: "Pronouns",
      type: "enum",
      label: "Pronouns",
      description: "Preferred pronouns",
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
      key: "First Name",
      type: "string",
      label: "First Name",
      description: "Required Field - Maximum 50 characters",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "middle_name",
      type: "string",
      label: "Middle Name",
      description: "Maximum 50 characters"
    },
    {
      key: "last_name",
      type: "string",
      label: "Last Name",
      description: "Required Field - Maximum 50 characters",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "alternate_first_name",
      type: "string",
      label: "Alternate First Name",
      description: "Maximum 50 characters"
    },
    {
      key: "alternate_middle_name",
      type: "string",
      label: "Alternate Middle Name",
      description: "Maximum 50 characters"
    },
    {
      key: "alternate_last_name",
      type: "string",
      label: "Alternate Last Name",
      description: "Maximum 50 characters"
    },
    {
      key: "alternate_name_start_date",
      type: "date",
      label: "Alternate Name Start Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "alternate_name_end_date",
      type: "date",
      label: "Alternate Name End Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "provider_type",
      type: "string",
      label: "Provider Type",
      description: "Must match company-defined provider types. Required for new providers."
    },
    {
      key: "npi",
      type: "string",
      label: "National Provider Identification Number (NPI)",
      description: "Must be exactly 10 digits"
    },
    {
      key: "auto_verify_npi",
      type: "enum",
      label: "Auto-Verify NPI?",
      description: "Auto-verify NPI setting",
      config: {
        options: [
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" }
        ]
      }
    },
    {
      key: "ssn",
      type: "string",
      label: "Social Security Number (SSN)",
      description: "Must be 9 digits (###-##-####)"
    },
    {
      key: "birth_date",
      type: "date",
      label: "Birth Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "country_of_birth",
      type: "string",
      label: "Country of Birth",
      description: "Maximum 100 characters - must match company settings"
    },
    {
      key: "state_of_birth",
      type: "string",
      label: "State of Birth",
      description: "Maximum 50 characters - must be valid subdivision for country"
    },
    {
      key: "city_of_birth",
      type: "string",
      label: "City of Birth",
      description: "Maximum 100 characters"
    },
    {
      key: "gender",
      type: "enum",
      label: "Gender",
      description: "Gender identification",
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
      description: "Ethnicity classification",
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
    {
      key: "citizenship",
      type: "string",
      label: "Citizenship",
      description: "Maximum 100 characters"
    },
    {
      key: "work_visa_type",
      type: "enum",
      label: "Work Visa Type",
      description: "Work visa classification",
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
      label: "Visa Expiration",
      description: "Must be formatted as m/d/yyyy. Requires Work Visa Type."
    },
    {
      key: "visa_number",
      type: "string",
      label: "Visa Number",
      description: "Maximum 20 characters. Requires Work Visa Type."
    },
    {
      key: "accepting_new_patients",
      type: "enum",
      label: "Accepting New Patients",
      description: "Patient acceptance status",
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
      description: "Pipe-delimited (|) values"
    },
    {
      key: "marital_status",
      type: "enum",
      label: "Marital Status",
      description: "Marital status classification",
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
      label: "Spouse Full Name",
      description: "Maximum 256 characters"
    },
    {
      key: "corporate_employment_type",
      type: "string",
      label: "Corporate Employment Type",
      description: "Must be valid for the company"
    },
    {
      key: "supervising_physicians_name",
      type: "string",
      label: "Supervising Physician's Name",
      description: "Maximum 100 characters"
    },
    {
      key: "time_in_position_start_date",
      type: "date",
      label: "Time in this Position Start Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "time_in_position_end_date",
      type: "date",
      label: "Time in this Position End Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "specialty",
      type: "string",
      label: "Specialty",
      description: "Maximum 100 characters - must be defined in Settings > Configurable Lists"
    },
    {
      key: "subspecialty",
      type: "string",
      label: "Subspecialty",
      description: "Maximum 100 characters - must be defined in Settings > Configurable Lists"
    },
    {
      key: "taxonomy",
      type: "string",
      label: "Taxonomy",
      description: "Maximum 100 characters"
    },
    {
      key: "medicare_number",
      type: "string",
      label: "Medicare Number",
      description: "Maximum 50 characters"
    },
    {
      key: "medicaid_number",
      type: "string",
      label: "Medicaid Number",
      description: "Maximum 50 characters"
    },
    {
      key: "login_email",
      type: "string",
      label: "Login Email/Contact Email",
      description: "Maximum 128 characters - must be valid email format"
    },
    {
      key: "other_email",
      type: "string",
      label: "Other Email",
      description: "Maximum 100 characters - must be valid email format"
    },
    {
      key: "home_phone",
      type: "string",
      label: "Home Phone",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "mobile_phone",
      type: "string",
      label: "Mobile Phone",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "pager",
      type: "string",
      label: "Pager",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "preferred_contact_method",
      type: "enum",
      label: "Preferred Contact Method",
      description: "Preferred method of contact",
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
      key: "state",
      type: "string",
      label: "State",
      description: "Must match state drop-down (abbreviation)"
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
      description: "Maximum 100 characters"
    },
    {
      key: "emergency_contact_first_name",
      type: "string",
      label: "Emergency Contact First Name",
      description: "Maximum 100 characters"
    },
    {
      key: "emergency_contact_last_name",
      type: "string",
      label: "Emergency Contact Last Name",
      description: "Maximum 100 characters"
    },
    {
      key: "emergency_contact_phone_number",
      type: "string",
      label: "Emergency Contact Phone Number",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "emergency_contact_email",
      type: "string",
      label: "Emergency Contact Email",
      description: "Maximum 100 characters - must be valid email format"
    },
    {
      key: "tax_id",
      type: "string",
      label: "Tax ID",
      description: "Maximum 100 characters"
    },
    {
      key: "tax_name",
      type: "string",
      label: "Tax Name",
      description: "Maximum 100 characters"
    },
    {
      key: "provider_id",
      type: "string",
      label: "Provider ID",
      description: "Maximum 64 characters"
    },
    {
      key: "internal_id",
      type: "string",
      label: "Internal ID",
      description: "Maximum 100 characters"
    },
    {
      key: "emr_id",
      type: "string",
      label: "EMR ID",
      description: "Maximum 64 characters"
    },
    {
      key: "sso_id",
      type: "string",
      label: "SSO ID",
      description: "Single Sign-On identifier"
    },
    {
      key: "suffix",
      type: "enum",
      label: "Suffix",
      description: "Name suffix",
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
      label: "Preferred Name",
      description: "Maximum 256 characters"
    },
    {
      key: "alternate_name_suffix",
      type: "enum",
      label: "Alternate Name Suffix",
      description: "Alternate name suffix",
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
      key: "upin",
      type: "string",
      label: "UPIN",
      description: "Must be 6 character alphanumeric value"
    },
    {
      key: "county_of_birth",
      type: "string",
      label: "County of Birth",
      description: "Maximum 100 characters"
    },
    {
      key: "spouse_phone_number",
      type: "string",
      label: "Spouse Phone Number",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "military_start_date",
      type: "date",
      label: "Military Start Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "military_end_date",
      type: "date",
      label: "Military End Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "military_branch",
      type: "enum",
      label: "Military Branch",
      description: "Military service branch",
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
      description: "Military service status",
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
      label: "Military Title",
      description: "Maximum 200 characters"
    },
    {
      key: "county",
      type: "string",
      label: "County",
      description: "Maximum 100 characters"
    },
    {
      key: "assistant_name",
      type: "string",
      label: "Assistant Name",
      description: "Maximum 256 characters"
    },
    {
      key: "assistant_email",
      type: "string",
      label: "Assistant Email",
      description: "Maximum 100 characters - must be valid email format"
    },
    {
      key: "assistant_phone",
      type: "string",
      label: "Assistant Phone",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "preferred_credentials",
      type: "string",
      label: "Preferred Credentials",
      description: "Maximum 50 characters"
    },
    {
      key: "affiliation_verification_available",
      type: "enum",
      label: "Affiliation Verification Available",
      description: "Affiliation verification status",
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
      label: "Primary Credentialing Specialist Email",
      description: "Maximum 200 characters - must be valid email format"
    },
    {
      key: "disable_expiring_notifications",
      type: "enum",
      label: "Disable Expiring Notifications",
      description: "Notification preference setting",
      config: {
        options: [
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" }
        ]
      }
    },
    {
      key: "race",
      type: "string",
      label: "Race",
      description: "Must match drop-down values in system"
    },
    
    // Provider User Defined Fields - these are positioned as per specification
    // X1-X10 custom fields
    {
      key: "x1",
      type: "string",
      label: "X1",
      description: "User defined field 1"
    },
    {
      key: "x2", 
      type: "string",
      label: "X2",
      description: "User defined field 2"
    },
    {
      key: "x3",
      type: "string", 
      label: "X3",
      description: "User defined field 3"
    },
    {
      key: "x4",
      type: "string",
      label: "X4", 
      description: "User defined field 4"
    },
    {
      key: "x5",
      type: "string",
      label: "X5",
      description: "User defined field 5"
    },
    {
      key: "x6",
      type: "string",
      label: "X6",
      description: "User defined field 6"
    },
    {
      key: "x7",
      type: "string",
      label: "X7",
      description: "User defined field 7"
    },
    {
      key: "x8",
      type: "string",
      label: "X8",
      description: "User defined field 8"
    },
    {
      key: "x9",
      type: "string",
      label: "X9",
      description: "User defined field 9"
    },
    {
      key: "x10",
      type: "string",
      label: "X10",
      description: "User defined field 10"
    }
  ]
};