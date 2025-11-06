# Sheet Blueprint Creation Template

This template provides a standardized approach for creating new sheet blueprints in the Flatfile QGenda system.

## 📋 **Step-by-Step Checklist**

### **1. Sheet Configuration File**
Create: `src/blueprints/sheets/{sheet-name}.sheet.ts`

```typescript
import { Flatfile } from "@flatfile/api";

export const {sheetName}Sheet: Flatfile.SheetConfig = {
  name: "{Sheet Display Name}",
  slug: "{sheet-slug}",
  access: ["*"],
  fields: [
    // Standard fields based on specification
    {
      key: "field_key",
      type: "string|enum|date|number",
      label: "Field Label",
      description: "Field description from spec",
      constraints: [
        {
          type: "required" // if required field
        }
      ],
      config: {
        // For enum fields only
        options: [
          { value: "Value1", label: "Value1" },
          { value: "Value2", label: "Value2" }
        ]
      }
    },
    // ... all fields from specification
    
    // ALWAYS ADD: X1-X10 Custom Fields
    {
      key: "x1",
      type: "string",
      label: "X1",
      description: "Custom field X1"
    },
    {
      key: "x2",
      type: "string",
      label: "X2",
      description: "Custom field X2"
    },
    // ... continue through x10
    {
      key: "x10",
      type: "string",
      label: "X10",
      description: "Custom field X10"
    }
  ],
  actions: [
    {
      operation: "validate{SheetName}",
      mode: "foreground",
      label: "Validate {Sheet Name}",
      description: "Validate {sheet name} data with comprehensive business rules"
    }
  ]
};
```

### **2. Validation Listener**
Create: `src/listeners/{sheet-name}-validation.listener.ts`

```typescript
import { FlatfileListener } from "@flatfile/listener";
import { recordHook } from "@flatfile/plugin-record-hook";

export const {sheetName}ValidationHook = (listener: FlatfileListener) => {
  listener.use(
    recordHook("{sheet-slug}", (record) => {
      // Get all field values
      const fieldValue = record.get("field_key") as string;
      
      // Required field validations
      if (!fieldValue?.trim()) {
        record.addError("field_key", "Field is required");
      }
      
      // Character limit validations
      if (fieldValue && fieldValue.length > MAX_LENGTH) {
        record.addError("field_key", \`Field exceeds character limit of \${MAX_LENGTH}\`);
      }
      
      // Enum validations
      if (enumField && !VALID_VALUES.includes(enumField)) {
        record.addError("enum_field", "Invalid value");
      }
      
      // Date validations
      if (dateField) {
        const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!dateRegex.test(dateField)) {
          record.addError("date_field", "Date must be formatted as m/d/yyyy");
        }
      }
      
      // Cross-field validations
      // Business logic validations
      // Warning conditions
      
      return record;
    })
  );
};
```

### **3. Batch Validation Action**
Create: `src/blueprints/actions/validate-{sheet-name}.action.ts`

```typescript
import { FlatfileListener } from "@flatfile/listener";
import { FlatfileRecord } from "@flatfile/hooks";

export const validate{SheetName}Action = (listener: FlatfileListener) => {
  listener.on(
    "job:ready",
    { job: "sheet:validate{SheetName}" },
    async ({ context: { jobId, sheetId }, ...event }) => {
      try {
        const { data: records } = await event.data;

        const validatedRecords = records.map((record: FlatfileRecord) => {
          // Same validation logic as listener
          // More comprehensive batch processing if needed
          
          return record;
        });

        await event.data(validatedRecords);

      } catch (error) {
        console.error("Error in {Sheet Name} validation:", error);
        throw error;
      }
    }
  );
};
```

### **4. Sample CSV File**
Create: `src/samples/{SheetName}.csv`

```csv
Field1,Field2,Field3,...,X1,X2,X3,X4,X5,X6,X7,X8,X9,X10
SampleValue1,SampleValue2,SampleValue3,...,Value1,Value2,Value3,Value4,Value5,Value6,Value7,Value8,Value9,Value10
```

### **5. Workbook Integration**
Update: `src/blueprints/workbooks/company.workbook.ts`

```typescript
// Add import
import { {sheetName}Sheet } from "../sheets/{sheet-name}.sheet";

// Add to sheets array
sheets: [ ..., {sheetName}Sheet ],
```

### **6. Field Mappings Integration**
Update: `src/utils/field-mappings.ts`

```typescript
// Add import
import { {sheetName}Sheet } from "../blueprints/sheets/{sheet-name}.sheet";

// Add to sheets array
const sheets = [
  ...,
  {sheetName}Sheet
];
```

### **7. Main Index Integration**
Update: `src/index.ts`

```typescript
// Add imports
import { {sheetName}ValidationHook } from "./listeners/{sheet-name}-validation.listener";
import { validate{SheetName}Action } from "./blueprints/actions/validate-{sheet-name}.action";

// Add to listener registrations
listener.use({sheetName}ValidationHook);
listener.use(validate{SheetName}Action);
```

## 🔧 **Configuration Standards**

### **Field Types**
- **String**: Default for text fields
- **Enum**: For dropdown/select fields with predefined options
- **Date**: For date fields (always validate m/d/yyyy format)
- **Number**: For numeric fields

### **Required Fields**
Always mark required fields with:
```typescript
constraints: [
  {
    type: "required"
  }
]
```

### **Enum Configuration**
```typescript
config: {
  options: [
    { value: "ActualValue", label: "DisplayLabel" }
  ]
}
```

### **Character Limits**
Document in description, validate in listeners (Flatfile API doesn't support max_length constraint)

## ✅ **Validation Patterns**

### **Standard Validations**
1. **Required Fields**: Check for empty/null values
2. **Character Limits**: Validate field length in listeners
3. **Enum Values**: Verify against allowed options
4. **Date Formats**: Validate m/d/yyyy pattern
5. **Cross-field Logic**: Business rules between fields
6. **GUID Formats**: UUID validation where applicable

### **Error vs Warning**
- **Error**: Blocks import, must be fixed
- **Warning**: Allows import, informational

## 📁 **File Naming Conventions**

- **Sheet**: `{sheet-name}.sheet.ts` (kebab-case)
- **Listener**: `{sheet-name}-validation.listener.ts`
- **Action**: `validate-{sheet-name}.action.ts`
- **Sample**: `{SheetName}.csv` (PascalCase)
- **Export Functions**: `{sheetName}Sheet`, `{sheetName}ValidationHook`, `validate{SheetName}Action` (camelCase)

## 🚀 **Testing Checklist**

1. **Compilation**: `npm run dev` runs without errors
2. **Field Mappings**: New fields appear in generated mappings
3. **Auto-Update**: Changes propagate to existing spaces
4. **Validation**: Required fields, character limits, enum values work
5. **Sample Import**: CSV file imports successfully
6. **Export**: Download includes new field headers

## 📋 **X1-X10 Standard**

**ALWAYS include X1-X10 custom fields in every sheet:**
- Type: `string` 
- Labels: `X1`, `X2`, ..., `X10`
- Purpose: Flexible custom data fields for client-specific needs
- No validation constraints (maximum flexibility)

This ensures every sheet has extensibility for custom requirements without code changes.
test edit 20251108 