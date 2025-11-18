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
import { driversLicenseSheet } from "../blueprints/sheets/drivers-license.sheet";
import { malpracticeClaimSheet } from "../blueprints/sheets/malpractice-claim.sheet";
import { personalReferenceSheet } from "../blueprints/sheets/personal-reference.sheet";
import { companyPrivilegesSheet } from "../blueprints/sheets/company-privileges.sheet";
import { providerPrivilegesSheet } from "../blueprints/sheets/provider-privileges.sheet";
import { professionalTrainingSheet } from "../blueprints/sheets/professional-training.sheet";
import { providerProfessionalAccountSheet } from "../blueprints/sheets/provider-professional-account.sheet";
import { professionalReferenceSheet } from "../blueprints/sheets/professional-reference.sheet";
import { fileDetailsSheet } from "../blueprints/sheets/file-details.sheet";
import { globalPrivilegeSheet } from "../blueprints/sheets/global-privilege.sheet";
import { healthRecordSheet } from "../blueprints/sheets/health-record.sheet";
import { otherRecordSheet } from "../blueprints/sheets/other-record.sheet";
import { workGapSheet } from "../blueprints/sheets/work-gap.sheet";
import { workHistorySheet } from "../blueprints/sheets/work-history.sheet";

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
    locationSheet,
    driversLicenseSheet,
    malpracticeClaimSheet,
    personalReferenceSheet,
    companyPrivilegesSheet,
    providerPrivilegesSheet,
    professionalTrainingSheet,
    providerProfessionalAccountSheet,
    professionalReferenceSheet,
    fileDetailsSheet,
    globalPrivilegeSheet,
    healthRecordSheet,
    otherRecordSheet,
    workGapSheet,
    workHistorySheet
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