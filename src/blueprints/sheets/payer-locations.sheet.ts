import { Flatfile } from "@flatfile/api";

export const payerLocationsSheet: Flatfile.SheetConfig = {
  name: "Payer-Locations",
  slug: "payer-locations",
  access: ["*"],
  fields: [
    // Required Fields from Specification
    {
      key: "payer_name",
      type: "string",
      label: "Payer Name",
      description: "Name of the payer organization"
    },
    {
      key: "payer_key",
      type: "string",
      label: "Payer Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (8-4-4-4-12 characters)",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "location_name",
      type: "string",
      label: "Location Name",
      description: "Name of the location"
    },
    {
      key: "location_key",
      type: "string",
      label: "Location Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (8-4-4-4-12 characters). Multiple keys must be comma-delimited",
      constraints: [
        {
          type: "required"
        }
      ]
    },

    // Standard X1-X10 Custom Fields
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
      operation: "validatePayerLocations",
      mode: "foreground",
      label: "Validate Payer-Locations",
      description: "Validate payer-locations data with comprehensive business rules and GUID format validation"
    }
  ]
};