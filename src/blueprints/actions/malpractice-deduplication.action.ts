import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

/**
 * Malpractice Insurance Deduplication Action
 * Focused implementation for just malpractice insurance records
 */
export const malpracticeDeduplicationAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "dedupeMalpracticeInsurance" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        console.log("Starting malpractice insurance deduplication...");
        
        const { data: records } = await event.data;
        
        console.log(`Processing ${records.length} malpractice insurance records for deduplication...`);
        
        // Key: external_id + external_id_type + carrier_name + policy_number
        const duplicateMap = new Map<string, FlatfileRecord[]>();
        
        for (const record of records) {
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const carrierName = record.get("carrierName") as string;
          const policyNumber = record.get("policyNumber") as string;
          
          if (externalId && externalIdType && carrierName && policyNumber) {
            const key = `${externalId.toLowerCase()}|${externalIdType.toLowerCase()}|${carrierName.toLowerCase()}|${policyNumber.toLowerCase()}`;
            
            if (!duplicateMap.has(key)) {
              duplicateMap.set(key, []);
            }
            duplicateMap.get(key)!.push(record);
          }
        }
        
        let duplicateCount = 0;
        for (const [key, duplicateRecords] of duplicateMap.entries()) {
          if (duplicateRecords.length > 1) {
            // Flag all duplicates after the first
            for (let i = 1; i < duplicateRecords.length; i++) {
              duplicateRecords[i].addError(
                "carrierName",
                `Duplicate malpractice insurance record found. A policy with this carrier and number already exists for this provider.`
              );
              duplicateCount++;
            }
            
            duplicateRecords[0].addInfo(
              "carrierName",
              `Duplicate insurance records found and flagged. Keeping first occurrence of ${duplicateRecords.length} records.`
            );
          }
        }
        
        console.log(`Malpractice insurance deduplication completed. Found and flagged ${duplicateCount} duplicate records.`);
        
      } catch (error) {
        console.error("Error in malpractice insurance deduplication:", error);
        throw new Error("Malpractice insurance deduplication failed. Please try again.");
      }
    }
  );
};