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
    educationGapSheet
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