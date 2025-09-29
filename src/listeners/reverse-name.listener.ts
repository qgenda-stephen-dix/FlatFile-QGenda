import api, { Flatfile } from "@flatfile/api";
import { FlatfileListener } from "@flatfile/listener";

export const reverseNameListener = (listener: FlatfileListener) => {
  listener.filter({ job: "sheet:reverseName" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { jobId, sheetId } = event.context;
      
      try {
        // Acknowledge the job
        await api.jobs.ack(jobId, {
          info: "Starting name reversal process...",
          progress: 10,
        });

        // Get all records from the sheet
        const recordsResponse = await api.records.get(sheetId);
        const records = recordsResponse.data.records;
        
        // Update progress
        await api.jobs.ack(jobId, {
          info: "Processing records...",
          progress: 30,
        });

        const updates: Flatfile.RecordWithLinks[] = [];
        
        // Process each record and reverse the name field
        for (const record of records) {
          const currentName = record.values.name?.value as string;
          
          if (currentName && typeof currentName === 'string') {
            const reversedName = currentName.split('').reverse().join('');
            
            updates.push({
              id: record.id,
              values: {
                name: {
                  value: reversedName
                }
              }
            });
          }
        }

        // Update progress
        await api.jobs.ack(jobId, {
          info: "Updating records...",
          progress: 70,
        });

        // Batch update the records if there are any updates
        if (updates.length > 0) {
          await api.records.update(sheetId, updates);
        }

        // Complete the job
        await api.jobs.complete(jobId, {
          outcome: {
            message: `Successfully reversed names for ${updates.length} records.`,
          },
        });

      } catch (error) {
        // Handle errors
        await api.jobs.fail(jobId, {
          outcome: {
            message: `Failed to reverse names: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        });
      }
    });
  });
};
