import api from "@flatfile/api";
import { recordHook } from "@flatfile/plugin-record-hook";

export const demographicV2CitizenshipHook = recordHook('demographic_v2', async (record, event) => {
  const citizenshipId = record.get("citizenship") as string;
  
  if (citizenshipId) {
    try {
      // Find the demographic reference sheet in the same workbook
      const workbook = await api.workbooks.get(event.context.workbookId);
      const referenceSheet = workbook.data.sheets?.find(sheet => sheet.config.slug === 'demographic_reference');
      
      if (referenceSheet) {
        // Get all records from the reference sheet
        const records = await api.records.get(referenceSheet.id);
        
        if (records.data.records && records.data.records.length > 0) {
          // Find the matching record by demographic_id
          const matchingRecord = records.data.records.find(record => 
            record.values.demographic_id?.value === citizenshipId
          );
          
          if (matchingRecord) {
            const demographicName = matchingRecord.values.demographic_name?.value as string;
            
            if (demographicName) {
              // Set the citizenship_name field with the demographic name
              record.set("citizenship_name", demographicName);
            }
          } else {
            // Clear the field if no matching reference is found
            record.set("citizenship_name", "");
          }
        } else {
          // Clear the field if no records found
          record.set("citizenship_name", "");
        }
      }
    } catch (error) {
      console.error("Error fetching citizenship name:", error);
      // Set an error indicator in the field
      record.set("citizenship_name", "Error loading name");
    }
  } else {
    // Clear the field if no citizenship is selected
    record.set("citizenship_name", "");
  }
  
  return record;
});
