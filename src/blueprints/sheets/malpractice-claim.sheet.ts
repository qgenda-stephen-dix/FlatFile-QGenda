import { Flatfile } from "@flatfile/api";

export const malpracticeClaimSheet: Flatfile.SheetConfig = {
  name: "Malpractice Claim Import Format",
  slug: "malpractice_claim",
  access: ["*"],
  fields: [
    // Key Identity Fields
    {
      key: "provider_name",
      type: "string",
      label: "Provider Name",
      description: "Dummy Column - Provider identification field"
    },
    {
      key: "external_id",
      type: "string",
      label: "External ID",
      description: "Key field for updating, Required field",
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
      description: "Key field for updating, Required field",
      constraints: [
        {
          type: "required"
        }
      ],
      config: {
        options: [
          { value: "NPI", label: "NPI" },
          { value: "InternalID", label: "Internal ID" },
          { value: "ProviderID", label: "Provider ID" },
          { value: "EmrID", label: "EMR ID" }
        ]
      }
    },
    {
      key: "organization_name",
      type: "string",
      label: "Organization Name",
      description: "Key field for updating, Required field - Maximum 100 characters",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "reporting_entity",
      type: "string",
      label: "Reporting Entity",
      description: "Key field for updating, Required field - Maximum 100 characters",
      constraints: [
        {
          type: "required"
        }
      ]
    },

    // Claim Details
    {
      key: "primary_act_omission",
      type: "string",
      label: "Primary Act / Omission",
      description: "Maximum 500 characters"
    },
    {
      key: "incident_date",
      type: "date",
      label: "Incident Date",
      description: "Key field for updating, Required field - Must be m/d/yyyy format",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "judgment_date",
      type: "date",
      label: "Judgment Date",
      description: "Must be m/d/yyyy format"
    },
    {
      key: "claim_status",
      type: "enum",
      label: "Claim Status",
      description: "Key field for updating - Must match dropdown values",
      config: {
        options: [
          { value: "Open", label: "Open" },
          { value: "Closed", label: "Closed" },
          { value: "Settled", label: "Settled" },
          { value: "Dismissed", label: "Dismissed" },
          { value: "Pending", label: "Pending" }
        ]
      }
    },
    {
      key: "case_number",
      type: "string",
      label: "Case #",
      description: "Maximum 50 characters"
    },

    // Legal Information
    {
      key: "carrier_attorney_statement",
      type: "string",
      label: "Carrier / Attorney Statement",
      description: "Maximum 5,000 characters"
    },
    {
      key: "description_of_judgment",
      type: "string",
      label: "Description of Judgment",
      description: "Maximum 5,000 characters"
    },

    // Practitioner and Payment Information
    {
      key: "number_of_practitioners",
      type: "number",
      label: "# of Practitioners",
      description: "Must be an integer between 1 and 999"
    },
    {
      key: "total_paid_for_this_practitioner",
      type: "number",
      label: "Total Paid for this Practitioner",
      description: "Cannot exceed $2.1 billion, maximum 12 characters"
    },
    {
      key: "types_of_payment",
      type: "enum",
      label: "Types of Payment",
      description: "Must match dropdown values",
      config: {
        options: [
          { value: "Settlement", label: "Settlement" },
          { value: "Judgment", label: "Judgment" },
          { value: "Defense Costs", label: "Defense Costs" },
          { value: "Other", label: "Other" }
        ]
      }
    },
    {
      key: "payment_results",
      type: "string",
      label: "Payment Results",
      description: "Maximum 5,000 characters"
    },
    {
      key: "payment_date",
      type: "date",
      label: "Payment Date",
      description: "Must be m/d/yyyy format"
    },
    {
      key: "total_paid_for_claim",
      type: "number",
      label: "Total Paid for Claim",
      description: "Cannot exceed $2.1 billion, maximum 12 characters"
    },
    {
      key: "role_in_claim",
      type: "string",
      label: "Role in Claim",
      description: "Maximum 100 characters"
    },
    {
      key: "provider_statement",
      type: "string",
      label: "Provider Statement",
      description: "Maximum 5,000 characters"
    },

    // File Management
    {
      key: "file_key",
      type: "string",
      label: "File Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (8,4,4,4,12 characters)"
    },

    // Additional Information
    {
      key: "note",
      type: "string",
      label: "Note",
      description: "Maximum 10,000 characters"
    },
    {
      key: "user",
      type: "string",
      label: "User",
      description: "If empty, 'Credentialing System' will be used - must match Cred Spec emails"
    },
    {
      key: "timestamp",
      type: "date",
      label: "TimeStamp",
      description: "Must be m/d/yyyy format"
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
      operation: "validateMalpracticeClaim",
      mode: "foreground",
      label: "Validate Malpractice Claim Data",
      description: "Comprehensive validation of malpractice claim information with duplicate detection"
    }
  ]
};