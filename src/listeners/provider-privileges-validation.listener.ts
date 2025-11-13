import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const providerPrivilegesValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("provider_privileges", (record) => {
      // Get all field values
      const providerName = record.get("provider_name") as string;
      const externalId = record.get("external_id") as string;
      const externalIdType = record.get("external_id_type") as string;
      const locationName = record.get("location_name") as string;
      const locationKey = record.get("location_key") as string;
      const privilegeName = record.get("privilege_name") as string;
      const conditions = record.get("conditions") as string;
      const apptDate = record.get("appt_date") as string;
      const reapptDate = record.get("reappt_date") as string;
      const status = record.get("status") as string;
      const grantedBy = record.get("granted_by") as string;
      const ignoreRequiredFields = record.get("ignore_required_fields_validation") as string;

      // Required field validations
      if (!externalId?.trim()) {
        record.addError("external_id", "External ID required");
      }

      if (!externalIdType?.trim()) {
        record.addError("external_id_type", "External ID Type required");
      }

      if (!locationKey?.trim()) {
        record.addError("location_key", "Location Key required");
      }

      if (!privilegeName?.trim()) {
        record.addError("privilege_name", "Privilege Name required");
      }

      // External ID and External ID Type cross-validation
      const hasExternalId = externalId && externalId.trim();
      const hasExternalIdType = externalIdType && externalIdType.trim();
      
      if ((hasExternalId && !hasExternalIdType) || (!hasExternalId && hasExternalIdType)) {
        record.addError("external_id", "Must provide both External ID and External ID Type");
        record.addError("external_id_type", "Must provide both External ID and External ID Type");
      }

      // Location Key GUID format validation
      if (locationKey && locationKey.trim()) {
        const guidRegex = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
        if (!guidRegex.test(locationKey.trim())) {
          record.addError("location_key", "Location Key must be a valid GUID");
        }
      }

      // External ID Type validation
      if (externalIdType && externalIdType.trim()) {
        const validTypes = ["NPI", "InternalID", "ProviderID", "EmrID", "BillingSystemID"];
        if (!validTypes.includes(externalIdType.trim())) {
          record.addError("external_id_type", "External ID Type not valid");
        }
      }

      // Conditions character limit validation
      if (conditions && conditions.length > 10000) {
        record.addError("conditions", "Conditions exceeds character limit of 10000");
      }

      // Date format validation (m/d/yyyy)
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

      const validateDateValue = (dateStr: string, fieldKey: string, fieldName: string) => {
        if (dateStr && dateStr.trim()) {
          if (!dateRegex.test(dateStr.trim())) {
            record.addError(fieldKey, `${fieldName} must be formatted as m/d/yyyy`);
            return false;
          }
          
          const [month, day, year] = dateStr.trim().split('/').map(Number);
          const dateObj = new Date(year, month - 1, day);
          
          if (dateObj.getFullYear() !== year || 
              dateObj.getMonth() !== month - 1 || 
              dateObj.getDate() !== day) {
            record.addError(fieldKey, `${fieldName} must be formatted as m/d/yyyy`);
            return false;
          }
          return true;
        }
        return false;
      };

      const isApptDateValid = validateDateValue(apptDate, "appt_date", "Appt. Date");
      const isReapptDateValid = validateDateValue(reapptDate, "reappt_date", "Reappt. Date");

      // Status-based conditional validation for Approved status
      const isApprovedStatus = status && status.trim().toLowerCase() === 'approved';
      
      if (isApprovedStatus) {
        if (!apptDate?.trim()) {
          record.addError("appt_date", "Appt. Date is required when Status is \"Approved\" (or a company configured equivalent)");
        }
        
        if (!reapptDate?.trim()) {
          record.addError("reappt_date", "Reappt. Date is required when Status is \"Approved\" (or a company configured equivalent)");
        }
      }

      // Cross-field date validation - Reappt. Date must be after Appt. Date
      if (isApptDateValid && isReapptDateValid && apptDate && reapptDate) {
        const [apptMonth, apptDay, apptYear] = apptDate.trim().split('/').map(Number);
        const [reapptMonth, reapptDay, reapptYear] = reapptDate.trim().split('/').map(Number);
        
        const apptDateObj = new Date(apptYear, apptMonth - 1, apptDay);
        const reapptDateObj = new Date(reapptYear, reapptMonth - 1, reapptDay);
        
        if (reapptDateObj <= apptDateObj) {
          record.addError("reappt_date", "Reappt. Date must be after Appt. Date");
        }
      }

      // Ignore Required Fields Validation Y/N validation
      if (ignoreRequiredFields && ignoreRequiredFields.trim() && !["Y", "N"].includes(ignoreRequiredFields.trim())) {
        record.addError("ignore_required_fields_validation", "Ignore Required Fields Validation? must be Y or N");
      }

      // External ID format validation based on type
      if (externalId && externalIdType && externalId.trim() && externalIdType.trim()) {
        const id = externalId.trim();
        const type = externalIdType.trim();
        
        switch (type) {
          case "NPI":
            // NPI should be 10 digits
            if (!/^\d{10}$/.test(id)) {
              record.addError("external_id", "NPI must be exactly 10 digits");
            }
            break;
          case "InternalID":
          case "ProviderID":
          case "EmrID":
          case "BillingSystemID":
            // Basic alphanumeric validation for other ID types
            if (!/^[A-Za-z0-9\-\_\.]+$/.test(id)) {
              record.addError("external_id", `${type} contains invalid characters. Use only letters, numbers, hyphens, underscores, and periods`);
            }
            break;
        }
      }

      // Basic privilege name validation
      if (privilegeName && privilegeName.trim()) {
        // Check for potentially problematic characters
        const invalidChars = /[<>\"&]/;
        if (invalidChars.test(privilegeName)) {
          record.addError("privilege_name", "Privilege Name contains invalid characters: < > \" &");
        }
      }

      // TODO: Production validations that would be implemented:
      // - Validate Status against company's Privilege Status configurable list
      // - Validate Granted By against company's Privileges Granted By configurable list
      // - Cross-reference External ID/Type with existing providers in company
      // - Validate Location Key against existing locations in company
      // - Validate Privilege Name against existing privileges in company
      // - Check provider-location assignment validity
      // - Validate privilege provider type/specialty matching

      return record;
    })
  );
};