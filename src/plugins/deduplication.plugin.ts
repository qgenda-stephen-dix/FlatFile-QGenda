import type { FlatfileListener } from '@flatfile/listener'
import { jobHandler } from '@flatfile/plugin-job-handler'
import { FlatfileRecord } from '@flatfile/hooks'

/**
 * Deduplication Plugin for Flatfile
 * 
 * This plugin provides comprehensive deduplication functionality across all sheets.
 * It can handle:
 * - Single key deduplication (external_id)
 * - Composite key deduplication (external_id + external_id_type)
 * - Custom field combinations
 * - Different deduplication strategies (keep first, keep last, merge, flag)
 */

export interface DeduplicationConfig {
  /** Fields to use as the unique key for deduplication */
  keyFields: string[]
  /** Strategy for handling duplicates */
  strategy: 'keep-first' | 'keep-last' | 'merge' | 'flag-only'
  /** Whether to case-sensitive comparison for string fields */
  caseSensitive?: boolean
  /** Custom message for duplicate notifications */
  duplicateMessage?: string
  /** Fields to merge when using 'merge' strategy (takes non-empty values from later records) */
  mergeFields?: string[]
  /** Whether to add info messages about dedupe actions */
  verbose?: boolean
}

/**
 * Default configurations for different sheet types
 */
export const DEFAULT_DEDUPE_CONFIGS: Record<string, DeduplicationConfig> = {
  // Standard single external ID deduplication
  'default': {
    keyFields: ['external_id'],
    strategy: 'flag-only',
    caseSensitive: false,
    duplicateMessage: 'Duplicate External ID found. Only the first occurrence will be processed.',
    verbose: true
  },
  
  // External ID + Type combination (most common)
  'external-id-type': {
    keyFields: ['external_id', 'external_id_type'],
    strategy: 'flag-only',
    caseSensitive: false,
    duplicateMessage: 'Duplicate External ID and Type combination found. Only the first occurrence will be processed.',
    verbose: true
  },
  
  // Affiliation specific (provider + facility + dates)
  'affiliation': {
    keyFields: ['external_id', 'external_id_type', 'facility_employer_name', 'start_date'],
    strategy: 'keep-last',
    caseSensitive: false,
    duplicateMessage: 'Duplicate affiliation record found. Keeping the last occurrence with most recent data.',
    mergeFields: ['end_date', 'title_position', 'department', 'note'],
    verbose: true
  },
  
  // State License specific
  'state-license': {
    keyFields: ['external_id', 'external_id_type', 'license_number', 'state'],
    strategy: 'flag-only',
    caseSensitive: false,
    duplicateMessage: 'Duplicate license record found for the same provider and state.',
    verbose: true
  },
  
  // DEA License specific  
  'dea-license': {
    keyFields: ['external_id', 'external_id_type', 'dea_number'],
    strategy: 'flag-only',
    caseSensitive: false,
    duplicateMessage: 'Duplicate DEA license record found for the same DEA number.',
    verbose: true
  },
  
  // Demographics (provider identity)
  'demographic': {
    keyFields: ['external_id', 'external_id_type'],
    strategy: 'merge',
    caseSensitive: false,
    duplicateMessage: 'Duplicate provider record found. Merging data from multiple rows.',
    mergeFields: ['phone_number', 'email', 'address_line_1', 'address_line_2', 'city', 'state', 'zip'],
    verbose: true
  },
  
  // Other Certification
  'other-certification': {
    keyFields: ['external_id', 'external_id_type', 'certification', 'certification_number'],
    strategy: 'flag-only',
    caseSensitive: false,
    duplicateMessage: 'Duplicate certification record found.',
    verbose: true
  },
  
  // Malpractice Insurance
  'malpractice-insurance': {
    keyFields: ['external_id', 'external_id_type', 'policy_number', 'carrier_name'],
    strategy: 'keep-last',
    caseSensitive: false,
    duplicateMessage: 'Duplicate malpractice insurance record found. Keeping most recent policy information.',
    mergeFields: ['current_expiration_date', 'coverage_per_occurrence', 'coverage_aggregate'],
    verbose: true
  }
}

/**
 * Create a deduplication plugin for a specific sheet
 */
export function createDedupePlugin(
  sheetSlug: string, 
  config?: Partial<DeduplicationConfig>
) {
  return (listener: FlatfileListener) => {
    // Get default config for this sheet type or use generic default
    const defaultConfig = DEFAULT_DEDUPE_CONFIGS[sheetSlug] || DEFAULT_DEDUPE_CONFIGS['default']
    const finalConfig: DeduplicationConfig = { ...defaultConfig, ...config }
    
    listener.use(
      jobHandler(`sheet:dedupe-${sheetSlug}`, async (event, tick) => {
        const { sheetId } = event.context
        
        await tick(10, `Starting deduplication for ${sheetSlug}...`)
        
        try {
          // Get all records from the sheet
          const { data: records } = await event.data
          
          await tick(20, `Found ${records.length} records. Analyzing for duplicates...`)
          
          // Track duplicates and their keys
          const keyMap = new Map<string, FlatfileRecord[]>()
          const duplicateGroups: FlatfileRecord[][] = []
          
          // Group records by key
          for (const record of records) {
            const keyValues = finalConfig.keyFields.map(field => {
              const value = record.get(field) as string
              return finalConfig.caseSensitive ? value : value?.toLowerCase?.() || ''
            })
            
            // Skip records with empty key fields
            if (keyValues.some(v => !v || v.trim() === '')) {
              continue
            }
            
            const key = keyValues.join('|')
            
            if (!keyMap.has(key)) {
              keyMap.set(key, [])
            }
            keyMap.get(key)!.push(record)
          }
          
          await tick(40, 'Identifying duplicate groups...')
          
          // Find groups with duplicates
          for (const [key, recordGroup] of keyMap.entries()) {
            if (recordGroup.length > 1) {
              duplicateGroups.push(recordGroup)
            }
          }
          
          await tick(60, `Found ${duplicateGroups.length} duplicate groups. Processing...`)
          
          let processedCount = 0
          let flaggedCount = 0
          let removedCount = 0
          let mergedCount = 0
          
          // Process each duplicate group
          for (const duplicateGroup of duplicateGroups) {
            await processDuplicateGroup(duplicateGroup, finalConfig)
            processedCount += duplicateGroup.length
            
            switch (finalConfig.strategy) {
              case 'flag-only':
                flaggedCount += duplicateGroup.length - 1
                break
              case 'keep-first':
              case 'keep-last':
                removedCount += duplicateGroup.length - 1
                break
              case 'merge':
                mergedCount += duplicateGroup.length - 1
                break
            }
          }
          
          await tick(90, 'Deduplication complete. Generating summary...')
          
          const summary = [
            `Deduplication Summary for ${sheetSlug}:`,
            `- Total records processed: ${records.length}`,
            `- Duplicate groups found: ${duplicateGroups.length}`,
            `- Records in duplicates: ${processedCount}`,
            ``
          ]
          
          if (flaggedCount > 0) summary.push(`- Records flagged as duplicates: ${flaggedCount}`)
          if (removedCount > 0) summary.push(`- Records marked for removal: ${removedCount}`)
          if (mergedCount > 0) summary.push(`- Records merged: ${mergedCount}`)
          
          summary.push(``, `Strategy used: ${finalConfig.strategy}`)
          summary.push(`Key fields: ${finalConfig.keyFields.join(', ')}`)
          
          return {
            outcome: {
              message: summary.join('\n'),
              next: {
                type: 'id',
                id: sheetId
              }
            }
          }
          
        } catch (error) {
          console.error(`Error in ${sheetSlug} deduplication:`, error)
          throw new Error(`Deduplication failed: ${error.message}`)
        }
      })
    )
  }
}

/**
 * Process a group of duplicate records according to the strategy
 */
async function processDuplicateGroup(
  duplicates: FlatfileRecord[], 
  config: DeduplicationConfig
): Promise<void> {
  if (duplicates.length <= 1) return
  
  const keyFieldsText = config.keyFields.join(', ')
  const duplicateMessage = config.duplicateMessage || `Duplicate record found based on: ${keyFieldsText}`
  
  switch (config.strategy) {
    case 'flag-only':
      // Flag all duplicates after the first one
      for (let i = 1; i < duplicates.length; i++) {
        duplicates[i].addError(config.keyFields[0], duplicateMessage)
        if (config.verbose) {
          duplicates[i].addInfo('deduplication', `Duplicate #${i} of ${duplicates.length} for key: ${keyFieldsText}`)
        }
      }
      break
      
    case 'keep-first':
      // Mark all but first for removal
      for (let i = 1; i < duplicates.length; i++) {
        duplicates[i].addError(config.keyFields[0], `${duplicateMessage} This record will be ignored.`)
        // Mark the record as invalid so it won't be processed
        markRecordForSkip(duplicates[i])
      }
      if (config.verbose) {
        duplicates[0].addInfo('deduplication', `Keeping first of ${duplicates.length} duplicates`)
      }
      break
      
    case 'keep-last':
      // Mark all but last for removal
      for (let i = 0; i < duplicates.length - 1; i++) {
        duplicates[i].addError(config.keyFields[0], `${duplicateMessage} This record will be ignored.`)
        markRecordForSkip(duplicates[i])
      }
      if (config.verbose) {
        duplicates[duplicates.length - 1].addInfo('deduplication', `Keeping last of ${duplicates.length} duplicates`)
      }
      break
      
    case 'merge':
      // Merge data into the first record and mark others for removal
      const targetRecord = duplicates[0]
      const fieldsToMerge = config.mergeFields || []
      
      for (let i = 1; i < duplicates.length; i++) {
        const sourceRecord = duplicates[i]
        
        // Merge specified fields (take non-empty values from later records)
        for (const field of fieldsToMerge) {
          const sourceValue = sourceRecord.get(field) as string
          const targetValue = targetRecord.get(field) as string
          
          if (sourceValue && sourceValue.trim() !== '' && (!targetValue || targetValue.trim() === '')) {
            targetRecord.set(field, sourceValue)
          }
        }
        
        sourceRecord.addError(config.keyFields[0], `${duplicateMessage} Data merged into first occurrence.`)
        markRecordForSkip(sourceRecord)
      }
      
      if (config.verbose) {
        targetRecord.addInfo('deduplication', `Merged data from ${duplicates.length - 1} duplicate records`)
      }
      break
  }
}

/**
 * Mark a record to be skipped during processing
 */
function markRecordForSkip(record: FlatfileRecord): void {
  // Add a special marker that can be used by downstream processing
  record.set('_dedupe_skip', 'true')
}

/**
 * Universal deduplication plugin that can be applied to any sheet
 */
export function universalDedupePlugin(
  configs: Record<string, Partial<DeduplicationConfig>> = {}
) {
  return (listener: FlatfileListener) => {
    // Register deduplication jobs for all known sheet types
    const sheetTypes = Object.keys(DEFAULT_DEDUPE_CONFIGS)
    
    for (const sheetSlug of sheetTypes) {
      const config = configs[sheetSlug] || {}
      const plugin = createDedupePlugin(sheetSlug, config)
      plugin(listener)
    }
    
    // Also register a generic dedupe job
    const genericPlugin = createDedupePlugin('records', configs['generic'] || {})
    genericPlugin(listener)
  }
}

/**
 * Quick setup for common deduplication scenarios
 */
export const QuickDedupe = {
  // External ID only
  externalId: (sheetSlug: string) => createDedupePlugin(sheetSlug, {
    keyFields: ['external_id'],
    strategy: 'flag-only'
  }),
  
  // External ID + Type
  externalIdType: (sheetSlug: string) => createDedupePlugin(sheetSlug, {
    keyFields: ['external_id', 'external_id_type'],
    strategy: 'flag-only'
  }),
  
  // Custom fields
  custom: (sheetSlug: string, keyFields: string[], strategy: DeduplicationConfig['strategy'] = 'flag-only') => 
    createDedupePlugin(sheetSlug, { keyFields, strategy })
}

export default universalDedupePlugin