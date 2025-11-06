import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

// Validation helper functions
function isValidUUID(value: string): boolean {
  if (!value) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

function isValidEmail(email: string): boolean {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url: string): boolean {
  if (!url) return true; // Optional field
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && urlObj.hostname.includes('.');
  } catch {
    return false;
  }
}

function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return true; // Optional field
  const cleanPhone = phone.replace(/\D/g, '');
  return [9, 10, 12].includes(cleanPhone.length);
}

function isValidZipCode(zip: string): boolean {
  if (!zip) return true; // Optional field
  const cleanZip = zip.replace(/\D/g, '');
  return [5, 6, 9].includes(cleanZip.length);
}

function isValidTimeFormat(time: string): boolean {
  if (!time) return true; // Optional field
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

function isValidNPI(npi: string): boolean {
  if (!npi) return true; // Optional field
  const cleanNPI = npi.replace(/\D/g, '');
  return cleanNPI.length === 10;
}

function isValidExtension(ext: string): boolean {
  if (!ext) return true; // Optional field
  const cleanExt = ext.replace(/\D/g, '');
  return cleanExt.length <= 20 && cleanExt === ext;
}

function isValidYesNo(value: string): boolean {
  if (!value) return true; // Optional field
  return ['Y', 'N', 'y', 'n'].includes(value);
}

function validateCharacterLimit(value: string, limit: number, fieldName: string): string[] {
  const errors: string[] = [];
  if (value && value.length > limit) {
    errors.push(`${fieldName} exceeds character limit of ${limit}`);
  }
  return errors;
}

export const locationValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("location", (record) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Extract field values
      const externalId = record.get("externalId") as string;
      const externalIdType = record.get("externalIdType") as string;
      const locationName = record.get("locationName") as string;
      const dba = record.get("dba") as string;
      const legalBusinessName = record.get("legalBusinessName") as string;
      const corporateEntity = record.get("corporateEntity") as string;
      const taxonomy = record.get("taxonomy") as string;
      const specialty = record.get("specialty") as string;
      const locationId = record.get("locationId") as string;
      const region = record.get("region") as string;
      const npiNumber = record.get("npiNumber") as string;
      const taxId = record.get("taxId") as string;
      const medicareId = record.get("medicareId") as string;
      const medicaidId = record.get("medicaidId") as string;

      // Contact Information fields
      const contactCountry = record.get("contactCountry") as string;
      const contactAddressLine1 = record.get("contactAddressLine1") as string;
      const contactAddressLine2 = record.get("contactAddressLine2") as string;
      const contactCity = record.get("contactCity") as string;
      const contactCounty = record.get("contactCounty") as string;
      const contactZip = record.get("contactZip") as string;
      const contactEmail = record.get("contactEmail") as string;
      const contactPhoneNumber = record.get("contactPhoneNumber") as string;
      const contactExt = record.get("contactExt") as string;
      const contactFax = record.get("contactFax") as string;
      const website = record.get("website") as string;

      // Correspondence fields
      const correspondenceName = record.get("correspondenceName") as string;
      const correspondenceTitle = record.get("correspondenceTitle") as string;
      const correspondenceAddressLine1 = record.get("correspondenceAddressLine1") as string;
      const correspondenceAddressLine2 = record.get("correspondenceAddressLine2") as string;
      const correspondenceCity = record.get("correspondenceCity") as string;
      const correspondenceCounty = record.get("correspondenceCounty") as string;
      const correspondenceZip = record.get("correspondenceZip") as string;
      const correspondenceEmail = record.get("correspondenceEmail") as string;
      const correspondencePhoneNumber = record.get("correspondencePhoneNumber") as string;
      const correspondenceExt = record.get("correspondenceExt") as string;
      const correspondenceFax = record.get("correspondenceFax") as string;

      // Operating Hours fields
      const sundayStartTime = record.get("sundayStartTime") as string;
      const sundayEndTime = record.get("sundayEndTime") as string;
      const sundayClosed = record.get("sundayClosed") as string;
      const mondayStartTime = record.get("mondayStartTime") as string;
      const mondayEndTime = record.get("mondayEndTime") as string;
      const mondayClosed = record.get("mondayClosed") as string;
      const tuesdayStartTime = record.get("tuesdayStartTime") as string;
      const tuesdayEndTime = record.get("tuesdayEndTime") as string;
      const tuesdayClosed = record.get("tuesdayClosed") as string;
      const wednesdayStartTime = record.get("wednesdayStartTime") as string;
      const wednesdayEndTime = record.get("wednesdayEndTime") as string;
      const wednesdayClosed = record.get("wednesdayClosed") as string;
      const thursdayStartTime = record.get("thursdayStartTime") as string;
      const thursdayEndTime = record.get("thursdayEndTime") as string;
      const thursdayClosed = record.get("thursdayClosed") as string;
      const fridayStartTime = record.get("fridayStartTime") as string;
      const fridayEndTime = record.get("fridayEndTime") as string;
      const fridayClosed = record.get("fridayClosed") as string;
      const saturdayStartTime = record.get("saturdayStartTime") as string;
      const saturdayEndTime = record.get("saturdayEndTime") as string;
      const saturdayClosed = record.get("saturdayClosed") as string;

      // Billing Address fields
      const billingName = record.get("billingName") as string;
      const billingAddressLine1 = record.get("billingAddressLine1") as string;
      const billingAddressLine2 = record.get("billingAddressLine2") as string;
      const billingCity = record.get("billingCity") as string;
      const billingCounty = record.get("billingCounty") as string;
      const billingZip = record.get("billingZip") as string;
      const billingEmail = record.get("billingEmail") as string;
      const billingPhoneNumber = record.get("billingPhoneNumber") as string;
      const billingExt = record.get("billingExt") as string;
      const billingFax = record.get("billingFax") as string;

      // Additional fields
      const generalNotes = record.get("generalNotes") as string;
      const instructions = record.get("instructions") as string;
      
      // Boolean Y/N fields
      const affiliationVerificationAvailable = record.get("affiliationVerificationAvailable") as string;
      const locationDetailIdsSameAsCorporateEntity = record.get("locationDetailIdsSameAsCorporateEntity") as string;
      const contactInformationSameAsCorporateEntity = record.get("contactInformationSameAsCorporateEntity") as string;
      const correspondenceSameAsCorporateEntity = record.get("correspondenceSameAsCorporateEntity") as string;
      const billingAddressSameAsCorporateEntity = record.get("billingAddressSameAsCorporateEntity") as string;
      const adaCompliant = record.get("adaCompliant") as string;
      const examTableScaleChair = record.get("examTableScaleChair") as string;
      const exteriorBuilding = record.get("exteriorBuilding") as string;
      const handicapAccessibility = record.get("handicapAccessibility") as string;
      const interiorBuilding = record.get("interiorBuilding") as string;
      const parking = record.get("parking") as string;
      const publicTransportationAccess = record.get("publicTransportationAccess") as string;
      const restroom = record.get("restroom") as string;
      const siteAccessibility = record.get("siteAccessibility") as string;
      const multiLineConferencing = record.get("multiLineConferencing") as string;
      const interpreterServices = record.get("interpreterServices") as string;

      // Required field validations
      if (!externalId) {
        errors.push("External ID is required");
      }
      if (!externalIdType) {
        errors.push("External ID Type is required");
      }
      if (!locationName) {
        errors.push("Location Name is required");
      }
      if (!corporateEntity) {
        errors.push("Corporate Entity is required");
      }

      // External ID Type validation
      if (externalIdType && !["Location Key", "Location ID"].includes(externalIdType)) {
        errors.push("External ID Type not valid");
      }

      // External ID and External ID Type dependency validation
      if ((externalId && !externalIdType) || (!externalId && externalIdType)) {
        errors.push("Must provide both External ID and External ID Type");
      }

      // UUID validation for Location Key when adding new records
      if (externalIdType === "Location Key" && externalId && !isValidUUID(externalId)) {
        errors.push("Location Key formatted incorrectly");
      }

      // Character limit validations
      errors.push(...validateCharacterLimit(externalId, 36, "External ID"));
      errors.push(...validateCharacterLimit(locationName, 100, "Location Name"));
      errors.push(...validateCharacterLimit(dba, 100, "DBA"));
      errors.push(...validateCharacterLimit(legalBusinessName, 100, "Legal Business Name"));
      errors.push(...validateCharacterLimit(taxonomy, 100, "Taxonomy"));
      errors.push(...validateCharacterLimit(specialty, 50, "Specialty"));
      errors.push(...validateCharacterLimit(region, 50, "Region"));
      errors.push(...validateCharacterLimit(taxId, 50, "Tax ID"));
      errors.push(...validateCharacterLimit(medicareId, 50, "Medicare ID"));
      errors.push(...validateCharacterLimit(medicaidId, 50, "Medicaid ID"));
      
      // Contact Information character limits
      errors.push(...validateCharacterLimit(contactCountry, 100, "Contact Country"));
      errors.push(...validateCharacterLimit(contactAddressLine1, 100, "Contact Address Line 1"));
      errors.push(...validateCharacterLimit(contactAddressLine2, 50, "Contact Address Line 2"));
      errors.push(...validateCharacterLimit(contactCity, 50, "Contact City"));
      errors.push(...validateCharacterLimit(contactCounty, 100, "Contact County"));
      
      // Correspondence character limits
      errors.push(...validateCharacterLimit(correspondenceName, 100, "Correspondence Name"));
      errors.push(...validateCharacterLimit(correspondenceTitle, 100, "Correspondence Title"));
      errors.push(...validateCharacterLimit(correspondenceAddressLine1, 100, "Correspondence Address Line 1"));
      errors.push(...validateCharacterLimit(correspondenceAddressLine2, 50, "Correspondence Address Line 2"));
      errors.push(...validateCharacterLimit(correspondenceCity, 50, "Correspondence City"));
      errors.push(...validateCharacterLimit(correspondenceCounty, 100, "Correspondence County"));
      
      // Billing Address character limits
      errors.push(...validateCharacterLimit(billingName, 100, "Billing Name"));
      errors.push(...validateCharacterLimit(billingAddressLine1, 100, "Billing Address Line 1"));
      errors.push(...validateCharacterLimit(billingAddressLine2, 50, "Billing Address Line 2"));
      errors.push(...validateCharacterLimit(billingCity, 50, "Billing City"));
      errors.push(...validateCharacterLimit(billingCounty, 100, "Billing County"));
      
      // Long text field limits
      errors.push(...validateCharacterLimit(generalNotes, 10000, "General Notes"));
      errors.push(...validateCharacterLimit(instructions, 10000, "Instructions"));

      // Location ID validation (pipe-delimited, max 64 chars each)
      if (locationId) {
        const locationIds = locationId.split('|');
        for (const id of locationIds) {
          if (id.length > 64) {
            errors.push("One of the Location ID's exceeds character limit of 64");
            break;
          }
        }
      }

      // NPI Number validation
      if (!isValidNPI(npiNumber)) {
        errors.push("NPI Number must be exactly 10 digits");
      }

      // Email validations
      if (!isValidEmail(contactEmail)) {
        errors.push("Contact Email not a valid email");
      }
      if (!isValidEmail(correspondenceEmail)) {
        errors.push("Correspondence Email not a valid email");
      }
      if (!isValidEmail(billingEmail)) {
        errors.push("Billing Email not a valid email");
      }

      // Phone number validations
      if (!isValidPhoneNumber(contactPhoneNumber)) {
        errors.push("Contact Phone Number must be 9, 10, or 12-digit number");
      }
      if (!isValidPhoneNumber(contactFax)) {
        errors.push("Contact Fax must be 9, 10, or 12-digit number");
      }
      if (!isValidPhoneNumber(correspondencePhoneNumber)) {
        errors.push("Correspondence Phone Number must be 9, 10, or 12-digit number");
      }
      if (!isValidPhoneNumber(correspondenceFax)) {
        errors.push("Correspondence Fax must be 9, 10, or 12-digit number");
      }
      if (!isValidPhoneNumber(billingPhoneNumber)) {
        errors.push("Billing Phone Number must be 9, 10, or 12-digit number");
      }
      if (!isValidPhoneNumber(billingFax)) {
        errors.push("Billing Fax must be 9, 10, or 12-digit number");
      }

      // Extension validations
      if (!isValidExtension(contactExt)) {
        errors.push("Contact Ext. must be a number up to 20 digits in length");
      }
      if (!isValidExtension(correspondenceExt)) {
        errors.push("Correspondence Ext. must be a number up to 20 digits in length");
      }
      if (!isValidExtension(billingExt)) {
        errors.push("Billing Ext. must be a number up to 20 digits in length");
      }

      // Zip code validations
      if (!isValidZipCode(contactZip)) {
        errors.push("Contact Zip is not 5, 6, or 9 digits");
      }
      if (!isValidZipCode(correspondenceZip)) {
        errors.push("Correspondence Zip is not 5, 6, or 9 digits");
      }
      if (!isValidZipCode(billingZip)) {
        errors.push("Billing Zip is not 5, 6, or 9 digits");
      }

      // Website validation
      if (!isValidUrl(website)) {
        errors.push("Website not a valid url");
      }

      // Time format validations
      const timeFields = [
        { value: sundayStartTime, name: "Sunday Start Time" },
        { value: sundayEndTime, name: "Sunday End Time" },
        { value: mondayStartTime, name: "Monday Start Time" },
        { value: mondayEndTime, name: "Monday End Time" },
        { value: tuesdayStartTime, name: "Tuesday Start Time" },
        { value: tuesdayEndTime, name: "Tuesday End Time" },
        { value: wednesdayStartTime, name: "Wednesday Start Time" },
        { value: wednesdayEndTime, name: "Wednesday End Time" },
        { value: thursdayStartTime, name: "Thursday Start Time" },
        { value: thursdayEndTime, name: "Thursday End Time" },
        { value: fridayStartTime, name: "Friday Start Time" },
        { value: fridayEndTime, name: "Friday End Time" },
        { value: saturdayStartTime, name: "Saturday Start Time" },
        { value: saturdayEndTime, name: "Saturday End Time" }
      ];

      for (const timeField of timeFields) {
        if (!isValidTimeFormat(timeField.value)) {
          errors.push(`${timeField.name} must be formatted as hh:mm`);
        }
      }

      // Y/N boolean validations
      const booleanFields = [
        { value: affiliationVerificationAvailable, name: "Affiliation Verification Available" },
        { value: locationDetailIdsSameAsCorporateEntity, name: "Location Detail IDs Same as Corporate Entity" },
        { value: contactInformationSameAsCorporateEntity, name: "Contact Information Same as Corporate Entity" },
        { value: correspondenceSameAsCorporateEntity, name: "Correspondence Same as Corporate Entity" },
        { value: billingAddressSameAsCorporateEntity, name: "Billing Address Same as Corporate Entity" },
        { value: sundayClosed, name: "Sunday Closed" },
        { value: mondayClosed, name: "Monday Closed" },
        { value: tuesdayClosed, name: "Tuesday Closed" },
        { value: wednesdayClosed, name: "Wednesday Closed" },
        { value: thursdayClosed, name: "Thursday Closed" },
        { value: fridayClosed, name: "Friday Closed" },
        { value: saturdayClosed, name: "Saturday Closed" },
        { value: adaCompliant, name: "ADA Compliant" },
        { value: examTableScaleChair, name: "Exam Table/Scale/Chair" },
        { value: exteriorBuilding, name: "Exterior Building" },
        { value: handicapAccessibility, name: "Handicap Accessibility" },
        { value: interiorBuilding, name: "Interior Building" },
        { value: parking, name: "Parking" },
        { value: publicTransportationAccess, name: "Public Transportation Access" },
        { value: restroom, name: "Restroom" },
        { value: siteAccessibility, name: "Site Accessibility" },
        { value: multiLineConferencing, name: "Multi-Line Conferencing" },
        { value: interpreterServices, name: "Interpreter Services" }
      ];

      for (const boolField of booleanFields) {
        if (!isValidYesNo(boolField.value)) {
          errors.push(`${boolField.name} must be Y or N`);
        }
      }

      // Apply errors to record
      for (const error of errors) {
        record.addError("*", error);
      }

      // Apply warnings to record
      for (const warning of warnings) {
        record.addWarning("*", warning);
      }

      return record;
    })
  );
};