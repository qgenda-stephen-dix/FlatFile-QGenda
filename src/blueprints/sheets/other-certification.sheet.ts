import { Flatfile } from "@flatfile/api";

export const otherCertificationSheet: Flatfile.SheetConfig = {
  name: "Other Certification",
  slug: "other-certification",
  access: ["*"],
  fields: [
    {
      key: "provider_name",
      type: "string",
      label: "Provider Name",
      description: "Dummy field - not used for processing"
    },
    {
      key: "external_id",
      type: "string",
      label: "External ID",
      description: "Key field for updating",
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
      description: "Key field for updating",
      config: {
        options: [
          { value: "InternalID", label: "InternalID" },
          { value: "BillingSystemID", label: "BillingSystemID" }
        ]
      },
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "certification",
      type: "string",
      label: "Certification",
      description: "Key field for updating",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "certification_number",
      type: "string",
      label: "Certification Number",
      description: "Certification number - max 50 characters"
    },
    {
      key: "classification",
      type: "string",
      label: "Classification",
      description: "Classification - max 200 characters"
    },
    {
      key: "status",
      type: "enum",
      label: "Status",
      description: "Certification status",
      config: {
        options: [
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
          { value: "Pending", label: "Pending" },
          { value: "Expired", label: "Expired" },
          { value: "Suspended", label: "Suspended" }
        ]
      },
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "issue_date",
      type: "date",
      label: "Issue Date",
      description: "Date certification was issued (m/d/yyyy format)"
    },
    {
      key: "expires_on",
      type: "date",
      label: "Expires On",
      description: "Key field for updating - expiration date (m/d/yyyy format)"
    },
    {
      key: "monitor_expiration_date",
      type: "enum",
      label: "Monitor Expiration Date",
      description: "Whether to monitor expiration date",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "record_viewable_by_provider",
      type: "enum",
      label: "Record Viewable by Provider",
      description: "Whether record is viewable by provider",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "ignore_required_fields_validation",
      type: "enum",
      label: "Ignore Required Fields Validation?",
      description: "Whether to ignore required field validation",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },
    {
      key: "file_viewable_by_provider",
      type: "enum",
      label: "File Viewable by Provider",
      description: "Whether file is viewable by provider",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "file_key",
      type: "string",
      label: "File Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    },
    {
      key: "note",
      type: "string",
      label: "Note",
      description: "Additional notes - max 10,000 characters"
    },
    {
      key: "user",
      type: "string",
      label: "User",
      description: "User email - defaults to 'Credentialing System' if empty"
    },
    {
      key: "timestamp",
      type: "date",
      label: "TimeStamp",
      description: "Timestamp in m/d/yyyy format"
    },
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
      operation: "validateOtherCertification",
      mode: "foreground",
      label: "Validate Other Certification",
      description: "Validate other certification data with comprehensive business rules"
    },
    {
      operation: "dedupeOtherCertification",
      mode: "foreground",
      label: "Remove Duplicate Certifications",
      description: "Identify and flag duplicate certification records for the same provider and certification type"
    }
  ]
};