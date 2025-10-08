import { Flatfile } from '@flatfile/api'

/**
 * Malpractice Insurance Import Format Sheet Configuration
 * 
 * Key fields for updating:
 * - External ID (required)
 * - External ID Type (required) 
 * - Carrier Name (required)
 * - Policy Number
 * - Current Expiration Date (required)
 * - Primary Location Key (GUID format)
 * 
 * Includes comprehensive validation for dates, GUIDs, phone numbers, emails, and business rules.
 */
export const malpracticeInsuranceSheet: Flatfile.SheetConfig = {
  name: 'Malpractice Insurance',
  slug: 'malpractice-insurance',
  fields: [
    // Core Provider Information
    {
      key: 'providerName',
      type: 'string',
      label: 'Provider Name',
      description: 'Name of the provider'
    },
    {
      key: 'externalId',
      type: 'string',
      label: 'External ID',
      description: 'Key field for updating, Required field',
      constraints: [{ type: 'required' }]
    },
    {
      key: 'externalIdType',
      type: 'string',
      label: 'External ID Type',
      description: 'Key field for updating, Required field',
      constraints: [{ type: 'required' }]
    },

    // Location Information
    {
      key: 'primaryLocationName',
      type: 'string',
      label: 'Primary Location Name',
      description: 'Name of the primary location'
    },
    {
      key: 'primaryLocationKey',
      type: 'string',
      label: 'Primary Location Key',
      description: 'GUID format key for primary location (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)'
    },
    {
      key: 'additionalLocationNames',
      type: 'string',
      label: 'Additional Location Names',
      description: 'Comma-delimited list of additional location names'
    },
    {
      key: 'additionalLocationKeys',
      type: 'string',
      label: 'Additional Location Keys',
      description: 'Comma-delimited list of additional location GUIDs'
    },

    // Insurance Policy Information
    {
      key: 'carrierName',
      type: 'string',
      label: 'Carrier Name',
      description: 'Key field for updating, Required field',
      constraints: [{ type: 'required' }]
    },
    {
      key: 'policyType',
      type: 'string',
      label: 'Policy Type',
      description: 'Type of insurance policy - must match Policy Type drop-down values'
    },
    {
      key: 'policyNumber',
      type: 'string',
      label: 'Policy Number',
      description: 'Key field for updating'
    },
    {
      key: 'currentEffectiveDate',
      type: 'date',
      label: 'Current Effective Date',
      description: 'Current effective date in m/d/yyyy format'
    },
    {
      key: 'originalEffectiveDate',
      type: 'date',
      label: 'Original Effective Date',
      description: 'Original effective date in m/d/yyyy format'
    },
    {
      key: 'currentExpirationDate',
      type: 'date',
      label: 'Current Expiration Date',
      description: 'Key field for updating, Required field',
      constraints: [{ type: 'required' }]
    },
    {
      key: 'monitorExpirationDate',
      type: 'enum',
      label: 'Monitor Expiration Date',
      description: 'Whether to monitor expiration date',
      config: {
        options: [
          { value: 'T', label: 'T' },
          { value: 'F', label: 'F' }
        ]
      }
    },

    // Coverage Information
    {
      key: 'coveragePerOccurrence',
      type: 'number',
      label: 'Coverage Per Occurrence ($)',
      description: 'Coverage amount per occurrence (max 2.1 billion)'
    },
    {
      key: 'coverageAggregate',
      type: 'number',
      label: 'Coverage Aggregate ($)',
      description: 'Aggregate coverage amount (max 2.1 billion)'
    },

    // Address Information
    {
      key: 'addressLine1',
      type: 'string',
      label: 'Address line 1',
      description: 'Primary address line'
    },
    {
      key: 'addressLine2',
      type: 'string',
      label: 'Address line 2',
      description: 'Secondary address line'
    },
    {
      key: 'city',
      type: 'string',
      label: 'City',
      description: 'City name'
    },
    {
      key: 'state',
      type: 'string',
      label: 'State',
      description: 'State abbreviation'
    },
    {
      key: 'zip',
      type: 'string',
      label: 'Zip',
      description: 'Zip code in format #####, ######, or #####-####'
    },

    // Contact Information
    {
      key: 'phoneNumber',
      type: 'string',
      label: 'Phone Number',
      description: 'Phone number in 9, 10, or 12-digit format'
    },
    {
      key: 'ext',
      type: 'string',
      label: 'Ext.',
      description: 'Phone extension (up to 20 digits)'
    },
    {
      key: 'email',
      type: 'string',
      label: 'Email',
      description: 'Valid email address'
    },
    {
      key: 'fax',
      type: 'string',
      label: 'Fax',
      description: 'Fax number in 9, 10, or 12-digit format'
    },

    // Additional Policy Information
    {
      key: 'recordViewableByProvider',
      type: 'string',
      label: 'Record Viewable by Provider',
      description: 'Whether record is viewable by provider'
    },
    {
      key: 'excessLimitPerClaim',
      type: 'number',
      label: 'Excess Limit Per Claim ($)',
      description: 'Excess limit per claim (max 2.1 billion)'
    },
    {
      key: 'excessLimitAggregate',
      type: 'number',
      label: 'Excess Limit Aggregate ($)',
      description: 'Excess limit aggregate (max 2.1 billion)'
    },
    {
      key: 'nonNetworkInsurance',
      type: 'enum',
      label: 'Non-Network Insurance',
      description: 'Whether this is non-network insurance',
      config: {
        options: [
          { value: 'Y', label: 'Y' },
          { value: 'N', label: 'N' }
        ]
      }
    },
    {
      key: 'selfInsured',
      type: 'enum',
      label: 'Self Insured',
      description: 'Whether provider is self insured',
      config: {
        options: [
          { value: 'Y', label: 'Y' },
          { value: 'N', label: 'N' }
        ]
      }
    },
    {
      key: 'privilegeLimitation',
      type: 'enum',
      label: 'Privilege Limitation',
      description: 'Whether there are privilege limitations',
      config: {
        options: [
          { value: 'Y', label: 'Y' },
          { value: 'N', label: 'N' }
        ]
      }
    },
    {
      key: 'limitationInformation',
      type: 'string',
      label: 'Limitation Information',
      description: 'Details about limitations (max 10,000 characters)'
    },

    // Additional Contact Information
    {
      key: 'contactName',
      type: 'string',
      label: 'Contact Name',
      description: 'Name of contact person (max 256 characters)'
    },
    {
      key: 'agentName',
      type: 'string',
      label: 'Agent Name',
      description: 'Name of insurance agent (max 256 characters)'
    },
    {
      key: 'alternatePhone',
      type: 'string',
      label: 'Alternate Phone',
      description: 'Alternate phone number in 9, 10, or 12-digit format'
    },
    {
      key: 'alternateExt',
      type: 'string',
      label: 'Alternate Ext.',
      description: 'Alternate phone extension (up to 20 digits)'
    },
    {
      key: 'website',
      type: 'string',
      label: 'Website',
      description: 'Website URL (max 500 characters)'
    },

    // Administrative Fields
    {
      key: 'finalClaimsHistoryReceived',
      type: 'string',
      label: 'Final Claims History Received',
      description: 'Whether final claims history has been received'
    },
    {
      key: 'ignoreRequiredFieldsValidation',
      type: 'string',
      label: 'Ignore Required Fields Validation?',
      description: 'Whether to ignore required field validation'
    },
    {
      key: 'fileViewableByProvider',
      type: 'string',
      label: 'File Viewable by Provider',
      description: 'Whether file is viewable by provider'
    },
    {
      key: 'fileKey',
      type: 'string',
      label: 'File Key',
      description: 'GUID format file key'
    },
    {
      key: 'note',
      type: 'string',
      label: 'Note',
      description: 'Additional notes (max 10,000 characters)'
    },
    {
      key: 'user',
      type: 'string',
      label: 'User',
      description: 'User who created/modified the record'
    },
    {
      key: 'timeStamp',
      type: 'date',
      label: 'TimeStamp',
      description: 'Timestamp in m/d/yyyy format'
    },

    // Standard X1-X10 Custom Fields
    {
      key: 'x1',
      type: 'string',
      label: 'X1',
      description: 'Custom field 1 for extensibility'
    },
    {
      key: 'x2',
      type: 'string',
      label: 'X2',
      description: 'Custom field 2 for extensibility'
    },
    {
      key: 'x3',
      type: 'string',
      label: 'X3',
      description: 'Custom field 3 for extensibility'
    },
    {
      key: 'x4',
      type: 'string',
      label: 'X4',
      description: 'Custom field 4 for extensibility'
    },
    {
      key: 'x5',
      type: 'string',
      label: 'X5',
      description: 'Custom field 5 for extensibility'
    },
    {
      key: 'x6',
      type: 'string',
      label: 'X6',
      description: 'Custom field 6 for extensibility'
    },
    {
      key: 'x7',
      type: 'string',
      label: 'X7',
      description: 'Custom field 7 for extensibility'
    },
    {
      key: 'x8',
      type: 'string',
      label: 'X8',
      description: 'Custom field 8 for extensibility'
    },
    {
      key: 'x9',
      type: 'string',
      label: 'X9',
      description: 'Custom field 9 for extensibility'
    },
    {
      key: 'x10',
      type: 'string',
      label: 'X10',
      description: 'Custom field 10 for extensibility'
    }
  ],
  actions: [
    {
      operation: 'validateMalpracticeInsurance',
      mode: 'background',
      label: 'Validate Malpractice Insurance',
      description: 'Validates malpractice insurance records with comprehensive business rules'
    }
  ]
}