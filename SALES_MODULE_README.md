# Sales Module - Quick Start Guide

This guide will help you get started with the Sales module of the Jewellery POS System.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Setup](#quick-setup)
- [Basic Usage](#basic-usage)
- [Common Scenarios](#common-scenarios)
- [API Examples](#api-examples)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Sales module handles all customer-facing sales operations with:

- **Inventory Locking**: Prevents overselling during checkout
- **Customer Deduplication**: Auto-creates or reuses customers by phone
- **Complex Pricing**: Gold rate + making charges + stone charges + discount + GST
- **Unique Invoice Numbers**: Auto-generated format: `INV-YYYYMMDD-XXXX`
- **Payment Tracking**: Supports CASH, CARD, UPI, BANK_TRANSFER, CHEQUE, CREDIT
- **Transaction Safety**: MongoDB transactions with automatic rollback on failures
- **High Performance**: Optimized for 5000+ items with proper indexing

## 🚀 Quick Setup

### Prerequisites

```bash
# MongoDB must be running as a replica set (required for transactions)
# Check your MongoDB connection in lib/mongodb.ts

# Install dependencies
pnpm install
```

### Database Indexes

The Sales module creates 14 indexes automatically:

**Customer Model** (7 indexes):
- `user_id + phone` (unique) - Customer deduplication
- `user_id + email`
- `user_id + customer_type`
- `user_id + loyalty_tier`
- `created_at`
- Plus standard indexes on user_id

**Sale Model** (7 indexes):
- `user_id + invoice_number` (unique) - Invoice uniqueness
- `user_id + customer_id`
- `user_id + payment_status`
- `user_id + sale_status`
- `user_id + sale_date`
- Plus standard indexes on user_id

## 📖 Basic Usage

### 1. Create a Sale

```typescript
// POST /api/sales
const response = await fetch('/api/sales', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    // Customer details (auto-creates or reuses by phone)
    customer_name: "John Doe",
    customer_phone: "9876543210",
    customer_email: "john@example.com",
    customer_type: "B2C",
    
    // Sale details
    sale_date: "2024-01-15",
    gst_type: "INTRASTATE", // or "INTERSTATE"
    
    // Items array
    items: [
      {
        item_name: "Gold Ring",
        category: "Ring",
        quantity: 1,
        weight: 5.5,
        purity: 91.6,
        gold_rate: 6500,
        making_charges: 1500,
        stone_charges: 500,
        discount_percentage: 5,
        hsn_code: "7113",
        inventory_id: "..." // Optional: link to inventory
      }
    ],
    
    // Payment details
    payment_mode: ["UPI"],
    payment_details: [
      {
        mode: "UPI",
        amount: 40000,
        transaction_id: "UPI123456",
        payment_date: "2024-01-15"
      }
    ]
  })
})

const data = await response.json()
// Returns: { success: true, data: { sale: {...}, invoice_number: "INV-20240115-0001" } }
```

### 2. List Sales

```typescript
// GET /api/sales?page=1&limit=20&payment_status=UNPAID
const response = await fetch('/api/sales?page=1&limit=20')
const data = await response.json()

// Returns paginated sales with customer details
```

### 3. Delete a Sale

```typescript
// DELETE /api/sales?id=65a1b2c3d4e5f6g7h8i9j0k1
const response = await fetch('/api/sales?id=65a1b2c3d4e5f6g7h8i9j0k1', {
  method: 'DELETE'
})

// Returns: { success: true, message: "Sale deleted successfully" }
```

## 🎪 Common Scenarios

### Scenario 1: Walk-in Customer Sale (B2C)

```javascript
{
  customer_name: "Rajesh Kumar",
  customer_phone: "9876543210",
  customer_type: "B2C",
  sale_date: "2024-01-15",
  gst_type: "INTRASTATE",
  items: [
    {
      item_name: "Gold Chain",
      category: "Chain",
      quantity: 1,
      weight: 10.5,
      purity: 91.6,
      gold_rate: 6500,
      making_charges: 2500,
      discount_percentage: 0
    }
  ],
  payment_mode: ["CASH"],
  payment_details: [
    {
      mode: "CASH",
      amount: 71225, // Auto-calculated
      payment_date: "2024-01-15"
    }
  ]
}
```

### Scenario 2: Business Customer with Credit (B2B)

```javascript
{
  customer_name: "ABC Jewellers",
  customer_phone: "9123456789",
  customer_email: "abc@jewellers.com",
  customer_type: "B2B",
  business_name: "ABC Jewellers Pvt Ltd",
  gst_number: "27AAAAA0000A1Z5",
  credit_limit: 500000,
  payment_terms: 30, // 30 days credit
  sale_date: "2024-01-15",
  gst_type: "INTERSTATE",
  items: [...],
  payment_mode: ["CREDIT"], // No immediate payment
  payment_details: [] // Empty for credit sales
}
```

### Scenario 3: Multiple Items with Mixed Pricing

```javascript
{
  customer_name: "Priya Sharma",
  customer_phone: "9988776655",
  customer_type: "B2C",
  sale_date: "2024-01-15",
  gst_type: "INTRASTATE",
  items: [
    {
      item_name: "Gold Necklace",
      category: "Necklace",
      quantity: 1,
      weight: 25.5,
      purity: 91.6,
      gold_rate: 6500,
      making_charges: 8000,
      stone_charges: 5000,
      discount_percentage: 10
    },
    {
      item_name: "Gold Earrings",
      category: "Earrings",
      quantity: 1,
      weight: 8.2,
      purity: 75.0,
      gold_rate: 5400,
      making_charges: 1500,
      discount_percentage: 5
    }
  ],
  payment_mode: ["CARD", "UPI"],
  payment_details: [
    { mode: "CARD", amount: 150000, transaction_id: "CARD123", payment_date: "2024-01-15" },
    { mode: "UPI", amount: 50000, transaction_id: "UPI456", payment_date: "2024-01-15" }
  ]
}
```

## 📡 API Examples

### Filter Sales by Customer

```bash
curl "http://localhost:3000/api/sales?customer_id=65a1b2c3d4e5f6g7h8i9j0k1"
```

### Filter by Payment Status

```bash
curl "http://localhost:3000/api/sales?payment_status=UNPAID"
```

### Filter by Date Range

```bash
curl "http://localhost:3000/api/sales?start_date=2024-01-01&end_date=2024-01-31"
```

### Filter by Customer Type

```bash
curl "http://localhost:3000/api/sales?customer_type=B2B"
```

## 🔧 Troubleshooting

### Error: "Insufficient inventory available"

**Problem**: The system detected that the requested quantity exceeds available stock.

**Solution**:
1. Check current inventory: `GET /api/inventory`
2. Reduce sale quantity
3. Add more stock via Purchase module first

```javascript
// Error response
{
  success: false,
  error: "INSUFFICIENT_STOCK",
  message: "Insufficient inventory available for item: Gold Ring"
}
```

### Error: "Invalid phone number"

**Problem**: Phone number doesn't match Indian format (10 digits, starting with 6-9).

**Solution**:
```javascript
// ❌ Wrong
customer_phone: "+91 98765 43210"  // Has spaces and +91
customer_phone: "1234567890"       // Doesn't start with 6-9

// ✅ Correct
customer_phone: "9876543210"       // 10 digits, starts with 9
```

### Error: "Duplicate invoice number"

**Problem**: Extremely rare - indicates system time reset or database corruption.

**Solution**:
1. Check system date/time
2. Verify MongoDB is running correctly
3. Check Sale model's `generateInvoiceNumber()` method

### Transaction Rollback

If any step fails during sale creation, the entire transaction is rolled back:
- Inventory locks are released
- No sale record is created
- Customer stats are not updated
- Metal ledger is not modified

**Check logs** for detailed error messages:
```bash
# Check server logs
tail -f logs/app.log

# Or in development
npm run dev # Shows console.error() output
```

## 📚 Additional Resources

- **Full API Documentation**: See `SALES_MODULE_DOCUMENTATION.md`
- **Architecture Details**: See `SALES_MODULE_ARCHITECTURE.md`
- **Implementation Summary**: See `SALES_MODULE_SUMMARY.md`
- **Utility Functions**: See `lib/utils/salesUtils.ts`

## 🔗 Related Modules

- **Purchase Module**: For supplier-side inventory acquisition
- **Inventory Module**: For stock management and tracking
- **Reports Module**: For sales analytics and insights

## 💡 Best Practices

1. **Always validate inventory** before creating a sale
2. **Use customer phone** for deduplication (don't create duplicate customers)
3. **Provide accurate gold rates** to ensure correct pricing
4. **Choose correct GST type** (INTRASTATE vs INTERSTATE)
5. **Track all payments** even for credit sales
6. **Use proper HSN codes** for GST compliance
7. **Review locks** if sales fail frequently (check inventory reserved_quantity)

## 🎯 Key Features

### Inventory Locking
- Automatically locks inventory during checkout
- Prevents overselling even with concurrent sales
- Releases locks on transaction failure
- Uses `reserved_quantity` field in Inventory model

### Pricing Calculation
```
Base Price = (gold_rate × weight) + making_charges + stone_charges + other_charges
Discount Amount = base_price × (discount_percentage / 100)
Taxable Amount = base_price - discount_amount
GST = taxable_amount × (3% for INTRASTATE: 1.5% CGST + 1.5% SGST, or 3% IGST for INTERSTATE)
Item Total = taxable_amount + total_gst
```

### Customer Management
- **Deduplication**: Automatically finds or creates customer by phone number
- **Loyalty Tiers**: BRONZE → SILVER → GOLD → PLATINUM based on purchase value
- **Credit Management**: Track credit limits and outstanding balances for B2B customers

### Transaction Safety
- All operations wrapped in MongoDB transaction
- Automatic rollback on any failure
- ACID compliance guaranteed
- No partial updates or data corruption

---

**Need Help?** Check the full documentation or contact support.
