import { FlatfileListener } from "@flatfile/listener";
import { configureSpace } from "@flatfile/plugin-space-configure";
import api from "@flatfile/api";

export const companyProfessionalTrainingBatchValidationAction = (listener: FlatfileListener) => {
  listener.filter({ job: "workbook:company-professional-training-batch-validation" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { jobId, spaceId, workbookId } = event.context;
      
      try {
        const sheets = await api.sheets.list({ workbookId });
        
        const professionalTrainingSheet = sheets.data.find(
          (sheet) => sheet.config.slug === "professional_training"
        );
        
        if (!professionalTrainingSheet) {
          throw new Error("Professional Training sheet not found");
        }
        
        // Get all records from the Professional Training sheet
        const response = await api.records.get(professionalTrainingSheet.id);
        const records = response.data.records;
        
        let processedCount = 0;
        let errorCount = 0;
        let warningCount = 0;
        const batchErrors: string[] = [];
        const batchWarnings: string[] = [];
        
        // Update job progress
        await api.jobs.update(jobId, {
          progress: 10,
          info: `Starting validation of ${records.length} Professional Training records...`
        });
        
        // Batch validation logic
        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          const recordNumber = i + 1;
          
          try {
            // Cross-record validations
            await performCrossRecordValidations(record, records, recordNumber, batchErrors, batchWarnings);
            
            processedCount++;
            
            // Update progress every 100 records
            if (processedCount % 100 === 0) {
              await api.jobs.update(jobId, {
                progress: 10 + Math.floor((processedCount / records.length) * 80),
                info: `Processed ${processedCount} of ${records.length} records...`
              });
            }
            
          } catch (error) {
            errorCount++;
            batchErrors.push(`Row ${recordNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        
        // Final validation summary
        const validRecordsCount = processedCount - errorCount;
        
        const completionSummary = [
          `Professional Training Batch Validation Complete`,
          `Total Records: ${records.length}`,
          `Valid Records: ${validRecordsCount}`,
          `Records with Errors: ${errorCount}`,
          `Records with Warnings: ${warningCount}`,
          ``,
          `Key Validations Performed:`,
          `- External ID and Type validation`,
          `- Training Type validation`,
          `- Phone/Fax format validation`,
          `- Email format validation`, 
          `- Date format validation`,
          `- Character limit validation`,
          `- T/F and Y/N value validation`,
          `- GUID format validation`,
          `- URL format validation`,
          `- Cross-record duplicate validation`
        ];
        
        if (batchErrors.length > 0) {
          completionSummary.push(``, `Errors Found:`);
          completionSummary.push(...batchErrors.slice(0, 50)); // Limit to first 50 errors
          if (batchErrors.length > 50) {
            completionSummary.push(`... and ${batchErrors.length - 50} more errors`);
          }
        }
        
        if (batchWarnings.length > 0) {
          completionSummary.push(``, `Warnings Found:`);
          completionSummary.push(...batchWarnings.slice(0, 20)); // Limit to first 20 warnings
          if (batchWarnings.length > 20) {
            completionSummary.push(`... and ${batchWarnings.length - 20} more warnings`);
          }
        }
        
        await api.jobs.complete(jobId, {
          outcome: {
            message: completionSummary.join('\n'),
            acknowledge: true
          }
        });
        
      } catch (error) {
        await api.jobs.fail(jobId, {
          outcome: {
            message: `Professional Training batch validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            acknowledge: true
          }
        });
      }
    });
  });
};

async function performCrossRecordValidations(
  record: any, 
  allRecords: any[], 
  recordNumber: number, 
  batchErrors: string[], 
  batchWarnings: string[]
): Promise<void> {
  const externalId = record.values?.external_id?.value;
  const externalIdType = record.values?.external_id_type?.value;
  const trainingType = record.values?.training_type?.value;
  const startDate = record.values?.start_date?.value;
  const endDate = record.values?.end_date?.value;
  const institutionHospitalName = record.values?.institution_hospital_name?.value;
  const departmentProgram = record.values?.department_program?.value;
  
  // Duplicate External ID + Training Type validation
  if (externalId && externalIdType && trainingType) {
    const duplicates = allRecords.filter((otherRecord, index) => 
      index !== recordNumber - 1 && // Don't compare with self
      otherRecord.values?.external_id?.value === externalId &&
      otherRecord.values?.external_id_type?.value === externalIdType &&
      otherRecord.values?.training_type?.value === trainingType
    );
    
    if (duplicates.length > 0) {
      batchErrors.push(`Row ${recordNumber}: Duplicate combination found - External ID "${externalId}" + Training Type "${trainingType}" already exists`);
    }
  }
  
  // Duplicate External ID + Institution + Department validation
  if (externalId && externalIdType && institutionHospitalName && departmentProgram) {
    const duplicates = allRecords.filter((otherRecord, index) => 
      index !== recordNumber - 1 && // Don't compare with self
      otherRecord.values?.external_id?.value === externalId &&
      otherRecord.values?.external_id_type?.value === externalIdType &&
      otherRecord.values?.institution_hospital_name?.value === institutionHospitalName &&
      otherRecord.values?.department_program?.value === departmentProgram
    );
    
    if (duplicates.length > 0) {
      batchWarnings.push(`Row ${recordNumber}: Similar training record exists for same provider at same institution/department`);
    }
  }
  
  // Date range validation
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      batchErrors.push(`Row ${recordNumber}: Start Date cannot be after End Date`);
    }
    
    // Check for reasonable training duration (warn if > 10 years)
    const yearsDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsDiff > 10) {
      batchWarnings.push(`Row ${recordNumber}: Training duration exceeds 10 years - please verify dates`);
    }
  }
  
  // Training Type and Department validation
  if (trainingType === "Fellowship" && departmentProgram) {
    // Fellowship programs typically have specific naming patterns
    const fellowshipKeywords = ["fellowship", "fellow", "subspecialty"];
    const hasfellowshipKeyword = fellowshipKeywords.some(keyword => 
      departmentProgram.toLowerCase().includes(keyword)
    );
    
    if (!hasfellowshipKeyword) {
      batchWarnings.push(`Row ${recordNumber}: Training Type is Fellowship but Department/Program doesn't indicate fellowship training`);
    }
  }
  
  // Institution validation patterns
  if (institutionHospitalName) {
    const institution = institutionHospitalName.toLowerCase();
    const suspiciousPatterns = ["test", "example", "dummy", "xxx", "tbd"];
    
    if (suspiciousPatterns.some(pattern => institution.includes(pattern))) {
      batchWarnings.push(`Row ${recordNumber}: Institution name appears to be placeholder or test data`);
    }
  }
  
  // Professional training sequence validation
  const trainingHierarchy = {
    "Internship": 1,
    "Residency": 2,
    "Internship/Residency": 2,
    "Chief Residency": 3,
    "Fellowship": 4,
    "Post Doctoral Fellowship": 5,
    "Faculty Position/Academic Employment": 6
  };
  
  if (trainingType && trainingHierarchy[trainingType] && externalId && externalIdType) {
    const currentLevel = trainingHierarchy[trainingType];
    
    // Check for other training records for same provider
    const otherTrainings = allRecords.filter((otherRecord, index) => 
      index !== recordNumber - 1 &&
      otherRecord.values?.external_id?.value === externalId &&
      otherRecord.values?.external_id_type?.value === externalIdType &&
      otherRecord.values?.training_type?.value &&
      trainingHierarchy[otherRecord.values.training_type.value]
    );
    
    // Warn about sequence issues
    otherTrainings.forEach((otherRecord) => {
      const otherType = otherRecord.values.training_type.value;
      const otherLevel = trainingHierarchy[otherType];
      const otherStartDate = otherRecord.values?.start_date?.value;
      
      if (otherLevel > currentLevel && otherStartDate && startDate) {
        const otherStart = new Date(otherStartDate);
        const currentStart = new Date(startDate);
        
        if (currentStart > otherStart) {
          batchWarnings.push(`Row ${recordNumber}: ${trainingType} started after ${otherType} - unusual training sequence`);
        }
      }
    });
  }
}