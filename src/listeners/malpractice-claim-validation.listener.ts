import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const malpracticeClaimValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("malpractice_claim", (record) => {
      // Get all field values
      const providerName = record.get("provider_name") as string;
      const externalId = record.get("external_id") as string;
      const externalIdType = record.get("external_id_type") as string;
      const organizationName = record.get("organization_name") as string;
      const reportingEntity = record.get("reporting_entity") as string;
      const primaryActOmission = record.get("primary_act_omission") as string;
      const incidentDate = record.get("incident_date") as string;
      const judgmentDate = record.get("judgment_date") as string;
      const claimStatus = record.get("claim_status") as string;
      const caseNumber = record.get("case_number") as string;
      const carrierAttorneyStatement = record.get("carrier_attorney_statement") as string;
      const descriptionOfJudgment = record.get("description_of_judgment") as string;
      const numberOfPractitioners = record.get("number_of_practitioners") as string;
      const totalPaidForThisPractitioner = record.get("total_paid_for_this_practitioner") as string;
      const typesOfPayment = record.get("types_of_payment") as string;
      const paymentResults = record.get("payment_results") as string;
      const paymentDate = record.get("payment_date") as string;
      const totalPaidForClaim = record.get("total_paid_for_claim") as string;
      const roleInClaim = record.get("role_in_claim") as string;
      const providerStatement = record.get("provider_statement") as string;
      const fileKey = record.get("file_key") as string;
      const note = record.get("note") as string;
      const user = record.get("user") as string;
      const timestamp = record.get("timestamp") as string;

      // Required field validations - Red text fields
      if (!externalId?.trim()) {
        record.addError("external_id", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("external_id_type", "External Id Type required");
      }

      if (!organizationName?.trim()) {
        record.addError("organization_name", "Organization Name required");
      }

      if (!reportingEntity?.trim()) {
        record.addError("reporting_entity", "Reporting Entity required");
      }

      if (!incidentDate?.trim()) {
        record.addError("incident_date", "Incident Date required");
      }

      // Character limit validations
      if (organizationName && organizationName.length > 100) {
        record.addError("organization_name", "Organization Name exceeds character limit of 100");
      }

      if (reportingEntity && reportingEntity.length > 100) {
        record.addError("reporting_entity", "Reporting Entity exceeds character limit of 100");
      }

      if (primaryActOmission && primaryActOmission.length > 500) {
        record.addError("primary_act_omission", "Primary Act / Omission exceeds character limit of 500");
      }

      if (caseNumber && caseNumber.length > 50) {
        record.addError("case_number", "Case # exceeds character limit of 50");
      }

      if (carrierAttorneyStatement && carrierAttorneyStatement.length > 5000) {
        record.addError("carrier_attorney_statement", "Carrier / Attorney Statement exceeds character limit of 5000");
      }

      if (descriptionOfJudgment && descriptionOfJudgment.length > 5000) {
        record.addError("description_of_judgment", "Description of Judgment exceeds character limit of 5000");
      }

      if (paymentResults && paymentResults.length > 5000) {
        record.addError("payment_results", "Payment Results exceeds character limit of 5000");
      }

      if (roleInClaim && roleInClaim.length > 100) {
        record.addError("role_in_claim", "Role in Claim exceeds character limit of 100");
      }

      if (providerStatement && providerStatement.length > 5000) {
        record.addError("provider_statement", "Provider Statement exceeds character limit of 5000");
      }

      if (note && note.length > 10000) {
        record.addError("note", "Note exceeds character limit of 10000");
      }

      // Date format validation (m/d/yyyy)
      const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

      if (incidentDate && !dateRegex.test(incidentDate)) {
        record.addError("incident_date", "Incident Date must be formatted as m/d/yyyy");
      }

      if (judgmentDate && judgmentDate.trim() && !dateRegex.test(judgmentDate)) {
        record.addError("judgment_date", "Judgment Date must be formatted as m/d/yyyy");
      }

      if (paymentDate && paymentDate.trim() && !dateRegex.test(paymentDate)) {
        record.addError("payment_date", "Payment Date must be formatted as m/d/yyyy");
      }

      if (timestamp && timestamp.trim() && !dateRegex.test(timestamp)) {
        record.addError("timestamp", "Timestamp must be formatted as m/d/yyyy");
      }

      // Date validation - check if dates are valid
      const validateDateValue = (dateStr: string, fieldKey: string, fieldName: string) => {
        if (dateStr && dateRegex.test(dateStr)) {
          const [month, day, year] = dateStr.split('/').map(Number);
          const dateObj = new Date(year, month - 1, day);
          
          if (dateObj.getFullYear() !== year || 
              dateObj.getMonth() !== month - 1 || 
              dateObj.getDate() !== day) {
            record.addError(fieldKey, `${fieldName} must be formatted as m/d/yyyy`);
          }
        }
      };

      validateDateValue(incidentDate, "incident_date", "Incident Date");
      validateDateValue(judgmentDate, "judgment_date", "Judgment Date");
      validateDateValue(paymentDate, "payment_date", "Payment Date");
      validateDateValue(timestamp, "timestamp", "Timestamp");

      // Number of Practitioners validation
      if (numberOfPractitioners && numberOfPractitioners.trim()) {
        const practitionerCount = parseInt(numberOfPractitioners.trim(), 10);
        if (isNaN(practitionerCount) || practitionerCount < 1 || practitionerCount > 999) {
          record.addError("number_of_practitioners", "# of Practitioners must be an integer between 1 and 999");
        }
      }

      // Payment amount validations
      const validatePaymentAmount = (amountStr: string, fieldKey: string, fieldName: string) => {
        if (amountStr && amountStr.trim()) {
          // Remove currency symbols and commas for validation
          const cleanAmount = amountStr.replace(/[$,]/g, '').trim();
          const amount = parseFloat(cleanAmount);
          
          if (isNaN(amount)) {
            record.addError(fieldKey, `${fieldName} must be a valid number`);
          } else if (amount > 2100000000) { // $2.1 billion
            record.addError(fieldKey, `${fieldName} cannot exceed 2.1 billion`);
          }
          
          // Character limit check (12 characters)
          if (cleanAmount.length > 12) {
            record.addError(fieldKey, `${fieldName} exceeds character limit of 12`);
          }
        }
      };

      validatePaymentAmount(totalPaidForThisPractitioner, "total_paid_for_this_practitioner", "Total Paid for this Practitioner");
      validatePaymentAmount(totalPaidForClaim, "total_paid_for_claim", "Total Paid for Claim");

      // Dropdown validations
      if (claimStatus && claimStatus.trim()) {
        const validClaimStatuses = ["Open", "Closed", "Settled", "Dismissed", "Pending"];
        if (!validClaimStatuses.includes(claimStatus.trim())) {
          record.addError("claim_status", "Claim Status not supported");
        }
      }

      if (typesOfPayment && typesOfPayment.trim()) {
        const validPaymentTypes = ["Settlement", "Judgment", "Defense Costs", "Other"];
        if (!validPaymentTypes.includes(typesOfPayment.trim())) {
          record.addError("types_of_payment", "Types of Payment not supported");
        }
      }

      // GUID format validation for File Key
      if (fileKey && fileKey.trim()) {
        const guidRegex = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
        if (!guidRegex.test(fileKey.trim())) {
          record.addError("file_key", "File Key must be a valid GUID");
        }
      }

      // User validation warning
      if (!user?.trim()) {
        record.addWarning("user", "No User listed, so \"Credentialing System\" will be listed");
      }

      return record;
    })
  );
};