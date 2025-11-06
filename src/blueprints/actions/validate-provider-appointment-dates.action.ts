import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validateProviderAppointmentDatesAction = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validateProviderAppointmentDates" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        // Track duplicates by External ID + External ID Type combination
        const duplicateTracker = new Map<string, FlatfileRecord[]>();

        records.forEach((record: FlatfileRecord) => {
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          
          if (externalId && externalIdType) {
            const key = `${externalIdType}:${externalId}`;
            
            if (!duplicateTracker.has(key)) {
              duplicateTracker.set(key, []);
            }
            duplicateTracker.get(key)!.push(record);
          }
        });

        // Process duplicate detection
        duplicateTracker.forEach((duplicateRecords, key) => {
          if (duplicateRecords.length > 1) {
            duplicateRecords.forEach((record) => {
              record.addError("externalId", `Duplicate records exist in file with same External ID Type and External ID combination`);
            });
          }
        });

        const validatedRecords = records.map((record: FlatfileRecord) => {
          // Get field values for business rule validation
          const externalId = record.get("externalId") as string;
          const externalIdType = record.get("externalIdType") as string;
          const locationKey = record.get("locationKey") as string;
          const workflowType = record.get("workflowType") as string;
          const workflowKey = record.get("workflowKey") as string;
          const resolution = record.get("resolution") as string;
          const locationEmploymentType = record.get("locationEmploymentType") as string;
          const appointmentDate = record.get("appointmentDate") as string;
          const reappointmentDate = record.get("reappointmentDate") as string;
          const reappointmentNotificationDate = record.get("reappointmentNotificationDate") as string;
          const inactiveDate = record.get("inactiveDate") as string;
          const notes = record.get("notes") as string;
          const providerCategory = record.get("providerCategory") as string;

          // Required field validations (same as listener)
          if (!locationKey?.trim()) {
            record.addError("locationKey", "Location Key required");
          }

          if (!workflowType?.trim()) {
            record.addError("workflowType", "Workflow Type required");
          }

          if (!workflowKey?.trim()) {
            record.addError("workflowKey", "Workflow Key required");
          }

          if (!externalId?.trim()) {
            record.addError("externalId", "External Id required");
          }

          if (!externalIdType?.trim()) {
            record.addError("externalIdType", "External Id Type required");
          }

          // External ID validation - both must be provided together
          if ((externalId && !externalIdType) || (!externalId && externalIdType)) {
            record.addError("externalId", "Must provide both External ID and External ID Type");
            record.addError("externalIdType", "Must provide both External ID and External ID Type");
          }

          // External ID Type validation
          const validExternalIdTypes = ["NPI", "InternalID", "ProviderID", "EmrID", "BillingSystemID"];
          if (externalIdType && !validExternalIdTypes.includes(externalIdType)) {
            record.addError("externalIdType", "External ID Type not valid");
          }

          // GUID format validations
          const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
          
          if (locationKey && !guidRegex.test(locationKey)) {
            record.addError("locationKey", "Location Key must be a valid GUID");
          }

          if (workflowKey && !guidRegex.test(workflowKey)) {
            record.addError("workflowKey", "Workflow Key must be a valid GUID");
          }

          // Workflow Type validation
          const validWorkflowTypes = ["Appointment", "Provider - Location Termination"];
          if (workflowType && !validWorkflowTypes.includes(workflowType)) {
            record.addError("workflowType", "Workflow Type not supported");
          }

          // Resolution validation based on Workflow Type
          if (workflowType === "Appointment") {
            if (!resolution?.trim()) {
              record.addError("resolution", "Resolution required");
            } else {
              const validResolutions = ["Approved", "Withdrawn", "Denied", "Approved - Historical Only"];
              if (!validResolutions.includes(resolution)) {
                record.addError("resolution", "Resolution not supported");
              }
            }
          } else if (workflowType === "Provider - Location Termination") {
            if (resolution?.trim()) {
              record.addError("resolution", "Resolution can only be input if Workflow Type is Appointment");
            }
          }

          // Date format validations
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
          
          if (appointmentDate) {
            if (!dateRegex.test(appointmentDate)) {
              record.addError("appointmentDate", "Appointment Date must be formatted as m/d/yyyy");
            }
            
            // Appointment Date can only be input if Resolution is Approved
            if (resolution !== "Approved") {
              record.addError("appointmentDate", "Appointment Date can only be input if Resolution is Approved");
            }
          }

          if (reappointmentDate) {
            if (!dateRegex.test(reappointmentDate)) {
              record.addError("reappointmentDate", "Reappointment Date must be formatted as m/d/yyyy");
            }
            
            // Reappointment Date can only be input if Resolution is Approved
            if (resolution !== "Approved") {
              record.addError("reappointmentDate", "Reappointment Date can only be input if Resolution is Approved");
            }
            
            // Reappointment Date can only be input if Workflow Type is Appointment
            if (workflowType !== "Appointment") {
              record.addError("reappointmentDate", "Reappointment Date can only be input if Workflow Type is Appointment");
            }
          }

          if (reappointmentNotificationDate) {
            if (!dateRegex.test(reappointmentNotificationDate)) {
              record.addError("reappointmentNotificationDate", "Notification Date must be formatted as m/d/yyyy");
            }
          }

          if (inactiveDate) {
            if (!dateRegex.test(inactiveDate)) {
              record.addError("inactiveDate", "Inactive Date must be formatted as m/d/yyyy");
            }
            
            // Inactive Date can only be input if Workflow Type is "Provider - Location Termination"
            if (workflowType !== "Provider - Location Termination") {
              record.addError("inactiveDate", "Inactive Date can only be input if Workflow Type is \"Provider - Location Termination\"");
            }
          }

          // Date relationship validations
          if (appointmentDate && reappointmentDate) {
            const appointmentDateObj = new Date(appointmentDate);
            const reappointmentDateObj = new Date(reappointmentDate);
            
            if (reappointmentDateObj <= appointmentDateObj) {
              record.addError("reappointmentDate", "Reappointment Date must be after Appointment Date");
            }
          }

          if (reappointmentNotificationDate && reappointmentDate) {
            const notificationDateObj = new Date(reappointmentNotificationDate);
            const reappointmentDateObj = new Date(reappointmentDate);
            
            if (notificationDateObj >= reappointmentDateObj) {
              record.addError("reappointmentNotificationDate", "Notification Date must be before Reappointment Date");
            }
            
            // Check if notification date is 1-999 days before reappointment date
            const timeDiff = reappointmentDateObj.getTime() - notificationDateObj.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (daysDiff < 1 || daysDiff > 999) {
              record.addError("reappointmentNotificationDate", "Notification Date must be between 1 and 999 days before Reappointment Date");
            }
          }

          // Required fields when Resolution = Approved
          if (resolution === "Approved") {
            if (!appointmentDate?.trim()) {
              record.addError("appointmentDate", "Appointment Date required when Resolution is Approved");
            }
            
            if (!reappointmentDate?.trim()) {
              record.addError("reappointmentDate", "Reappointment Date required when Resolution is Approved");
            }
          }

          // Required Inactive Date when Workflow Type = "Provider - Location Termination"
          if (workflowType === "Provider - Location Termination") {
            if (!inactiveDate?.trim()) {
              record.addError("inactiveDate", "Inactive Date required when Workflow Type is \"Provider - Location Termination\"");
            }
          }

          // Notes validation
          if (resolution === "Denied") {
            if (!notes?.trim()) {
              record.addError("notes", "Notes required when Resolution is Denied");
            }
          }

          if (notes && notes.length > 500) {
            record.addError("notes", "Notes must be 500 characters or less");
          }

          // Location Employment Type warning
          if (locationEmploymentType && workflowType !== "Appointment") {
            record.addWarning("locationEmploymentType", "Location Employment Type will not import information when Workflow Type is not Appointment");
          }

          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in Provider Appointment Dates validation:", error);
        throw error;
      }
    }
  );
};