# External Validations


**Avoid external validations** in demo development unless explicitly asked to do so. Instead, use record hooks for custom validation.

## Recommended Approach: Record Hooks

Create validation logic using `@flatfile/plugin-record-hook`:

```typescript
import { recordHook } from '@flatfile/plugin-record-hook'

export const maxLengthValidator = recordHook('sheetName', (record) => {
  const value = record.get('fieldName')
  if (value && value.length > 100) {
    record.addError('fieldName', 'Value must be no more than 100 characters long')
  }
  return record
})

export const minValueValidator = recordHook('sheetName', (record) => {
  const value = record.get('numberField')
  const numValue = Number(value)
  if (value && (isNaN(numValue) || numValue < 0)) {
    record.addError('numberField', 'Value must be a number at least 0')
  } else if (value) {
    record.set('numberField', numValue)
  }
  return record
})
```
3. In your main `index.ts` file, import and use these validations:

```typescript
import { FlatfileListener } from '@flatfile/listener'
import { maxLengthValidator, minValueValidator } from './hooks/validations'

export default function flatfileEventListener(listener: FlatfileListener) {
  listener.use(maxLengthValidator)
  listener.use(minValueValidator)

  // ... rest of your listener configuration
}
```
4. Use these custom validations in your sheet configurations:

```typescript
{
  key: 'fieldName',
  type: 'string',
  constraints: [
    { type: 'external', validator: 'maxLength', config: { max: 100 } }
  ]
}
```
This setup allows you to define reusable validation functions and apply them across your Flatfile configuration. The validation functions can modify the record directly using methods like `addError`, `addWarning`, `addInfo`, and `set`. This provides more flexibility in handling different validation scenarios and updating the record as needed.
