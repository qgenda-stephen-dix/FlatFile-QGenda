import { FlatfileListener } from "@flatfile/listener";
import api from "@flatfile/api";

export const providerPrivilegesBatchValidationHook = (listener: FlatfileListener) => {
  listener.filter({ job: "workbook:providerPrivilegesValidateAction" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { jobId, spaceId } = event.context;
      
      try {
        await api.jobs.ack(jobId, {
          info: "Starting Provider Privileges batch validation...",
          progress: 10,
        });

        const sheets = await api.sheets.list({ workbookId: event.context.workbookId });
        const providerPrivilegesSheet = sheets.data.find(sheet => sheet.config.slug === "provider_privileges");
        
        if (!providerPrivilegesSheet) {
          throw new Error("Provider Privileges sheet not found");
        }

        await api.jobs.ack(jobId, {
          info: "Loading Provider Privileges records...",
          progress: 20,
        });

        const records = await api.records.get(providerPrivilegesSheet.id);
        let totalErrors = 0;
        let totalWarnings = 0;
        let totalRecords = records.data.records?.length || 0;

        // Track duplicates and validation data
        const externalIdMap = new Map<string, number[]>();
        const locationKeyMap = new Map<string, number[]>();
        const privilegeNameMap = new Map<string, number[]>();
        
        await api.jobs.ack(jobId, {
          info: "Validating duplicate records and business rules...",
          progress: 40,
        });

        // First pass: collect all records for duplicate checking and validation
        records.data.records?.forEach((record, index) => {
          const externalId = record.values?.external_id?.value as string;
          const externalIdType = record.values?.external_id_type?.value as string;
          const locationKey = record.values?.location_key?.value as string;
          const privilegeName = record.values?.privilege_name?.value as string;
          
          // Track External ID + Type combinations for duplicate detection
          if (externalId && externalIdType && externalId.trim() && externalIdType.trim()) {
            const key = `${externalId.trim()}|${externalIdType.trim()}`.toLowerCase();
            if (!externalIdMap.has(key)) {
              externalIdMap.set(key, []);
            }
            externalIdMap.get(key)!.push(index);
          }
          
          // Track Location Keys
          if (locationKey && locationKey.trim()) {
            const key = locationKey.trim().toLowerCase();
            if (!locationKeyMap.has(key)) {
              locationKeyMap.set(key, []);
            }
            locationKeyMap.get(key)!.push(index);
          }
          
          // Track Privilege Names for reference
          if (privilegeName && privilegeName.trim()) {
            const key = privilegeName.trim().toLowerCase();
            if (!privilegeNameMap.has(key)) {
              privilegeNameMap.set(key, []);
            }
            privilegeNameMap.get(key)!.push(index);
          }
        });

        await api.jobs.ack(jobId, {
          info: "Processing business rule validations...",
          progress: 60,
        });

        // Second pass: apply business rule validations
        const recordUpdates: any[] = [];

        records.data.records?.forEach((record, index) => {
          const recordUpdate = {
            id: record.id,
            values: { ...record.values }
          };

          let hasUpdates = false;
          const externalId = record.values?.external_id?.value as string;
          const externalIdType = record.values?.external_id_type?.value as string;
          const locationKey = record.values?.location_key?.value as string;
          const privilegeName = record.values?.privilege_name?.value as string;
          const status = record.values?.status?.value as string;
          const grantedBy = record.values?.granted_by?.value as string;
          const apptDate = record.values?.appt_date?.value as string;
          const reapptDate = record.values?.reappt_date?.value as string;

          // External ID + Type duplicate validation
          if (externalId && externalIdType && externalId.trim() && externalIdType.trim()) {
            const key = `${externalId.trim()}|${externalIdType.trim()}`.toLowerCase();
            const duplicateIndices = externalIdMap.get(key) || [];
            if (duplicateIndices.length > 1) {
              recordUpdate.values.external_id = {
                ...record.values.external_id,
                messages: [
                  ...(record.values.external_id.messages || []),
                  {
                    type: "warn" as const,
                    message: `Duplicate External ID + Type combination found in rows: ${duplicateIndices.map(i => i + 1).join(", ")}`
                  }
                ]
              };
              hasUpdates = true;
              totalWarnings++;
            }
          }

          // Location Key validation (basic format check already done in field validation)
          if (locationKey && locationKey.trim()) {
            // Simulate location key validation against company locations
            // In production, this would check against actual location database
            const guidRegex = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
            if (guidRegex.test(locationKey.trim())) {
              // Simulate "location not found" for specific test GUIDs
              if (locationKey.trim().toLowerCase().includes('00000000')) {
                recordUpdate.values.location_key = {
                  ...record.values.location_key,
                  messages: [
                    ...(record.values.location_key.messages || []),
                    {
                      type: "error" as const,
                      message: "No matching location found."
                    }
                  ]
                };
                hasUpdates = true;
                totalErrors++;
              }
              
              // Simulate "provider not assigned to location" for specific test cases
              if (locationKey.trim().toLowerCase().includes('99999999')) {
                recordUpdate.values.location_key = {
                  ...record.values.location_key,
                  messages: [
                    ...(record.values.location_key.messages || []),
                    {
                      type: "error" as const,
                      message: "Provider is not assigned to this location."
                    }
                  ]
                };
                hasUpdates = true;
                totalErrors++;
              }
            }
          }

          // Privilege Name validation
          if (privilegeName && privilegeName.trim()) {
            const name = privilegeName.trim();
            
            // Simulate privilege name validation against company privileges
            // In production, this would check against actual privilege database
            if (name.toLowerCase().includes('invalid') || name.toLowerCase().includes('test')) {
              recordUpdate.values.privilege_name = {
                ...record.values.privilege_name,
                messages: [
                  ...(record.values.privilege_name.messages || []),
                  {
                    type: "error" as const,
                    message: "Privilege Name does not match an existing Privilege Name within the Company"
                  }
                ]
              };
              hasUpdates = true;
              totalErrors++;
            }
            
            // Simulate duplicate privilege names in company
            if (name.toLowerCase().includes('duplicate')) {
              recordUpdate.values.privilege_name = {
                ...record.values.privilege_name,
                messages: [
                  ...(record.values.privilege_name.messages || []),
                  {
                    type: "error" as const,
                    message: "Privilege Name matches more than one existing Privilege"
                  }
                ]
              };
              hasUpdates = true;
              totalErrors++;
            }
          }

          // Status validation
          if (status && status.trim()) {
            // Common privilege statuses for basic validation
            const validStatuses = [
              'approved', 'pending', 'denied', 'expired', 'suspended', 'active', 'inactive'
            ];
            
            if (!validStatuses.includes(status.trim().toLowerCase())) {
              recordUpdate.values.status = {
                ...record.values.status,
                messages: [
                  ...(record.values.status.messages || []),
                  {
                    type: "error" as const,
                    message: "Status does not match an existing Status within the Company"
                  }
                ]
              };
              hasUpdates = true;
              totalErrors++;
            }
          }

          // Granted By validation
          if (grantedBy && grantedBy.trim()) {
            // Simulate granted by validation
            // In production, this would check against actual granted by list
            if (grantedBy.trim().length < 3) {
              recordUpdate.values.granted_by = {
                ...record.values.granted_by,
                messages: [
                  ...(record.values.granted_by.messages || []),
                  {
                    type: "error" as const,
                    message: "Granted By does not match an existing Granted By within the Company"
                  }
                ]
              };
              hasUpdates = true;
              totalErrors++;
            }
          }

          // External ID format validation based on type (enhanced)
          if (externalId && externalIdType && externalId.trim() && externalIdType.trim()) {
            const id = externalId.trim();
            const type = externalIdType.trim();
            
            // Simulate provider matching validation
            // In production, this would check against actual provider database
            if (type === "NPI" && id === "1234567890") {
              recordUpdate.values.external_id = {
                ...record.values.external_id,
                messages: [
                  ...(record.values.external_id.messages || []),
                  {
                    type: "error" as const,
                    message: "No matching provider found"
                  }
                ]
              };
              hasUpdates = true;
              totalErrors++;
            }
            
            // Simulate ID collision detection
            if (id.toLowerCase().includes('duplicate')) {
              recordUpdate.values.external_id = {
                ...record.values.external_id,
                messages: [
                  ...(record.values.external_id.messages || []),
                  {
                    type: "error" as const,
                    message: `${type} matches the ${type} of an existing provider`
                  }
                ]
              };
              hasUpdates = true;
              totalErrors++;
            }
          }

          // Provider and location status warnings
          if (externalId && externalId.trim().toLowerCase().includes('inactive')) {
            recordUpdate.values.external_id = {
              ...record.values.external_id,
              messages: [
                ...(record.values.external_id.messages || []),
                {
                  type: "warn" as const,
                  message: "Provider was updated but is inactive."
                }
              ]
            };
            hasUpdates = true;
            totalWarnings++;
          }
          
          if (locationKey && locationKey.trim().toLowerCase().includes('archived')) {
            recordUpdate.values.location_key = {
              ...record.values.location_key,
              messages: [
                ...(record.values.location_key.messages || []),
                {
                  type: "warn" as const,
                  message: "Privilege history was added/updated but Location is archived in Settings"
                }
              ]
            };
            hasUpdates = true;
            totalWarnings++;
          }

          // Provider type/specialty mismatch warning
          if (privilegeName && privilegeName.trim().toLowerCase().includes('mismatch')) {
            recordUpdate.values.privilege_name = {
              ...record.values.privilege_name,
              messages: [
                ...(record.values.privilege_name.messages || []),
                {
                  type: "warn" as const,
                  message: "Privilege (Provider Type, Specialty, Sub-Specialty) does not match Provider's (Provider Type, Specialty, Sub-Specialty)"
                }
              ]
            };
            hasUpdates = true;
            totalWarnings++;
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
            await api.records.update(providerPrivilegesSheet.id, batch);
          }
        }

        // Complete the job
        await api.jobs.complete(jobId, {
          outcome: {
            message: `Provider Privileges validation completed. Processed ${totalRecords} records with ${totalErrors} errors and ${totalWarnings} warnings.`,
            next: {
              type: "wait",
            },
          },
        });

      } catch (error: any) {
        console.error("Provider Privileges batch validation error:", error);
        
        await api.jobs.fail(jobId, {
          outcome: {
            message: `Provider Privileges validation failed: ${error.message}`,
          },
        });
      }
    });
  });
};