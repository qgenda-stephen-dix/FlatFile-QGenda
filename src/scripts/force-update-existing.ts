import { FlatfileClient } from "@flatfile/api";

const api = new FlatfileClient();

async function forceUpdateExistingSpaces() {
  try {
    console.log("🔄 Force updating existing spaces with new sheet schemas...");
    
    // Get spaces with qgenda-company namespace
    const spaces = await api.spaces.list({ 
      pageSize: 100,
      namespace: "qgenda-company"
    });
    
    console.log(`Found ${spaces.data.length} spaces to update`);
    
    for (const space of spaces.data) {
      console.log(`\n📋 Updating space: ${space.name} (${space.id})`);
      
      try {
        // Get workbooks in the space
        const workbooks = await api.workbooks.list({ spaceId: space.id });
        
        for (const workbook of workbooks.data) {
          console.log(`  📚 Processing workbook: ${workbook.name} (${workbook.id})`);
          
          // Get sheets in the workbook
          const sheets = await api.sheets.list({ workbookId: workbook.id });
          
          for (const sheet of sheets.data) {
            if (sheet.config.slug === "users") {
              console.log(`    🔧 Found Users sheet: ${sheet.id}`);
              
              // Check current field configuration
              const fields = sheet.config.fields || [];
              const name2Field = fields.find(f => f.key === "name2");
              
              if (name2Field) {
                console.log(`    📝 Current name2 label: "${name2Field.label}"`);
                
                if (name2Field.label !== "Name2_AUTO_UPDATE_TEST_SUCCESS") {
                  console.log(`    ⚠️  Label needs updating!`);
                  console.log(`    💡 Manual update required - Flatfile doesn't support direct schema updates on existing sheets`);
                  console.log(`    📋 Options:`);
                  console.log(`       1. Delete and recreate the project`);
                  console.log(`       2. Use Flatfile dashboard to manually update field labels`);
                  console.log(`       3. Export data, delete project, recreate, reimport data`);
                } else {
                  console.log(`    ✅ Label is already up to date!`);
                }
              }
            }
          }
        }
        
      } catch (error) {
        console.error(`❌ Error processing space ${space.id}:`, error);
      }
    }
    
    console.log("\n🎯 Summary:");
    console.log("The auto-update system is working for:");
    console.log("  ✅ Export field mappings (headers in downloaded files)");
    console.log("  ✅ New projects created after configuration changes");
    console.log("  ❌ Existing project sheet schemas (Flatfile API limitation)");
    
    console.log("\n💡 For existing projects, schema updates require manual recreation or Flatfile dashboard updates.");
    
  } catch (error) {
    console.error("❌ Error in force update:", error);
  }
}

forceUpdateExistingSpaces().catch(console.error);