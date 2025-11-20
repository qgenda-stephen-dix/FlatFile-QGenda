import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateProviderDemographicImportAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateProviderDemographicImport" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track IDs for duplicate detection
        const externalIdMap = new Map<string, number>();
        const npiMap = new Map<string, number>();
        const providerIdMap = new Map<string, number>();
        const internalIdMap = new Map<string, number>();
        const emrIdMap = new Map<string, number>();

        const duplicateExternalIds = new Set<string>();
        const duplicateNpis = new Set<string>();
        const duplicateProviderIds = new Set<string>();
        const duplicateInternalIds = new Set<string>();
        const duplicateEmrIds = new Set<string>();

        // First pass: identify duplicates within the file
        records.forEach((record: FlatfileRecord, index: number) => {
          const externalId = record.get("External ID") as string;
          const externalIdType = record.get("External ID Type") as string;
          const npi = record.get("National Provider Identification Number (NPI)") as string;
          const providerId = record.get("Provider ID") as string;
          const internalId = record.get("Internal ID") as string;
          const emrId = record.get("EMR ID") as string;

          // Track External ID and Type combinations
          if (externalId?.trim() && externalIdType?.trim()) {
            const idKey = `${externalIdType}:${externalId}`.toLowerCase();
            if (externalIdMap.has(idKey)) {
              duplicateExternalIds.add(idKey);
            } else {
              externalIdMap.set(idKey, index);
            }
          }

          // Track NPI duplicates
          if (npi?.trim()) {
            if (npiMap.has(npi)) {
              duplicateNpis.add(npi);
            } else {
              npiMap.set(npi, index);
            }
          }

          // Track Provider ID duplicates
          if (providerId?.trim()) {
            if (providerIdMap.has(providerId)) {
              duplicateProviderIds.add(providerId);
            } else {
              providerIdMap.set(providerId, index);
            }
          }

          // Track Internal ID duplicates
          if (internalId?.trim()) {
            if (internalIdMap.has(internalId)) {
              duplicateInternalIds.add(internalId);
            } else {
              internalIdMap.set(internalId, index);
            }
          }

          // Track EMR ID duplicates
          if (emrId?.trim()) {
            if (emrIdMap.has(emrId)) {
              duplicateEmrIds.add(emrId);
            } else {
              emrIdMap.set(emrId, index);
            }
          }
        });

        // Second pass: apply cross-record validations
        const validatedRecords = records.map((record: FlatfileRecord, index: number) => {
          const externalId = record.get("External ID") as string;
          const externalIdType = record.get("External ID Type") as string;
          const firstName = record.get("First Name") as string;
          const lastName = record.get("Last Name") as string;
          const npi = record.get("National Provider Identification Number (NPI)") as string;
          const providerId = record.get("Provider ID") as string;
          const internalId = record.get("Internal ID") as string;
          const emrId = record.get("EMR ID") as string;
          const providerType = record.get("Provider Type") as string;
          const corporateEmploymentType = record.get("Corporate Employment Type") as string;
          const countryOfBirth = record.get("Country of Birth") as string;
          const stateOfBirth = record.get("State of Birth") as string;
          const specialty = record.get("Specialty") as string;
          const subspecialty = record.get("Subspecialty") as string;
          const languagesSpoken = record.get("Languages Spoken") as string;
          const race = record.get("Race") as string;

          // Duplicate validation within import file
          if (externalId?.trim() && externalIdType?.trim()) {
            const idKey = `${externalIdType}:${externalId}`.toLowerCase();
            if (duplicateExternalIds.has(idKey)) {
              record.addError("External ID", "Duplicate External ID and Type found");
            }
          }

          if (npi?.trim() && duplicateNpis.has(npi)) {
            record.addError("National Provider Identification Number (NPI)", "Duplicate NPI found");
          }

          if (providerId?.trim() && duplicateProviderIds.has(providerId)) {
            record.addError("Provider ID", "Duplicate Provider ID found");
          }

          if (internalId?.trim() && duplicateInternalIds.has(internalId)) {
            record.addError("Internal ID", "Duplicate Internal ID found");
          }

          if (emrId?.trim() && duplicateEmrIds.has(emrId)) {
            record.addError("EMR ID", "Duplicate EMR ID found");
          }

          // External ID format validation
          if (externalId?.trim()) {
            // Validate NPI or Provider ID format (not checking database existence, just format)
            if (externalIdType === "NPI" && !/^\d{10}$/.test(externalId)) {
              record.addError("External ID", "External ID not valid");
            }
            
            // Add other format validations as needed for different ID types
            if (externalIdType === "ProviderID" && externalId.length > 64) {
              record.addError("External ID", "External ID not valid");
            }
          }

          // Provider matching simulation (would connect to actual database)
          if (externalId?.trim() && externalIdType?.trim()) {
            // Simulate provider lookup
            if (externalId === "NOTFOUND") {
              record.addError("External ID", "No matching provider found");
            }
            
            // Simulate multiple matches
            if (externalId === "MULTIPLE") {
              record.addError("External ID", `${externalIdType} matches the ${externalIdType} of more than one existing provider`);
            }

            // Simulate ID matches existing provider (would be database lookup)
            if (externalId === "EXISTS123") {
              record.addError("External ID", `${externalIdType} matches the ${externalIdType} of an existing provider`);
            }
          }

          // Provider Type validation (would connect to company settings)
          if (providerType?.trim()) {
            // Simulate company-specific provider type validation
            const validProviderTypes = ["Physician", "Nurse Practitioner", "Physician Assistant", "Registered Nurse"];
            if (!validProviderTypes.includes(providerType)) {
              record.addError("Provider Type", "Provider Type not defined for company");
            }
          }

          // Corporate Employment Type validation (would connect to company settings)
          if (corporateEmploymentType?.trim()) {
            // Simulate company-specific employment type validation
            const validEmploymentTypes = ["Employee", "Contractor", "Volunteer", "Locum Tenens"];
            if (!validEmploymentTypes.includes(corporateEmploymentType)) {
              record.addError("Corporate Employment Type", "Corporate Employment Type not defined for company");
            }
          }

          // Country and State cross-validation
          if (countryOfBirth && stateOfBirth) {
            // Simulate country/state validation
            if (countryOfBirth === "United States" || countryOfBirth === "US") {
              const usStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
              if (!usStates.includes(stateOfBirth.toUpperCase())) {
                record.addWarning("State of Birth", `${stateOfBirth} is not a valid subdivison value for Country of Birth.`);
              }
            }
          }

          // Country of Birth validation (simulate company settings)
          if (countryOfBirth?.trim()) {
            // This would check against Settings > Configurable Lists > Countries
            const recognizedCountries = ["United States", "Canada", "Mexico", "United Kingdom", "Germany", "France", "India", "China", "Japan"];
            if (!recognizedCountries.includes(countryOfBirth)) {
              record.addError("Country of Birth", "Country of Birth is not recognized");
            }
          }

          // State validation for existing records (simulate database check)
          if (stateOfBirth && !countryOfBirth && externalId?.trim()) {
            // This would check if updating existing record without providing country
            record.addError("State of Birth", "Country of Birth and State of Birth must be provided when updating State of Birth.");
          }

          // Specialty validation (simulate Settings > Configurable Lists)
          if (specialty?.trim()) {
            const validSpecialties = ["Internal Medicine", "Cardiology", "Emergency Medicine", "Family Medicine", "Surgery", "Pediatrics", "Neurology", "Orthopedics", "Radiology", "Anesthesiology"];
            if (!validSpecialties.includes(specialty)) {
              record.addError("Specialty", "Specialty not supported");
            }
          }

          // Subspecialty validation (simulate Settings > Configurable Lists)
          if (subspecialty?.trim()) {
            const validSubspecialties = ["Interventional Cardiology", "Pediatric Cardiology", "Emergency Critical Care", "Sports Medicine", "Neurosurgery", "Orthopedic Surgery"];
            if (!validSubspecialties.includes(subspecialty)) {
              record.addError("Subspecialty", "Subspecialty not supported");
            }
          }

          // Languages validation (simulate company language list)
          if (languagesSpoken?.trim()) {
            const languages = languagesSpoken.split("|").map(lang => lang.trim());
            const validLanguages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Arabic", "Portuguese", "Italian"];
            
            languages.forEach(language => {
              if (language && !validLanguages.includes(language)) {
                record.addError("Languages Spoken", "Languages Spoken not supported");
              }
            });
          }

          // Race validation (simulate drop-down values)
          if (race?.trim()) {
            const validRaces = ["American Indian or Alaska Native", "Asian", "Black or African American", "Native Hawaiian or Other Pacific Islander", "White", "Other", "Declined to Answer"];
            if (!validRaces.includes(race)) {
              record.addError("Race", "Race not supported");
            }
          }

          // Name matching warning (simulate existing provider check)
          if (firstName?.trim() && lastName?.trim()) {
            // This would check against existing providers in the database
            if (firstName.toLowerCase() === "john" && lastName.toLowerCase() === "doe") {
              record.addWarning("First Name", "Provider's First and Last Name match the First and Last Name of an existing provider.");
            }
          }

          // Provider inactive status simulation (would connect to actual provider status)
          if (externalId === "INACTIVE456") {
            record.addWarning("External ID", "Provider was updated but is inactive.");
          }

          // User Defined Fields validation (simulation)
          // In real implementation, this would validate against actual UDF configuration
          // For now, we'll simulate some common UDF patterns
          
          // Text Input UDF simulation
          const simulateTextUDF = (value: string, fieldName: string, maxLength: number = 50) => {
            if (value && value.length > maxLength) {
              record.addError(fieldName, `${fieldName} exceeds character limit of ${maxLength}`);
            }
          };

          // Checkbox UDF simulation
          const simulateCheckboxUDF = (value: string, fieldName: string) => {
            if (value && !["T", "F", ""].includes(value)) {
              record.addError(fieldName, `${fieldName} must be 'T', 'F' or blank`);
            }
          };

          // Date UDF simulation
          const simulateDateUDF = (value: string, fieldName: string) => {
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            if (value && !dateRegex.test(value)) {
              record.addError(fieldName, `${fieldName} must be formatted as m/d/yyyy`);
            }
          };

          // Link UDF simulation
          const simulateLinkUDF = (value: string, fieldName: string) => {
            const urlRegex = /^https?:\/\/[^\s]+$/;
            if (value && !urlRegex.test(value)) {
              record.addError(fieldName, `${fieldName} is not a valid URL`);
            }
          };

          // Multi-Line Text UDF simulation (would check against Settings-defined limit)
          const simulateMultiLineUDF = (value: string, fieldName: string, maxLength: number = 1000) => {
            if (value && value.length > maxLength) {
              record.addError(fieldName, `${fieldName} exceeds character limit of ${maxLength}.`);
            }
          };

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Provider Demographic Import validation:", error);
        throw error;
      }
    }
  );
};