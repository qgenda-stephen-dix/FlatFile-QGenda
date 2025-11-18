import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const globalPrivilegeValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("global-privilege", (record) => {
      // Get all field values
      const privilegeName = record.get("privilegeName") as string;
      const icdCptCode = record.get("icdCptCode") as string;
      const specialty = record.get("specialty") as string;
      const subspecialty = record.get("subspecialty") as string;
      const description = record.get("description") as string;

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

      // Character limit validations
      if (privilegeName && privilegeName.length > 100) {
        record.addError("privilegeName", "Privilege Name exceeds character limit of 100");
      }

      if (icdCptCode && icdCptCode.length > 50) {
        record.addError("icdCptCode", "ICD/CPT Code exceeds character limit of 50");
      }

      if (specialty && specialty.length > 100) {
        record.addError("specialty", "Specialty exceeds character limit of 100");
      }

      if (subspecialty && subspecialty.length > 100) {
        record.addError("subspecialty", "Subspecialty exceeds character limit of 100");
      }

      if (description && description.length > 10000) {
        record.addError("description", "Description exceeds character limit of 10000");
      }

      // Pipe-delimited value validation for Specialty
      if (specialty) {
        const specialtyValues = specialty.split("|").map(s => s.trim()).filter(s => s);
        
        // Check if any specialty value is empty after splitting
        if (specialtyValues.length === 0) {
          record.addError("specialty", "Specialty required");
        }
        
        // Validate individual specialty values against simulated Specialty List Management
        const validSpecialties = [
          "Cardiology",
          "Pediatrics", 
          "Internal Medicine",
          "Emergency Medicine",
          "Family Medicine",
          "Surgery",
          "Orthopedic Surgery",
          "Neurosurgery",
          "Plastic Surgery",
          "Radiology",
          "Pathology",
          "Anesthesiology",
          "Psychiatry",
          "Dermatology",
          "Ophthalmology",
          "Otolaryngology",
          "Urology",
          "Obstetrics and Gynecology",
          "Oncology",
          "Neurology",
          "Pulmonology",
          "Gastroenterology",
          "Endocrinology",
          "Nephrology",
          "Rheumatology",
          "Hematology",
          "Infectious Disease",
          "Critical Care",
          "Palliative Care",
          "Geriatrics",
          "Sports Medicine",
          "Physical Medicine and Rehabilitation",
          "Occupational Medicine",
          "Preventive Medicine"
        ];

        for (const specialtyValue of specialtyValues) {
          if (!validSpecialties.includes(specialtyValue)) {
            record.addError("specialty", "Specialty not supported");
            break; // Only show one error per field
          }
        }

        // Check total character count including pipes
        if (specialty.length > 100) {
          record.addError("specialty", "Specialty exceeds character limit of 100");
        }
      }

      // Pipe-delimited value validation for Subspecialty
      if (subspecialty) {
        const subspecialtyValues = subspecialty.split("|").map(s => s.trim()).filter(s => s);
        
        // Validate individual subspecialty values against simulated Specialty List Management
        const validSubspecialties = [
          "Interventional Cardiology",
          "Electrophysiology",
          "Heart Failure",
          "Pediatric Cardiology",
          "Neonatal-Perinatal Medicine",
          "Pediatric Emergency Medicine", 
          "Adolescent Medicine",
          "General Surgery",
          "Vascular Surgery",
          "Trauma Surgery",
          "Cardiothoracic Surgery",
          "Hand Surgery",
          "Spine Surgery",
          "Joint Replacement",
          "Sports Orthopedics",
          "Pediatric Orthopedics",
          "Diagnostic Radiology",
          "Interventional Radiology",
          "Nuclear Medicine",
          "Radiation Oncology",
          "Cardiac Anesthesia",
          "Pediatric Anesthesia",
          "Pain Management",
          "Child Psychiatry",
          "Forensic Psychiatry",
          "Addiction Medicine",
          "Mohs Surgery",
          "Pediatric Dermatology",
          "Dermatopathology",
          "Retina",
          "Cornea",
          "Glaucoma",
          "Facial Plastic Surgery",
          "Pediatric Otolaryngology",
          "Male Infertility",
          "Pediatric Urology",
          "Urologic Oncology",
          "Maternal-Fetal Medicine",
          "Reproductive Endocrinology",
          "Gynecologic Oncology",
          "Medical Oncology",
          "Surgical Oncology",
          "Pediatric Oncology",
          "Stroke Neurology",
          "Epilepsy",
          "Movement Disorders",
          "Interventional Pulmonology",
          "Sleep Medicine",
          "Hepatology",
          "Inflammatory Bowel Disease",
          "Diabetes",
          "Thyroid Disorders",
          "Dialysis",
          "Transplant Nephrology",
          "Lupus",
          "Arthritis",
          "Leukemia",
          "Bone Marrow Transplant",
          "HIV Medicine",
          "Hospital Medicine",
          "Hospice Care",
          "Pain Medicine",
          "Memory Care",
          "Concussion",
          "Knee Injuries",
          "Spinal Cord Injury",
          "Brain Injury",
          "Environmental Medicine",
          "Travel Medicine",
          "Toxicology"
        ];

        for (const subspecialtyValue of subspecialtyValues) {
          if (!validSubspecialties.includes(subspecialtyValue)) {
            record.addError("subspecialty", "Subspecialty not supported");
            break; // Only show one error per field
          }
        }

        // Check total character count including pipes
        if (subspecialty.length > 100) {
          record.addError("subspecialty", "Subspecialty exceeds character limit of 100");
        }
      }

      // ICD/CPT Code format validation (basic format check)
      if (icdCptCode) {
        // Basic validation for common ICD/CPT formats
        // ICD-10: A00.0 format (letter + digits + dot + digits)
        // CPT: 99213 format (5 digits)
        const icdRegex = /^[A-Z]\d{2}(\.\d{1,2})?$/;
        const cptRegex = /^\d{5}$/;
        const icd9Regex = /^\d{3}(\.\d{1,2})?$/; // Legacy ICD-9 format
        
        if (!icdRegex.test(icdCptCode) && !cptRegex.test(icdCptCode) && !icd9Regex.test(icdCptCode)) {
          record.addWarning("icdCptCode", "ICD/CPT Code format may not be valid. Expected formats: ICD-10 (A00.0), CPT (99213), or ICD-9 (123.45)");
        }
      }

      return record;
    })
  );
};