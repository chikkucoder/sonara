# Sales Module Architecture - Jewellery POS System

## Executive Summary
High-performance, transaction-safe sales processing system designed for concurrent operations, inventory accuracy, and zero-lag user experience.

---

## 1. Database Schema Design

### 1.1 Core Entities

#### **Sales Table**
```typescript
{
  _id: ObjectId,
  user_id: string (indexed),
  invoice_number: string (unique indexed), // INV-YYYYMMDD-XXXX
  invoice_date: Date (indexed),
  
  // Customer (denormalized for read performance)
  customer_id: ObjectId (ref Customer, indexed),
  customer_name: string,
  customer_phone: string,
  customer_type: 'B2C' | 'B2B',
  customer_gst: string?,
  
  // Line Items Array
  items: [{
    inventory_id: ObjectId (ref Inventory),
    item_name: string,
    category: string,
    purity: string?,
    metal_type: enum,
    quantity: number,
    weight: number?,
    
    // Pricing Components
    gold_rate: number?,          // Per gram
    making_charges: number,      // Flat amount
    stone_charges: number,       // Flat amount
    base_price: number,          // Calculated
    
    // Discount
    discount_percentage: number,
    discount_amount: number,     // Calculated
    
    // Tax
    taxable_amount: number,      // After discount
    gst_rate: number,            // Percentage
    cgst_amount: number,         // Calculated
    sgst_amount: number,         // Calculated
    igst_amount: number,         // Calculated
    total_gst: number,           // Calculated
    
    item_total: number           // Final price
  }],
  
  // Aggregated Totals
  total_base_price: number,
  total_making_charges: number,
  total_stone_charges: number,
  total_discount_amount: number,
  total_taxable_amount: number,
  total_cgst: number,
  total_sgst: number,
  total_igst: number,
  total_gst: number,
  grand_total: number,
  
  // Tax & Payment
  gst_type: 'INTRASTATE' | 'INTERSTATE',
  payment_mode: enum,
  payment_status: 'PAID' | 'UNPAID' | 'PARTIAL' (indexed),
  amount_paid: number,
  amount_pending: number,
  payment_date: Date?,
  payment_reference: string?,
  payment_terms: enum?,
  due_date: Date?,
  
  // Status
  sale_status: 'COMPLETED' | 'PENDING' | 'CANCELLED' (indexed),
  is_inventory_updated: boolean,
  
  notes: string?,
  created_at: Date,
  updated_at: Date
}
```

#### **Inventory Table**
```typescript
{
  _id: ObjectId,
  user_id: string (indexed),
  item_name: string,
  category: string (indexed),
  purity: string?,
  metal_type: enum?,
  
  // Stock Tracking
  quantity: number,              // Total physical stock
  reserved_quantity: number,     // Locked during checkout
  available_quantity: number,    // quantity - reserved (virtual)
  
  weight: number?,
  rate: number,
  total_value: number,
  
  location: string?,
  min_stock_level: number?,
  
  last_purchase_date: Date?,
  last_sale_date: Date?,
  
  created_at: Date,
  updated_at: Date
}
```

#### **Customer Table**
```typescript
{
  _id: ObjectId,
  user_id: string (indexed),
  customer_type: 'B2C' | 'B2B',
  name: string,
  phone: string (unique indexed per user),
  email: string?,
  address: string?,
  city: string?,
  state: string?,
  pincode: string?,
  
  // B2B Fields
  business_name: string?,
  contact_person: string?,
  gst_number: string?,
  pan_number: string?,
  
  // Analytics (aggregated)
  total_purchases: number,
  total_purchase_value: number,
  last_purchase_date: Date?,
  lifetime_discount_given: number,
  
  // Credit Management
  credit_limit: number?,
  outstanding_balance: number,
  payment_terms: enum?,
  
  is_active: boolean,
  loyalty_tier: enum?,
  notes: string?,
  
  created_at: Date,
  updated_at: Date
}
```

### 1.2 Critical Indexes

```javascript
// Sales Indexes
db.sales.createIndex({ invoice_number: 1 }, { unique: true })
db.sales.createIndex({ user_id: 1, invoice_date: -1 })
db.sales.createIndex({ user_id: 1, customer_id: 1, invoice_date: -1 })
db.sales.createIndex({ user_id: 1, payment_status: 1 })
db.sales.createIndex({ user_id: 1, sale_status: 1 })
db.sales.createIndex({ user_id: 1, created_at: -1 })
db.sales.createIndex({ user_id: 1, customer_type: 1 })

// Inventory Indexes
db.inventory.createIndex({ user_id: 1, item_name: 1, category: 1, purity: 1 }, { unique: true })
db.inventory.createIndex({ user_id: 1, category: 1 })
db.inventory.createIndex({ user_id: 1, available_quantity: 1 })
db.inventory.createIndex({ user_id: 1, quantity: 1 }, { partialFilterExpression: { quantity: { $lt: 10 } } })

// Customer Indexes
db.customers.createIndex({ user_id: 1, phone: 1 }, { unique: true })
db.customers.createIndex({ user_id: 1, customer_type: 1 })
db.customers.createIndex({ user_id: 1, is_active: 1 })
```

---

## 2. Sale Creation Flow (Transaction-Safe)

### 2.1 High-Level Flow

```
┌─────────────────┐
│  User Checkout  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  START MONGO TRANSACTION    │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  1. Validate Request Data    │
│     - Customer info          │
│     - Items array            │
│     - Payment details        │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  2. Find/Create Customer     │
│     - Dedupe by phone        │
│     - Create if new          │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  3. Lock Inventory Items     │
│     - Check availability     │
│     - Reserve stock          │
│     - Throw if insufficient  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  4. Generate Invoice Number  │
│     - Sequential per day     │
│     - Thread-safe            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  5. Calculate Item Pricing   │
│     For each item:           │
│     • Base = gold×weight +   │
│              making + stone  │
│     • Discount               │
│     • Taxable = Base - Disc  │
│     • GST (CGST/SGST/IGST)   │
│     • Item Total             │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  6. Create Sale Record       │
│     - Save sale document     │
│     - Aggregate totals       │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  7. Update Inventory         │
│     - Reduce quantity        │
│     - Clear reservation      │
│     - Update last_sale_date  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  8. Update Customer Stats    │
│     - Increment purchases    │
│     - Add to lifetime value  │
│     - Update last purchase   │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  9. Update Metal Ledger      │
│     - Record metal outflow   │
│     - Track gold/silver used │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  COMMIT TRANSACTION          │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Return Success Response     │
│  - Invoice number            │
│  - Grand total               │
│  - Sale ID                   │
└──────────────────────────────┘

         │ (On Any Error)
         ▼
┌──────────────────────────────┐
│  ROLLBACK TRANSACTION        │
│  - Unlock inventory          │
│  - Return error message      │
└──────────────────────────────┘
```

### 2.2 Concurrency Handling

**Problem**: Multiple cashiers processing sales simultaneously for same item

**Solution**:
1. **Optimistic Locking** via `reserved_quantity`
2. **MongoDB Transactions** ensure atomicity
3. **Index-based locking** on inventory items

**Example Scenario**:
```
Cashier A wants to sell 2 units of "Gold Ring 22K"
Cashier B wants to sell 3 units of "Gold Ring 22K"
Current stock: 4 units

Timeline:
T1: Cashier A starts transaction → Locks 2 units → reserved = 2
T2: Cashier B starts transaction → Locks 3 units → 
    Available = 4 - 2 = 2 (insufficient!) → Transaction fails
T3: Cashier A completes → Quantity = 2, reserved = 0
T4: Cashier B retries → Locks 2 units → Success
```

---

## 3. Pricing Calculation Algorithm

### 3.1 Formula

```typescript
// For each item:
BASE_PRICE = (WEIGHT × GOLD_RATE) + MAKING_CHARGES + STONE_CHARGES

DISCOUNT_AMOUNT = BASE_PRICE × (DISCOUNT_% / 100)

TAXABLE_AMOUNT = BASE_PRICE - DISCOUNT_AMOUNT

if (GST_TYPE === 'INTRASTATE') {
  CGST = TAXABLE_AMOUNT × (GST_RATE / 200)  // Half
  SGST = TAXABLE_AMOUNT × (GST_RATE / 200)  // Half
  IGST = 0
} else {
  CGST = 0
  SGST = 0
  IGST = TAXABLE_AMOUNT × (GST_RATE / 100)
}

TOTAL_GST = CGST + SGST + IGST

ITEM_TOTAL = TAXABLE_AMOUNT + TOTAL_GST
```

### 3.2 Example Calculation

```
Item: Gold Ring 22K
Weight: 10g
Gold Rate: ₹6,000/g
Making Charges: ₹5,000
Stone Charges: ₹2,000
Discount: 5%
GST: 3%
GST Type: INTRASTATE

Calculation:
─────────────────────────────────────
BASE_PRICE = (10 × 6000) + 5000 + 2000
           = 60,000 + 5,000 + 2,000
           = ₹67,000

DISCOUNT = 67,000 × 0.05
         = ₹3,350

TAXABLE = 67,000 - 3,350
        = ₹63,650

CGST = 63,650 × 0.015 = ₹954.75
SGST = 63,650 × 0.015 = ₹954.75
TOTAL_GST = ₹1,909.50

ITEM_TOTAL = 63,650 + 1,909.50
           = ₹65,559.50
```

---

## 4. API Implementation

### 4.1 POST /api/sales - Create Sale

**Request**:
```json
{
  "customer_type": "B2C",
  "customer_name": "John Doe",
  "customer_phone": "9876543210",
  "customer_address": "123 Main St",
  "customer_gst": null,
  
  "items": [
    {
      "inventory_id": "674abc...",
      "quantity": 1,
      "weight": 10,
      "gold_rate": 6000,
      "making_charges": 5000,
      "stone_charges": 2000,
      "discount_percentage": 5,
      "gst_rate": 3
    }
  ],
  
  "gst_type": "INTRASTATE",
  "payment_mode": "CASH",
  "amount_paid": 65559.50
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Sale created successfully",
  "data": {
    "sale": { /* full sale object */ },
    "invoice_number": "INV-20260117-0001",
    "customer_id": "674xyz...",
    "grand_total": 65559.50,
    "amount_pending": 0
  }
}
```

**Response (Error - Insufficient Stock)**:
```json
{
  "success": false,
  "error": "Insufficient stock for Gold Ring 22K. Available: 0, Requested: 1",
  "code": "INSUFFICIENT_STOCK"
}
```

### 4.2 GET /api/sales - List Sales

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)
- `customer_id`: Filter by customer
- `payment_status`: PAID | UNPAID | PARTIAL
- `sale_status`: COMPLETED | PENDING | CANCELLED
- `customer_type`: B2C | B2B
- `from_date`: Start date
- `to_date`: End date

**Response**:
```json
{
  "success": true,
  "data": [ /* array of sales */ ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "totalCount": 1250,
    "totalPages": 25,
    "hasMore": true
  }
}
```

---

## 5. Performance Optimizations

### 5.1 Database Level

#### **Compound Indexes**
```javascript
// Fast lookups for common queries
{ user_id: 1, invoice_date: -1 }      // Recent sales
{ user_id: 1, payment_status: 1 }     // Unpaid invoices
{ user_id: 1, customer_id: 1 }        // Customer history
```

#### **Partial Indexes**
```javascript
// Index only low-stock items
{
  quantity: 1,
  partialFilterExpression: { quantity: { $lt: 10 } }
}
```

#### **Lean Queries**
```typescript
// Returns plain JS objects (30% faster)
await Sale.find(query).lean()
```

#### **Projection**
```typescript
// Fetch only needed fields
await Sale.find(query)
  .select('invoice_number grand_total customer_name')
  .lean()
```

### 5.2 Application Level

#### **Connection Pooling**
```typescript
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 50,
  minPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
```

#### **Batch Operations**
```typescript
// Update multiple inventory items in one query
await Inventory.bulkWrite([
  {
    updateOne: {
      filter: { _id: item1._id },
      update: { $inc: { quantity: -1 } }
    }
  },
  {
    updateOne: {
      filter: { _id: item2._id },
      update: { $inc: { quantity: -2 } }
    }
  }
], { session })
```

#### **Denormalization**
- Store customer name/phone in sale document
- Avoid joins during listing
- Trade: Storage for Speed

### 5.3 Frontend Level

#### **Optimistic UI Updates**
```typescript
// Show success immediately, rollback if fails
const handleSale = async () => {
  const tempInvoice = `INV-${Date.now()}`
  
  // Optimistically update UI
  addToSalesHistory(tempInvoice, saleData)
  
  try {
    const response = await fetch('/api/sales', { ... })
    updateWithActualInvoice(response.invoice_number)
  } catch (error) {
    // Rollback UI
    removeFromSalesHistory(tempInvoice)
    showError(error)
  }
}
```

#### **Debounced Stock Checks**
```typescript
// Check availability on quantity change
const debouncedStockCheck = useMemo(
  () => debounce((items) => {
    fetch('/api/inventory/check-availability', {
      body: JSON.stringify(items)
    })
  }, 300),
  []
)
```

---

## 6. Error Handling & Validation

### 6.1 Validation Rules

```typescript
// Customer
- name: 2-100 chars, required
- phone: 10 digits starting with 6-9, required
- gst_number: 15 chars alphanumeric (B2B only)

// Items
- quantity: > 0, required
- discount_percentage: 0-100
- gst_rate: 0-28

// Payment
- amount_paid: >= 0, <= grand_total
```

### 6.2 Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `INSUFFICIENT_STOCK` | Not enough inventory | Show available qty, suggest alternatives |
| `VALIDATION_FAILED` | Invalid input data | Show field-level errors |
| `CUSTOMER_NOT_FOUND` | Customer ID invalid | Auto-create or show search |
| `INVOICE_DUPLICATE` | Race condition | Retry with new invoice number |
| `TRANSACTION_FAILED` | DB error | Retry after 2s |

### 6.3 Logging

```typescript
// Critical logs
console.error('[SALE_FAILED]', {
  user_id,
  items: items.map(i => i.item_name),
  error: error.message,
  timestamp: new Date()
})

// Analytics
console.info('[SALE_SUCCESS]', {
  invoice_number,
  grand_total,
  items_count: items.length,
  processing_time: endTime - startTime
})
```

---

## 7. Monitoring & Alerts

### 7.1 Key Metrics

1. **Sale Processing Time**
   - Target: < 500ms for 95th percentile
   - Alert if > 2s

2. **Transaction Rollback Rate**
   - Target: < 1%
   - Alert if > 5%

3. **Inventory Reservation Leaks**
   - Monitor `reserved_quantity` > 0 for > 1 hour
   - Auto-cleanup job

4. **Concurrent Sale Conflicts**
   - Track "Insufficient stock" errors
   - Optimize hot items

### 7.2 Dashboard Analytics

```typescript
// Real-time metrics
- Sales today: COUNT, SUM(grand_total)
- Average transaction value
- Top-selling items
- Payment mode distribution
- Outstanding payments
```

---

## 8. Testing Strategy

### 8.1 Unit Tests

```typescript
describe('calculateItemPricing', () => {
  it('should calculate correct GST for INTRASTATE', () => {
    const result = calculateItemPricing({
      weight: 10,
      gold_rate: 6000,
      making_charges: 5000,
      stone_charges: 2000,
      discount_percentage: 5,
      gst_rate: 3
    }, 'INTRASTATE')
    
    expect(result.base_price).toBe(67000)
    expect(result.cgst_amount).toBe(954.75)
    expect(result.sgst_amount).toBe(954.75)
  })
})
```

### 8.2 Integration Tests

```typescript
describe('POST /api/sales', () => {
  it('should prevent overselling with concurrent requests', async () => {
    // Setup: 1 item in stock
    await Inventory.create({
      item_name: 'Test Ring',
      quantity: 1
    })
    
    // Simulate 2 concurrent sales
    const [sale1, sale2] = await Promise.allSettled([
      fetch('/api/sales', { body: createSaleData(1) }),
      fetch('/api/sales', { body: createSaleData(1) })
    ])
    
    // Only 1 should succeed
    const successes = [sale1, sale2].filter(s => s.status === 'fulfilled')
    expect(successes).toHaveLength(1)
  })
})
```

### 8.3 Load Tests

```bash
# Artillery load test
artillery quick --count 100 --num 50 http://localhost:3000/api/sales

# Expected: 95% success rate, < 1s response time
```

---

## 9. Security Considerations

### 9.1 Authentication
- All endpoints require valid JWT token
- User ID extracted from session

### 9.2 Authorization
- Users can only access their own sales
- `user_id` filter on all queries

### 9.3 Input Sanitization
```typescript
// Prevent NoSQL injection
customer_name: data.customer_name.trim().substring(0, 100)

// Validate ObjectId
if (!mongoose.Types.ObjectId.isValid(inventory_id)) {
  throw new Error('Invalid inventory ID')
}
```

---

## 10. Deployment Checklist

- [ ] Database indexes created
- [ ] Connection pool configured
- [ ] Error logging integrated
- [ ] Monitoring dashboards setup
- [ ] Load testing completed
- [ ] Rollback plan documented
- [ ] Team training completed

---

## Appendix: Sample Code Snippets

See implementation files:
- `lib/models/Sale.ts` - Schema & methods
- `lib/models/Inventory.ts` - Stock management
- `lib/models/Customer.ts` - Customer deduplication
- `app/api/sales/route.ts` - API endpoint
- `app/dashboard/sales/page.tsx` - Frontend

---

**Architecture Version**: 2.0
**Last Updated**: January 17, 2026
**Status**: Production Ready ✅
