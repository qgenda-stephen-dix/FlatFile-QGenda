import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const providerLocationDetailsValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("provider-location-details", (record) => {
      // Get all field values
      const externalId = record.get("externalId") as string;
      const externalIdType = record.get("externalIdType") as string;
      const locationKey = record.get("locationKey") as string;
      const placementDate = record.get("placementDate") as string;
      const taxonomy = record.get("taxonomy") as string;
      const contractStart = record.get("contractStart") as string;
      const contractedHours = record.get("contractedHours") as string;
      const expectedStartDate = record.get("expectedStartDate") as string;
      const credentialingOverride = record.get("credentialingOverride") as string;
      const endDate = record.get("endDate") as string;
      const pendingDate = record.get("pendingDate") as string;
      const firstShift = record.get("firstShift") as string;
      const lastShift = record.get("lastShift") as string;
      const seesPatients = record.get("seesPatients") as string;
      const providerLocationArchived = record.get("providerLocationArchived") as string;
      const acceptingNewPatients = record.get("acceptingNewPatients") as string;
      const pcpOrSpecialist = record.get("pcpOrSpecialist") as string;
      const payerDirectory = record.get("payerDirectory") as string;
      const virtualCare = record.get("virtualCare") as string;
      const telephonicCare = record.get("telephonicCare") as string;
      const remoteMonitoring = record.get("remoteMonitoring") as string;
      const minAgeSeen = record.get("minAgeSeen") as string;
      const maxAgeSeen = record.get("maxAgeSeen") as string;
      const membershipCapacity = record.get("membershipCapacity") as string;

      // Required field validations
      if (!externalId?.trim()) {
        record.addError("externalId", "External ID is required");
      }

      if (!externalIdType?.trim()) {
        record.addError("externalIdType", "External ID Type is required");
      }

      if (!locationKey?.trim()) {
        record.addError("locationKey", "Location Key is required");
      }

      // External ID Type validation - must be one of specific values
      if (externalIdType?.trim() && !["NPI", "InternalID", "ProviderID", "EmrID", "BillingSystemID"].includes(externalIdType)) {
        record.addError("externalIdType", "External ID Type must be NPI, InternalID, ProviderID, EmrID, or BillingSystemID");
      }

      // External ID and External ID Type dependency validation
      if ((externalId?.trim() && !externalIdType?.trim()) || (!externalId?.trim() && externalIdType?.trim())) {
        record.addError("externalId", "Must provide both External ID and External ID Type");
        record.addError("externalIdType", "Must provide both External ID and External ID Type");
      }

      // Location Key GUID format validation
      if (locationKey?.trim()) {
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!guidRegex.test(locationKey)) {
          record.addError("locationKey", "Location Key must be a valid GUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)");
        }
      }

      // Date format validation helper function
      const validateDate = (dateValue: string, fieldName: string, fieldLabel: string) => {
        if (dateValue?.trim()) {
          // Basic date format validation - Flatfile will handle detailed date parsing
          // Check for obviously invalid formats
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
          if (!dateRegex.test(dateValue)) {
            record.addError(fieldName, `${fieldLabel} must be formatted as m/d/yyyy`);
          } else {
            // Additional validation for invalid dates like 2/31/2023
            const [month, day, year] = dateValue.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
              record.addError(fieldName, `${fieldLabel} must be a valid date`);
            }
          }
        }
      };

      // Date field validations
      validateDate(placementDate, "placementDate", "Placement Date");
      validateDate(contractStart, "contractStart", "Contract Start");
      validateDate(expectedStartDate, "expectedStartDate", "Expected Start Date");
      validateDate(endDate, "endDate", "End Date");
      validateDate(pendingDate, "pendingDate", "Pending Date");
      validateDate(firstShift, "firstShift", "First Shift");
      validateDate(lastShift, "lastShift", "Last Shift");

      // Credentialing Override conditional validations
      if (credentialingOverride?.trim()) {
        if (!["End Date", "Pending", "None", ""].includes(credentialingOverride)) {
          record.addError("credentialingOverride", "Credentialing Override must be 'End Date', 'Pending', 'None', or blank");
        }

        // End Date required if Credentialing Override = "End Date"
        if (credentialingOverride === "End Date" && !endDate?.trim()) {
          record.addError("endDate", "End Date is required when Credentialing Override is 'End Date'");
        }

        // Pending Date required if Credentialing Override = "Pending"
        if (credentialingOverride === "Pending" && !pendingDate?.trim()) {
          record.addError("pendingDate", "Pending Date is required when Credentialing Override is 'Pending'");
        }
      }

      // Character limit validations
      if (taxonomy && taxonomy.length > 100) {
        record.addError("taxonomy", "Taxonomy exceeds character limit of 100");
      }

      if (contractedHours && contractedHours.length > 10) {
        record.addError("contractedHours", "Contracted Hours exceeds character limit of 10");
      }

      if (minAgeSeen && minAgeSeen.length > 120) {
        record.addError("minAgeSeen", "Min Age Seen exceeds character limit of 120");
      }

      if (maxAgeSeen && maxAgeSeen.length > 120) {
        record.addError("maxAgeSeen", "Max Age Seen exceeds character limit of 120");
      }

      if (membershipCapacity && membershipCapacity.length > 4) {
        record.addError("membershipCapacity", "Membership Capacity exceeds character limit of 9999");
      }

      // Y/N field validations
      const validateYesNo = (value: string, fieldName: string, fieldLabel: string) => {
        if (value?.trim() && !["Y", "N", ""].includes(value)) {
          record.addError(fieldName, `${fieldLabel} must be Y or N`);
        }
      };

      validateYesNo(seesPatients, "seesPatients", "Sees Patients?");
      validateYesNo(providerLocationArchived, "providerLocationArchived", "Provider Location Archived?");
      validateYesNo(acceptingNewPatients, "acceptingNewPatients", "Accepting New Patients");
      validateYesNo(payerDirectory, "payerDirectory", "Payer Directory");
      validateYesNo(virtualCare, "virtualCare", "Virtual Care");
      validateYesNo(telephonicCare, "telephonicCare", "Telephonic Care");
      validateYesNo(remoteMonitoring, "remoteMonitoring", "Remote Monitoring");

      // PCP or Specialist validation
      if (pcpOrSpecialist?.trim() && !["", "PCP", "Specialist"].includes(pcpOrSpecialist)) {
        record.addError("pcpOrSpecialist", "PCP/Specialist must be 'Blank', 'PCP' or 'Specialist'");
      }

      // User Defined Field validations (X1-X10)
      const validateUDF = (fieldValue: string, fieldName: string) => {
        if (fieldValue && fieldValue.length > 50) {
          record.addError(fieldName, `${fieldName.toUpperCase()} exceeds character limit of 50`);
        }
      };

      // Validate all X1-X10 fields
      for (let i = 1; i <= 10; i++) {
        const fieldName = `x${i}`;
        const fieldValue = record.get(fieldName) as string;
        validateUDF(fieldValue, fieldName);
      }

      // Handle "None" values - clear fields if they contain "None" (case-insensitive)
      const clearNoneValues = (value: string, fieldName: string) => {
        if (value?.toLowerCase() === "none") {
          record.set(fieldName, "");
        }
      };

      // Apply "None" clearing to relevant fields
      clearNoneValues(taxonomy, "taxonomy");
      clearNoneValues(contractedHours, "contractedHours");
      clearNoneValues(minAgeSeen, "minAgeSeen");
      clearNoneValues(maxAgeSeen, "maxAgeSeen");
      clearNoneValues(membershipCapacity, "membershipCapacity");
      
      // Clear "None" values in UDF fields
      for (let i = 1; i <= 10; i++) {
        const fieldName = `x${i}`;
        const fieldValue = record.get(fieldName) as string;
        clearNoneValues(fieldValue, fieldName);
      }

      return record;
    })
  );
};