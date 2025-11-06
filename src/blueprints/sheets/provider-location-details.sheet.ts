import { Flatfile } from "@flatfile/api";

export const providerLocationDetailsSheet: Flatfile.SheetConfig = {
  name: "Provider Location Details Import Format",
  slug: "provider-location-details",
  access: ["*"],
  fields: [
    {
      key: "providerName",
      type: "string",
      label: "Provider Name",
      description: "Provider Name (Dummy Column)",
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
      description: "Location Name (Dummy Column)"
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
      key: "placementDate",
      type: "date",
      label: "Placement Date",
      description: "Date must be formatted as m/d/yyyy"
    },
    {
      key: "locationEmploymentType",
      type: "string",
      label: "Location Employment Type",
      description: "Location Employment Type from dropdown"
    },
    {
      key: "specialty",
      type: "string",
      label: "Specialty",
      description: "Specialty from company settings - Users can add multiple using '|' separator"
    },
    {
      key: "taxonomy",
      type: "string",
      label: "Taxonomy",
      description: "Taxonomy code - Maximum 100 characters"
    },
    {
      key: "contractStart",
      type: "date",
      label: "Contract Start",
      description: "Contract Start Date - Must be formatted as m/d/yyyy"
    },
    {
      key: "contractedHours",
      type: "string",
      label: "Contracted Hours",
      description: "Contracted Hours - Maximum 10 characters"
    },
    {
      key: "expectedStartDate",
      type: "date",
      label: "Expected Start Date",
      description: "Expected Start Date - Must be formatted as m/d/yyyy"
    },
    {
      key: "credentialingOverride",
      type: "enum",
      label: "Credentialing Override",
      description: "Must be 'End Date', 'Pending', 'None', or null",
      config: {
        options: [
          { value: "End Date", label: "End Date" },
          { value: "Pending", label: "Pending" },
          { value: "None", label: "None" },
          { value: "", label: "(blank)" }
        ]
      }
    },
    {
      key: "endDate",
      type: "date",
      label: "End Date", 
      description: "End Date - Must be formatted as m/d/yyyy. Required if Credentialing Override = 'End Date'"
    },
    {
      key: "pendingDate",
      type: "date",
      label: "Pending Date",
      description: "Pending Date - Must be formatted as m/d/yyyy. Required if Credentialing Override = 'Pending'"
    },
    {
      key: "firstShift",
      type: "date",
      label: "First Shift",
      description: "First Shift Date - Must be formatted as m/d/yyyy"
    },
    {
      key: "lastShift",
      type: "date",
      label: "Last Shift",
      description: "Last Shift Date - Must be formatted as m/d/yyyy"
    },
    {
      key: "locationPreference",
      type: "string",
      label: "Location Preference",
      description: "Location Preference from dropdown"
    },
    {
      key: "seesPatients",
      type: "enum",
      label: "Sees Patients?",
      description: "Must be Y or N",
      config: {
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
          { value: "", label: "(blank)" }
        ]
      }
    },
    {
      key: "providerLocationArchived",
      type: "enum",
      label: "Provider Location Archived?",
      description: "Must be Y or N",
      config: {
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
          { value: "", label: "(blank)" }
        ]
      }
    },
    {
      key: "acceptingNewPatients",
      type: "enum",
      label: "Accepting New Patients",
      description: "Must be Y or N",
      config: {
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
          { value: "", label: "(blank)" }
        ]
      }
    },
    {
      key: "patientsSeen",
      type: "string",
      label: "Patients Seen",
      description: "Patients Seen from dropdown"
    },
    {
      key: "pcpOrSpecialist",
      type: "enum",
      label: "PCP or Specialist",
      description: "Must be 'Blank', 'PCP', or 'Specialist'",
      config: {
        options: [
          { value: "", label: "(blank)" },
          { value: "PCP", label: "PCP" },
          { value: "Specialist", label: "Specialist" }
        ]
      }
    },
    {
      key: "payerDirectory",
      type: "enum",
      label: "Payer Directory",
      description: "Must be Y or N",
      config: {
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
          { value: "", label: "(blank)" }
        ]
      }
    },
    {
      key: "virtualCare",
      type: "enum",
      label: "Virtual Care",
      description: "Must be Y or N",
      config: {
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
          { value: "", label: "(blank)" }
        ]
      }
    },
    {
      key: "telephonicCare",
      type: "enum",
      label: "Telephonic Care", 
      description: "Must be Y or N",
      config: {
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
          { value: "", label: "(blank)" }
        ]
      }
    },
    {
      key: "remoteMonitoring",
      type: "enum",
      label: "Remote Monitoring",
      description: "Must be Y or N",
      config: {
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
          { value: "", label: "(blank)" }
        ]
      }
    },
    {
      key: "minAgeSeen",
      type: "string",
      label: "Min Age Seen",
      description: "Minimum Age Seen - Maximum 120 characters"
    },
    {
      key: "maxAgeSeen",
      type: "string",
      label: "Max Age Seen",
      description: "Maximum Age Seen - Maximum 120 characters"
    },
    {
      key: "membershipCapacity",
      type: "string",
      label: "Membership Capacity",
      description: "Membership Capacity - Maximum 9999"
    },
    {
      key: "coveringPhysiciansExternalId",
      type: "string",
      label: "Covering Physician(s) External ID",
      description: "External IDs of covering physicians - Multiple values can be separated by '|'"
    },
    // User Defined Fields X1-X10
    {
      key: "x1",
      type: "string",
      label: "X1",
      description: "User Defined Field X1 - Multi-select UDFs are pipe-delimited ('|')"
    },
    {
      key: "x2",
      type: "string",
      label: "X2", 
      description: "User Defined Field X2 - Multi-select UDFs are pipe-delimited ('|')"
    },
    {
      key: "x3",
      type: "string",
      label: "X3",
      description: "User Defined Field X3 - Multi-select UDFs are pipe-delimited ('|')"
    },
    {
      key: "x4",
      type: "string",
      label: "X4",
      description: "User Defined Field X4 - Multi-select UDFs are pipe-delimited ('|')"
    },
    {
      key: "x5",
      type: "string",
      label: "X5",
      description: "User Defined Field X5 - Multi-select UDFs are pipe-delimited ('|')"
    },
    {
      key: "x6",
      type: "string",
      label: "X6",
      description: "User Defined Field X6 - Multi-select UDFs are pipe-delimited ('|')"
    },
    {
      key: "x7",
      type: "string",
      label: "X7",
      description: "User Defined Field X7 - Multi-select UDFs are pipe-delimited ('|')"
    },
    {
      key: "x8",
      type: "string",
      label: "X8",
      description: "User Defined Field X8 - Multi-select UDFs are pipe-delimited ('|')"
    },
    {
      key: "x9",
      type: "string",
      label: "X9",
      description: "User Defined Field X9 - Multi-select UDFs are pipe-delimited ('|')"
    },
    {
      key: "x10",
      type: "string",
      label: "X10",
      description: "User Defined Field X10 - Multi-select UDFs are pipe-delimited ('|')"
    },
  ],
};