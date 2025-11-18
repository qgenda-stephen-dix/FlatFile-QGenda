import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const providerProfessionalAccountValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("provider_professional_account", (record) => {
      // Get all field values
      const providerName = record.get("provider_name") as string;
      const externalId = record.get("external_id") as string;
      const externalIdType = record.get("external_id_type") as string;
      const accountName = record.get("account_name") as string;
      const username = record.get("username") as string;
      const password = record.get("password") as string;
      const expirationDate = record.get("expiration_date") as string;
      const id = record.get("id") as string;
      const notes = record.get("notes") as string;

      // Required field validations
      if (!externalId?.trim()) {
        record.addError("external_id", "External Id required");
      }

      if (!externalIdType?.trim()) {
        record.addError("external_id_type", "External Id Type required");
      }

      if (!accountName?.trim()) {
        record.addError("account_name", "Account Name required");
      }

      // External ID Type enum validation
      if (externalIdType && externalIdType.trim()) {
        const validIdTypes = ["NPI", "InternalID", "ProviderID", "EmrID", "BillingSystemID"];
        if (!validIdTypes.includes(externalIdType.trim())) {
          record.addError("external_id_type", "External ID Type not valid");
        }
      }

      // Character limit validations
      if (username && username.length > 50) {
        record.addError("username", "Username exceeds character limit of 50");
      }

      if (password && password.length > 50) {
        record.addError("password", "Password exceeds character limit of 50");
      }

      if (id && id.length > 250) {
        record.addError("id", "ID exceeds character limit of 250");
      }

      if (notes && notes.length > 500) {
        record.addError("notes", "Notes exceeds character limit of 500");
      }

      // Date format validation for Expiration Date (m/d/yyyy)
      if (expirationDate && expirationDate.trim()) {
        const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!dateRegex.test(expirationDate.trim())) {
          record.addError("expiration_date", "Expiration Date must be formatted as m/d/yyyy");
        } else {
          // Validate actual date values
          const [month, day, year] = expirationDate.trim().split('/').map(Number);
          const dateObj = new Date(year, month - 1, day);
          
          if (dateObj.getFullYear() !== year || 
              dateObj.getMonth() !== month - 1 || 
              dateObj.getDate() !== day) {
            record.addError("expiration_date", "Expiration Date must be formatted as m/d/yyyy");
          }
        }
      }

      // External ID format validation based on type
      if (externalId && externalIdType && externalId.trim() && externalIdType.trim()) {
        const idValue = externalId.trim();
        const idType = externalIdType.trim();
        
        switch (idType) {
          case "NPI":
            // NPI should be 10 digits
            if (!/^\d{10}$/.test(idValue)) {
              record.addError("external_id", "NPI must be exactly 10 digits");
            }
            break;
          case "InternalID":
          case "ProviderID":
          case "EmrID":
          case "BillingSystemID":
            // Basic alphanumeric validation for other ID types
            if (!/^[A-Za-z0-9\-\_\.]+$/.test(idValue)) {
              record.addError("external_id", `${idType} contains invalid characters. Use only letters, numbers, hyphens, underscores, and periods`);
            }
            break;
        }
      }

      // Cross-field validations
      const hasExternalId = externalId && externalId.trim();
      const hasExternalIdType = externalIdType && externalIdType.trim();
      
      if ((hasExternalId && !hasExternalIdType) || (!hasExternalId && hasExternalIdType)) {
        record.addError("external_id", "Must provide both External ID and External ID Type");
        record.addError("external_id_type", "Must provide both External ID and External ID Type");
      }

      // Account Name validation (basic format check)
      if (accountName && accountName.trim()) {
        // Check for suspicious patterns that might indicate invalid account names
        const suspiciousPatterns = ["test", "example", "dummy", "xxx", "tbd"];
        const accountLower = accountName.toLowerCase();
        
        if (suspiciousPatterns.some(pattern => accountLower.includes(pattern))) {
          record.addWarning("account_name", "Account Name appears to be placeholder data - verify it matches existing company accounts");
        }
      }

      // Password security warnings (optional but helpful)
      if (password && password.trim()) {
        if (password.length < 8) {
          record.addWarning("password", "Password is less than 8 characters - consider stronger passwords for security");
        }
        
        // Check for common weak passwords
        const weakPasswords = ["password", "123456", "admin", "user"];
        if (weakPasswords.includes(password.toLowerCase())) {
          record.addWarning("password", "Password appears to be commonly used - consider more secure password");
        }
      }

      // TODO: Production validations that would be implemented:
      // - Validate Account Name against existing company-level Account Names
      // - Check if Account Name is archived in provider's company
      // - Cross-reference External ID/Type with existing providers in company
      // - Validate username availability/uniqueness within account context
      // - Check password policy compliance (complexity requirements)
      // - Validate expiration date is in the future (if provided)

      return record;
    })
  );
};