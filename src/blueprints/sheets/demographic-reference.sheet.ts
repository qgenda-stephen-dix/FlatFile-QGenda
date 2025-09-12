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
