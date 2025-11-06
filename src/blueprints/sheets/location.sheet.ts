import { Flatfile } from "@flatfile/api";

// External ID Type enumeration for Location Import Format
export const externalIdTypeEnum = [
  { value: "Location Key", label: "Location Key" },
  { value: "Location ID", label: "Location ID" }
];

// Location Category enumeration
export const locationCategoryEnum = [
  { value: "", label: "" },
  { value: "Appointment", label: "Appointment" },
  { value: "Practice", label: "Practice" }
];

// Y/N boolean enumeration for various fields
export const yesNoEnum = [
  { value: "", label: "" },
  { value: "Y", label: "Y" },
  { value: "N", label: "N" }
];

// Location Import Format sheet configuration with 95+ fields
export const locationSheet: Flatfile.SheetConfig = {
  name: "Location Import Format",
  slug: "location",
  fields: [
    // Key Fields (2)
    {
      key: "externalId",
      type: "string",
      label: "External ID",
      description: "Required key field for updating, optional when adding (max 36 characters)",
      constraints: [{ type: "required" }]
    },
    {
      key: "externalIdType",
      type: "enum",
      label: "External ID Type",
      description: "Required key field for updating, optional when adding (Location Key or Location ID)",
      config: { options: externalIdTypeEnum },
      constraints: [{ type: "required" }]
    },

    // Basic Information (8)
    {
      key: "locationName",
      type: "string",
      label: "Location Name", 
      description: "Required field (max 100 characters)",
      constraints: [{ type: "required" }]
    },
    {
      key: "dba",
      type: "string",
      label: "DBA",
      description: "Max 100 characters"
    },
    {
      key: "legalBusinessName",
      type: "string",
      label: "Legal Business Name",
      description: "Max 100 characters"
    },
    {
      key: "corporateEntity",
      type: "string",
      label: "Corporate Entity",
      description: "Required field",
      constraints: [{ type: "required" }]
    },
    {
      key: "taxonomy",
      type: "string",
      label: "Taxonomy",
      description: "Max 100 characters"
    },
    {
      key: "specialty",
      type: "string",
      label: "Specialty",
      description: "Max 50 characters"
    },
    {
      key: "locationId",
      type: "string",
      label: "Location ID",
      description: "Use | as delimiter character. When updating, ALL Location ID's in .csv must match with ALL Location ID's for existing Location. Each Location ID needs to be unique and can only be used in one Location. Max 64 characters per ID"
    },
    {
      key: "region",
      type: "string",
      label: "Region",
      description: "Max 50 characters"
    },

    // Configuration Fields (2)
    {
      key: "affiliationVerificationAvailable",
      type: "enum",
      label: "Affiliation Verification Available",
      config: { options: yesNoEnum }
    },
    {
      key: "locationDetailIdsSameAsCorporateEntity",
      type: "enum",
      label: "Location Detail IDs Same as Corporate Entity",
      description: "If Y, .csv import ignored for all fields in Location Detail ID's section and Corporate Entity values for these fields imported instead",
      config: { options: yesNoEnum }
    },

    // Location Detail IDs (4)
    {
      key: "npiNumber",
      type: "string",
      label: "NPI Number",
      description: "Must be exactly 10 digits"
    },
    {
      key: "taxId",
      type: "string",
      label: "Tax ID",
      description: "Max 50 characters"
    },
    {
      key: "medicareId",
      type: "string",
      label: "Medicare ID",
      description: "Max 50 characters"
    },
    {
      key: "medicaidId",
      type: "string",
      label: "Medicaid ID",
      description: "Max 50 characters"
    },

    // Contact Information Section (13)
    {
      key: "contactInformationSameAsCorporateEntity",
      type: "enum",
      label: "Contact Information Same as Corporate Entity",
      description: "If Y, .csv import ignored for all fields in Contact Information section and Corporate Entity values for these fields imported instead",
      config: { options: yesNoEnum }
    },
    {
      key: "contactCountry",
      type: "string",
      label: "Contact Country",
      description: "Max 100 characters"
    },
    {
      key: "contactAddressLine1",
      type: "string",
      label: "Contact Address Line 1",
      description: "Max 100 characters"
    },
    {
      key: "contactAddressLine2",
      type: "string",
      label: "Contact Address Line 2",
      description: "Max 50 characters"
    },
    {
      key: "contactCity",
      type: "string",
      label: "Contact City",
      description: "Max 50 characters"
    },
    {
      key: "contactCounty",
      type: "string",
      label: "Contact County",
      description: "Max 100 characters"
    },
    {
      key: "contactStateProvince",
      type: "string",
      label: "Contact State/Province"
    },
    {
      key: "contactZip",
      type: "string",
      label: "Contact Zip",
      description: "Must be 5, 6, or 9 digits"
    },
    {
      key: "contactEmail",
      type: "string",
      label: "Contact Email",
      description: "Must adhere to username@domain.com format"
    },
    {
      key: "contactPhoneNumber",
      type: "string",
      label: "Contact Phone Number",
      description: "Must be 9, 10, or 12-digit number"
    },
    {
      key: "contactExt",
      type: "string",
      label: "Contact Ext.",
      description: "Must be a number up to 20 digits in length"
    },
    {
      key: "contactFax",
      type: "string",
      label: "Contact Fax",
      description: "Must be 9, 10, or 12-digit number"
    },
    {
      key: "website",
      type: "string",
      label: "Website",
      description: "Must adhere to https://www.subdomain.topdomain format"
    },

    // Correspondence Section (13)
    {
      key: "correspondenceSameAsCorporateEntity",
      type: "enum",
      label: "Correspondence Same as Corporate Entity",
      description: "If Y, .csv import ignored for all fields in Correspondence section and Corporate Entity values for these fields imported instead",
      config: { options: yesNoEnum }
    },
    {
      key: "correspondenceName",
      type: "string",
      label: "Correspondence Name",
      description: "Max 100 characters"
    },
    {
      key: "correspondenceTitle",
      type: "string",
      label: "Correspondence Title",
      description: "Max 100 characters"
    },
    {
      key: "correspondenceCountry",
      type: "string",
      label: "Correspondence Country"
    },
    {
      key: "correspondenceAddressLine1",
      type: "string",
      label: "Correspondence Address Line 1",
      description: "Max 100 characters"
    },
    {
      key: "correspondenceAddressLine2",
      type: "string",
      label: "Correspondence Address Line 2",
      description: "Max 50 characters"
    },
    {
      key: "correspondenceCity",
      type: "string",
      label: "Correspondence City",
      description: "Max 50 characters"
    },
    {
      key: "correspondenceCounty",
      type: "string",
      label: "Correspondence County",
      description: "Max 100 characters"
    },
    {
      key: "correspondenceStateProvince",
      type: "string",
      label: "Correspondence State/Province"
    },
    {
      key: "correspondenceZip",
      type: "string",
      label: "Correspondence Zip",
      description: "Must be 5, 6, or 9 digits"
    },
    {
      key: "correspondenceEmail",
      type: "string",
      label: "Correspondence Email",
      description: "Must adhere to username@domain.com format"
    },
    {
      key: "correspondencePhoneNumber",
      type: "string",
      label: "Correspondence Phone Number",
      description: "Must be 9, 10, or 12-digit number"
    },
    {
      key: "correspondenceExt",
      type: "string",
      label: "Correspondence Ext.",
      description: "Must be a number up to 20 digits in length"
    },
    {
      key: "correspondenceFax",
      type: "string",
      label: "Correspondence Fax",
      description: "Must be 9, 10, or 12-digit number"
    },

    // Operating Hours - Sunday (3)
    {
      key: "sundayStartTime",
      type: "string",
      label: "Sunday Start Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "sundayEndTime",
      type: "string",
      label: "Sunday End Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "sundayClosed",
      type: "enum",
      label: "Sunday Closed",
      description: "If Closed = Y, Start and End Times for that day ignored and not imported",
      config: { options: yesNoEnum }
    },

    // Operating Hours - Monday (3)
    {
      key: "mondayStartTime",
      type: "string",
      label: "Monday Start Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "mondayEndTime",
      type: "string",
      label: "Monday End Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "mondayClosed",
      type: "enum",
      label: "Monday Closed",
      description: "If Closed = Y, Start and End Times for that day ignored and not imported",
      config: { options: yesNoEnum }
    },

    // Operating Hours - Tuesday (3)
    {
      key: "tuesdayStartTime",
      type: "string",
      label: "Tuesday Start Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "tuesdayEndTime",
      type: "string",
      label: "Tuesday End Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "tuesdayClosed",
      type: "enum",
      label: "Tuesday Closed",
      description: "If Closed = Y, Start and End Times for that day ignored and not imported",
      config: { options: yesNoEnum }
    },

    // Operating Hours - Wednesday (3)
    {
      key: "wednesdayStartTime",
      type: "string",
      label: "Wednesday Start Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "wednesdayEndTime",
      type: "string",
      label: "Wednesday End Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "wednesdayClosed",
      type: "enum",
      label: "Wednesday Closed",
      description: "If Closed = Y, Start and End Times for that day ignored and not imported",
      config: { options: yesNoEnum }
    },

    // Operating Hours - Thursday (3)
    {
      key: "thursdayStartTime",
      type: "string",
      label: "Thursday Start Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "thursdayEndTime",
      type: "string",
      label: "Thursday End Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "thursdayClosed",
      type: "enum",
      label: "Thursday Closed",
      description: "If Closed = Y, Start and End Times for that day ignored and not imported",
      config: { options: yesNoEnum }
    },

    // Operating Hours - Friday (3)
    {
      key: "fridayStartTime",
      type: "string",
      label: "Friday Start Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "fridayEndTime",
      type: "string",
      label: "Friday End Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "fridayClosed",
      type: "enum",
      label: "Friday Closed",
      description: "If Closed = Y, Start and End Times for that day ignored and not imported",
      config: { options: yesNoEnum }
    },

    // Operating Hours - Saturday (3)
    {
      key: "saturdayStartTime",
      type: "string",
      label: "Saturday Start Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "saturdayEndTime",
      type: "string",
      label: "Saturday End Time",
      description: "Must be formatted as hh:mm (military time)"
    },
    {
      key: "saturdayClosed",
      type: "enum",
      label: "Saturday Closed",
      description: "If Closed = Y, Start and End Times for that day ignored and not imported",
      config: { options: yesNoEnum }
    },

    // Billing Address Section (13)
    {
      key: "billingAddressSameAsCorporateEntity",
      type: "enum",
      label: "Billing Address Same as Corporate Entity",
      description: "If Y, .csv import ignored for all fields in Billing Address section and Corporate Entity values for these fields imported instead",
      config: { options: yesNoEnum }
    },
    {
      key: "billingName",
      type: "string",
      label: "Billing Name",
      description: "Max 100 characters"
    },
    {
      key: "billingCountry",
      type: "string",
      label: "Billing Country"
    },
    {
      key: "billingAddressLine1",
      type: "string",
      label: "Billing Address Line 1",
      description: "Max 100 characters"
    },
    {
      key: "billingAddressLine2",
      type: "string",
      label: "Billing Address Line 2",
      description: "Max 50 characters"
    },
    {
      key: "billingCity",
      type: "string",
      label: "Billing City",
      description: "Max 50 characters"
    },
    {
      key: "billingCounty",
      type: "string",
      label: "Billing County",
      description: "Max 100 characters"
    },
    {
      key: "billingStateProvince",
      type: "string",
      label: "Billing State/Province"
    },
    {
      key: "billingZip",
      type: "string",
      label: "Billing Zip",
      description: "Must be 5, 6, or 9 digits"
    },
    {
      key: "billingEmail",
      type: "string",
      label: "Billing Email",
      description: "Must adhere to username@domain.com format"
    },
    {
      key: "billingPhoneNumber",
      type: "string",
      label: "Billing Phone Number",
      description: "Must be 9, 10, or 12-digit number"
    },
    {
      key: "billingExt",
      type: "string",
      label: "Billing Ext.",
      description: "Must be a number up to 20 digits in length"
    },
    {
      key: "billingFax",
      type: "string",
      label: "Billing Fax",
      description: "Must be 9, 10, or 12-digit number"
    },

    // Additional Fields (6)
    {
      key: "generalNotes",
      type: "string",
      label: "General Notes",
      description: "Max 10,000 characters"
    },
    {
      key: "instructions",
      type: "string",
      label: "Instructions",
      description: "Max 10,000 characters"
    },
    {
      key: "locationCategory",
      type: "enum",
      label: "Location Category",
      description: "Value must be blank, Appointment, or Practice",
      config: { options: locationCategoryEnum }
    },
    {
      key: "locationType",
      type: "string",
      label: "Location Type"
    },
    {
      key: "excludeFromWorkforceConnection",
      type: "enum",
      label: "Exclude From Workforce Connection",
      config: { options: yesNoEnum }
    },
    {
      key: "excludeFromHl7Integration",
      type: "enum",
      label: "Exclude from HL7 Integration",
      config: { options: yesNoEnum }
    },

    // Accessibility Features (9)
    {
      key: "adaCompliant",
      type: "enum",
      label: "ADA Compliant",
      config: { options: yesNoEnum }
    },
    {
      key: "examTableScaleChair",
      type: "enum",
      label: "Exam Table/Scale/Chair",
      config: { options: yesNoEnum }
    },
    {
      key: "exteriorBuilding",
      type: "enum",
      label: "Exterior Building",
      config: { options: yesNoEnum }
    },
    {
      key: "handicapAccessibility",
      type: "enum",
      label: "Handicap Accessibility",
      config: { options: yesNoEnum }
    },
    {
      key: "interiorBuilding",
      type: "enum",
      label: "Interior Building",
      config: { options: yesNoEnum }
    },
    {
      key: "parking",
      type: "enum",
      label: "Parking",
      config: { options: yesNoEnum }
    },
    {
      key: "publicTransportationAccess",
      type: "enum",
      label: "Public Transportation Access",
      config: { options: yesNoEnum }
    },
    {
      key: "restroom",
      type: "enum",
      label: "Restroom",
      config: { options: yesNoEnum }
    },
    {
      key: "siteAccessibility",
      type: "enum",
      label: "Site Accessibility",
      config: { options: yesNoEnum }
    },

    // Services (2)
    {
      key: "multiLineConferencing",
      type: "enum",
      label: "Multi-Line Conferencing",
      config: { options: yesNoEnum }
    },
    {
      key: "interpreterServices",
      type: "enum",
      label: "Interpreter Services",
      config: { options: yesNoEnum }
    }

    // Total: 2+8+2+4+13+13+21+13+6+9+2 = 93 fields
    // Note: Provider User Defined Fields would be added dynamically based on company configuration
  ],
  actions: [
    {
      operation: "validate-location",
      mode: "background",
      label: "Validate Location Data",
      description: "Run comprehensive validation on Location Import Format data including duplicate detection and business rule validation"
    }
  ]
};