import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateLocationAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validate-location" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;
        
        if (!records || records.length === 0) {
          console.log("No Location records found to validate");
          return;
        }

        console.log(`Processing ${records.length} location records`);        // Track duplicates and validation issues
        const duplicateExternalIds = new Set<string>();
        const duplicateLocationNames = new Set<string>();
        const duplicateLocationIds = new Set<string>();
        const externalIdCombos = new Map<string, number>();
        const locationNames = new Map<string, number>();
        const locationIdMap = new Map<string, number>();

        // First pass: identify duplicates
        console.log("Checking for duplicates");
        
        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const locationName = record.get("locationName") as string;
          const locationId = record.get("locationId") as string;

          // Check for duplicate External ID + External ID Type combinations
          if (externalId && externalIdType) {
            const combo = `${externalId}_${externalIdType}`;
            if (externalIdCombos.has(combo)) {
              duplicateExternalIds.add(combo);
            } else {
              externalIdCombos.set(combo, i);
            }
          }

          // Check for duplicate Location Names
          if (locationName) {
            const lowerLocationName = locationName.toLowerCase();
            if (locationNames.has(lowerLocationName)) {
              duplicateLocationNames.add(lowerLocationName);
            } else {
              locationNames.set(lowerLocationName, i);
            }
          }

          // Check for duplicate Location IDs within and across records
          if (locationId) {
            const locationIds = locationId.split('|');
            for (const id of locationIds) {
              const trimmedId = id.trim();
              if (trimmedId) {
                if (locationIdMap.has(trimmedId)) {
                  duplicateLocationIds.add(trimmedId);
                } else {
                  locationIdMap.set(trimmedId, i);
                }
              }
            }
          }
        }

        // Second pass: apply validations and errors
        console.log("Applying validation results");
        
        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          const errors: string[] = [];
          const warnings: string[] = [];

          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const locationName = record.get("locationName") as string;
          const locationId = record.get("locationId") as string;
          const locationCategory = record.get("locationCategory") as string;

          // Duplicate External ID + External ID Type validation
          if (externalId && externalIdType) {
            const combo = `${externalId}_${externalIdType}`;
            if (duplicateExternalIds.has(combo)) {
              errors.push("Duplicate External ID and External ID Type combination found in file");
            }
          }

          // Duplicate Location Name validation
          if (locationName) {
            const lowerLocationName = locationName.toLowerCase();
            if (duplicateLocationNames.has(lowerLocationName)) {
              errors.push("Location Name must be unique");
            }
          }

          // Duplicate Location ID validation
          if (locationId) {
            const locationIds = locationId.split('|');
            const seenIdsInThisRecord = new Set<string>();
            
            for (const id of locationIds) {
              const trimmedId = id.trim();
              if (trimmedId) {
                // Check for duplicates within the same record
                if (seenIdsInThisRecord.has(trimmedId)) {
                  errors.push("Duplicate Location ID found within the same record");
                } else {
                  seenIdsInThisRecord.add(trimmedId);
                }
                
                // Check for duplicates across records
                if (duplicateLocationIds.has(trimmedId)) {
                  errors.push("Duplicate Location ID found");
                }
              }
            }
          }

          // External ID Type specific validations
          if (externalIdType === "Location Key") {
            // UUID validation for Location Key
            if (externalId) {
              const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              if (!uuidRegex.test(externalId)) {
                errors.push("Location Key formatted incorrectly");
              }
            }
          } else if (externalIdType === "Location ID") {
            // For Location ID type, verify all Location IDs match existing locations
            // This would typically require database lookup in a real implementation
            // For now, we'll add a placeholder validation
            if (locationId) {
              // This validation would check against existing locations in the database
              // errors.push("No matching Location found");
            }
          }

          // Location Category validation
          if (locationCategory && !["", "Appointment", "Practice"].includes(locationCategory)) {
            errors.push("Location Category not supported");
          }

          // Business rule validations
          const contactInformationSameAsCorporateEntity = record.get("contactInformationSameAsCorporateEntity") as string;
          const correspondenceSameAsCorporateEntity = record.get("correspondenceSameAsCorporateEntity") as string;
          const billingAddressSameAsCorporateEntity = record.get("billingAddressSameAsCorporateEntity") as string;
          const locationDetailIdsSameAsCorporateEntity = record.get("locationDetailIdsSameAsCorporateEntity") as string;

          // Warn about "Same as Corporate Entity" implications
          if (contactInformationSameAsCorporateEntity === "Y") {
            warnings.push("Contact Information will be ignored and Corporate Entity values will be used");
          }
          if (correspondenceSameAsCorporateEntity === "Y") {
            warnings.push("Correspondence Information will be ignored and Corporate Entity values will be used");
          }
          if (billingAddressSameAsCorporateEntity === "Y") {
            warnings.push("Billing Address will be ignored and Corporate Entity values will be used");
          }
          if (locationDetailIdsSameAsCorporateEntity === "Y") {
            warnings.push("Location Detail IDs will be ignored and Corporate Entity values will be used");
          }

          // Operating hours validation - closed day logic
          const dayClosedFields = [
            { closed: record.get("sundayClosed"), start: record.get("sundayStartTime"), end: record.get("sundayEndTime"), day: "Sunday" },
            { closed: record.get("mondayClosed"), start: record.get("mondayStartTime"), end: record.get("mondayEndTime"), day: "Monday" },
            { closed: record.get("tuesdayClosed"), start: record.get("tuesdayStartTime"), end: record.get("tuesdayEndTime"), day: "Tuesday" },
            { closed: record.get("wednesdayClosed"), start: record.get("wednesdayStartTime"), end: record.get("wednesdayEndTime"), day: "Wednesday" },
            { closed: record.get("thursdayClosed"), start: record.get("thursdayStartTime"), end: record.get("thursdayEndTime"), day: "Thursday" },
            { closed: record.get("fridayClosed"), start: record.get("fridayStartTime"), end: record.get("fridayEndTime"), day: "Friday" },
            { closed: record.get("saturdayClosed"), start: record.get("saturdayStartTime"), end: record.get("saturdayEndTime"), day: "Saturday" }
          ];

          for (const dayInfo of dayClosedFields) {
            if (dayInfo.closed === "Y" && (dayInfo.start || dayInfo.end)) {
              warnings.push(`${dayInfo.day} is marked as closed but has start or end times - times will be ignored`);
            }
          }

          // Country and State validation warnings for address sections
          const addressSections = [
            { 
              country: record.get("contactCountry"), 
              state: record.get("contactStateProvince"), 
              section: "Contact" 
            },
            { 
              country: record.get("correspondenceCountry"), 
              state: record.get("correspondenceStateProvince"), 
              section: "Correspondence" 
            },
            { 
              country: record.get("billingCountry"), 
              state: record.get("billingStateProvince"), 
              section: "Billing" 
            }
          ];

          for (const addr of addressSections) {
            if (addr.country && addr.state) {
              // This would require country/state validation against database
              // For now, add a general validation message
              // warnings.push(`${addr.section} Country and State combination should be verified`);
            }
          }

          // Apply all errors to the record
          for (const error of errors) {
            record.addError("*", error);
          }

          // Apply all warnings to the record
          for (const warning of warnings) {
            record.addWarning("*", warning);
          }
        }

        console.log(`Location validation completed for ${records.length} records`);

      } catch (error) {
        console.error("Location validation error:", error);
        throw new Error(`Location validation failed: ${error.message}`);
      }
    }
  );
};