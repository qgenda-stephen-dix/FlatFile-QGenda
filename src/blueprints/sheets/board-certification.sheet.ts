import { Flatfile } from "@flatfile/api";

export const boardCertificationSheet: Flatfile.SheetConfig = {
  name: "Board Certification",
  slug: "board_certification",
  fields: [
    // Key Identity Fields
    {
      key: "provider_name",
      type: "string",
      label: "Provider Name",
      description: "Dummy field - do not omit from CSV file"
    },
    {
      key: "external_id",
      type: "string",
      label: "External ID",
      description: "Key field for updating, Required field",
      constraints: [{ type: "required" }]
    },
    {
      key: "external_id_type",
      type: "enum",
      label: "External ID Type",
      description: "Key field for updating, Required field",
      constraints: [{ type: "required" }],
      config: {
        options: [
          { value: "NPI", label: "NPI" },
          { value: "InternalID", label: "InternalID" },
          { value: "ProviderID", label: "ProviderID" },
          { value: "EmrID", label: "EmrID" }
        ]
      }
    },

    // Board Certification Core Fields
    {
      key: "board_certification_name",
      type: "string",
      label: "Board Certification Name",
      description: "Key field for updating, Required field",
      constraints: [{ type: "required" }]
    },
    {
      key: "certification_number",
      type: "string",
      label: "Certification Number",
      description: "Key field for updating - max 200 characters"
    },
    {
      key: "specialty",
      type: "string",
      label: "Specialty",
      description: "Key field for updating - must match Settings > Configurable Lists"
    },

    // Board Status and Details
    {
      key: "board_status",
      type: "string",
      label: "Board Status",
      description: "Must match dropdown values"
    },
    {
      key: "board_status_reason",
      type: "string",
      label: "Board Status Reason",
      description: "Max 100 characters"
    },
    {
      key: "waived_on",
      type: "date",
      label: "Waived On",
      description: "Format m/d/yyyy"
    },
    {
      key: "granted_by",
      type: "string",
      label: "Granted By",
      description: "Max 100 characters"
    },

    // Board Eligibility
    {
      key: "board_eligible",
      type: "enum",
      label: "Board Eligible?",
      description: "Must be Y, N, or blank",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
          { value: "", label: "" }
        ]
      }
    },

    // Written Exam Fields
    {
      key: "written_exam_scheduled",
      type: "enum",
      label: "Written Exam Scheduled?",
      description: "Must be Y, N, or blank",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
          { value: "", label: "" }
        ]
      }
    },
    {
      key: "written_exam_date",
      type: "date",
      label: "Written Exam Date",
      description: "Format m/d/yyyy"
    },

    // Verbal Exam Fields
    {
      key: "verbal_exam_scheduled",
      type: "enum",
      label: "Verbal Exam Scheduled?",
      description: "Must be Y, N, or blank",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
          { value: "", label: "" }
        ]
      }
    },
    {
      key: "verbal_exam_date",
      type: "date",
      label: "Verbal Exam Date",
      description: "Format m/d/yyyy"
    },

    // Board Ineligible Reason
    {
      key: "board_ineligible_reason",
      type: "string",
      label: "Board Ineligible Reason",
      description: "Max 500 characters"
    },

    // MOC (Maintenance of Certification)
    {
      key: "participating_in_moc",
      type: "enum",
      label: "Participating in MOC?",
      description: "Must be Y, N, N/A, or blank",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
          { value: "N/A", label: "N/A" },
          { value: "", label: "" }
        ]
      }
    },
    {
      key: "meeting_moc_requirements",
      type: "enum",
      label: "Meeting MOC requirements?",
      description: "Must be Y, N, N/A, or blank",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
          { value: "N/A", label: "N/A" },
          { value: "", label: "" }
        ]
      }
    },

    // Status and Dates
    {
      key: "active",
      type: "enum",
      label: "Active?",
      description: "Required field - must be Y or N",
      constraints: [{ type: "required" }],
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },
    {
      key: "issue_date",
      type: "date",
      label: "Issue Date",
      description: "Format m/d/yyyy - must be before Expiration Date"
    },
    {
      key: "expires_on",
      type: "date",
      label: "Expires On",
      description: "Format m/d/yyyy"
    },

    // Monitoring and Visibility
    {
      key: "monitor_expiration_date",
      type: "enum",
      label: "Monitor Expiration Date",
      description: "Must be T or F",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "record_viewable_by_provider",
      type: "enum",
      label: "Record Viewable by Provider",
      description: "Must be T or F",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },

    // Additional Specialty Fields
    {
      key: "subspecialty",
      type: "string",
      label: "Subspecialty",
      description: "Must match Settings > Configurable Lists"
    },
    {
      key: "specialty_type",
      type: "string",
      label: "Specialty Type",
      description: "Must match dropdown values"
    },

    // Administrative Controls
    {
      key: "ignore_required_fields_validation",
      type: "enum",
      label: "Ignore Required Fields Validation?",
      description: "Must be Y or N",
      config: {
        options: [
          { value: "Y", label: "Y" },
          { value: "N", label: "N" }
        ]
      }
    },
    {
      key: "file_viewable_by_provider",
      type: "enum",
      label: "File Viewable by Provider",
      description: "Must be T or F",
      config: {
        options: [
          { value: "T", label: "T" },
          { value: "F", label: "F" }
        ]
      }
    },
    {
      key: "file_key",
      type: "string",
      label: "File Key",
      description: "Must be valid GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)"
    },

    // Administrative Fields
    {
      key: "note",
      type: "string",
      label: "Note",
      description: "Max 10,000 characters"
    },
    {
      key: "user",
      type: "string",
      label: "User",
      description: "If empty, 'Credentialing System' will be used"
    },
    {
      key: "timestamp",
      type: "date",
      label: "TimeStamp",
      description: "Format m/d/yyyy"
    },
    {
      key: "board_certification_preference",
      type: "string",
      label: "Board Certification Preference",
      description: "Must match Board Certification Preference dropdown values"
    }

    // Note: User Defined Fields would be added dynamically based on company configuration
    // They should be added before the board_certification_preference field as noted in spec
  ]
};
