import api, { Flatfile } from "@flatfile/api";
import { FlatfileListener } from "@flatfile/listener";

export const demographicReferenceDataListener = (listener: FlatfileListener) => {
  listener.filter({ job: "sheet:initializeDemographicReference" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { jobId, sheetId } = event.context;
      
      try {
        // Acknowledge the job
        await api.jobs.ack(jobId, {
          info: "Initializing demographic reference data...",
          progress: 10,
        });

        // Common citizenship values
        const citizenshipData = [
          { demographic_id: "US", demographic_name: "United States" },
          { demographic_id: "CA", demographic_name: "Canada" },
          { demographic_id: "MX", demographic_name: "Mexico" },
          { demographic_id: "GB", demographic_name: "United Kingdom" },
          { demographic_id: "DE", demographic_name: "Germany" },
          { demographic_id: "FR", demographic_name: "France" },
          { demographic_id: "IN", demographic_name: "India" },
          { demographic_id: "CN", demographic_name: "China" },
          { demographic_id: "JP", demographic_name: "Japan" },
          { demographic_id: "AU", demographic_name: "Australia" },
          { demographic_id: "BR", demographic_name: "Brazil" },
          { demographic_id: "OTHER", demographic_name: "Other" }
        ];

        // Update progress
        await api.jobs.ack(jobId, {
          info: "Adding citizenship reference data...",
          progress: 50,
        });

        // Insert the records
        const records: Flatfile.RecordData[] = citizenshipData.map(item => ({
          demographic_id: { value: item.demographic_id },
          demographic_name: { value: item.demographic_name }
        }));

        await api.records.insert(sheetId, records);

        // Complete the job
        await api.jobs.complete(jobId, {
          outcome: {
            message: `Successfully initialized ${citizenshipData.length} citizenship reference records.`,
          },
        });

      } catch (error) {
        // Handle errors
        await api.jobs.fail(jobId, {
          outcome: {
            message: `Failed to initialize reference data: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        });
      }
    });
  });
};
