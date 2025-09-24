import { rollout } from "@flatfile/plugin-rollout";
import { FlatfileClient, Flatfile } from "@flatfile/api";
import { companyWorkbook } from "../blueprints/workbooks/company.workbook";

const api = new FlatfileClient();

export const rolloutPlugin = rollout({
  namespace: "workbook:qgenda-company",
  dev: true, // Enable updates when the development listener environment is restarted
  updater: async (space: Flatfile.Space, workbooks: Flatfile.Workbook[]) => {
    console.log(`Starting rollout update for space ${space.id} with ${workbooks.length} workbook(s)`);
    
    const updatedWorkbooks: Flatfile.Workbook[] = [];
    
    for (const workbook of workbooks) {
      try {
        console.log(`Updating workbook ${workbook.id} (${workbook.name})`);
        
        // Update the workbook metadata and configuration
        await api.workbooks.update(workbook.id, {
          name: companyWorkbook.name,
          labels: companyWorkbook.labels,
          actions: companyWorkbook.actions,
          namespace: companyWorkbook.namespace
        });
        
        // For sheet updates, we'll rely on the space configuration listener
        // to handle schema changes when workbooks are updated, rather than
        // trying to update individual sheets here
        
        console.log(`Successfully updated workbook ${workbook.id}`);
        updatedWorkbooks.push(workbook);
        
      } catch (error) {
        console.error(`Failed to update workbook ${workbook.id}:`, error);
        // Continue with the next workbook rather than failing the entire process
      }
    }
    
    console.log(`Rollout completed. Updated ${updatedWorkbooks.length} out of ${workbooks.length} workbook(s)`);
    
    // Return the workbooks that were successfully updated to re-trigger hooks
    return updatedWorkbooks;
  }
});