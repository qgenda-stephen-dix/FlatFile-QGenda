import { Flatfile } from "@flatfile/api";

// Company Privileges Import Format sheet configuration
export const companyPrivilegesSheet: Flatfile.SheetConfig = {
  name: "Company Privileges Import Format",
  slug: "company_privileges",
  access: ["*"],
  fields: [
    // Required Field
    {
      key: "privilege_name",
      type: "string",
      label: "Privilege Name",
      description: "Required field - ADD only, no updating. Max 100 characters",
      constraints: [
        {
          type: "required"
        }
      ]
    },

    // Optional Core Fields
    {
      key: "icd_cpt_code",
      type: "string", 
      label: "ICD/CPT Code",
      description: "Optional - Max 50 characters. Must be unique within file"
    },
    {
      key: "specialty",
      type: "string",
      label: "Specialty",
      description: "Optional - Pipe-delimited values (|). Max 100 characters total. Must exist in Specialty List Management"
    },
    {
      key: "subspecialty",
      type: "string",
      label: "Subspecialty", 
      description: "Optional - Pipe-delimited values (|). Max 100 characters total. Must exist in Specialty List Management"
    },
    {
      key: "description",
      type: "string",
      label: "Description",
      description: "Optional - Max 10,000 characters"
    },
    {
      key: "qualifications",
      type: "string",
      label: "Qualifications",
      description: "Optional - Max 10,000 characters"
    },
    {
      key: "competency",
      type: "string", 
      label: "Competency",
      description: "Optional - Max 10,000 characters"
    },
    {
      key: "include_in_all_locations",
      type: "string",
      label: "Include in All Locations",
      description: "Optional - Configuration setting for location application"
    }
  ],
  actions: [
    {
      operation: "companyPrivilegesValidateAction",
      mode: "background",
      label: "Validate Company Privileges Data",
      description: "Run comprehensive validation on Company Privileges Import Format data including duplicate detection and specialty validation"
    }
  ]
};