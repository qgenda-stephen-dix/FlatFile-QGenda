import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const companyPrivilegesValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("company_privileges", (record) => {
      // Get all field values
      const privilegeName = record.get("privilege_name") as string;
      const icdCptCode = record.get("icd_cpt_code") as string;
      const specialty = record.get("specialty") as string;
      const subspecialty = record.get("subspecialty") as string;
      const description = record.get("description") as string;
      const qualifications = record.get("qualifications") as string;
      const competency = record.get("competency") as string;
      const includeInAllLocations = record.get("include_in_all_locations") as string;

      // Required field validations
      if (!privilegeName?.trim()) {
        record.addError("privilege_name", "Privilege Name required");
      }

      // Note: ICD/CPT Code and Specialty are now optional fields
      // Note: Privilege Name has no text constraints (no character limits or character restrictions)

      if (icdCptCode && icdCptCode.length > 50) {
        record.addError("icd_cpt_code", "ICD/CPT Code exceeds character limit of 50");
      }

      // Pipe-delimited field validation for Specialty
      if (specialty && specialty.trim()) {
        // Check total character limit including pipes
        if (specialty.length > 100) {
          record.addError("specialty", "Specialty exceeds character limit of 100");
        }

        // Validate pipe-delimited format
        const specialtyValues = specialty.split("|").map(s => s.trim()).filter(s => s.length > 0);
        
        // Check each specialty value (if any provided)
        specialtyValues.forEach(spec => {
          if (spec.length === 0) {
            record.addError("specialty", "Empty specialty value found in pipe-delimited list");
          }
          
          // Basic specialty validation - would be enhanced with actual specialty list in production
          if (spec.length > 50) {
            record.addError("specialty", `Individual specialty value "${spec}" exceeds 50 characters`);
          }
        });
      }

      // Pipe-delimited field validation for Subspecialty
      if (subspecialty && subspecialty.trim()) {
        // Check total character limit including pipes
        if (subspecialty.length > 100) {
          record.addError("subspecialty", "Subspecialty exceeds character limit of 100");
        }

        // Validate pipe-delimited format
        const subspecialtyValues = subspecialty.split("|").map(s => s.trim()).filter(s => s.length > 0);
        
        // Check each subspecialty value
        subspecialtyValues.forEach(subspec => {
          if (subspec.length === 0) {
            record.addError("subspecialty", "Empty subspecialty value found in pipe-delimited list");
          }
          
          // Basic subspecialty validation - would be enhanced with actual subspecialty list in production
          if (subspec.length > 50) {
            record.addError("subspecialty", `Individual subspecialty value "${subspec}" exceeds 50 characters`);
          }
        });
      }

      // Large text field validations
      if (description && description.length > 10000) {
        record.addError("description", "Description exceeds character limit of 10000");
      }

      if (qualifications && qualifications.length > 10000) {
        record.addError("qualifications", "Qualifications exceeds character limit of 10000");
      }

      if (competency && competency.length > 10000) {
        record.addError("competency", "Competency exceeds character limit of 10000");
      }

      // ICD/CPT Code format validation
      if (icdCptCode && icdCptCode.trim()) {
        const code = icdCptCode.trim();
        
        // Basic format validation - alphanumeric with some special characters
        const validCodeFormat = /^[A-Za-z0-9\-\.\_]+$/;
        if (!validCodeFormat.test(code)) {
          record.addError("icd_cpt_code", "ICD/CPT Code contains invalid characters. Use only letters, numbers, hyphens, periods, and underscores");
        }
      }

      // Privilege Name - no text constraints applied

      // TODO: Production validations that would be implemented:
      // - Validate specialty values against actual Specialty List Management
      // - Validate subspecialty values against actual Specialty List Management  
      // - Cross-reference ICD/CPT codes with medical coding standards
      // - Validate Include in All Locations against valid options

      return record;
    })
  );
};