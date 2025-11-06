import { Flatfile } from "@flatfile/api";
import { usersSheet } from "../sheets/users.sheet";
import { demographicSheet } from "../sheets/demographic.sheet";
import { demographicV2Sheet } from "../sheets/demographic-v2.sheet";
import { demographicReferenceSheet } from "../sheets/demographic-reference.sheet";
import { stateLicenseSheet } from "../sheets/state-license.sheet";
import { deaLicenseSheet } from "../sheets/dea-license.sheet";
import { affiliationSheet } from "../sheets/affiliation.sheet";
import { boardCertificationSheet } from "../sheets/board-certification.sheet";
import { otherCertificationSheet } from "../sheets/other-certification.sheet";
import { malpracticeInsuranceSheet } from "../sheets/malpractice-insurance.sheet";
import { educationGapSheet } from "../sheets/education-gap.sheet";
import { payerLocationsSheet } from "../sheets/payer-locations.sheet";
import { payerSheet } from "../sheets/payer.sheet";
import { cdsCertificateSheet } from "../sheets/cds-certificate.sheet";
import { cmeSheet } from "../sheets/cme.sheet";
import { educationSheet } from "../sheets/education.sheet";
import { providerAppointmentDatesSheet } from "../sheets/provider-appointment-dates.sheet";
import { providerLocationDetailsSheet } from "../sheets/provider-location-details.sheet";
import { providerPayerEnrollmentDatesSheet } from "../sheets/provider-payer-enrollment-dates.sheet";
import { locationSheet } from "../sheets/location.sheet";

export const companyWorkbook: Flatfile.CreateWorkbookConfig = {
  name: "Company Workbook",
  namespace: "workbook:qgenda-company",
  labels: [ "pinned" ],
  sheets: [ usersSheet, demographicSheet, demographicV2Sheet, demographicReferenceSheet, stateLicenseSheet, deaLicenseSheet, affiliationSheet, boardCertificationSheet, otherCertificationSheet, malpracticeInsuranceSheet, educationGapSheet, payerLocationsSheet, payerSheet, cdsCertificateSheet, cmeSheet, educationSheet, providerAppointmentDatesSheet, providerLocationDetailsSheet, providerPayerEnrollmentDatesSheet, locationSheet ],
  actions: [ {
    operation: "downloadWorkbook",
    mode: "foreground",
    label: "Download Workbook",
    description: "Download workbook with proper column headers"
  } ]
};
