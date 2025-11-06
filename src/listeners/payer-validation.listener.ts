import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const payerValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("payer", (record) => {
      // Get all field values
      const payerKey = record.get("payer_key") as string;
      const payerName = record.get("payer_name") as string;
      const planLineOfBusiness = record.get("plan_line_of_business") as string;
      const states = record.get("states") as string;
      const website = record.get("website") as string;
      const primaryContactName = record.get("primary_contact_name") as string;
      const primaryContactEmail = record.get("primary_contact_email") as string;
      const primaryContactPhone = record.get("primary_contact_phone") as string;
      const primaryContactPhoneExt = record.get("primary_contact_phone_ext") as string;
      const primaryContactFax = record.get("primary_contact_fax") as string;
      const secondaryContactName = record.get("secondary_contact_name") as string;
      const secondaryContactEmail = record.get("secondary_contact_email") as string;
      const secondaryContactPhone = record.get("secondary_contact_phone") as string;
      const secondaryContactPhoneExt = record.get("secondary_contact_phone_ext") as string;
      const secondaryContactFax = record.get("secondary_contact_fax") as string;
      const generalNotes = record.get("general_notes") as string;
      const instructions = record.get("instructions") as string;
      const lineOfBusinessNotes = record.get("line_of_business_notes") as string;
      const locationKeys = record.get("location_keys") as string;

      // Required field validation
      if (!payerName?.trim()) {
        record.addError("payer_name", "Payer Name required");
      }

      // Character limit validations
      if (payerName && payerName.length > 100) {
        record.addError("payer_name", "Payer Name exceeds character limit of 100.");
      }

      if (planLineOfBusiness && planLineOfBusiness.length > 100) {
        record.addError("plan_line_of_business", "Plan/Line of Business exceeds character limit of 100.");
      }

      if (website && website.length > 2047) {
        record.addError("website", "Website exceeds character limit of 2047");
      }

      if (primaryContactName && primaryContactName.length > 50) {
        record.addError("primary_contact_name", "Primary Contact Name exceeds character limit of 50.");
      }

      if (primaryContactEmail && primaryContactEmail.length > 100) {
        record.addError("primary_contact_email", "Primary Contact Email exceeds character limit of 100.");
      }

      if (secondaryContactName && secondaryContactName.length > 50) {
        record.addError("secondary_contact_name", "Secondary Contact Name exceeds character limit of 50.");
      }

      if (secondaryContactEmail && secondaryContactEmail.length > 100) {
        record.addError("secondary_contact_email", "Secondary Contact Email exceeds character limit of 100.");
      }

      if (generalNotes && generalNotes.length > 10000) {
        record.addError("general_notes", "General Notes exceeds character limit of 10000.");
      }

      if (instructions && instructions.length > 10000) {
        record.addError("instructions", "Instructions exceeds character limit of 10000.");
      }

      if (lineOfBusinessNotes && lineOfBusinessNotes.length > 10000) {
        record.addError("line_of_business_notes", "Line of Business Notes exceeds character limit of 10000.");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (primaryContactEmail?.trim() && !emailRegex.test(primaryContactEmail.trim())) {
        record.addError("primary_contact_email", "Primary Contact Email is not a valid email.");
      }

      if (secondaryContactEmail?.trim() && !emailRegex.test(secondaryContactEmail.trim())) {
        record.addError("secondary_contact_email", "Secondary Contact Email is not a valid email.");
      }

      // Phone number validation (9, 10, or 12 digits only)
      const phoneRegex = /^[0-9]{9}$|^[0-9]{10}$|^[0-9]{12}$/;
      
      if (primaryContactPhone?.trim() && !phoneRegex.test(primaryContactPhone.trim())) {
        record.addError("primary_contact_phone", "Primary Contact Phone must be 9, 10, or 12-digit number");
      }

      if (primaryContactFax?.trim() && !phoneRegex.test(primaryContactFax.trim())) {
        record.addError("primary_contact_fax", "Primary Contact Fax must be 9, 10, or 12-digit number");
      }

      if (secondaryContactPhone?.trim() && !phoneRegex.test(secondaryContactPhone.trim())) {
        record.addError("secondary_contact_phone", "Secondary Contact Phone must be 9, 10, or 12-digit number");
      }

      if (secondaryContactFax?.trim() && !phoneRegex.test(secondaryContactFax.trim())) {
        record.addError("secondary_contact_fax", "Secondary Contact Fax must be 9, 10, or 12-digit number");
      }

      // Phone extension validation (number up to 20 digits)
      const extensionRegex = /^[0-9]{1,20}$/;
      
      if (primaryContactPhoneExt?.trim() && !extensionRegex.test(primaryContactPhoneExt.trim())) {
        record.addError("primary_contact_phone_ext", "Primary Contact Phone Ext.' must be a number up to 20 digits in length");
      }

      if (secondaryContactPhoneExt?.trim() && !extensionRegex.test(secondaryContactPhoneExt.trim())) {
        record.addError("secondary_contact_phone_ext", "Secondary Contact Phone Ext.' must be a number up to 20 digits in length");
      }

      // URL validation
      if (website?.trim()) {
        try {
          new URL(website.trim());
        } catch {
          record.addError("website", "URL not valid");
        }
      }

      // GUID validation for location keys
      const guidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
      
      if (locationKeys?.trim()) {
        const keys = locationKeys.split(',').map(key => key.trim());
        for (const key of keys) {
          if (key && !guidRegex.test(key)) {
            record.addError("location_keys", "Location Key must be a valid GUID. Multiple Keys must be comma-delimited.");
            break;
          }
        }
      }

      // State validation would require a predefined list of valid states
      // TODO: Implement state dropdown validation
      // if (states?.trim()) {
      //   const stateList = states.split(',').map(state => state.trim());
      //   const validStates = ['AL', 'AK', 'AZ', ...]; // Full list needed
      //   const invalidStates = stateList.filter(state => !validStates.includes(state));
      //   if (invalidStates.length > 0) {
      //     record.addError("states", `State value(s) [${invalidStates.join(', ')}] not supported`);
      //   }
      // }

      return record;
    })
  );
};