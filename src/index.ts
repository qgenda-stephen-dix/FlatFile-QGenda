import "@flatfile/http-logger/init"

import FlatfileListener, { Listener } from "@flatfile/listener";
import { ExcelExtractor } from "@flatfile/plugin-xlsx-extractor";
import { spaceConfig } from "./listeners/configure-space.listener";
import { exportWorkbookPlugin} from "@flatfile/plugin-export-workbook";
import { usersHook } from "./listeners/users-hook.listener";
import { reverseNameListener } from "./listeners/reverse-name.listener";
import { demographicValidationHook } from "./listeners/demographic-validation.listener";
import { demographicV2ValidationHook } from "./listeners/demographic-v2-validation.listener";
import { demographicReferenceDataListener } from "./listeners/demographic-reference-data.listener";
import { demographicV2CitizenshipHook } from "./listeners/demographic-v2-citizenship.listener";
import { stateLicenseValidationHook } from "./blueprints/actions/validate-state-license.action";
import { deaLicenseValidationHook } from "./listeners/dea-license-validation.listener";
import { validateDEALicenseAction } from "./blueprints/actions/validate-dea-license.action";
import { customDownloadWorkbookAction } from "./blueprints/actions/custom-download-workbook.action";
import { rolloutPlugin } from "./plugins/rollout.plugin";
import { generateFieldMappings } from "./utils/field-mappings";

export default function (listener: FlatfileListener) {
  // Generate field mappings dynamically from sheet configurations
  const fieldMappings = generateFieldMappings();
  console.log(`[INIT] Generated ${Object.keys(fieldMappings).length} field mappings`);
  console.log(`[INIT] Sample mappings:`, Object.entries(fieldMappings).slice(0, 5));

  // Globally installed plugins
  listener.use(ExcelExtractor());

  listener.use(spaceConfig);
  listener.use(exportWorkbookPlugin({
    debug: true,  // Enable verbose logging for troubleshooting
    columnNameTransformer: (columnName, sheetSlug) => {
      const transformed = fieldMappings[columnName] || columnName;
      console.log(`[EXPORT] Transforming sheet "${sheetSlug}": ${columnName} -> ${transformed}`);
      return transformed;
    }
  }));
  listener.use(usersHook);
  listener.use(demographicValidationHook);
  listener.use(demographicV2ValidationHook);
  listener.use(demographicV2CitizenshipHook);
  listener.use(stateLicenseValidationHook);
  listener.use(deaLicenseValidationHook);
  listener.use(validateDEALicenseAction);

  // Register the rollout plugin root handler for agent deployment events
  listener.use(rolloutPlugin.root);

  // Register the rollout plugin on namespaced listener for job handling
  listener.namespace(['workbook:qgenda-company'], (filteredListener) => {
    filteredListener.use(rolloutPlugin);
  });

  // Custom listeners
  reverseNameListener(listener);
  demographicReferenceDataListener(listener);

  // Disabled for deployed agents
  if (!process.env.LAMBDA_TASK_ROOT) {
    listener.on("**", (event) => {
      console.log(`Received event: ${event.topic}`);
    });
  }
}
