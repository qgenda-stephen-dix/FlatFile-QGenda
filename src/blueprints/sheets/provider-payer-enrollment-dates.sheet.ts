import { Flatfile } from "@flatfile/api";

export const providerPayerEnrollmentDatesSheet: Flatfile.SheetConfig = {
  name: "Provider Payer Enrollment Dates Import Format",
  slug: "provider-payer-enrollment-dates",
  access: ["*"],
  fields: [
    {
      key: "providerName",
      type: "string",
      label: "Provider Name",
      description: "Provider Name (Dummy Field)",
    },
    {
      key: "externalId",
      type: "string",
      label: "External ID",
      description: "Required field - Key field for updating"
    },
    {
      key: "externalIdType",
      type: "string",
      label: "External ID Type", 
      description: "Key field for updating, Required field - Must be NPI, InternalID, ProviderID, EmrID, or BillingSystemID"
    },
    {
      key: "locationName",
      type: "string",
      label: "Location Name",
      description: "Location Name (Dummy Field)"
    },
    {
      key: "locationKey",
      type: "string",
      label: "Location Key",
      description: "Required Field - Must be a valid GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "payerName",
      type: "string",
      label: "Payer Name",
      description: "Payer Name (Dummy Field)"
    },
    {
      key: "payerKey",
      type: "string",
      label: "Payer Key",
      description: "Required Field - Must be a valid GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "workflowName",
      type: "string",
      label: "Workflow Name",
      description: "Workflow Name (Dummy Field)"
    },
    {
      key: "workflowKey",
      type: "string",
      label: "Workflow Key",
      description: "Required Field - Must be a valid GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "resolution",
      type: "enum",
      label: "Resolution",
      description: "Required field - Must be Approved, Participating, Rejected, Denied, Withdrawn, Non-Participating, Non-Billing, or Terminated",
      constraints: [
        {
          type: "required"
        }
      ],
      config: {
        options: [
          { value: "Approved", label: "Approved" },
          { value: "Participating", label: "Participating" },
          { value: "Rejected", label: "Rejected" },
          { value: "Denied", label: "Denied" },
          { value: "Withdrawn", label: "Withdrawn" },
          { value: "Non-Participating", label: "Non-Participating" },
          { value: "Non-Billing", label: "Non-Billing" },
          { value: "Terminated", label: "Terminated" }
        ]
      }
    },
    {
      key: "effectiveDate",
      type: "date",
      label: "Effective Date",
      description: "Effective Date - Must be formatted as m/d/yyyy. Can only be input if Resolution is Approved or Participating"
    },
    {
      key: "reEnrollmentDate",
      type: "date",
      label: "Re-Enrollment Date",
      description: "Re-Enrollment Date - Must be formatted as m/d/yyyy. Must be after Effective Date. Can only be input if Resolution is Approved or Participating"
    },
    {
      key: "notes",
      type: "string",
      label: "Notes",
      description: "Notes field for additional information"
    },
    {
      key: "payerProviderId",
      type: "string",
      label: "Payer Provider ID",
      description: "Payer Provider ID - Maximum 50 characters"
    },
  ],
};