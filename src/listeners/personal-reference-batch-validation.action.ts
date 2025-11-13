import { FlatfileListener } from "@flatfile/listener";
import api from "@flatfile/api";

export const personalReferenceBatchValidationHook = (listener: FlatfileListener) => {
  listener.filter({ job: "workbook:personalReferenceValidateAction" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { jobId, spaceId } = event.context;
      
      try {
        await api.jobs.ack(jobId, {
          info: "Starting Personal Reference batch validation...",
          progress: 10,
        });

        const sheets = await api.sheets.list({ workbookId: event.context.workbookId });
        const personalReferenceSheet = sheets.data.find(sheet => sheet.config.slug === "personal_reference");
        
        if (!personalReferenceSheet) {
          throw new Error("Personal Reference sheet not found");
        }

        await api.jobs.ack(jobId, {
          info: "Loading Personal Reference records...",
          progress: 20,
        });

        const records = await api.records.get(personalReferenceSheet.id);
        let totalErrors = 0;
        let totalWarnings = 0;
        let totalRecords = records.data.records?.length || 0;

        // Track duplicates
        const externalIdMap = new Map<string, number[]>();
        const fullNameMap = new Map<string, number[]>();
        
        await api.jobs.ack(jobId, {
          info: "Validating duplicate records...",
          progress: 40,
        });

        // First pass: collect all records for duplicate checking
        records.data.records?.forEach((record, index) => {
          const externalId = record.values?.external_id?.value as string;
          const fullName = record.values?.full_name?.value as string;
          
          // Track External ID duplicates
          if (externalId && externalId.trim()) {
            const key = externalId.trim().toLowerCase();
            if (!externalIdMap.has(key)) {
              externalIdMap.set(key, []);
            }
            externalIdMap.get(key)!.push(index);
          }
          
          // Track Full Name duplicates
          if (fullName && fullName.trim()) {
            const key = fullName.trim().toLowerCase();
            if (!fullNameMap.has(key)) {
              fullNameMap.set(key, []);
            }
            fullNameMap.get(key)!.push(index);
          }
        });

        await api.jobs.ack(jobId, {
          info: "Processing business rule validations...",
          progress: 60,
        });

        // Second pass: apply duplicate validations and other business rules
        const recordUpdates: any[] = [];

        records.data.records?.forEach((record, index) => {
          const recordUpdate = {
            id: record.id,
            values: { ...record.values }
          };

          let hasUpdates = false;
          const externalId = record.values?.external_id?.value as string;
          const fullName = record.values?.full_name?.value as string;
          const providerName = record.values?.provider_name?.value as string;

          // Duplicate External ID validation
          if (externalId && externalId.trim()) {
            const key = externalId.trim().toLowerCase();
            const duplicateIndices = externalIdMap.get(key) || [];
            if (duplicateIndices.length > 1) {
              recordUpdate.values.external_id = {
                ...record.values.external_id,
                messages: [
                  ...(record.values.external_id.messages || []),
                  {
                    type: "error" as const,
                    message: `Duplicate External Id found in rows: ${duplicateIndices.map(i => i + 1).join(", ")}`
                  }
                ]
              };
              hasUpdates = true;
              totalErrors++;
            }
          }

          // Duplicate Full Name validation (warning only)
          if (fullName && fullName.trim()) {
            const key = fullName.trim().toLowerCase();
            const duplicateIndices = fullNameMap.get(key) || [];
            if (duplicateIndices.length > 1) {
              recordUpdate.values.full_name = {
                ...record.values.full_name,
                messages: [
                  ...(record.values.full_name.messages || []),
                  {
                    type: "warn" as const,
                    message: `Duplicate Full Name found in rows: ${duplicateIndices.map(i => i + 1).join(", ")}`
                  }
                ]
              };
              hasUpdates = true;
              totalWarnings++;
            }
          }

          // Provider Name validation (business rule)
          if (providerName && providerName.trim()) {
            // Check if provider name contains only valid characters
            const invalidChars = /[<>\"&]/;
            if (invalidChars.test(providerName)) {
              recordUpdate.values.provider_name = {
                ...record.values.provider_name,
                messages: [
                  ...(record.values.provider_name.messages || []),
                  {
                    type: "error" as const,
                    message: "Provider Name contains invalid characters: < > \" &"
                  }
                ]
              };
              hasUpdates = true;
              totalErrors++;
            }
          }

          // Relationship validation business rules
          const relationship = record.values?.relationship?.value as string;
          if (relationship && relationship.trim()) {
            const rel = relationship.trim().toLowerCase();
            
            // Check for common relationship terms that might need standardization
            const standardRelationships = [
              'colleague', 'supervisor', 'subordinate', 'peer', 'mentor', 
              'former colleague', 'department head', 'medical director',
              'chief of staff', 'residency director', 'fellowship director'
            ];
            
            const isStandardRelationship = standardRelationships.some(standard => 
              rel.includes(standard.toLowerCase())
            );
            
            if (!isStandardRelationship && relationship.length > 50) {
              recordUpdate.values.relationship = {
                ...record.values.relationship,
                messages: [
                  ...(record.values.relationship.messages || []),
                  {
                    type: "warn" as const,
                    message: "Consider using a standard relationship term for consistency"
                  }
                ]
              };
              hasUpdates = true;
              totalWarnings++;
            }
          }

          // Country/State validation business rule
          const country = record.values?.country?.value as string;
          const state = record.values?.state?.value as string;
          
          if (country && state) {
            const countryUpper = country.trim().toUpperCase();
            const stateUpper = state.trim().toUpperCase();
            
            // US state validation
            if (countryUpper === "US" || countryUpper === "USA" || countryUpper === "UNITED STATES") {
              const validUSStates = [
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
                'DC'  // District of Columbia
              ];
              
              if (!validUSStates.includes(stateUpper)) {
                recordUpdate.values.state = {
                  ...record.values.state,
                  messages: [
                    ...(record.values.state.messages || []),
                    {
                      type: "error" as const,
                      message: "Invalid US state code. Use standard 2-letter abbreviation"
                    }
                  ]
                };
                hasUpdates = true;
                totalErrors++;
              }
            }
          }

          if (hasUpdates) {
            recordUpdates.push(recordUpdate);
          }
        });

        // Apply all record updates in batches
        if (recordUpdates.length > 0) {
          await api.jobs.ack(jobId, {
            info: "Applying validation results...",
            progress: 80,
          });

          const batchSize = 100;
          for (let i = 0; i < recordUpdates.length; i += batchSize) {
            const batch = recordUpdates.slice(i, i + batchSize);
            await api.records.update(personalReferenceSheet.id, batch);
          }
        }

        // Complete the job
        await api.jobs.complete(jobId, {
          outcome: {
            message: `Personal Reference validation completed. Processed ${totalRecords} records with ${totalErrors} errors and ${totalWarnings} warnings.`,
            next: {
              type: "wait",
            },
          },
        });

      } catch (error: any) {
        console.error("Personal Reference batch validation error:", error);
        
        await api.jobs.fail(jobId, {
          outcome: {
            message: `Personal Reference validation failed: ${error.message}`,
          },
        });
      }
    });
  });
};