import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validatePayerLocationsAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validatePayerLocations" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track combinations seen in this file for duplicate detection
        const seenCombinations = new Set<string>();

        const validatedRecords = records.map((record: FlatfileRecord, index: number) => {
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

            // Check for duplicate combinations in file
            if (payerKey?.trim()) {
              const locationKeys = locationKey.split(',').map(key => key.trim());
              
              for (const locKey of locationKeys) {
                if (locKey) {
                  const combination = `${payerKey.trim()}|${locKey}`;
                  
                  if (seenCombinations.has(combination)) {
                    record.addError("location_key", "Duplicate Payer and Location Key combination found.");
                  } else {
                    seenCombinations.add(combination);
                  }
                }
              }
            }
          }

          // TODO: Implement API-based validations:
          // These would require calls to QGenda API to validate against existing data

          // 1. Validate Payer Key exists in company
          // if (payerKey && guidRegex.test(payerKey)) {
          //   // API call to check if payer exists
          //   // if (!payerExists) {
          //   //   record.addError("payer_key", "No matching payer found.");
          //   // }
          //   // if (payerArchived) {
          //   //   record.addInfo("payer_key", "Payer was archived in Settings. These payer-locations associations have been added as archived.");
          //   // }
          // }

          // 2. Validate Location Key exists in company
          // if (locationKey && validLocationKeys) {
          //   // For each location key, check if it exists
          //   // if (!locationExists) {
          //   //   record.addError("location_key", `[Location Key ${locKey}] - No matching location found.`);
          //   // }
          //   // if (locationArchived) {
          //   //   record.addInfo("location_key", "Data was updated, but location is archived in Settings");
          //   // }
          // }

          // 3. Check for existing payer-location relationships
          // if (existingRelationship) {
          //   if (relationshipActive) {
          //     record.addError("location_key", `[Location Key ${locKey}] has an active association with this Payer.`);
          //   } else {
          //     record.addInfo("location_key", `[Location Key ${locKey}] was archived for this Payer. This payer-location association has been updated to be un-archived.`);
          //   }
          // }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Payer-Locations validation:", error);
        throw error;
      }
    }
  );
};