import { FlatfileClient } from "@flatfile/api";

const api = new FlatfileClient();

async function findAllSpaces() {
  try {
    console.log("🔍 Searching for ALL spaces in your account...");
    
    const allSpaces = await api.spaces.list({ 
      pageSize: 100,
      // Don't filter by namespace - get everything
    });
    
    console.log(`\n📊 Found ${allSpaces.data.length} total spaces:`);
    console.log("=".repeat(50));
    
    for (const space of allSpaces.data) {
      console.log(`
🏠 Space: ${space.name || "Unnamed"}
   📝 ID: ${space.id}
   🏷️  Namespace: ${space.namespace || "No namespace"}
   📅 Created: ${space.createdAt}
   🌐 Environment: ${space.environmentId}
   📋 Metadata: ${JSON.stringify(space.metadata || {}, null, 2)}
      `);
      
      // Also check workbooks in this space
      try {
        const workbooks = await api.workbooks.list({ spaceId: space.id });
        if (workbooks.data.length > 0) {
          console.log(`   📚 Workbooks (${workbooks.data.length}):`);
          for (const wb of workbooks.data) {
            console.log(`      - ${wb.name} (${wb.id}) - Namespace: ${wb.namespace || "None"}`);
          }
        }
      } catch (err) {
        console.log(`   ❌ Could not fetch workbooks: ${err.message}`);
      }
      
      console.log("-".repeat(30));
    }
    
    // Show what namespace our system is looking for
    console.log(`\n🎯 Our system is configured to look for namespace: "qgenda-company"`);
    console.log(`❓ Do any of your spaces have this namespace?`);
    
    const matchingSpaces = allSpaces.data.filter(s => s.namespace === "qgenda-company");
    if (matchingSpaces.length > 0) {
      console.log(`✅ Found ${matchingSpaces.length} matching spaces!`);
    } else {
      console.log(`❌ No spaces found with "qgenda-company" namespace`);
      console.log(`💡 This explains why auto-updates aren't working`);
    }
    
  } catch (error) {
    console.error("❌ Error fetching spaces:", error);
  }
}

findAllSpaces().catch(console.error);