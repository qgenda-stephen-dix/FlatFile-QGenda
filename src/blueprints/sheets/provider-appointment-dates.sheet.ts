import { Flatfile } from "@flatfile/api";

export const providerAppointmentDatesSheet: Flatfile.SheetConfig = {
  name: "Provider Appointment Dates Import Format",
  slug: "provider-appointment-dates",
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
      description: "Provider identifier, required field"
    },
    {
      key: "externalIdType",
      type: "string",
      label: "External ID Type",
      description: "Type of external ID (NPI, InternalID, ProviderID, EmrID, BillingSystemID)"
    },
    {
      key: "locationName",
      type: "string",
      label: "Location Name",
      description: "Dummy field for location identification"
    },
    {
      key: "locationKey",
      type: "string",
      label: "Location Key",
      description: "Required field - GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "workflowType",
      type: "enum",
      label: "Workflow Type",
      description: "Required field - must be 'Appointment' or 'Provider - Location Termination'",
      constraints: [
        {
          type: "required"
        }
      ],
      config: {
        options: [
          { value: "Appointment", label: "Appointment" },
          { value: "Provider - Location Termination", label: "Provider - Location Termination" }
        ]
      }
    },
    {
      key: "workflowName",
      type: "string",
      label: "Workflow Name",
      description: "Dummy field for workflow identification"
    },
    {
      key: "workflowKey",
      type: "string",
      label: "Workflow Key",
      description: "Required field - GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
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
      description: "Required when Workflow Type = Appointment. Options: Approved, Withdrawn, Denied, Approved - Historical Only",
      config: {
        options: [
          { value: "", label: "" },
          { value: "Approved", label: "Approved" },
          { value: "Withdrawn", label: "Withdrawn" },
          { value: "Denied", label: "Denied" },
          { value: "Approved - Historical Only", label: "Approved - Historical Only" }
        ]
      }
    },
    {
      key: "locationEmploymentType",
      type: "string",
      label: "Location Employment Type",
      description: "Imported when Type = Appointment, must match company configurable list"
    },
    {
      key: "appointmentDate",
      type: "date",
      label: "Appointment Date",
      description: "Required when Resolution = Approved, format: m/d/yyyy"
    },
    {
      key: "reappointmentDate",
      type: "date",
      label: "Reappointment Date",
      description: "Required when Resolution = Approved, format: m/d/yyyy"
    },
    {
      key: "reappointmentNotificationDate",
      type: "date",
      label: "Reappointment Notification Date",
      description: "Format: m/d/yyyy, must be 1-999 days before Reappointment Date"
    },
    {
      key: "inactiveDate",
      type: "date",
      label: "Inactive Date",
      description: "Required when Workflow Type = 'Provider - Location Termination', format: m/d/yyyy"
    },
    {
      key: "notes",
      type: "string",
      label: "Notes",
      description: "Optional, Required when Resolution = Denied (max 500 characters)"
    },
    {
      key: "providerCategory",
      type: "string",
      label: "Provider Category",
      description: "Must match a value defined in company settings"
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
      operation: "validateProviderAppointmentDates",
      mode: "foreground",
      label: "Validate Provider Appointment Dates",
      description: "Validate provider appointment dates data with comprehensive business rules"
    }
  ]
};