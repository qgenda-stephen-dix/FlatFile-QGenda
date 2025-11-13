import { FlatfileListener } from "@flatfile/listener";
import api from "@flatfile/api";

export const companyPrivilegesBatchValidationHook = (listener: FlatfileListener) => {
  listener.filter({ job: "workbook:companyPrivilegesValidateAction" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { jobId, spaceId } = event.context;
      
      try {
        await api.jobs.ack(jobId, {
          info: "Starting Company Privileges batch validation...",
          progress: 10,
        });

        const sheets = await api.sheets.list({ workbookId: event.context.workbookId });
        const companyPrivilegesSheet = sheets.data.find(sheet => sheet.config.slug === "company_privileges");
        
        if (!companyPrivilegesSheet) {
          throw new Error("Company Privileges sheet not found");
        }

        await api.jobs.ack(jobId, {
          info: "Loading Company Privileges records...",
          progress: 20,
        });

        const records = await api.records.get(companyPrivilegesSheet.id);
        let totalErrors = 0;
        let totalWarnings = 0;
        let totalRecords = records.data.records?.length || 0;

        // Track duplicate ICD/CPT codes within file
        const icdCptCodeMap = new Map<string, number[]>();
        
        await api.jobs.ack(jobId, {
          info: "Validating duplicate ICD/CPT codes...",
          progress: 40,
        });

        // First pass: collect all ICD/CPT codes for duplicate checking
        records.data.records?.forEach((record, index) => {
          const icdCptCode = record.values?.icd_cpt_code?.value as string;
          
          if (icdCptCode && icdCptCode.trim()) {
            const key = icdCptCode.trim().toLowerCase();
            if (!icdCptCodeMap.has(key)) {
              icdCptCodeMap.set(key, []);
            }
            icdCptCodeMap.get(key)!.push(index);
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
          const privilegeName = record.values?.privilege_name?.value as string;
          const icdCptCode = record.values?.icd_cpt_code?.value as string;
          const specialty = record.values?.specialty?.value as string;
          const subspecialty = record.values?.subspecialty?.value as string;

          // Duplicate ICD/CPT Code validation within file
          if (icdCptCode && icdCptCode.trim()) {
            const key = icdCptCode.trim().toLowerCase();
            const duplicateIndices = icdCptCodeMap.get(key) || [];
            if (duplicateIndices.length > 1) {
              recordUpdate.values.icd_cpt_code = {
                ...record.values.icd_cpt_code,
                messages: [
                  ...(record.values.icd_cpt_code.messages || []),
                  {
                    type: "warn" as const,
                    message: `ICD/CPT Code not unique - found in rows: ${duplicateIndices.map(i => i + 1).join(", ")}`
                  }
                ]
              };
              hasUpdates = true;
              totalWarnings++;
            }
          }

          // Privilege Name business rules
          if (privilegeName && privilegeName.trim()) {
            const name = privilegeName.trim();
            
            // Check for duplicate privilege names (business warning)
            // This would typically check against existing privileges in the system
            if (name.toLowerCase().includes('test') || name.toLowerCase().includes('sample')) {
              recordUpdate.values.privilege_name = {
                ...record.values.privilege_name,
                messages: [
                  ...(record.values.privilege_name.messages || []),
                  {
                    type: "warn" as const,
                    message: "Privilege name appears to be a test record - verify this is intended for production"
                  }
                ]
              };
              hasUpdates = true;
              totalWarnings++;
            }
          }

          // Specialty validation against standard medical specialties
          if (specialty && specialty.trim()) {
            const specialtyValues = specialty.split("|").map(s => s.trim()).filter(s => s.length > 0);
            
            // Common medical specialties for basic validation
            const commonSpecialties = [
              'anesthesiology', 'cardiology', 'dermatology', 'emergency medicine',
              'endocrinology', 'family medicine', 'gastroenterology', 'hematology',
              'infectious disease', 'internal medicine', 'nephrology', 'neurology',
              'obstetrics and gynecology', 'oncology', 'ophthalmology', 'orthopedics',
              'otolaryngology', 'pathology', 'pediatrics', 'psychiatry', 'pulmonology',
              'radiology', 'rheumatology', 'surgery', 'urology'
            ];
            
            const invalidSpecialties: string[] = [];
            specialtyValues.forEach(spec => {
              const normalizedSpec = spec.toLowerCase().trim();
              const isValidSpecialty = commonSpecialties.some(common => 
                normalizedSpec.includes(common) || common.includes(normalizedSpec)
              );
              
              if (!isValidSpecialty && spec.length > 2) {
                invalidSpecialties.push(spec);
              }
            });
            
            if (invalidSpecialties.length > 0) {
              recordUpdate.values.specialty = {
                ...record.values.specialty,
                messages: [
                  ...(record.values.specialty.messages || []),
                  {
                    type: "warn" as const,
                    message: `Specialty values may need verification: ${invalidSpecialties.join(", ")}`
                  }
                ]
              };
              hasUpdates = true;
              totalWarnings++;
            }
          }

          // Subspecialty validation
          if (subspecialty && subspecialty.trim()) {
            const subspecialtyValues = subspecialty.split("|").map(s => s.trim()).filter(s => s.length > 0);
            
            // Check for common subspecialty patterns
            subspecialtyValues.forEach(subspec => {
              if (subspec.length > 0 && subspec.length < 3) {
                recordUpdate.values.subspecialty = {
                  ...record.values.subspecialty,
                  messages: [
                    ...(record.values.subspecialty?.messages || []),
                    {
                      type: "warn" as const,
                      message: `Subspecialty value "${subspec}" appears unusually short - verify accuracy`
                    }
                  ]
                };
                hasUpdates = true;
                totalWarnings++;
              }
            });
          }

          // ICD/CPT Code format validation
          if (icdCptCode && icdCptCode.trim()) {
            const code = icdCptCode.trim().toUpperCase();
            
            // Basic ICD-10 and CPT format checking
            const icd10Pattern = /^[A-Z]\d{2}(\.\d{1,3})?$/;  // Basic ICD-10 pattern
            const cptPattern = /^\d{5}$/;  // Basic CPT pattern
            const hcpcsPattern = /^[A-Z]\d{4}$/;  // Basic HCPCS pattern
            
            if (!icd10Pattern.test(code) && !cptPattern.test(code) && !hcpcsPattern.test(code)) {
              recordUpdate.values.icd_cpt_code = {
                ...record.values.icd_cpt_code,
                messages: [
                  ...(record.values.icd_cpt_code?.messages || []),
                  {
                    type: "warn" as const,
                    message: "ICD/CPT Code format may not match standard ICD-10, CPT, or HCPCS patterns"
                  }
                ]
              };
              hasUpdates = true;
              totalWarnings++;
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
            await api.records.update(companyPrivilegesSheet.id, batch);
          }
        }

        // Complete the job
        await api.jobs.complete(jobId, {
          outcome: {
            message: `Company Privileges validation completed. Processed ${totalRecords} records with ${totalErrors} errors and ${totalWarnings} warnings.`,
            next: {
              type: "wait",
            },
          },
        });

      } catch (error: any) {
        console.error("Company Privileges batch validation error:", error);
        
        await api.jobs.fail(jobId, {
          outcome: {
            message: `Company Privileges validation failed: ${error.message}`,
          },
        });
      }
    });
  });
};