import { Flatfile } from "@flatfile/api";
import { usersSheet } from "../sheets/users.sheet";
import { demographicSheet } from "../sheets/demographic.sheet";
import { demographicV2Sheet } from "../sheets/demographic-v2.sheet";
import { demographicReferenceSheet } from "../sheets/demographic-reference.sheet";
import { stateLicenseSheet } from "../sheets/state-license.sheet";
import { deaLicenseSheet } from "../sheets/dea-license.sheet";
import { boardCertificationSheet } from "../sheets/board-certification.sheet";

export const companyWorkbook: Flatfile.CreateWorkbookConfig = {
  name: "Company Workbook",
  namespace: "workbook:qgenda-company",
  labels: [ "pinned" ],
  sheets: [ usersSheet, demographicSheet, demographicV2Sheet, demographicReferenceSheet, stateLicenseSheet, deaLicenseSheet, boardCertificationSheet ],
  actions: [ {
    operation: "downloadWorkbook",
    mode: "foreground",
    label: "Download Workbook",
    description: "Download workbook with proper column headers"
  } ]
};
