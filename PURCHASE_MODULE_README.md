# 🏪 Purchase Module - Quick Start Guide

> Production-grade Jewellery Shop Purchase Management System

## 📚 Documentation Index

1. **[PURCHASE_MODULE_SUMMARY.md](./PURCHASE_MODULE_SUMMARY.md)** - Quick overview and implementation summary
2. **[PURCHASE_MODULE_DOCUMENTATION.md](./PURCHASE_MODULE_DOCUMENTATION.md)** - Complete API documentation and usage guide
3. **[PURCHASE_MODULE_ARCHITECTURE.md](./PURCHASE_MODULE_ARCHITECTURE.md)** - System architecture and flow diagrams

## 🚀 Quick Start

### 1. Install Dependencies (if not already installed)

```bash
pnpm install mongoose
```

### 2. Environment Setup

Ensure your `.env.local` has:
```env
MONGO_URI=mongodb://your-connection-string
```

### 3. Create Your First Purchase

```bash
POST http://localhost:3000/api/purchase
Content-Type: application/json
Authorization: Bearer <your-session-token>

{
  "supplier_name": "ABC Jewellers",
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

### 4. Get Purchases

```bash
GET http://localhost:3000/api/purchase?page=1&limit=50
```

## ✨ Key Features

### ✅ Automatic Deduplication
- **Suppliers**: By phone number
- **Inventory**: By item name + category + purity

### ✅ GST Calculation
- Automatic CGST/SGST for intrastate
- Automatic IGST for interstate
- Valid rates: 0, 3, 5, 12, 18, 28

### ✅ Payment Tracking
- **PAID**: Full payment received
- **UNPAID**: No payment yet
- **PARTIAL**: Partial payment received

### ✅ Metal Ledger
- Track gold/silver in grams
- Running balance calculation
- Support for multiple purities

### ✅ Transaction Safety
- MongoDB transactions
- Complete rollback on errors
- Data integrity guaranteed

## 📊 Models

### Supplier
```typescript
{
  user_id: string
  name: string
  phone: string              // Unique per user
  gst_number?: string
  total_purchases: number
  total_purchase_value: number
}
```

### Purchase
```typescript
{
  purchase_reference: string  // Auto: PUR-YYYYMMDD-XXXX
  supplier_id: ObjectId
  item_name: string
  quantity: number
  rate_per_unit: number
  subtotal: number
  gst_rate: number
  total_amount: number
  payment_status: "PAID" | "UNPAID" | "PARTIAL"
  amount_paid: number
  amount_pending: number
}
```

### Inventory
```typescript
{
  user_id: string
  item_name: string
  category: string
  purity?: string
  quantity: number
  available_quantity: number
  rate: number
}
```

### MetalLedger
```typescript
{
  user_id: string
  metal_type: "GOLD" | "SILVER" | "PLATINUM" | "DIAMOND"
  purity: string
  weight_in: number
  weight_out: number
  running_balance: number
}
```

## 🔍 Example Queries

### Filter by Payment Status
```bash
GET /api/purchase?payment_status=UNPAID
```

### Date Range
```bash
GET /api/purchase?from_date=2026-01-01&to_date=2026-01-31
```

### By Supplier
```bash
GET /api/purchase?supplier_id=65a1b2c3d4e5f6g7h8i9j0k1
```

### By Category
```bash
GET /api/purchase?category=GOLD_JEWELLERY
```

## 🛠️ Utility Functions

Use the helper functions in `lib/utils/purchaseUtils.ts`:

```typescript
import {
  calculateGST,
  validateIndianPhone,
  validateGSTNumber,
  formatINR,
  formatWeight
} from "@/lib/utils/purchaseUtils"

// Calculate GST
const gst = calculateGST(10000, 3, "INTRASTATE")
// { cgst_amount: 150, sgst_amount: 150, total_gst: 300, total_amount: 10300 }

// Validate phone
const isValid = validateIndianPhone("9876543210") // true

// Format currency
const formatted = formatINR(10300) // "₹10,300.00"
```

## 🎯 Validation Rules

### Required Fields
- `supplier_name` (min 2 chars)
- `supplier_phone` (10 digits, starts with 6-9)
- `item_name` (min 2 chars)
- `category`
- `quantity` (> 0)
- `rate_per_unit` (> 0)
- `gst_rate` (must be 0, 3, 5, 12, 18, or 28)
- `gst_type` ("INTRASTATE" or "INTERSTATE")
- `payment_mode`

### Optional Fields
- `supplier_gst` (if provided, must match format)
- `weight` (required if metal_type provided)
- `purity` (required if metal_type provided)
- `metal_type` ("GOLD", "SILVER", "PLATINUM", "DIAMOND")
- `amount_paid` (default: 0)
- `location`
- `notes`

## 🚦 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Purchase created successfully",
  "data": {
    "purchase": { ... },
    "purchase_reference": "PUR-20260117-0001"
  }
}
```

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Supplier phone number is required",
    "Quantity must be greater than 0"
  ]
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Failed to update inventory: Insufficient stock"
}
```

## 📈 Performance

### Optimized for 10,000+ Purchases

| Operation | Expected Time |
|-----------|---------------|
| Create Purchase | 100-200ms |
| List 50 Purchases | 50-100ms |
| Get by Reference | 5-10ms |
| Filter by Status | 50-150ms |

### 21 Database Indexes
- Unique constraints for deduplication
- Compound indexes for common queries
- Text indexes for search
- Optimized for large datasets

## 🔐 Security

- ✅ NextAuth authentication required
- ✅ User-scoped data (no cross-user access)
- ✅ Input validation and sanitization
- ✅ Transaction safety

## 📝 Example Workflow

### Scenario: Purchase 25.5g of 22K Gold

```typescript
// 1. Create purchase
POST /api/purchase
{
  "supplier_name": "Gold Supplier",
  "supplier_phone": "9876543210",
  "item_name": "22K Gold Chain",
  "category": "GOLD_JEWELLERY",
  "quantity": 1,
  "weight": 25.5,
  "purity": "22K",
  "metal_type": "GOLD",
  "rate_per_unit": 5500,  // Per gram
  "subtotal": 140250,     // 25.5 * 5500
  "gst_rate": 3,
  "gst_type": "INTRASTATE",
  "payment_mode": "CASH",
  "amount_paid": 144457.5
}

// 2. System automatically:
// - Creates/updates supplier with phone 9876543210
// - Generates reference: PUR-20260117-0001
// - Calculates GST: CGST 2103.75 + SGST 2103.75 = 4207.5
// - Total: 140250 + 4207.5 = 144457.5
// - Creates purchase record
// - Updates inventory: "22K Gold Chain" +1 qty, +25.5g
// - Updates metal ledger: Gold 22K +25.5g
// - Updates supplier stats: +1 purchase, +144457.5 value

// 3. Response
{
  "success": true,
  "data": {
    "purchase_reference": "PUR-20260117-0001",
    "payment_status": "PAID",
    "is_inventory_updated": true,
    "is_ledger_updated": true
  }
}
```

## 🧪 Testing

### Manual Testing
1. Create purchase with full payment → Check PAID status
2. Create purchase with no payment → Check UNPAID status
3. Create two purchases with same phone → Verify supplier reuse
4. Create two purchases with same item → Verify inventory aggregation
5. Create purchase with gold → Verify metal ledger entry

### Check Logs
```bash
# In your terminal, watch for:
✅ Validation passed
✅ Supplier created/found
✅ Purchase reference generated
✅ Inventory updated
✅ Metal ledger updated
✅ Transaction committed
```

## 🆘 Troubleshooting

### Issue: "Validation failed"
- Check all required fields are provided
- Verify phone number format (10 digits, starts with 6-9)
- Verify GST rate is valid (0, 3, 5, 12, 18, 28)

### Issue: "Duplicate key error"
- Purchase reference already exists (rare, retry)
- Supplier phone already used by another user (check user_id)

### Issue: "Failed to update inventory"
- Check item_name, category, purity are provided
- Verify database connection

### Issue: "Transaction failed"
- Check MongoDB supports transactions (requires replica set)
- Verify database connection is stable

## 📞 Support

For detailed documentation:
- See [PURCHASE_MODULE_DOCUMENTATION.md](./PURCHASE_MODULE_DOCUMENTATION.md)
- See [PURCHASE_MODULE_ARCHITECTURE.md](./PURCHASE_MODULE_ARCHITECTURE.md)

---

**Ready to use!** 🎉

Start creating purchases and the system will handle:
- ✅ Supplier deduplication
- ✅ Inventory management
- ✅ Metal ledger tracking
- ✅ GST calculation
- ✅ Payment tracking
- ✅ Data integrity
