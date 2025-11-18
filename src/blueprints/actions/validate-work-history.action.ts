import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateWorkHistoryAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateWorkHistory" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track external IDs for duplicate detection
        const externalIdMap = new Map<string, number>();
        const duplicateExternalIds = new Set<string>();

        // Track File Keys for cross-record validation
        const fileKeyMap = new Map<string, string>();
        const duplicateFileKeys = new Set<string>();

        // First pass: identify duplicates and build maps
        records.forEach((record: FlatfileRecord, index: number) => {
          const externalId = record.get("external_id") as string;
          const externalIdType = record.get("external_id_type") as string;
          const fileKey = record.get("file_key") as string;

          // Track External ID duplicates
          if (externalId?.trim()) {
            const idKey = `${externalIdType}:${externalId}`.toLowerCase();
            if (externalIdMap.has(idKey)) {
              duplicateExternalIds.add(idKey);
            } else {
              externalIdMap.set(idKey, index);
            }
          }

          // Track File Key usage
          if (fileKey?.trim()) {
            if (fileKeyMap.has(fileKey)) {
              duplicateFileKeys.add(fileKey);
            } else {
              fileKeyMap.set(fileKey, `Record ${index + 1}`);
            }
          }
        });

        // Second pass: apply validations
        const validatedRecords = records.map((record: FlatfileRecord, index: number) => {
          const externalId = record.get("external_id") as string;
          const externalIdType = record.get("external_id_type") as string;
          const nameOfFacilityEmployer = record.get("name_of_facility_employer") as string;
          const department = record.get("department") as string;
          const role = record.get("role") as string;
          const startDate = record.get("start_date") as string;
          const endDate = record.get("end_date") as string;
          const reasonForLeaving = record.get("reason_for_leaving") as string;
          const addressLine1 = record.get("address_line_1") as string;
          const addressLine2 = record.get("address_line_2") as string;
          const city = record.get("city") as string;
          const county = record.get("county") as string;
          const state = record.get("state") as string;
          const zip = record.get("zip") as string;
          const country = record.get("country") as string;
          const contactName = record.get("contact_name") as string;
          const contactTitlePosition = record.get("contact_title_position") as string;
          const phoneNumber = record.get("phone_number") as string;
          const ext = record.get("ext") as string;
          const email = record.get("email") as string;
          const fax = record.get("fax") as string;
          const recordViewableByProvider = record.get("record_viewable_by_provider") as string;
          const fileViewableByProvider = record.get("file_viewable_by_provider") as string;
          const fileKey = record.get("file_key") as string;
          const note = record.get("note") as string;
          const user = record.get("user") as string;
          const timestamp = record.get("timestamp") as string;

          // Duplicate External ID validation
          if (externalId?.trim()) {
            const idKey = `${externalIdType}:${externalId}`.toLowerCase();
            if (duplicateExternalIds.has(idKey)) {
              record.addError("external_id", "Duplicate External ID found in import file");
            }
          }

          // Provider matching validation (simulated - would connect to actual provider database)
          if (externalId?.trim() && externalIdType?.trim()) {
            // This would typically check against the provider database
            // For now, we'll add a warning for demonstration
            if (externalIdType === "NPI" && externalId.length !== 10) {
              record.addError("external_id", "NPI must be 10 digits");
            }
            
            // Simulate provider lookup error
            if (externalId === "NOTFOUND") {
              record.addError("external_id", "No matching provider found");
            }
          }

          // File Key business rules validation
          if (fileKey?.trim()) {
            // Check for duplicate File Keys in current import
            if (duplicateFileKeys.has(fileKey)) {
              record.addWarning("file_key", `File Key linked successfully but unlinked from other record in this import`);
            }

            // Validate GUID format (additional check beyond field-level validation)
            const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
            if (!guidRegex.test(fileKey)) {
              record.addError("file_key", "File Key must be a valid GUID");
            }

            // Simulate File Key validation errors (would connect to actual file system)
            if (fileKey === "00000000-0000-0000-0000-000000000000") {
              record.addError("file_key", "File not found");
            }
            if (fileKey.startsWith("INVALID-")) {
              record.addError("file_key", "File Key invalid - does not belong to this company or provider");
            }
            if (fileKey.startsWith("LINKED-")) {
              record.addError("file_key", "File already linked to another record and unable to be linked to a new record");
            }
            if (fileKey.startsWith("TYPE-")) {
              record.addError("file_key", "File type not able to be linked");
            }
          }

          // User validation against Cred Spec emails (simulated)
          if (user?.trim()) {
            // This would typically validate against the actual Cred Spec email list
            const validUserEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!validUserEmailPattern.test(user)) {
              record.addError("user", "No User matches found");
            }
            
            // Simulate user validation
            if (user === "invalid@example.com") {
              record.addError("user", "No User matches found");
            }
          }

          // Cross-field date validation
          if (startDate && endDate) {
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            
            if (startDateObj > endDateObj) {
              record.addError("end_date", "End Date must be after Start Date");
            }
          }

          // Country and State cross-validation
          if (country && state) {
            // This would typically validate against actual country/state data
            // For demonstration, we'll check some common patterns
            if (country === "United States" || country === "US") {
              // Validate US state codes or names
              const usStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
              if (!usStates.includes(state.toUpperCase())) {
                record.addWarning("state", `${state} is not a valid subdivison value for Country.`);
              }
            }
          }

          // State validation when updating existing records (simulated)
          if (state && !country) {
            // This would check if record exists and has different country/state
            record.addError("state", "Country and State must be provided when updating State.");
          }

          // Work history completeness validation
          if (nameOfFacilityEmployer?.trim()) {
            // Validate that key work history fields are provided for meaningful records
            if (!startDate?.trim()) {
              record.addWarning("start_date", "Start Date recommended for complete work history records");
            }
            
            if (!role?.trim() && !department?.trim()) {
              record.addWarning("role", "Role or Department recommended for complete work history records");
            }
          }

          // Current position logic validation
          if (endDate?.trim()) {
            // If end date is provided, we can validate it's not in the future (for completed positions)
            const endDateObj = new Date(endDate);
            const today = new Date();
            
            if (endDateObj > today) {
              record.addWarning("end_date", "End Date is in the future - verify if this is a current position");
            }
          }

          // Provider inactive status simulation (would connect to actual provider status)
          if (externalId === "INACTIVE123") {
            record.addWarning("external_id", "Provider was updated but is inactive.");
          }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Work History validation:", error);
        throw error;
      }
    }
  );
};