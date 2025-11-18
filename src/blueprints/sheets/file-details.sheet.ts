import { Flatfile } from "@flatfile/api";

export const fileDetailsSheet: Flatfile.SheetConfig = {
  name: "File Details",
  slug: "file-details",
  access: ["*"],
  fields: [
    // Dummy Field (per specification)
    {
      key: "providerName",
      type: "string",
      label: "Provider Name",
      description: "Dummy field - Provider Name (required for template structure)"
    },

    // Key Fields (Required)
    {
      key: "externalId",
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
      key: "externalIdType",
      type: "string",
      label: "External ID Type",
      description: "Key field for updating, Required field",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "fileName",
      type: "string",
      label: "File Name",
      description: "Optional, only provide a value when updating (max 250 characters). Cannot be 'None'. Extension will be appended automatically."
    },
    {
      key: "fileKey",
      type: "string",
      label: "File Key",
      description: "Key field for updating, Required field - GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)",
      constraints: [
        {
          type: "required"
        }
      ]
    },

    // File Metadata Fields
    {
      key: "fileCategory",
      type: "string",
      label: "File Category",
      description: "File Category - must match dropdown values. Required if File Type is provided. 'None' will clear existing information."
    },
    {
      key: "fileType",
      type: "string",
      label: "File Type",
      description: "File Type - must match dropdown values for selected File Category. 'Signable Document' requires PDF format. 'None' will clear existing information."
    },
    {
      key: "fileDescription",
      type: "string",
      label: "File Description",
      description: "File Description (max 10000 characters). 'None' will clear existing information."
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
      operation: "validateFileDetails",
      mode: "foreground",
      label: "Validate File Details",
      description: "Validate file details data with comprehensive business rules and file management validation"
    }
  ]
};