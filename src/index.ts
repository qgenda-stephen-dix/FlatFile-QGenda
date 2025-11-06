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
import { affiliationValidationHook } from "./listeners/affiliation-validation.listener";
import { validateAffiliationAction } from "./blueprints/actions/validate-affiliation.action";
import { otherCertificationValidationHook } from "./listeners/other-certification-validation.listener";
import { validateOtherCertificationAction } from "./blueprints/actions/validate-other-certification.action";
import malpracticeInsuranceValidationHook from "./listeners/malpractice-insurance-validation.listener";
import { validateMalpracticeInsuranceAction } from "./blueprints/actions/validate-malpractice-insurance.action";
import { customDownloadWorkbookAction } from "./blueprints/actions/custom-download-workbook.action";
import { rolloutPlugin } from "./plugins/rollout.plugin";
import { generateFieldMappings } from "./utils/field-mappings";
import { debugSpacesListener } from "./listeners/debug-spaces.listener";
import { malpracticeDeduplicationAction } from "./blueprints/actions/malpractice-deduplication.action";
import { educationGapValidationHook } from "./listeners/education-gap-validation.listener";
import { validateEducationGapAction } from "./blueprints/actions/validate-education-gap.action";
import { payerLocationsValidationHook } from "./listeners/payer-locations-validation.listener";
import { validatePayerLocationsAction } from "./blueprints/actions/validate-payer-locations.action";
import { payerValidationHook } from "./listeners/payer-validation.listener";
import { validatePayerAction } from "./blueprints/actions/validate-payer.action";
import { cdsCertificateValidationHook } from "./listeners/cds-certificate-validation.listener";
import { validateCDSCertificateAction } from "./blueprints/actions/validate-cds-certificate.action";
import { cmeValidationHook } from "./listeners/cme-validation.listener";
import { validateCMEAction } from "./blueprints/actions/validate-cme.action";
import { educationValidationHook } from "./listeners/education-validation.listener";
import { validateEducationAction } from "./blueprints/actions/validate-education.action";
import { providerAppointmentDatesValidationHook } from "./listeners/provider-appointment-dates-validation.listener";
import { validateProviderAppointmentDatesAction } from "./blueprints/actions/validate-provider-appointment-dates.action";
import { providerLocationDetailsValidationHook } from "./listeners/provider-location-details-validation.listener";
import { validateProviderLocationDetailsAction } from "./blueprints/actions/validate-provider-location-details.action";
import { providerPayerEnrollmentDatesValidationHook } from "./listeners/provider-payer-enrollment-dates-validation.listener";
import { validateProviderPayerEnrollmentDatesAction } from "./blueprints/actions/validate-provider-payer-enrollment-dates.action";
import { locationValidationHook } from "./listeners/location-validation.listener";
import { validateLocationAction } from "./blueprints/actions/validate-location.action";

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
  listener.use(affiliationValidationHook);
  listener.use(validateAffiliationAction);
  listener.use(otherCertificationValidationHook);
  listener.use(validateOtherCertificationAction);
  listener.use(malpracticeInsuranceValidationHook);
  listener.use(validateMalpracticeInsuranceAction);
  listener.use(educationGapValidationHook);
  listener.use(validateEducationGapAction);
  listener.use(payerLocationsValidationHook);
  listener.use(validatePayerLocationsAction);
  listener.use(payerValidationHook);
  listener.use(validatePayerAction);
  listener.use(cdsCertificateValidationHook);
  listener.use(validateCDSCertificateAction);
  listener.use(cmeValidationHook);
  listener.use(validateCMEAction);
  listener.use(educationValidationHook);
  listener.use(validateEducationAction);
  listener.use(providerAppointmentDatesValidationHook);
  listener.use(validateProviderAppointmentDatesAction);
  listener.use(providerLocationDetailsValidationHook);
  listener.use(validateProviderLocationDetailsAction);
  listener.use(providerPayerEnrollmentDatesValidationHook);
  listener.use(validateProviderPayerEnrollmentDatesAction);
  listener.use(locationValidationHook);
  listener.use(validateLocationAction);
  listener.use(debugSpacesListener);  // Add debug listener

  // Add malpractice insurance deduplication action
  malpracticeDeduplicationAction(listener);

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
