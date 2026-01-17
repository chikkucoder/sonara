`   # Purchase Module - Production-Ready Implementation

## 📋 Overview

This document describes the enhanced Purchase module designed for high-performance jewellery shop management with support for 10,000+ purchases.

## 🏗️ Architecture

### Models

1. **Supplier Model** (`lib/models/Supplier.ts`)
   - Deduplication by phone number
   - Automatic aggregation of purchase stats
   - GST/PAN validation

2. **Purchase Model** (`lib/models/Purchase.ts`)
   - Complete GST calculation (CGST/SGST/IGST)
   - Payment status tracking (PAID/UNPAID/PARTIAL)
   - Unique purchase reference numbers
   - Atomic inventory updates

3. **Inventory Model** (`lib/models/Inventory.ts`)
   - Deduplication by item attributes
   - Reserved quantity tracking
   - Low stock alerts

4. **MetalLedger Model** (`lib/models/MetalLedger.ts`)
   - Track gold/silver in grams
   - Running balance calculation
   - Transaction history

### API Endpoints

- `GET /api/purchase` - List purchases with filtering
- `POST /api/purchase` - Create purchase with atomic updates
- `PUT /api/purchase` - Update payment details
- `DELETE /api/purchase` - Delete purchase

## 🚀 Key Features

### 1. Supplier Deduplication

Suppliers are automatically deduplicated by phone number:

```typescript
// First purchase from supplier
POST /api/purchase
{
  "supplier_name": "ABC Jewellers",
  "supplier_phone": "9876543210",
  ...
}
// Creates new supplier

// Second purchase from same supplier
POST /api/purchase
{
  "supplier_name": "ABC Jewellers Ltd", // Different name
  "supplier_phone": "9876543210",       // Same phone
  ...
}
// Reuses existing supplier, updates name
```

### 2. Unique Purchase References

Auto-generated format: `PUR-YYYYMMDD-XXXX`

Examples:
- `PUR-20260117-0001` - First purchase of Jan 17, 2026
- `PUR-20260117-0002` - Second purchase of same day
- `PUR-20260118-0001` - First purchase of next day

### 3. GST Calculation

Automatic GST calculation based on type:

**Intrastate (CGST + SGST):**
```json
{
  "subtotal": 10000,
  "gst_rate": 3,
  "gst_type": "INTRASTATE"
}
// Results in:
// cgst_amount: 150 (1.5%)
// sgst_amount: 150 (1.5%)
// total_gst: 300
// total_amount: 10300
```

**Interstate (IGST):**
```json
{
  "subtotal": 10000,
  "gst_rate": 3,
  "gst_type": "INTERSTATE"
}
// Results in:
// igst_amount: 300 (3%)
// cgst_amount: 0
// sgst_amount: 0
// total_gst: 300
// total_amount: 10300
```

### 4. Payment Status Tracking

Automatic payment status calculation:

- `amount_paid = 0` → `UNPAID`
- `amount_paid < total_amount` → `PARTIAL`
- `amount_paid >= total_amount` → `PAID`

### 5. Atomic Inventory Updates

All operations happen in a MongoDB transaction:

```typescript
// Transaction flow:
1. Validate data
2. Find/create supplier
3. Generate purchase reference
4. Create purchase record
5. Update inventory (atomic)
6. Update metal ledger (if metal)
7. Update supplier stats
8. Commit transaction

// If any step fails, ALL changes are rolled back
```

### 6. Metal Ledger Tracking

For precious metals (gold/silver), tracks:
- Weight in grams
- Running balance by purity
- Transaction history

```json
{
  "metal_type": "GOLD",
  "purity": "22K",
  "weight": 15.5,
  "rate_per_unit": 5500
}
// Creates ledger entry:
// - weight_in: 15.5
// - running_balance: previous_balance + 15.5
```

## 📝 API Usage Examples

### Create Purchase (Simple)

```bash
POST /api/purchase
Content-Type: application/json

{
  "supplier_name": "XYZ Suppliers",
  "supplier_phone": "9876543210",
  "item_name": "Gold Ring",
  "category": "GOLD_JEWELLERY",
  "quantity": 2,
  "rate_per_unit": 5000,
  "subtotal": 10000,
  "gst_rate": 3,
  "gst_type": "INTRASTATE",
  "payment_mode": "CASH",
  "amount_paid": 10300
}
```

### Create Purchase (With Metal Tracking)

```bash
POST /api/purchase
Content-Type: application/json

{
  "supplier_name": "Gold Wholesaler",
  "supplier_phone": "9123456789",
  "supplier_gst": "27AABCU9603R1ZM",
  "item_name": "22K Gold Chain",
  "category": "GOLD_JEWELLERY",
  "quantity": 1,
  "weight": 25.5,
  "purity": "22K",
  "metal_type": "GOLD",
  "rate_per_unit": 5500,
  "subtotal": 140250,
  "gst_rate": 3,
  "gst_type": "INTRASTATE",
  "payment_mode": "BANK_TRANSFER",
  "amount_paid": 100000,
  "payment_reference": "TXN123456",
  "location": "SAFE_A1",
  "notes": "Premium quality 22K gold"
}
```

Response:
```json
{
  "success": true,
  "message": "Purchase created successfully",
  "data": {
    "purchase": {
      "_id": "...",
      "purchase_reference": "PUR-20260117-0001",
      "total_amount": 144457.5,
      "payment_status": "PARTIAL",
      "amount_pending": 44457.5,
      "is_inventory_updated": true,
      "is_ledger_updated": true
    },
    "purchase_reference": "PUR-20260117-0001",
    "supplier_id": "..."
  }
}
```

### List Purchases with Filters

```bash
# Get unpaid purchases
GET /api/purchase?payment_status=UNPAID&page=1&limit=20

# Get purchases from specific supplier
GET /api/purchase?supplier_id=65a1b2c3d4e5f6g7h8i9j0k1&page=1

# Get purchases in date range
GET /api/purchase?from_date=2026-01-01&to_date=2026-01-31

# Get gold purchases
GET /api/purchase?category=GOLD_JEWELLERY
```

### Update Payment Status

```bash
PUT /api/purchase
Content-Type: application/json

{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "amount_paid": 144457.5,
  "payment_mode": "UPI",
  "payment_reference": "UPI123456",
  "payment_date": "2026-01-18"
}
```

## ⚡ Performance Optimizations

### 1. Database Indexes

**Supplier Model:**
```javascript
{ user_id: 1, phone: 1 } - UNIQUE (deduplication)
{ user_id: 1, is_active: 1 }
{ user_id: 1, last_purchase_date: -1 }
{ user_id: 1, name: "text" } - Text search
```

**Purchase Model:**
```javascript
{ purchase_reference: 1 } - UNIQUE
{ user_id: 1, purchase_date: -1 } - Recent purchases
{ user_id: 1, supplier_id: 1, purchase_date: -1 }
{ user_id: 1, payment_status: 1 } - Unpaid filter
{ user_id: 1, item_name: 1, purchase_date: -1 }
```

**Inventory Model:**
```javascript
{ user_id: 1, item_name: 1, category: 1, purity: 1 } - UNIQUE (deduplication)
{ user_id: 1, category: 1 }
{ user_id: 1, available_quantity: -1 }
{ user_id: 1, metal_type: 1 }
```

**MetalLedger Model:**
```javascript
{ user_id: 1, metal_type: 1, purity: 1, created_at: -1 }
{ transaction_ref_id: 1 }
{ user_id: 1, transaction_date: -1 }
```

### 2. Query Optimization

**Use lean() for read-only queries:**
```typescript
// ❌ Slow (creates Mongoose documents)
const purchases = await Purchase.find({ user_id })

// ✅ Fast (plain JavaScript objects)
const purchases = await Purchase.find({ user_id }).lean()
```

**Use select() to limit fields:**
```typescript
// ❌ Fetches all fields
const purchases = await Purchase.find({ user_id })

// ✅ Fetches only needed fields
const purchases = await Purchase.find({ user_id })
  .select('purchase_reference supplier_name total_amount payment_status')
```

**Use pagination:**
```typescript
// ✅ Always paginate large datasets
const purchases = await Purchase.find({ user_id })
  .skip((page - 1) * limit)
  .limit(limit)
```

### 3. Transaction Best Practices

**Keep transactions short:**
```typescript
// ✅ Do validation BEFORE starting transaction
const validation = validatePurchaseData(body)
if (!validation.isValid) {
  return error
}

// Start transaction only for database operations
const session = await mongoose.startSession()
session.startTransaction()
// ... atomic operations ...
await session.commitTransaction()
```

### 4. Connection Pooling

Already configured in `lib/mongodb.ts`:
```typescript
{
  maxPoolSize: 10,      // Max 10 concurrent connections
  minPoolSize: 2,       // Keep 2 connections always ready
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}
```

### 5. Aggregation for Reports

For large datasets, use aggregation instead of loading all records:

```typescript
// ✅ Get monthly purchase summary (efficient)
const summary = await Purchase.aggregate([
  { $match: { user_id: userId } },
  {
    $group: {
      _id: {
        year: { $year: "$purchase_date" },
        month: { $month: "$purchase_date" }
      },
      total_purchases: { $sum: 1 },
      total_value: { $sum: "$total_amount" },
      total_paid: { $sum: "$amount_paid" }
    }
  },
  { $sort: { "_id.year": -1, "_id.month": -1 } }
])
```

## ✅ Validations

### 1. Phone Number
- Format: 10 digits starting with 6-9
- Example: `9876543210` ✅
- Invalid: `1234567890` ❌ (doesn't start with 6-9)

### 2. GST Number
- Format: `22AAAAA0000A1Z5`
- Example: `27AABCU9603R1ZM` ✅
- Invalid: `INVALID123` ❌

### 3. Quantity & Rate
- Must be greater than 0
- Example: `quantity: 2` ✅, `rate: 5000` ✅
- Invalid: `quantity: 0` ❌, `rate: -100` ❌

### 4. GST Rate
- Must be one of: 0, 3, 5, 12, 18, 28
- Example: `gst_rate: 3` ✅
- Invalid: `gst_rate: 7` ❌

### 5. Metal Validation
- If `metal_type` is provided, `purity` and `weight` are required
- Example: `{ metal_type: "GOLD", purity: "22K", weight: 15.5 }` ✅
- Invalid: `{ metal_type: "GOLD" }` ❌ (missing purity/weight)

## 🔒 Error Handling

### Validation Errors (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Supplier phone number is required",
    "Quantity must be greater than 0",
    "Invalid GST rate. Must be one of: 0, 3, 5, 12, 18, 28"
  ]
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Purchase not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Failed to update inventory: Insufficient stock for Gold Ring. Available: 5, Requested: 10"
}
```

### Duplicate Key (500)
```json
{
  "success": false,
  "error": "E11000 duplicate key error...",
  "details": "A purchase with this reference already exists"
}
```

## 📊 Performance Benchmarks

For a system with 10,000+ purchases:

| Operation | Expected Time | Notes |
|-----------|---------------|-------|
| Create Purchase | 100-200ms | With transaction |
| List Purchases (50 items) | 50-100ms | With indexes |
| Get Purchase by Reference | 5-10ms | Unique index |
| Filter by Payment Status | 50-150ms | Indexed |
| Date Range Query | 100-300ms | Indexed |

## 🔄 Migration Guide

If you have existing purchases, run this migration:

```javascript
// Add purchase references to existing purchases
const purchases = await Purchase.find({ purchase_reference: { $exists: false } })

for (const purchase of purchases) {
  const reference = await Purchase.generatePurchaseReference(purchase.user_id)
  purchase.purchase_reference = reference
  await purchase.save()
}
```

## 🚨 Important Notes

1. **Transaction Safety**: All purchase creation operations are atomic. Either everything succeeds or everything rolls back.

2. **Supplier Deduplication**: Suppliers are uniquely identified by phone number per user. Same phone = same supplier.

3. **Inventory Deduplication**: Items are uniquely identified by `item_name + category + purity`. Same combination = same inventory item.

4. **Metal Ledger**: Only created for items with `metal_type`, `purity`, and `weight` specified.

5. **Payment Status**: Automatically calculated based on `amount_paid` and `total_amount`. Cannot be manually set.

6. **Delete Behavior**: Purchase deletion does NOT reverse inventory changes. This maintains historical accuracy. Consider implementing reversal logic for production.

## 🛠️ Testing

### Test Cases

1. **Create purchase with full payment**
   - Verify purchase_reference generated
   - Verify payment_status = "PAID"
   - Verify inventory updated
   - Verify metal ledger created (if metal)

2. **Create purchase with partial payment**
   - Verify payment_status = "PARTIAL"
   - Verify amount_pending calculated correctly

3. **Create purchase with no payment**
   - Verify payment_status = "UNPAID"
   - Verify amount_pending = total_amount

4. **Supplier deduplication**
   - Create two purchases with same phone
   - Verify same supplier_id used

5. **Inventory deduplication**
   - Create two purchases with same item
   - Verify quantity aggregated in single inventory record

6. **Transaction rollback**
   - Simulate error during inventory update
   - Verify purchase record not created
   - Verify database remains consistent

## 📚 Additional Resources

- [MongoDB Transactions Guide](https://www.mongodb.com/docs/manual/core/transactions/)
- [Mongoose Indexing](https://mongoosejs.com/docs/guide.html#indexes)
- [GST in India](https://www.gst.gov.in/)

---

**Version**: 1.0.0  
**Last Updated**: January 17, 2026  
**Author**: Senior Full-Stack Engineer
