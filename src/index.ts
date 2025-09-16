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
import { stateLicenseValidationHook } from "./actions/validate-state-license.action";

export default function (listener: FlatfileListener) {
  // Globally installed plugins
  listener.use(ExcelExtractor());

  listener.use(spaceConfig);
  listener.use(exportWorkbookPlugin());
  listener.use(usersHook);
  listener.use(demographicValidationHook);
  listener.use(demographicV2ValidationHook);
  listener.use(demographicV2CitizenshipHook);
  listener.use(stateLicenseValidationHook);

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
