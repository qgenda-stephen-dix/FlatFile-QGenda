import type { FlatfileListener } from '@flatfile/listener'
import { recordHook } from '@flatfile/plugin-record-hook'

/**
 * Malpractice Insurance Validation Listener
 * 
 * Provides real-time validation for malpractice insurance records including:
 * - Required field validation
 * - Character limit validation
 * - Date format validation
 * - GUID format validation
 * - Phone number format validation
 * - Email format validation
 * - Y/N enum validation
 * - Business rule validation
 */
export default function malpracticeInsuranceValidation(listener: FlatfileListener) {
  listener.use(
    recordHook('malpractice-insurance', (record) => {
      // Get field values
      const externalId = record.get('externalId') as string
      const externalIdType = record.get('externalIdType') as string
      const carrierName = record.get('carrierName') as string
      const policyType = record.get('policyType') as string
      const policyNumber = record.get('policyNumber') as string
      const currentEffectiveDate = record.get('currentEffectiveDate') as string
      const originalEffectiveDate = record.get('originalEffectiveDate') as string
      const currentExpirationDate = record.get('currentExpirationDate') as string
      const monitorExpirationDate = record.get('monitorExpirationDate') as string
      const coveragePerOccurrence = record.get('coveragePerOccurrence') as string
      const coverageAggregate = record.get('coverageAggregate') as string
      const addressLine1 = record.get('addressLine1') as string
      const addressLine2 = record.get('addressLine2') as string
      const city = record.get('city') as string
      const state = record.get('state') as string
      const zip = record.get('zip') as string
      const phoneNumber = record.get('phoneNumber') as string
      const ext = record.get('ext') as string
      const email = record.get('email') as string
      const fax = record.get('fax') as string
      const excessLimitPerClaim = record.get('excessLimitPerClaim') as string
      const excessLimitAggregate = record.get('excessLimitAggregate') as string
      const nonNetworkInsurance = record.get('nonNetworkInsurance') as string
      const selfInsured = record.get('selfInsured') as string
      const privilegeLimitation = record.get('privilegeLimitation') as string
      const limitationInformation = record.get('limitationInformation') as string
      const contactName = record.get('contactName') as string
      const agentName = record.get('agentName') as string
      const alternatePhone = record.get('alternatePhone') as string
      const alternateExt = record.get('alternateExt') as string
      const website = record.get('website') as string
      const primaryLocationKey = record.get('primaryLocationKey') as string
      const additionalLocationKeys = record.get('additionalLocationKeys') as string
      const timeStamp = record.get('timeStamp') as string
      const user = record.get('user') as string
      const note = record.get('note') as string
      const fileKey = record.get('fileKey') as string

      // Required field validation
      if (!externalId) {
        record.addError('externalId', 'External Id required')
      }

      if (!externalIdType) {
        record.addError('externalIdType', 'External Id Type required')
      }

      if (!carrierName) {
        record.addError('carrierName', 'Carrier Name required')
      }

      if (!currentExpirationDate) {
        record.addError('currentExpirationDate', 'Current Expiration Date required')
      }

      // Character limit validation
      if (carrierName && carrierName.length > 200) {
        record.addError('carrierName', 'Carrier Name exceeds character limit of 200')
      }

      if (policyNumber && policyNumber.length > 100) {
        record.addError('policyNumber', 'Policy Number exceeds character limit of 100')
      }

      if (addressLine1 && addressLine1.length > 100) {
        record.addError('addressLine1', 'Address Line 1 exceeds character limit of 100')
      }

      if (addressLine2 && addressLine2.length > 100) {
        record.addError('addressLine2', 'Address Line 2 exceeds character limit of 100')
      }

      if (city && city.length > 50) {
        record.addError('city', 'City exceeds character limit of 50')
      }

      if (email && email.length > 100) {
        record.addError('email', 'Email exceeds character limit of 100')
      }

      if (limitationInformation && limitationInformation.length > 10000) {
        record.addError('limitationInformation', 'Limitation Information exceeds character limit of 10,000')
      }

      if (contactName && contactName.length > 256) {
        record.addError('contactName', 'Contact Name exceeds character limit of 256')
      }

      if (agentName && agentName.length > 256) {
        record.addError('agentName', 'Agent Name exceeds character limit of 256')
      }

      if (website && website.length > 500) {
        record.addError('website', 'Website exceeds character limit of 500')
      }

      if (note && note.length > 10000) {
        record.addError('note', 'Note exceeds character limit of 10000')
      }

      // Date format validation (m/d/yyyy)
      const dateRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/

      if (currentEffectiveDate && !dateRegex.test(currentEffectiveDate)) {
        record.addError('currentEffectiveDate', 'Current Effective Date must be formatted as m/d/yyyy')
      }

      if (originalEffectiveDate && !dateRegex.test(originalEffectiveDate)) {
        record.addError('originalEffectiveDate', 'Original Effective Date must be formatted as m/d/yyyy')
      }

      if (currentExpirationDate && !dateRegex.test(currentExpirationDate)) {
        record.addError('currentExpirationDate', 'Current Expiration Date must be formatted as m/d/yyyy')
      }

      if (timeStamp && !dateRegex.test(timeStamp)) {
        record.addError('timeStamp', 'Timestamp must be formatted as m/d/yyyy')
      }

      // Date logic validation
      if (currentEffectiveDate && currentExpirationDate && originalEffectiveDate) {
        const effectiveDate = new Date(currentEffectiveDate)
        const originalDate = new Date(originalEffectiveDate)
        const expirationDate = new Date(currentExpirationDate)

        if (expirationDate <= effectiveDate || expirationDate <= originalDate) {
          record.addError('currentExpirationDate', 'Expiration Date must be after Current and Original Effective Date')
        }
      }

      // T/F validation
      if (monitorExpirationDate && !['T', 'F'].includes(monitorExpirationDate)) {
        record.addError('monitorExpirationDate', 'Monitor Expiration Date must be T or F')
      }

      // Y/N validation
      if (nonNetworkInsurance && !['Y', 'N'].includes(nonNetworkInsurance)) {
        record.addError('nonNetworkInsurance', 'Non-Network Insurance must be Y or N')
      }

      if (selfInsured && !['Y', 'N'].includes(selfInsured)) {
        record.addError('selfInsured', 'Self Insured must be Y or N')
      }

      if (privilegeLimitation && !['Y', 'N'].includes(privilegeLimitation)) {
        record.addError('privilegeLimitation', 'Privilege Limitation must be Y or N')
      }

      // Numeric validation (2.1 billion limit)
      const maxAmount = 2100000000
      const numericFields = [
        { value: coveragePerOccurrence, field: 'coveragePerOccurrence', name: 'Coverage Per Occurrence' },
        { value: coverageAggregate, field: 'coverageAggregate', name: 'Coverage Aggregate' },
        { value: excessLimitPerClaim, field: 'excessLimitPerClaim', name: 'Excess Limit Per Claim' },
        { value: excessLimitAggregate, field: 'excessLimitAggregate', name: 'Excess Limit Aggregate' }
      ]

      numericFields.forEach(({ value, field, name }) => {
        if (value && parseFloat(value) > maxAmount) {
          record.addError(field, `${name} cannot exceed 2.1 billion`)
        }
      })

      // Coverage field character limits (10 digits)
      if (coveragePerOccurrence && coveragePerOccurrence.toString().length > 10) {
        record.addError('coveragePerOccurrence', 'Coverage Per Occurrence exceeds character limit of 10')
      }

      if (coverageAggregate && coverageAggregate.toString().length > 10) {
        record.addError('coverageAggregate', 'Coverage Aggregate exceeds character limit of 10')
      }

      if (excessLimitPerClaim && excessLimitPerClaim.toString().length > 10) {
        record.addError('excessLimitPerClaim', 'Excess Limit Per Claim exceeds character limit of 10')
      }

      if (excessLimitAggregate && excessLimitAggregate.toString().length > 10) {
        record.addError('excessLimitAggregate', 'Excess Limit Aggregate exceeds character limit of 10')
      }

      // Phone number validation (9, 10, or 12 digit)
      const phoneRegex = /^\d{9}$|^\d{10}$|^\d{12}$/
      
      if (phoneNumber && !phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
        record.addError('phoneNumber', 'Phone Number must be 9, 10, or 12-digit number')
      }

      if (fax && !phoneRegex.test(fax.replace(/\D/g, ''))) {
        record.addError('fax', 'Fax must be 9, 10, or 12-digit number')
      }

      if (alternatePhone && !phoneRegex.test(alternatePhone.replace(/\D/g, ''))) {
        record.addError('alternatePhone', 'Alternate Phone Number must be 9, 10, or 12-digit number')
      }

      // Extension validation (numeric, max 20 digits)
      const extRegex = /^\d{1,20}$/
      
      if (ext && !extRegex.test(ext)) {
        record.addError('ext', 'Ext. must be a number up to 20 digits in length')
      }

      if (alternateExt && !extRegex.test(alternateExt)) {
        record.addError('alternateExt', 'Alternate Ext. must be a number up to 20 digits in length')
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (email && !emailRegex.test(email)) {
        record.addError('email', 'Must be a valid email')
      }

      // Zip code validation (5, 6, or 9 digit formats)
      const zipRegex = /^\d{5}$|^\d{6}$|^\d{5}-\d{4}$/
      if (zip && !zipRegex.test(zip)) {
        record.addError('zip', 'Zip codes must be a 5, 6, or 9 digit zipcode (#####, ######, or #####-####)')
      }

      // GUID validation
      const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      
      if (primaryLocationKey && !guidRegex.test(primaryLocationKey)) {
        record.addError('primaryLocationKey', 'Primary Location Key must be a valid GUID')
      }

      if (additionalLocationKeys) {
        const keys = additionalLocationKeys.split(',')
        keys.forEach((key) => {
          if (key.trim() && !guidRegex.test(key.trim())) {
            record.addError('additionalLocationKeys', 'Additional Location Keys must be a valid GUID. Multiple Keys must be comma-delimited')
          }
        })
      }

      if (fileKey && !guidRegex.test(fileKey)) {
        record.addError('fileKey', 'File Key must be a valid GUID')
      }

      // URL validation
      if (website) {
        try {
          new URL(website)
        } catch {
          record.addError('website', 'URL not valid')
        }
      }

      // User warning
      if (!user) {
        record.addInfo('user', 'No User listed, so "Credentialing System" will be listed')
      }

      return record
    })
  )
}