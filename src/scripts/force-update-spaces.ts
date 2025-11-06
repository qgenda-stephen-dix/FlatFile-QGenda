import { FlatfileClient } from "@flatfile/api";
import { companyWorkbook } from "../blueprints/workbooks/company.workbook";

const api = new FlatfileClient();

async function forceUpdateExistingSpaces() {
  try {
    console.log("🔍 Searching for all spaces...");
    
    // Get ALL spaces (not just qgenda-company namespace)
    const allSpaces = await api.spaces.list({ pageSize: 100 });
    console.log(`Found ${allSpaces.data.length} total spaces`);
    
    // Filter for spaces that might need updates
    const targetSpaces = allSpaces.data.filter(space => 
      space.namespace?.includes('qgenda') || 
      space.namespace?.includes('company') ||
      space.name?.toLowerCase().includes('company')
    );
    
    console.log(`Found ${targetSpaces.length} target spaces to update:`, targetSpaces.map(s => ({ id: s.id, name: s.name, namespace: s.namespace })));
    
    for (const space of targetSpaces) {
      console.log(`🔄 Updating space ${space.id} (${space.name})...`);
      
      try {
        // Get existing workbooks in the space
        const workbooks = await api.workbooks.list({ spaceId: space.id });
        console.log(`  Found ${workbooks.data.length} workbooks in space`);
        
        for (const workbook of workbooks.data) {
          console.log(`  📝 Updating workbook ${workbook.id} (${workbook.name})`);
          
          // Update workbook configuration
          await api.workbooks.update(workbook.id, {
            name: companyWorkbook.name,
            labels: companyWorkbook.labels,
            actions: companyWorkbook.actions
          });
          
          console.log(`  ✅ Updated workbook ${workbook.id}`);
        }
        
        // Update space metadata
        await api.spaces.update(space.id, {
          metadata: {
            version: "2.1.0-force-update",
            updatedAt: new Date().toISOString()
          }
        });
        
        console.log(`✅ Successfully updated space ${space.id}`);
        
      } catch (error) {
        console.error(`❌ Error updating space ${space.id}:`, error);
      }
    }
    
    console.log("🎉 Force update complete!");
    
  } catch (error) {
    console.error("❌ Error in force update:", error);
  }
}

// Run the update
forceUpdateExistingSpaces().catch(console.error);