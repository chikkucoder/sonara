# Sales Module Performance Optimization Guide

## Executive Summary
Techniques to achieve **sub-500ms sale processing** with **5000+ concurrent users** and **50K+ inventory items**.

---

## 1. Database Optimizations

### 1.1 Index Strategy

```javascript
// ============================================
// CRITICAL INDEXES (Create First)
// ============================================

// 1. Sales - Invoice Lookup (Most Common Query)
db.sales.createIndex(
  { invoice_number: 1 },
  { unique: true, name: 'idx_invoice_unique' }
)

// 2. Sales - User Recent Sales (Dashboard)
db.sales.createIndex(
  { user_id: 1, invoice_date: -1 },
  { name: 'idx_user_recent_sales' }
)

// 3. Inventory - Deduplication Key
db.inventory.createIndex(
  { user_id: 1, item_name: 1, category: 1, purity: 1 },
  { unique: true, name: 'idx_inventory_unique' }
)

// 4. Inventory - Low Stock Alert (Partial Index)
db.inventory.createIndex(
  { user_id: 1, available_quantity: 1 },
  {
    partialFilterExpression: { available_quantity: { $lt: 10 } },
    name: 'idx_low_stock'
  }
)

// 5. Customer - Phone Deduplication
db.customers.createIndex(
  { user_id: 1, phone: 1 },
  { unique: true, name: 'idx_customer_phone' }
)

// ============================================
// SECONDARY INDEXES (Create After Data Grows)
// ============================================

// 6. Sales - Payment Status Filter
db.sales.createIndex(
  { user_id: 1, payment_status: 1, invoice_date: -1 },
  { name: 'idx_payment_status' }
)

// 7. Sales - Customer History
db.sales.createIndex(
  { user_id: 1, customer_id: 1, invoice_date: -1 },
  { name: 'idx_customer_history' }
)

// 8. Inventory - Category Lookup
db.inventory.createIndex(
  { user_id: 1, category: 1, available_quantity: -1 },
  { name: 'idx_category_availability' }
)
```

### 1.2 Query Optimization

#### **Use Lean Queries (30% Faster)**
```typescript
// ❌ BAD: Returns Mongoose documents with methods
const sales = await Sale.find({ user_id })

// ✅ GOOD: Returns plain JS objects
const sales = await Sale.find({ user_id }).lean()
```

#### **Project Only Needed Fields**
```typescript
// ❌ BAD: Fetches entire document
const sales = await Sale.find({ user_id })

// ✅ GOOD: Fetches only needed fields
const sales = await Sale.find({ user_id })
  .select('invoice_number customer_name grand_total payment_status')
  .lean()
```

#### **Use Covered Queries**
```typescript
// Query covered entirely by index (no document access needed)
db.sales.find(
  { user_id: 'U123', payment_status: 'UNPAID' },
  { _id: 0, invoice_number: 1, grand_total: 1 } // Fields in index
).explain('executionStats')

// Check: executionStats.totalDocsExamined === 0
```

#### **Batch Inventory Checks**
```typescript
// ❌ BAD: N queries for N items
for (const item of items) {
  const inv = await Inventory.findById(item.inventory_id)
}

// ✅ GOOD: 1 query for N items
const inventoryIds = items.map(i => i.inventory_id)
const inventories = await Inventory.find({
  _id: { $in: inventoryIds }
}).lean()
```

### 1.3 Connection Pooling

```typescript
// mongoose.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

const options: mongoose.ConnectOptions = {
  // Connection Pool
  maxPoolSize: 50,        // Max connections
  minPoolSize: 10,        // Min connections to keep alive
  
  // Timeouts
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  
  // Buffering
  bufferCommands: false,  // Fail fast if not connected
  
  // Monitoring
  monitorCommands: true,
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
```

### 1.4 Write Concern Optimization

```typescript
// For high-throughput scenarios
const session = await mongoose.startSession()
session.startTransaction({
  readConcern: { level: 'local' },         // Faster reads
  writeConcern: { w: 1, j: false },        // Faster writes (less safe)
  readPreference: 'primaryPreferred'
})

// For critical data (invoices)
const session = await mongoose.startSession()
session.startTransaction({
  readConcern: { level: 'majority' },      // Safer reads
  writeConcern: { w: 'majority', j: true }, // Safer writes
  readPreference: 'primary'
})
```

---

## 2. Application-Level Optimizations

### 2.1 Caching Strategy

#### **Redis Cache for Hot Data**
```typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

// Cache inventory with 5-minute TTL
async function getInventory(userId: string) {
  const cacheKey = `inventory:${userId}`
  
  // Try cache first
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }
  
  // Fetch from DB
  const inventory = await Inventory.find({ user_id: userId })
    .select('_id item_name category available_quantity rate')
    .lean()
  
  // Store in cache
  await redis.setex(cacheKey, 300, JSON.stringify(inventory))
  
  return inventory
}

// Invalidate cache on update
async function updateInventory(userId: string, data: any) {
  await Inventory.updateOne(...)
  await redis.del(`inventory:${userId}`) // Clear cache
}
```

#### **In-Memory Cache for Static Data**
```typescript
// Cache gold rates for 1 hour
const goldRateCache = new Map<string, { rate: number, timestamp: number }>()

function getGoldRate(purity: string): number {
  const cached = goldRateCache.get(purity)
  const now = Date.now()
  
  if (cached && now - cached.timestamp < 3600000) {
    return cached.rate
  }
  
  // Fetch fresh rate
  const rate = fetchGoldRateFromAPI(purity)
  goldRateCache.set(purity, { rate, timestamp: now })
  
  return rate
}
```

### 2.2 Async Processing

#### **Background Jobs for Non-Critical Tasks**
```typescript
import Bull from 'bull'

const analyticsQueue = new Bull('analytics', process.env.REDIS_URL)

// Main sale creation (fast)
async function createSale(data: any) {
  const sale = await Sale.create(data)
  
  // Update analytics asynchronously
  await analyticsQueue.add('update-dashboard', {
    userId: data.user_id,
    saleId: sale._id,
    amount: sale.grand_total
  })
  
  return sale
}

// Worker processes analytics separately
analyticsQueue.process('update-dashboard', async (job) => {
  await updateDashboardMetrics(job.data)
})
```

### 2.3 Bulk Operations

```typescript
// Bulk inventory update
async function updateInventoryBulk(items: any[], session: any) {
  const bulkOps = items.map(item => ({
    updateOne: {
      filter: { _id: item.inventory_id },
      update: {
        $inc: {
          quantity: -item.quantity,
          reserved_quantity: -item.quantity
        },
        $set: { last_sale_date: new Date() }
      }
    }
  }))
  
  await Inventory.bulkWrite(bulkOps, { session })
}
```

---

## 3. Frontend Optimizations

### 3.1 Debouncing & Throttling

```typescript
import { debounce } from 'lodash'

// Debounce search queries
const searchProducts = debounce(async (query: string) => {
  const results = await fetch(`/api/inventory?search=${query}`)
  setProducts(results)
}, 300)

// Throttle stock checks
const checkStock = throttle(async (items: any[]) => {
  const availability = await fetch('/api/inventory/check', {
    body: JSON.stringify(items)
  })
  updateAvailability(availability)
}, 1000)
```

### 3.2 Optimistic UI Updates

```typescript
async function completeSale(saleData: any) {
  const tempId = `temp-${Date.now()}`
  
  // 1. Immediately update UI
  addToSalesHistory({
    _id: tempId,
    ...saleData,
    status: 'processing'
  })
  
  try {
    // 2. Send to backend
    const response = await fetch('/api/sales', {
      method: 'POST',
      body: JSON.stringify(saleData)
    })
    
    // 3. Replace temp with real data
    updateSalesHistory(tempId, response.data)
    
  } catch (error) {
    // 4. Rollback on error
    removeFromSalesHistory(tempId)
    showError(error)
  }
}
```

### 3.3 Virtual Scrolling for Large Lists

```typescript
import { FixedSizeList } from 'react-window'

function InventoryList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].item_name} - {items[index].available_quantity}
    </div>
  )
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

### 3.4 Code Splitting

```typescript
// Lazy load heavy components
const SalesReport = lazy(() => import('./SalesReport'))
const BillPrinter = lazy(() => import('./BillPrinter'))

function SalesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {showReport && <SalesReport />}
      {showBill && <BillPrinter />}
    </Suspense>
  )
}
```

---

## 4. API Optimizations

### 4.1 Pagination

```typescript
// Always paginate large result sets
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
  const skip = (page - 1) * limit
  
  const [sales, totalCount] = await Promise.all([
    Sale.find(query).skip(skip).limit(limit).lean(),
    Sale.countDocuments(query)
  ])
  
  return NextResponse.json({
    data: sales,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: skip + sales.length < totalCount
    }
  })
}
```

### 4.2 Response Compression

```typescript
// next.config.mjs
export default {
  compress: true, // Enable gzip compression
  
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'X-Content-Type-Options', value: 'nosniff' }
        ]
      }
    ]
  }
}
```

### 4.3 Parallel Queries

```typescript
// ❌ BAD: Sequential queries (slow)
const customer = await Customer.findOne({ phone })
const inventory = await Inventory.find({ _id: { $in: itemIds } })
const lastInvoice = await Sale.findOne({ user_id }).sort({ invoice_number: -1 })

// ✅ GOOD: Parallel queries (fast)
const [customer, inventory, lastInvoice] = await Promise.all([
  Customer.findOne({ phone }),
  Inventory.find({ _id: { $in: itemIds } }),
  Sale.findOne({ user_id }).sort({ invoice_number: -1 })
])
```

---

## 5. Monitoring & Profiling

### 5.1 Query Performance Monitoring

```typescript
// Log slow queries
mongoose.set('debug', (collectionName, method, query, doc, options) => {
  const start = Date.now()
  
  return function() {
    const duration = Date.now() - start
    
    if (duration > 100) {
      console.warn('[SLOW QUERY]', {
        collection: collectionName,
        method,
        duration: `${duration}ms`,
        query: JSON.stringify(query)
      })
    }
  }
})
```

### 5.2 APM Integration

```typescript
import * as Sentry from '@sentry/nextjs'

// Track sale processing time
async function createSale(data: any) {
  const transaction = Sentry.startTransaction({
    name: 'Create Sale',
    op: 'sale.create'
  })
  
  try {
    const span1 = transaction.startChild({ op: 'validate' })
    await validateSaleData(data)
    span1.finish()
    
    const span2 = transaction.startChild({ op: 'lock_inventory' })
    await lockInventory(data.items)
    span2.finish()
    
    const span3 = transaction.startChild({ op: 'save_sale' })
    const sale = await Sale.create(data)
    span3.finish()
    
    return sale
    
  } finally {
    transaction.finish()
  }
}
```

### 5.3 Load Testing

```yaml
# artillery.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10      # 10 requests/second
    - duration: 120
      arrivalRate: 50      # Ramp up to 50 req/s
  processor: "./test-data.js"

scenarios:
  - name: "Create Sale"
    flow:
      - post:
          url: "/api/sales"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            customer_name: "{{ customerName }}"
            customer_phone: "{{ customerPhone }}"
            items: "{{ items }}"
          capture:
            - json: "$.data.invoice_number"
              as: "invoiceNumber"
      - think: 2

  - name: "List Sales"
    flow:
      - get:
          url: "/api/sales?page=1&limit=50"
          headers:
            Authorization: "Bearer {{ token }}"
```

```bash
# Run load test
artillery run artillery.yml

# Expected Results:
# - p95 < 500ms
# - p99 < 1000ms
# - Success rate > 99%
```

---

## 6. Benchmarks & Targets

### 6.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Sale Creation (p95) | < 500ms | Sentry APM |
| Sale Creation (p99) | < 1000ms | Sentry APM |
| Inventory Lookup | < 50ms | Database profiler |
| Customer Search | < 100ms | Database profiler |
| Dashboard Load | < 1000ms | Lighthouse |
| Transaction Rollback Rate | < 1% | Application logs |
| Concurrent Sales (no conflicts) | 100/sec | Load testing |

### 6.2 Scaling Thresholds

| Load Level | Configuration | Expected Performance |
|------------|---------------|---------------------|
| **Small** (< 1000 sales/day) | Single Node, 10 connections | 200ms avg |
| **Medium** (< 10K sales/day) | Replica Set, 30 connections | 350ms avg |
| **Large** (< 100K sales/day) | Sharded Cluster, 50 connections | 450ms avg |
| **Enterprise** (> 100K sales/day) | Multi-region, Read Replicas | 500ms avg |

---

## 7. Optimization Checklist

### Before Deployment
- [ ] All indexes created and verified
- [ ] Connection pooling configured
- [ ] Query projections optimized
- [ ] Lean queries used where possible
- [ ] Parallel queries implemented
- [ ] Response pagination enabled
- [ ] Caching strategy implemented
- [ ] Load testing completed (> 99% success)
- [ ] Monitoring dashboards setup
- [ ] Slow query alerts configured

### After Deployment
- [ ] Monitor p95/p99 latencies
- [ ] Check index usage (< 10% COLLSCAN)
- [ ] Review connection pool utilization
- [ ] Analyze query patterns
- [ ] Optimize hot paths
- [ ] Scale resources if needed

---

## 8. Common Pitfalls

### ❌ DON'T
```typescript
// 1. N+1 queries
for (const sale of sales) {
  sale.customer = await Customer.findById(sale.customer_id) // BAD
}

// 2. Fetching entire collections
const allInventory = await Inventory.find({}) // BAD

// 3. Not using indexes
await Sale.find({ notes: /keyword/ }) // BAD (full scan)

// 4. Synchronous operations in loops
for (const item of items) {
  await updateInventory(item) // BAD (sequential)
}
```

### ✅ DO
```typescript
// 1. Populate or batch fetch
const sales = await Sale.find({}).populate('customer_id')

// 2. Filter and project
const inventory = await Inventory.find({ user_id })
  .select('_id item_name available_quantity')
  .limit(100)

// 3. Use indexed fields
await Sale.find({ invoice_number: 'INV-20260117-0001' })

// 4. Parallel operations
await Promise.all(items.map(item => updateInventory(item)))
```

---

**Performance Guide Version**: 1.0
**Last Updated**: January 17, 2026
