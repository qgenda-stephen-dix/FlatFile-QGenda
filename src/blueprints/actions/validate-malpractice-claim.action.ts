import api from "@flatfile/api";
import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateMalpracticeClaimAction = (listener: FlatfileListener) => {
  listener.filter({ job: "sheet:validateMalpracticeClaim" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { jobId, sheetId } = event.context;

      try {
        await api.jobs.ack(jobId, {
          info: "Starting Malpractice Claim validation...",
          progress: 10,
        });

        const records = await api.records.get(sheetId);

        let validRecords = 0;
        let errorRecords = 0;
        const duplicateExternalIds = new Set<string>();
        const externalIdCombinations = new Map<string, number>();

        // Track duplicate External ID combinations for validation
        records.data.records?.forEach((record, index) => {
          const externalId = record.values.external_id?.value as string;
          const externalIdType = record.values.external_id_type?.value as string;
          
          if (externalId?.trim() && externalIdType?.trim()) {
            const combination = `${externalId.trim()}|${externalIdType.trim()}`;
            if (externalIdCombinations.has(combination)) {
              duplicateExternalIds.add(combination);
            } else {
              externalIdCombinations.set(combination, index);
            }
          }
        });

        await api.jobs.ack(jobId, {
          info: "Validating Malpractice Claim records...",
          progress: 50,
        });

        const updatedRecords = records.data.records?.map((record, index) => {
          const messages: any[] = [];

          // Get field values
          const externalId = record.values.external_id?.value as string;
          const externalIdType = record.values.external_id_type?.value as string;
          const organizationName = record.values.organization_name?.value as string;
          const reportingEntity = record.values.reporting_entity?.value as string;
          const primaryActOmission = record.values.primary_act_omission?.value as string;
          const incidentDate = record.values.incident_date?.value as string;
          const judgmentDate = record.values.judgment_date?.value as string;
          const claimStatus = record.values.claim_status?.value as string;
          const caseNumber = record.values.case_number?.value as string;
          const carrierAttorneyStatement = record.values.carrier_attorney_statement?.value as string;
          const descriptionOfJudgment = record.values.description_of_judgment?.value as string;
          const numberOfPractitioners = record.values.number_of_practitioners?.value as string;
          const totalPaidForThisPractitioner = record.values.total_paid_for_this_practitioner?.value as string;
          const typesOfPayment = record.values.types_of_payment?.value as string;
          const paymentResults = record.values.payment_results?.value as string;
          const paymentDate = record.values.payment_date?.value as string;
          const totalPaidForClaim = record.values.total_paid_for_claim?.value as string;
          const roleInClaim = record.values.role_in_claim?.value as string;
          const providerStatement = record.values.provider_statement?.value as string;
          const fileKey = record.values.file_key?.value as string;
          const note = record.values.note?.value as string;
          const user = record.values.user?.value as string;
          const timestamp = record.values.timestamp?.value as string;

          // Required field validations
          if (!externalId?.trim()) {
            messages.push({
              type: "error",
              field: "external_id",
              message: "External Id required"
            });
          }

          if (!externalIdType?.trim()) {
            messages.push({
              type: "error",
              field: "external_id_type",
              message: "External Id Type required"
            });
          }

          if (!organizationName?.trim()) {
            messages.push({
              type: "error",
              field: "organization_name",
              message: "Organization Name required"
            });
          }

          if (!reportingEntity?.trim()) {
            messages.push({
              type: "error",
              field: "reporting_entity",
              message: "Reporting Entity required"
            });
          }

          if (!incidentDate?.trim()) {
            messages.push({
              type: "error",
              field: "incident_date",
              message: "Incident Date required"
            });
          }

          // Duplicate External ID validation
          if (externalId?.trim() && externalIdType?.trim()) {
            const combination = `${externalId.trim()}|${externalIdType.trim()}`;
            if (duplicateExternalIds.has(combination)) {
              messages.push({
                type: "error",
                field: "external_id",
                message: "Duplicate External ID and External ID Type combination found in file"
              });
            }
          }

          // Character limit validations
          if (organizationName && organizationName.length > 100) {
            messages.push({
              type: "error",
              field: "organization_name",
              message: "Organization Name exceeds character limit of 100"
            });
          }

          if (reportingEntity && reportingEntity.length > 100) {
            messages.push({
              type: "error",
              field: "reporting_entity",
              message: "Reporting Entity exceeds character limit of 100"
            });
          }

          if (primaryActOmission && primaryActOmission.length > 500) {
            messages.push({
              type: "error",
              field: "primary_act_omission",
              message: "Primary Act / Omission exceeds character limit of 500"
            });
          }

          if (caseNumber && caseNumber.length > 50) {
            messages.push({
              type: "error",
              field: "case_number",
              message: "Case # exceeds character limit of 50"
            });
          }

          if (carrierAttorneyStatement && carrierAttorneyStatement.length > 5000) {
            messages.push({
              type: "error",
              field: "carrier_attorney_statement",
              message: "Carrier / Attorney Statement exceeds character limit of 5000"
            });
          }

          if (descriptionOfJudgment && descriptionOfJudgment.length > 5000) {
            messages.push({
              type: "error",
              field: "description_of_judgment",
              message: "Description of Judgment exceeds character limit of 5000"
            });
          }

          if (paymentResults && paymentResults.length > 5000) {
            messages.push({
              type: "error",
              field: "payment_results",
              message: "Payment Results exceeds character limit of 5000"
            });
          }

          if (roleInClaim && roleInClaim.length > 100) {
            messages.push({
              type: "error",
              field: "role_in_claim",
              message: "Role in Claim exceeds character limit of 100"
            });
          }

          if (providerStatement && providerStatement.length > 5000) {
            messages.push({
              type: "error",
              field: "provider_statement",
              message: "Provider Statement exceeds character limit of 5000"
            });
          }

          if (note && note.length > 10000) {
            messages.push({
              type: "error",
              field: "note",
              message: "Note exceeds character limit of 10000"
            });
          }

          // Date format validation
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

          if (incidentDate && !dateRegex.test(incidentDate)) {
            messages.push({
              type: "error",
              field: "incident_date",
              message: "Incident Date must be formatted as m/d/yyyy"
            });
          }

          if (judgmentDate && judgmentDate.trim() && !dateRegex.test(judgmentDate)) {
            messages.push({
              type: "error",
              field: "judgment_date",
              message: "Judgment Date must be formatted as m/d/yyyy"
            });
          }

          if (paymentDate && paymentDate.trim() && !dateRegex.test(paymentDate)) {
            messages.push({
              type: "error",
              field: "payment_date",
              message: "Payment Date must be formatted as m/d/yyyy"
            });
          }

          if (timestamp && timestamp.trim() && !dateRegex.test(timestamp)) {
            messages.push({
              type: "error",
              field: "timestamp",
              message: "Timestamp must be formatted as m/d/yyyy"
            });
          }

          // Number of Practitioners validation
          if (numberOfPractitioners && numberOfPractitioners.trim()) {
            const practitionerCount = parseInt(numberOfPractitioners.trim(), 10);
            if (isNaN(practitionerCount) || practitionerCount < 1 || practitionerCount > 999) {
              messages.push({
                type: "error",
                field: "number_of_practitioners",
                message: "# of Practitioners must be an integer between 1 and 999"
              });
            }
          }

          // Payment amount validations
          const validatePaymentAmount = (amountStr: string, fieldKey: string, fieldName: string) => {
            if (amountStr && amountStr.trim()) {
              const cleanAmount = amountStr.replace(/[$,]/g, '').trim();
              const amount = parseFloat(cleanAmount);
              
              if (isNaN(amount)) {
                messages.push({
                  type: "error",
                  field: fieldKey,
                  message: `${fieldName} must be a valid number`
                });
              } else if (amount > 2100000000) {
                messages.push({
                  type: "error",
                  field: fieldKey,
                  message: `${fieldName} cannot exceed 2.1 billion`
                });
              }
              
              if (cleanAmount.length > 12) {
                messages.push({
                  type: "error",
                  field: fieldKey,
                  message: `${fieldName} exceeds character limit of 12`
                });
              }
            }
          };

          validatePaymentAmount(totalPaidForThisPractitioner, "total_paid_for_this_practitioner", "Total Paid for this Practitioner");
          validatePaymentAmount(totalPaidForClaim, "total_paid_for_claim", "Total Paid for Claim");

          // Dropdown validations
          if (claimStatus && claimStatus.trim()) {
            const validClaimStatuses = ["Open", "Closed", "Settled", "Dismissed", "Pending"];
            if (!validClaimStatuses.includes(claimStatus.trim())) {
              messages.push({
                type: "error",
                field: "claim_status",
                message: "Claim Status not supported"
              });
            }
          }

          if (typesOfPayment && typesOfPayment.trim()) {
            const validPaymentTypes = ["Settlement", "Judgment", "Defense Costs", "Other"];
            if (!validPaymentTypes.includes(typesOfPayment.trim())) {
              messages.push({
                type: "error",
                field: "types_of_payment",
                message: "Types of Payment not supported"
              });
            }
          }

          // GUID format validation
          if (fileKey && fileKey.trim()) {
            const guidRegex = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
            if (!guidRegex.test(fileKey.trim())) {
              messages.push({
                type: "error",
                field: "file_key",
                message: "File Key must be a valid GUID"
              });
            }
          }

          // User validation warning
          if (!user?.trim()) {
            messages.push({
              type: "warning",
              field: "user",
              message: "No User listed, so \"Credentialing System\" will be listed"
            });
          }

          // TODO: Additional import-level validations would include:
          // - External ID matching against existing providers
          // - File Key validation against actual file database
          // - User email validation against Cred Spec emails
          // - Provider active/inactive status checks
          // - File Key linking/unlinking warnings

          if (messages.some(m => m.type === "error")) {
            errorRecords++;
          } else {
            validRecords++;
          }

          return {
            ...record,
            messages: messages
          };
        }) || [];

        await api.records.update(sheetId, updatedRecords);

        await api.jobs.complete(jobId, {
          outcome: {
            message: `Malpractice Claim validation completed. ${validRecords} valid records, ${errorRecords} records with errors. Found ${duplicateExternalIds.size} duplicate External ID combinations.`,
          },
        });

      } catch (error) {
        console.error("Error in Malpractice Claim validation:", error);
        
        await api.jobs.fail(jobId, {
          outcome: {
            message: `Malpractice Claim validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        });
      }
    });
  });
};