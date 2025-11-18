import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateGlobalPrivilegeAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateGlobalPrivilege" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track ICD/CPT Code duplicates within the file
        const icdCptCodeMap = new Map<string, number>();

        const validatedRecords = records.map((record: FlatfileRecord, index: number) => {
          const privilegeName = record.get("privilegeName") as string;
          const icdCptCode = record.get("icdCptCode") as string;
          const specialty = record.get("specialty") as string;
          const subspecialty = record.get("subspecialty") as string;
          const description = record.get("description") as string;

          // Duplicate ICD/CPT Code detection within file
          if (icdCptCode?.trim()) {
            const normalizedCode = icdCptCode.trim().toUpperCase();
            if (icdCptCodeMap.has(normalizedCode)) {
              const previousRow = icdCptCodeMap.get(normalizedCode)! + 1;
              record.addWarning("icdCptCode", "ICD/CPT Code not unique");
            } else {
              icdCptCodeMap.set(normalizedCode, index);
            }
          }

          // System-level ICD/CPT Code duplicate check (simulated)
          if (icdCptCode?.trim()) {
            // Simulate existing codes in the system
            const existingSystemCodes = [
              "99213", "99214", "99215", // Common CPT codes
              "I25.9", "E11.9", "Z12.11", // Common ICD-10 codes
              "412", "250.00", "V76.12" // Legacy ICD-9 codes
            ];
            
            if (existingSystemCodes.includes(icdCptCode.trim())) {
              record.addWarning("icdCptCode", `ICD/CPT Code '${icdCptCode}' already exists in the system, but record was successfully imported. ICD/CPT Code can be edited in-app.`);
            }
          }

          // Enhanced Specialty validation with pipe-delimited processing
          if (specialty) {
            const specialtyValues = specialty.split("|").map(s => s.trim()).filter(s => s);
            
            const validSpecialties = [
              "Cardiology", "Pediatrics", "Internal Medicine", "Emergency Medicine",
              "Family Medicine", "Surgery", "Orthopedic Surgery", "Neurosurgery",
              "Plastic Surgery", "Radiology", "Pathology", "Anesthesiology",
              "Psychiatry", "Dermatology", "Ophthalmology", "Otolaryngology",
              "Urology", "Obstetrics and Gynecology", "Oncology", "Neurology",
              "Pulmonology", "Gastroenterology", "Endocrinology", "Nephrology",
              "Rheumatology", "Hematology", "Infectious Disease", "Critical Care",
              "Palliative Care", "Geriatrics", "Sports Medicine",
              "Physical Medicine and Rehabilitation", "Occupational Medicine",
              "Preventive Medicine"
            ];

            for (const specialtyValue of specialtyValues) {
              if (specialtyValue && !validSpecialties.includes(specialtyValue)) {
                record.addError("specialty", "Specialty not supported");
                break; // Only show one error per field
              }
            }

            // Validate total character count including pipes meets limit
            if (specialty.length > 100) {
              record.addError("specialty", "Specialty exceeds character limit of 100");
            }
          }

          // Enhanced Subspecialty validation with pipe-delimited processing
          if (subspecialty) {
            const subspecialtyValues = subspecialty.split("|").map(s => s.trim()).filter(s => s);
            
            const validSubspecialties = [
              "Interventional Cardiology", "Electrophysiology", "Heart Failure",
              "Pediatric Cardiology", "Neonatal-Perinatal Medicine",
              "Pediatric Emergency Medicine", "Adolescent Medicine", "General Surgery",
              "Vascular Surgery", "Trauma Surgery", "Cardiothoracic Surgery",
              "Hand Surgery", "Spine Surgery", "Joint Replacement",
              "Sports Orthopedics", "Pediatric Orthopedics", "Diagnostic Radiology",
              "Interventional Radiology", "Nuclear Medicine", "Radiation Oncology",
              "Cardiac Anesthesia", "Pediatric Anesthesia", "Pain Management",
              "Child Psychiatry", "Forensic Psychiatry", "Addiction Medicine",
              "Mohs Surgery", "Pediatric Dermatology", "Dermatopathology",
              "Retina", "Cornea", "Glaucoma", "Facial Plastic Surgery",
              "Pediatric Otolaryngology", "Male Infertility", "Pediatric Urology",
              "Urologic Oncology", "Maternal-Fetal Medicine",
              "Reproductive Endocrinology", "Gynecologic Oncology",
              "Medical Oncology", "Surgical Oncology", "Pediatric Oncology",
              "Stroke Neurology", "Epilepsy", "Movement Disorders",
              "Interventional Pulmonology", "Sleep Medicine", "Hepatology",
              "Inflammatory Bowel Disease", "Diabetes", "Thyroid Disorders",
              "Dialysis", "Transplant Nephrology", "Lupus", "Arthritis",
              "Leukemia", "Bone Marrow Transplant", "HIV Medicine",
              "Hospital Medicine", "Hospice Care", "Pain Medicine",
              "Memory Care", "Concussion", "Knee Injuries", "Spinal Cord Injury",
              "Brain Injury", "Environmental Medicine", "Travel Medicine", "Toxicology"
            ];

            for (const subspecialtyValue of subspecialtyValues) {
              if (subspecialtyValue && !validSubspecialties.includes(subspecialtyValue)) {
                record.addError("subspecialty", "Subspecialty not supported");
                break; // Only show one error per field
              }
            }

            // Validate total character count including pipes meets limit
            if (subspecialty.length > 100) {
              record.addError("subspecialty", "Subspecialty exceeds character limit of 100");
            }
          }

          // Business logic validations
          if (privilegeName && icdCptCode) {
            // Check for potentially related privilege names and codes
            if (privilegeName.toLowerCase().includes("cardiac") && icdCptCode.startsWith("99")) {
              record.addWarning("icdCptCode", "CPT code may not be appropriate for cardiac privilege. Consider ICD-10 codes starting with 'I' for cardiovascular conditions.");
            }
            
            if (privilegeName.toLowerCase().includes("surgery") && !icdCptCode.match(/^(0|1|2|3|4|5)/)) {
              record.addWarning("icdCptCode", "Surgical privileges typically use procedure codes. Verify code is appropriate for surgical privilege.");
            }
          }

          // Privilege naming consistency checks
          if (privilegeName) {
            if (privilegeName.length < 5) {
              record.addWarning("privilegeName", "Privilege name is very short. Consider providing more descriptive name.");
            }
            
            // Check for common privilege naming patterns
            const privilegePatterns = [
              "Administration", "Procedure", "Surgery", "Consultation", "Evaluation",
              "Treatment", "Diagnosis", "Management", "Therapy", "Care"
            ];
            
            const hasPattern = privilegePatterns.some(pattern => 
              privilegeName.toLowerCase().includes(pattern.toLowerCase())
            );
            
            if (!hasPattern) {
              record.addInfo("privilegeName", "Consider including privilege type (e.g., Administration, Procedure, Surgery) in the name for clarity.");
            }
          }

          // Apply same individual record validations as the listener
          // (This ensures consistency between real-time and batch validation)
          
          // Required field validations
          if (!privilegeName?.trim()) {
            record.addError("privilegeName", "Privilege Name required");
          }

          if (!icdCptCode?.trim()) {
            record.addError("icdCptCode", "ICD/CPT Code required");
          }

          if (!specialty?.trim()) {
            record.addError("specialty", "Specialty required");
          }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Global Privilege validation:", error);
        throw error;
      }
    }
  );
};