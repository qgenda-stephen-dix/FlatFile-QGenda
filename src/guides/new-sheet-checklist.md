# New Sheet Blueprint - Quick Checklist

## ✅ **Files to Create/Update**

### **Create New Files:**
- [ ] `src/blueprints/sheets/{sheet-name}.sheet.ts`
- [ ] `src/listeners/{sheet-name}-validation.listener.ts` 
- [ ] `src/blueprints/actions/validate-{sheet-name}.action.ts`
- [ ] `src/samples/{SheetName}.csv`

### **Update Existing Files:**
- [ ] `src/blueprints/workbooks/company.workbook.ts` (add import & sheet)
- [ ] `src/utils/field-mappings.ts` (add import & sheet)
- [ ] `src/index.ts` (add imports & listener registrations)

## 🔧 **Standard Requirements**

### **Sheet Configuration:**
- [ ] All fields from specification
- [ ] **REQUIRED: X1-X10 custom fields** (string type)
- [ ] Proper field types (string/enum/date/number)
- [ ] Required field constraints
- [ ] Enum options with value/label pairs
- [ ] Validation action reference

### **Validation Logic:**
- [ ] Required field checks
- [ ] Character limit validations
- [ ] Date format validation (m/d/yyyy)
- [ ] Enum value validation
- [ ] Cross-field business rules
- [ ] GUID format validation (if applicable)
- [ ] Warning vs Error logic

### **Integration:**
- [ ] Import in company workbook
- [ ] Import in field mappings
- [ ] Register validation listener
- [ ] Register validation action
- [ ] Test compilation (`npm run dev`)

## 🎯 **Key Standards**

1. **Always include X1-X10 custom fields**
2. **Use consistent naming conventions**
3. **Validate all specification requirements**
4. **Create sample CSV with all fields**
5. **Test auto-update functionality**

## 📝 **Quick Copy-Paste Templates**

### **X1-X10 Fields Block:**
```typescript
{
  key: "x1", type: "string", label: "X1", description: "Custom field X1"
},
{
  key: "x2", type: "string", label: "X2", description: "Custom field X2"
},
{
  key: "x3", type: "string", label: "X3", description: "Custom field X3"
},
{
  key: "x4", type: "string", label: "X4", description: "Custom field X4"
},
{
  key: "x5", type: "string", label: "X5", description: "Custom field X5"
},
{
  key: "x6", type: "string", label: "X6", description: "Custom field X6"
},
{
  key: "x7", type: "string", label: "X7", description: "Custom field X7"
},
{
  key: "x8", type: "string", label: "X8", description: "Custom field X8"
},
{
  key: "x9", type: "string", label: "X9", description: "Custom field X9"
},
{
  key: "x10", type: "string", label: "X10", description: "Custom field X10"
}
```

### **Required Field Constraint:**
```typescript
constraints: [
  {
    type: "required"
  }
]
```

### **Enum Configuration:**
```typescript
config: {
  options: [
    { value: "Value1", label: "Value1" },
    { value: "Value2", label: "Value2" }
  ]
}
```

Use this checklist for every new sheet to ensure consistency and completeness!