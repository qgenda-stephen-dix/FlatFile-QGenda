import { rollout } from "@flatfile/plugin-rollout";
import { FlatfileClient, Flatfile } from "@flatfile/api";
import { companyWorkbook } from "../blueprints/workbooks/company.workbook";

const api = new FlatfileClient();

export const rolloutPlugin = rollout({
  namespace: "workbook:qgenda-company",
  dev: true, // Enable updates when the development listener environment is restarted
  updater: async (space: Flatfile.Space, workbooks: Flatfile.Workbook[]) => {
    console.log(`[ROLLOUT] Starting update for space ${space.id} (${space.name}) with ${workbooks.length} workbook(s)`);
    console.log(`[ROLLOUT] Space namespace: ${space.namespace}`);
    console.log(`[ROLLOUT] Space metadata:`, JSON.stringify(space.metadata, null, 2));
    
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
        
        // Force space reconfiguration by updating space metadata
        console.log(`[ROLLOUT] Updating space metadata to force reconfiguration`);
        try {
          await api.spaces.update(space.id, {
            metadata: {
              ...space.metadata,
              version: `2.1.0-rollout-${Date.now()}`,
              lastUpdated: new Date().toISOString()
            }
          });
          console.log(`[ROLLOUT] ✅ Updated space metadata to trigger reconfiguration`);
        } catch (spaceError) {
          console.error(`[ROLLOUT] ❌ Failed to update space metadata:`, spaceError);
        }
        
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