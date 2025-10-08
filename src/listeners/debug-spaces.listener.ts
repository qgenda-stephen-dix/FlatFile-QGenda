import { FlatfileListener } from "@flatfile/listener";
import { FlatfileClient } from "@flatfile/api";

const api = new FlatfileClient();

export const debugSpacesListener = (listener: FlatfileListener) => {
  listener.on("**", async (event) => {
    if (event.topic === "agent:created") {
      console.log("\n🔍 [DEBUG] Searching for ALL spaces in your account...");
      
      try {
        // Get ALL spaces without namespace filter
        const allSpaces = await api.spaces.list({ pageSize: 100 });
        
        console.log(`\n📊 [DEBUG] Found ${allSpaces.data.length} total spaces/projects:`);
        
        for (const space of allSpaces.data) {
          console.log(`
🏠 [DEBUG] Project: "${space.name || 'Unnamed'}"
   📝 ID: ${space.id}
   🏷️  Namespace: ${space.namespace || 'No namespace'}
   📅 Created: ${space.createdAt}
          `);
        }
        
        console.log(`\n🎯 [DEBUG] Our system looks for namespace: "qgenda-company"`);
        const matches = allSpaces.data.filter(s => s.namespace === "qgenda-company");
        console.log(`✅ [DEBUG] Matching spaces: ${matches.length}`);
        
      } catch (error) {
        console.error("❌ [DEBUG] Error fetching spaces:", error);
      }
    }
  });
};