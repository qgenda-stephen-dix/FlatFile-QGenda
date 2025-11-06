import { usersSheet } from "../blueprints/sheets/users.sheet";
import { demographicSheet } from "../blueprints/sheets/demographic.sheet";
import { demographicV2Sheet } from "../blueprints/sheets/demographic-v2.sheet";
import { demographicReferenceSheet } from "../blueprints/sheets/demographic-reference.sheet";
import { stateLicenseSheet } from "../blueprints/sheets/state-license.sheet";
import { deaLicenseSheet } from "../blueprints/sheets/dea-license.sheet";
import { affiliationSheet } from "../blueprints/sheets/affiliation.sheet";
import { otherCertificationSheet } from "../blueprints/sheets/other-certification.sheet";
import { malpracticeInsuranceSheet } from "../blueprints/sheets/malpractice-insurance.sheet";
import { educationGapSheet } from "../blueprints/sheets/education-gap.sheet";
import { payerLocationsSheet } from "../blueprints/sheets/payer-locations.sheet";
import { payerSheet } from "../blueprints/sheets/payer.sheet";
import { cdsCertificateSheet } from "../blueprints/sheets/cds-certificate.sheet";
import { cmeSheet } from "../blueprints/sheets/cme.sheet";
import { educationSheet } from "../blueprints/sheets/education.sheet";
import { providerAppointmentDatesSheet } from "../blueprints/sheets/provider-appointment-dates.sheet";
import { providerLocationDetailsSheet } from "../blueprints/sheets/provider-location-details.sheet";
import { providerPayerEnrollmentDatesSheet } from "../blueprints/sheets/provider-payer-enrollment-dates.sheet";
import { locationSheet } from "../blueprints/sheets/location.sheet";

// Generate field mappings from all sheet configurations
export function generateFieldMappings(): { [key: string]: string } {
  const sheets = [
    usersSheet,
    demographicSheet,
    demographicV2Sheet,
    demographicReferenceSheet,
    stateLicenseSheet,
    deaLicenseSheet,
    affiliationSheet,
    otherCertificationSheet,
    malpracticeInsuranceSheet,
    educationGapSheet,
    payerLocationsSheet,
    payerSheet,
    cdsCertificateSheet,
    cmeSheet,
    educationSheet,
    providerAppointmentDatesSheet,
    providerLocationDetailsSheet,
    providerPayerEnrollmentDatesSheet,
    locationSheet
  ];

  const mappings: { [key: string]: string } = {};
  
  sheets.forEach(sheet => {
    if (sheet.fields) {
      sheet.fields.forEach(field => {
        mappings[field.key] = field.label || field.key;
      });
    }
  });
  
  return mappings;
}