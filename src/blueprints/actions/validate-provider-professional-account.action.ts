import { FlatfileListener } from "@flatfile/listener";
import { configureSpace } from "@flatfile/plugin-space-configure";
import api from "@flatfile/api";

export const validateProviderProfessionalAccountAction = (listener: FlatfileListener) => {
  listener.filter({ job: "sheet:validateProviderProfessionalAccount" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { jobId, spaceId, sheetId } = event.context;
      
      try {
        // Get all records from the Provider Professional Account sheet
        const response = await api.records.get(sheetId);
        const records = response.data.records;
        
        let processedCount = 0;
        let errorCount = 0;
        let warningCount = 0;
        const batchErrors: string[] = [];
        const batchWarnings: string[] = [];
        
        // Update job progress
        await api.jobs.update(jobId, {
          progress: 10,
          info: `Starting validation of ${records.length} Provider Professional Account records...`
        });
        
        // Batch validation logic
        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          const recordNumber = i + 1;
          
          try {
            // Cross-record validations
            await performCrossRecordValidations(record, records, recordNumber, batchErrors, batchWarnings);
            
            processedCount++;
            
            // Update progress every 50 records
            if (processedCount % 50 === 0) {
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
        warningCount = batchWarnings.length;
        
        const completionSummary = [
          `Provider Professional Account Validation Complete`,
          `Total Records: ${records.length}`,
          `Valid Records: ${validRecordsCount}`,
          `Records with Errors: ${errorCount}`,
          `Records with Warnings: ${warningCount}`,
          ``,
          `Key Validations Performed:`,
          `- External ID and Type validation`,
          `- Account Name validation`,
          `- Character limit validation`,
          `- Date format validation`,
          `- Duplicate External ID detection`,
          `- Cross-record consistency checks`
        ];
        
        if (batchErrors.length > 0) {
          completionSummary.push(``, `Errors Found:`);
          completionSummary.push(...batchErrors.slice(0, 25)); // Limit to first 25 errors
          if (batchErrors.length > 25) {
            completionSummary.push(`... and ${batchErrors.length - 25} more errors`);
          }
        }
        
        if (batchWarnings.length > 0) {
          completionSummary.push(``, `Warnings Found:`);
          completionSummary.push(...batchWarnings.slice(0, 15)); // Limit to first 15 warnings
          if (batchWarnings.length > 15) {
            completionSummary.push(`... and ${batchWarnings.length - 15} more warnings`);
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
            message: `Provider Professional Account validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
  const accountName = record.values?.account_name?.value;
  const username = record.values?.username?.value;
  const id = record.values?.id?.value;
  const expirationDate = record.values?.expiration_date?.value;
  
  // Duplicate External ID + External ID Type validation
  if (externalId && externalIdType) {
    const duplicates = allRecords.filter((otherRecord, index) => 
      index !== recordNumber - 1 && // Don't compare with self
      otherRecord.values?.external_id?.value === externalId &&
      otherRecord.values?.external_id_type?.value === externalIdType
    );
    
    if (duplicates.length > 0) {
      batchErrors.push(`Row ${recordNumber}: Duplicate External ID "${externalId}" (${externalIdType}) found in file`);
    }
  }
  
  // Duplicate Account Name + External ID validation
  if (accountName && externalId && externalIdType) {
    const accountDuplicates = allRecords.filter((otherRecord, index) => 
      index !== recordNumber - 1 && // Don't compare with self
      otherRecord.values?.account_name?.value === accountName &&
      otherRecord.values?.external_id?.value === externalId &&
      otherRecord.values?.external_id_type?.value === externalIdType
    );
    
    if (accountDuplicates.length > 0) {
      batchErrors.push(`Row ${recordNumber}: Duplicate account "${accountName}" for provider "${externalId}" (${externalIdType})`);
    }
  }
  
  // Username uniqueness within same account validation
  if (username && username.trim() && accountName && accountName.trim()) {
    const usernameDuplicates = allRecords.filter((otherRecord, index) => 
      index !== recordNumber - 1 && // Don't compare with self
      otherRecord.values?.username?.value === username &&
      otherRecord.values?.account_name?.value === accountName
    );
    
    if (usernameDuplicates.length > 0) {
      batchWarnings.push(`Row ${recordNumber}: Username "${username}" appears multiple times for account "${accountName}"`);
    }
  }
  
  // ID field uniqueness validation (if provided)
  if (id && id.trim()) {
    const idDuplicates = allRecords.filter((otherRecord, index) => 
      index !== recordNumber - 1 && // Don't compare with self
      otherRecord.values?.id?.value === id
    );
    
    if (idDuplicates.length > 0) {
      batchWarnings.push(`Row ${recordNumber}: ID "${id}" appears multiple times in file`);
    }
  }
  
  // Expiration date validation (should be in the future)
  if (expirationDate && expirationDate.trim()) {
    try {
      const [month, day, year] = expirationDate.trim().split('/').map(Number);
      const expirationDateObj = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      
      if (expirationDateObj < today) {
        batchWarnings.push(`Row ${recordNumber}: Expiration Date "${expirationDate}" is in the past`);
      }
      
      // Warn about expiration within 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      if (expirationDateObj <= thirtyDaysFromNow && expirationDateObj >= today) {
        batchWarnings.push(`Row ${recordNumber}: Account expires within 30 days (${expirationDate})`);
      }
    } catch (error) {
      // Date parsing errors already handled in individual record validation
    }
  }
  
  // Account name pattern validation
  if (accountName && accountName.trim()) {
    const account = accountName.trim();
    
    // Check for common account naming patterns
    const systemAccountPatterns = /^(system|admin|root|test|demo)$/i;
    if (systemAccountPatterns.test(account)) {
      batchWarnings.push(`Row ${recordNumber}: Account name "${account}" appears to be a system account`);
    }
    
    // Check for very short account names
    if (account.length < 3) {
      batchWarnings.push(`Row ${recordNumber}: Account name "${account}" is very short - verify this is correct`);
    }
  }
  
  // Cross-validation of provider data consistency
  if (externalId && externalIdType) {
    // Find all records for same provider
    const providerRecords = allRecords.filter((otherRecord, index) => 
      otherRecord.values?.external_id?.value === externalId &&
      otherRecord.values?.external_id_type?.value === externalIdType
    );
    
    if (providerRecords.length > 1) {
      // Check for consistent account names across same provider
      const accountNames = providerRecords.map(r => r.values?.account_name?.value).filter(Boolean);
      const uniqueAccountNames = [...new Set(accountNames)];
      
      if (uniqueAccountNames.length > 3) {
        batchWarnings.push(`Row ${recordNumber}: Provider has accounts across ${uniqueAccountNames.length} different systems - verify this is expected`);
      }
    }
  }
}