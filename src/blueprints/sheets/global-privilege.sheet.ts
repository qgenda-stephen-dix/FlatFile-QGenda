import { Flatfile } from "@flatfile/api";

export const globalPrivilegeSheet: Flatfile.SheetConfig = {
  name: "Global Privilege",
  slug: "global-privilege",
  access: ["*"],
  fields: [
    // Required Fields (per specification)
    {
      key: "privilegeName",
      type: "string",
      label: "Privilege Name",
      description: "Required field - Name of the global privilege (max 100 characters)",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "icdCptCode",
      type: "string",
      label: "ICD/CPT Code",
      description: "Required field - ICD or CPT code associated with the privilege (max 50 characters)",
      constraints: [
        {
          type: "required"
        }
      ]
    },
    {
      key: "specialty",
      type: "string",
      label: "Specialty",
      description: "Required field - Medical specialty, use pipe (|) delimiter for multiple values (max 100 characters total)",
      constraints: [
        {
          type: "required"
        }
      ]
    },

    // Optional Fields
    {
      key: "subspecialty",
      type: "string",
      label: "Subspecialty",
      description: "Medical subspecialty, use pipe (|) delimiter for multiple values (max 100 characters total)"
    },
    {
      key: "description",
      type: "string",
      label: "Description",
      description: "Detailed description of the global privilege (max 10000 characters)"
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
      operation: "validateGlobalPrivilege",
      mode: "foreground",
      label: "Validate Global Privilege",
      description: "Validate global privilege data with comprehensive business rules and specialty validation"
    }
  ]
};