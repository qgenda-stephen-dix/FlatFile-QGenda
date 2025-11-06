import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validatePayerAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validatePayer" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track Payer Name + Line of Business combinations for duplicate detection
        const seenCombinations = new Map<string, number>();

        const validatedRecords = records.map((record: FlatfileRecord, index: number) => {
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

          const currentRowNumber = index + 1;

          // Duplicate Payer Name + Line of Business combination check
          if (payerName?.trim() && planLineOfBusiness?.trim()) {
            const combination = `${payerName.trim()}|${planLineOfBusiness.trim()}`;
            
            if (seenCombinations.has(combination)) {
              const firstOccurrence = seenCombinations.get(combination)!;
              record.addError(
                "plan_line_of_business", 
                `Line ${currentRowNumber} failed because attempting to populate same record as Line ${firstOccurrence}.`
              );
            } else {
              seenCombinations.set(combination, currentRowNumber);
            }
          }

          // Apply all the same validations from the listener
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

          // TODO: Implement API-based validations:
          // 1. Check if Payer Name + Line of Business already exists in company
          // if (payerName && planLineOfBusiness) {
          //   // API call to check existing payers
          //   // if (payerExists) {
          //   //   record.addError("payer_name", "Payer already exists in company.");
          //   // }
          // }

          // 2. Validate location keys exist in company
          // if (locationKeys?.trim()) {
          //   const keys = locationKeys.split(',').map(key => key.trim());
          //   for (const key of keys) {
          //     if (key && guidRegex.test(key)) {
          //       // API call to validate location exists
          //       // if (!locationExists) {
          //       //   record.addError("location_keys", "No matching location found.");
          //       // }
          //     }
          //   }
          // }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Payer validation:", error);
        throw error;
      }
    }
  );
};