import { Flatfile } from "@flatfile/api";

export const demographicReferenceSheet: Flatfile.SheetConfig = {
  name: "Demographic Reference",
  slug: "demographic_reference",
//   treatments: ["ENUM_REFERENCE"],
  fields: [
    {
      key: "demographic_id",
      type: "string",
      label: "Demographic ID",
      constraints: [{ type: "required" }, { type: "unique" }]
    },
    {
      key: "demographic_name",
      type: "string",
      label: "Demographic Name",
      constraints: [{ type: "required" }]
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
      operation: "initializeDemographicReference",
      mode: "foreground",
      label: "Initialize Reference Data",
      description: "Populate sheet with common citizenship values"
    }
  ]
};
