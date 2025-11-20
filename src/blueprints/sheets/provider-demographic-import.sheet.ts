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
      key: "Middle Name",
      type: "string",
      label: "Middle Name",
      description: "Maximum 50 characters"
    },
    {
      key: "Last Name",
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
      key: "Alternate First Name",
      type: "string",
      label: "Alternate First Name",
      description: "Maximum 50 characters"
    },
    {
      key: "Alternate Middle Name",
      type: "string",
      label: "Alternate Middle Name",
      description: "Maximum 50 characters"
    },
    {
      key: "Alternate Last Name",
      type: "string",
      label: "Alternate Last Name",
      description: "Maximum 50 characters"
    },
    {
      key: "Alternate Name Start Date",
      type: "date",
      label: "Alternate Name Start Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "Alternate Name End Date",
      type: "date",
      label: "Alternate Name End Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "Provider Type",
      type: "string",
      label: "Provider Type",
      description: "Must match company-defined provider types. Required for new providers."
    },
    {
      key: "National Provider Identification Number (NPI)",
      type: "string",
      label: "National Provider Identification Number (NPI)",
      description: "Must be exactly 10 digits"
    },
    {
      key: "Auto-Verify NPI?",
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
      key: "Social Security Number (SSN)",
      type: "string",
      label: "Social Security Number (SSN)",
      description: "Must be 9 digits (###-##-####)"
    },
    {
      key: "Birth Date",
      type: "date",
      label: "Birth Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "Country of Birth",
      type: "string",
      label: "Country of Birth",
      description: "Maximum 100 characters - must match company settings"
    },
    {
      key: "State of Birth",
      type: "string",
      label: "State of Birth",
      description: "Maximum 50 characters - must be valid subdivision for country"
    },
    {
      key: "City of Birth",
      type: "string",
      label: "City of Birth",
      description: "Maximum 100 characters"
    },
    {
      key: "Gender",
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
      key: "Ethnicity",
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
      key: "Citizenship",
      type: "string",
      label: "Citizenship",
      description: "Maximum 100 characters"
    },
    {
      key: "Work Visa Type",
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
      key: "Visa Expiration",
      type: "date",
      label: "Visa Expiration",
      description: "Must be formatted as m/d/yyyy. Requires Work Visa Type."
    },
    {
      key: "Visa Number",
      type: "string",
      label: "Visa Number",
      description: "Maximum 20 characters. Requires Work Visa Type."
    },
    {
      key: "Accepting New Patients",
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
      key: "Languages Spoken",
      type: "string",
      label: "Languages Spoken",
      description: "Pipe-delimited (|) values"
    },
    {
      key: "Marital Status",
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
      key: "Spouse Full Name",
      type: "string",
      label: "Spouse Full Name",
      description: "Maximum 256 characters"
    },
    {
      key: "Corporate Employment Type",
      type: "string",
      label: "Corporate Employment Type",
      description: "Must be valid for the company"
    },
    {
      key: "Supervising Physician's Name",
      type: "string",
      label: "Supervising Physician's Name",
      description: "Maximum 100 characters"
    },
    {
      key: "Time in this Position Start Date",
      type: "date",
      label: "Time in this Position Start Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "Time in this Position End Date",
      type: "date",
      label: "Time in this Position End Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "Specialty",
      type: "string",
      label: "Specialty",
      description: "Maximum 100 characters - must be defined in Settings > Configurable Lists"
    },
    {
      key: "Subspecialty",
      type: "string",
      label: "Subspecialty",
      description: "Maximum 100 characters - must be defined in Settings > Configurable Lists"
    },
    {
      key: "Taxonomy",
      type: "string",
      label: "Taxonomy",
      description: "Maximum 100 characters"
    },
    {
      key: "Medicare Number",
      type: "string",
      label: "Medicare Number",
      description: "Maximum 50 characters"
    },
    {
      key: "Medicaid Number",
      type: "string",
      label: "Medicaid Number",
      description: "Maximum 50 characters"
    },
    {
      key: "Login Email/Contact Email",
      type: "string",
      label: "Login Email/Contact Email",
      description: "Maximum 128 characters - must be valid email format"
    },
    {
      key: "Other Email",
      type: "string",
      label: "Other Email",
      description: "Maximum 100 characters - must be valid email format"
    },
    {
      key: "Home Phone",
      type: "string",
      label: "Home Phone",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "Mobile Phone",
      type: "string",
      label: "Mobile Phone",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "Pager",
      type: "string",
      label: "Pager",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "Preferred Contact Method",
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
      key: "Address Line 1",
      type: "string",
      label: "Address Line 1",
      description: "Maximum 100 characters"
    },
    {
      key: "Address Line 2",
      type: "string",
      label: "Address Line 2",
      description: "Maximum 50 characters"
    },
    {
      key: "City",
      type: "string",
      label: "City",
      description: "Maximum 50 characters"
    },
    {
      key: "State",
      type: "string",
      label: "State",
      description: "Must match state drop-down (abbreviation)"
    },
    {
      key: "Zip",
      type: "string",
      label: "Zip",
      description: "Maximum 10 alphanumeric characters"
    },
    {
      key: "Country",
      type: "string",
      label: "Country",
      description: "Maximum 100 characters"
    },
    {
      key: "Emergency Contact First Name",
      type: "string",
      label: "Emergency Contact First Name",
      description: "Maximum 100 characters"
    },
    {
      key: "Emergency Contact Last Name",
      type: "string",
      label: "Emergency Contact Last Name",
      description: "Maximum 100 characters"
    },
    {
      key: "Emergency Contact Phone Number",
      type: "string",
      label: "Emergency Contact Phone Number",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "Emergency Contact Email",
      type: "string",
      label: "Emergency Contact Email",
      description: "Maximum 100 characters - must be valid email format"
    },
    {
      key: "Tax ID",
      type: "string",
      label: "Tax ID",
      description: "Maximum 100 characters"
    },
    {
      key: "Tax Name",
      type: "string",
      label: "Tax Name",
      description: "Maximum 100 characters"
    },
    {
      key: "Provider ID",
      type: "string",
      label: "Provider ID",
      description: "Maximum 64 characters"
    },
    {
      key: "Internal ID",
      type: "string",
      label: "Internal ID",
      description: "Maximum 100 characters"
    },
    {
      key: "EMR ID",
      type: "string",
      label: "EMR ID",
      description: "Maximum 64 characters"
    },
    {
      key: "SSO ID",
      type: "string",
      label: "SSO ID",
      description: "Single Sign-On identifier"
    },
    {
      key: "Suffix",
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
      key: "Preferred Name",
      type: "string",
      label: "Preferred Name",
      description: "Maximum 256 characters"
    },
    {
      key: "Alternate Name Suffix",
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
      key: "UPIN",
      type: "string",
      label: "UPIN",
      description: "Must be 6 character alphanumeric value"
    },
    {
      key: "County of Birth",
      type: "string",
      label: "County of Birth",
      description: "Maximum 100 characters"
    },
    {
      key: "Spouse Phone Number",
      type: "string",
      label: "Spouse Phone Number",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "Military Start Date",
      type: "date",
      label: "Military Start Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "Military End Date",
      type: "date",
      label: "Military End Date",
      description: "Must be formatted as m/d/yyyy"
    },
    {
      key: "Military Branch",
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
      key: "Military Status",
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
      key: "Military Title",
      type: "string",
      label: "Military Title",
      description: "Maximum 200 characters"
    },
    {
      key: "County",
      type: "string",
      label: "County",
      description: "Maximum 100 characters"
    },
    {
      key: "Assistant Name",
      type: "string",
      label: "Assistant Name",
      description: "Maximum 256 characters"
    },
    {
      key: "Assistant Email",
      type: "string",
      label: "Assistant Email",
      description: "Maximum 100 characters - must be valid email format"
    },
    {
      key: "Assistant Phone",
      type: "string",
      label: "Assistant Phone",
      description: "Must be 9, 10, or 12-digit number without formatting"
    },
    {
      key: "Preferred Credentials",
      type: "string",
      label: "Preferred Credentials",
      description: "Maximum 50 characters"
    },
    {
      key: "Affiliation Verification Available",
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
      key: "Primary Credentialing Specialist Email",
      type: "string",
      label: "Primary Credentialing Specialist Email",
      description: "Maximum 200 characters - must be valid email format"
    },
    {
      key: "Disable Expiring Notifications",
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
      key: "Race",
      type: "string",
      label: "Race",
      description: "Must match drop-down values in system"
    },
    
    // Provider User Defined Fields - these are positioned as per specification
    // X1-X10 custom fields
    {
      key: "X1",
      type: "string",
      label: "X1",
      description: "User defined field 1"
    },
    {
      key: "X2", 
      type: "string",
      label: "X2",
      description: "User defined field 2"
    },
    {
      key: "X3",
      type: "string", 
      label: "X3",
      description: "User defined field 3"
    },
    {
      key: "X4",
      type: "string",
      label: "X4", 
      description: "User defined field 4"
    },
    {
      key: "X5",
      type: "string",
      label: "X5",
      description: "User defined field 5"
    },
    {
      key: "X6",
      type: "string",
      label: "X6",
      description: "User defined field 6"
    },
    {
      key: "X7",
      type: "string",
      label: "X7",
      description: "User defined field 7"
    },
    {
      key: "X8",
      type: "string",
      label: "X8",
      description: "User defined field 8"
    },
    {
      key: "X9",
      type: "string",
      label: "X9",
      description: "User defined field 9"
    },
    {
      key: "X10",
      type: "string",
      label: "X10",
      description: "User defined field 10"
    }
  ]
};