import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const payerLocationsValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("payer-locations", (record) => {
      // Get field values
      const payerName = record.get("payer_name") as string;
      const payerKey = record.get("payer_key") as string;
      const locationName = record.get("location_name") as string;
      const locationKey = record.get("location_key") as string;

      // GUID format regex: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (8-4-4-4-12)
      const guidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

      // Required field validations
      if (!payerKey?.trim()) {
        record.addError("payer_key", "Payer Key required");
      }

      if (!locationKey?.trim()) {
        record.addError("location_key", "Location Key required");
      }

      // Payer Key GUID format validation
      if (payerKey?.trim()) {
        if (!guidRegex.test(payerKey.trim())) {
          record.addError("payer_key", "Payer Key must be a valid GUID");
        }
      }

      // Location Key GUID format validation
      if (locationKey?.trim()) {
        // Handle comma-delimited multiple location keys
        const locationKeys = locationKey.split(',').map(key => key.trim());
        
        for (const key of locationKeys) {
          if (key && !guidRegex.test(key)) {
            record.addError("location_key", "Location Keys must be a valid GUID. Multiple Keys must be comma-delimited.");
            break;
          }
        }
      }

      // Business logic validations would go here:
      // - Check if Payer Key matches existing payer in company
      // - Check if Location Key matches existing location in company  
      // - Check for existing payer-location relationships
      // - Check for archived payers/locations
      // - Check for duplicate payer/location combinations in file

      // Note: These would require API calls to check against existing data
      // and are typically handled in the batch action rather than record hook
      // for performance reasons. Adding placeholders for reference:

      // TODO: Implement in batch action:
      // - "No matching payer found" validation
      // - "No matching location found" validation  
      // - "Existing Payer-Location relationship identified" validation
      // - "Duplicate Payer and Location Key combination found" validation
      // - Archived payer/location warnings

      return record;
    })
  );
};