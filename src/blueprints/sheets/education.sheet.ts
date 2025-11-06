import { Flatfile } from "@flatfile/api";

export const educationSheet: Flatfile.SheetConfig = {
  name: "Education Import Format",
  slug: "education",
  access: ["*"],
  fields: [
    {
      key: "providerName",
      type: "string",
      label: "Provider Name",
      description: "Dummy field for provider identification",
    },
    {
      key: "externalId",
      type: "string",
      label: "External ID",
      description: "Key field for updating, required field",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "externalIdType",
      type: "string",
      label: "External ID Type",
      description: "Key field for updating, required field",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "educationType",
      type: "enum",
      label: "Education Type",
      description: "Required field, must match dropdown values",
      constraints: [
        {
          type: "required"
        }
      ],
      config: {
        options: [
          { value: "Bachelor's", label: "Bachelor's" },
          { value: "Master's", label: "Master's" },
          { value: "Doctorate", label: "Doctorate" },
          { value: "Medical School", label: "Medical School" },
          { value: "Professional School", label: "Professional School" },
          { value: "Fifth Pathway", label: "Fifth Pathway" }
        ]
      }
    },
    {
      key: "foreignGraduate",
      type: "enum",
      label: "Foreign Graduate?",
      description: "Must be T or F if not empty",
      config: {
        options: [
          { value: "", label: "" },
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "ecfmgNumber",
      type: "string",
      label: "ECFMG Number",
      description: "ECFMG identification number (max 8 characters)"
    },
    {
      key: "ecfmgIssueDate",
      type: "date",
      label: "ECFMG Issue Date",
      description: "Format: m/d/yyyy"
    },
    {
      key: "fifthPathwayNumber",
      type: "string",
      label: "Fifth Pathway Number",
      description: "Fifth pathway identification number (max 50 characters)"
    },
    {
      key: "fifthPathwayIssueDate",
      type: "date",
      label: "Fifth Pathway Issue Date",
      description: "Format: m/d/yyyy"
    },
    {
      key: "degree",
      type: "string",
      label: "Degree",
      description: "Key field for updating, required field - must match dropdown based on Education Type",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "areaOfStudy",
      type: "string",
      label: "Area of Study / Major",
      description: "Key field for updating (max 100 characters)"
    },
    {
      key: "schoolName",
      type: "string",
      label: "School Name",
      description: "Key field for updating (max 150 characters)"
    },
    {
      key: "institutionEmail",
      type: "string",
      label: "Institution Email",
      description: "Email address format (max 100 characters)"
    },
    {
      key: "addressLine1",
      type: "string",
      label: "Address Line 1",
      description: "Primary address (max 100 characters)"
    },
    {
      key: "addressLine2",
      type: "string",
      label: "Address Line 2",
      description: "Secondary address (max 50 characters)"
    },
    {
      key: "city",
      type: "string",
      label: "City",
      description: "City name (max 50 characters)"
    },
    {
      key: "state",
      type: "string",
      label: "State",
      description: "State/subdivision (max 50 characters)"
    },
    {
      key: "zip",
      type: "string",
      label: "Zip",
      description: "Zip/postal code (max 10 alphanumeric characters)"
    },
    {
      key: "country",
      type: "string",
      label: "Country",
      description: "Country name (max 100 characters)"
    },
    {
      key: "phone",
      type: "string",
      label: "Phone",
      description: "Phone number (9, 10, or 12 digits only)"
    },
    {
      key: "ext",
      type: "string",
      label: "Ext.",
      description: "Phone extension (max 20 digits)"
    },
    {
      key: "fax",
      type: "string",
      label: "Fax",
      description: "Fax number (9, 10, or 12 digits only)"
    },
    {
      key: "startDate",
      type: "date",
      label: "Start Date",
      description: "Key field for updating, format: m/d/yyyy"
    },
    {
      key: "endDate",
      type: "date",
      label: "End Date",
      description: "Key field for updating, format: m/d/yyyy"
    },
    {
      key: "didYouGraduate",
      type: "enum",
      label: "Did you graduate?",
      description: "Must be Y or N if not empty",
      config: {
        options: [
          { value: "", label: "" },
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },
    {
      key: "viewableByProvider",
      type: "enum",
      label: "Viewable by Provider",
      description: "Must be T or F if not empty",
      config: {
        options: [
          { value: "", label: "" },
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "website",
      type: "string",
      label: "Website",
      description: "Website URL (max 500 characters)"
    },
    {
      key: "fileViewableByProvider",
      type: "enum",
      label: "File Viewable by Provider",
      description: "Must be T or F if not empty",
      config: {
        options: [
          { value: "", label: "" },
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "ignoreRequiredFieldsValidation",
      type: "enum",
      label: "Ignore Required Fields Validation",
      description: "Must be Y or N if not empty",
      config: {
        options: [
          { value: "", label: "" },
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },
    {
      key: "fileKey",
      type: "string",
      label: "File Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    },
    {
      key: "note",
      type: "string",
      label: "Note",
      description: "Notes field (max 10,000 characters)"
    },
    {
      key: "user",
      type: "string",
      label: "User",
      description: "User identifier, defaults to 'Credentialing System' if empty"
    },
    {
      key: "timestamp",
      type: "string",
      label: "TimeStamp",
      description: "Format: m/d/yyyy h:mm:ss"
    },
    // X1-X10 Custom Fields (Standard requirement)
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
      operation: "validateEducation",
      mode: "foreground",
      label: "Validate Education",
      description: "Validate education data with comprehensive business rules"
    }
  ]
};