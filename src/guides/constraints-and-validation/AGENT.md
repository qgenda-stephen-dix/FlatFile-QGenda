# Constraints and Validation


### **Avoid External Constraints**

For demo development, avoid using `@flatfile/plugin-constraints` and `externalConstraint` unless explicitly asked to do so. Instead, use built-in field validation and record hooks for custom validation logic.

#### Recommended Approach: Record Hooks

Use `@flatfile/plugin-record-hook` for custom validation:

```typescript
import { recordHook } from '@flatfile/plugin-record-hook'

export default function(listener: FlatfileListener) {
  listener.use(
    recordHook('sheetName', (record) => {
      // Max length validation
      const value = record.get('fieldName')
      if (value && value.length > 100) {
        record.addError('fieldName', 'Value must be no more than 100 characters long')
      }
      
      // Min value validation  
      const numValue = record.get('numberField')
      if (numValue && numValue < 0) {
        record.addError('numberField', 'Value must be at least 0')
      }
      
      return record
    })
  )
}
```

2. **In your blueprint:**

```typescript
{
  key: 'name',
  type: 'string',
  constraints: [
    { type: 'external', validator: 'maxLength', config: { max: 100 } }
  ]
},
{
  key: 'age',
  type: 'number',
  constraints: [
    { type: 'external', validator: 'minValue', config: { min: 0 } }
  ]
}
```
#### Benefits of External Constraints
- Custom validation logic
- Reusable validation functions
- Access to record context
- Flexible error handling
- Type safety with TypeScript

#### Best Practices for External Constraints
- Keep validation functions pure and focused
- Use descriptive error messages
- Handle edge cases (null, undefined)
- Consider performance for large datasets
- Group related validations
