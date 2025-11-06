import { Flatfile } from "@flatfile/api";

export const cmeSheet: Flatfile.SheetConfig = {
  name: "CME Import Format",
  slug: "cme",
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
      key: "name",
      type: "string",
      label: "Name",
      description: "Key field for updating, required field (max 100 characters)",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "category",
      type: "string",
      label: "Category",
      description: "Key field for updating, must match dropdown values"
    },
    {
      key: "cmeContents",
      type: "string",
      label: "CME Contents",
      description: "Key field for updating (max 100 characters)"
    },
    {
      key: "credits",
      type: "string",
      label: "Credits",
      description: "Numeric value (max 6 characters)"
    },
    {
      key: "cmeDescription",
      type: "string",
      label: "CME Description",
      description: "Description of CME (max 500 characters)"
    },
    {
      key: "completedOn",
      type: "date",
      label: "Completed On",
      description: "Key field for updating, format: m/d/yyyy"
    },
    {
      key: "validUntil",
      type: "date",
      label: "Valid Until",
      description: "Expiration date, format: m/d/yyyy"
    },
    {
      key: "states",
      type: "string",
      label: "State(s)",
      description: "Values should be pipe-delimited (|)"
    },
    {
      key: "recordViewableByProvider",
      type: "enum",
      label: "Record Viewable by Provider",
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
      key: "frequency",
      type: "string",
      label: "Frequency",
      description: "Must match dropdown values"
    },
    {
      key: "hoursRequired",
      type: "number",
      label: "Hours Required",
      description: "Numeric value between 1-50, inclusive"
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
      key: "fileKey",
      type: "string",
      label: "File Key",
      description: "GUID format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (adding in 2024.15+)"
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
      operation: "validateCME",
      mode: "foreground",
      label: "Validate CME",
      description: "Validate CME data with comprehensive business rules"
    }
  ]
};