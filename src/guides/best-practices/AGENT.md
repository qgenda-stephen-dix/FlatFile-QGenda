# Best Practices

## 🎯 **New Sheet Creation**
- **ALWAYS** follow the standardized template in `src/guides/sheet-blueprint-template.md`
- **ALWAYS** include X1-X10 custom fields in every new sheet
- **ALWAYS** use the quick checklist in `src/guides/new-sheet-checklist.md`
- Test auto-update functionality after creation

## 📋 **Sheet Configuration Standards**

1. **Field Requirements**
   - Include all fields from specification
   - **Always create headers in the exact order specified - DO NOT rearrange into categories**
   - Add X1-X10 custom string fields (standard requirement)
   - Use proper field types: string, enum, date, number
   - Mark required fields with constraints
   - Validate character limits in listeners (not constraints)

2. **Enum Best Practices**
   - Value and label should match exactly: `{ value: "Y", label: "Y" }`
   - Avoid `allow_empty` property (not supported in API)
   - Use consistent Y/N or T/F patterns as specified

3. **File Organization**
   - One sheet per file
   - Use descriptive file names
   - Export all sheets through an index file

2. **Naming Conventions**
   - Use PascalCase for sheet names
   - Use camelCase for field keys
   - Use kebab-case for slugs

3. **Documentation**
   - Always include field descriptions
   - Use JSDoc comments for sheet configurations
   - Document any special validation rules

4. **Validation**
   - Use the external constraints plugin for custom validation
   - Keep validation logic modular and reusable
   - Provide clear error messages
   - Handle edge cases appropriately

5. **References**
   - Use reference fields to maintain data relationships
   - Ensure referenced fields are unique
   - Document relationship requirements

6. **Enum Field Configuration**
   - **Always match enum labels to their values exactly**
   - Use `{ value: "Y", label: "Y" }` not `{ value: "Y", label: "Yes" }`
   - Use `{ value: "InternalID", label: "InternalID" }` not `{ value: "InternalID", label: "Internal ID" }`
   - This ensures consistency in data processing and exports
   - Prevents mapping issues during field transformations
