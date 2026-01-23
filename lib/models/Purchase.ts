import mongoose from "mongoose"

/**
 * Purchase Model
 * 
 * Purpose: Record all purchase transactions with complete GST and payment tracking
 * 
 * Features:
 * - Supplier deduplication via supplier_id reference
 * - Complete GST calculation (CGST, SGST, IGST)
 * - Payment status tracking (PAID, UNPAID, PARTIAL)
 * - Unique purchase reference numbers
 * - Atomic inventory and metal ledger updates
 * 
 * Performance Considerations:
 * - Indexed on purchase_reference for O(1) lookup
 * - Compound indexes for report queries
 * - Denormalized supplier data for fast reads
 */

// Define static methods interface
interface IPurchaseModel extends mongoose.Model<IPurchase> {
  generatePurchaseReference(userId: string): Promise<string>
}

export interface IPurchase extends mongoose.Document {
  user_id: string
  
  // Unique purchase reference (auto-generated)
  purchase_reference: string // Format: PUR-YYYYMMDD-XXXX
  
  // Supplier Information (denormalized for performance)
  supplier_id: mongoose.Types.ObjectId // Reference to Supplier model
  supplier_name: string
  supplier_phone: string
  supplier_gst?: string
  supplier_type?: "SUPPLIER" | "WHOLESALER" | "KARIGAR" // Supplier type
  
  // Product Information
  item_name: string
  item_type?: "RAW" | "JEWELLERY" // Item type: raw material or jewellery
  category: string // e.g., "GOLD_JEWELLERY", "SILVER_COINS", "DIAMOND_RING"
  quantity: number // Number of pieces
  
  // Metal details (for precious metals)
  weight?: number // Weight in grams
  purity?: string // e.g., "22K", "24K", "916" for gold
  metal_type?: "GOLD" | "SILVER" | "PLATINUM" | "DIAMOND" // For metal ledger
  
  // Pricing (all values in INR)
  rate_per_unit: number // Rate per piece or per gram
  subtotal: number // quantity * rate_per_unit (or weight * rate for metals)
  
  // GST Details
  gst_rate: number // GST percentage (0, 3, 5, 12, 18, 28)
  cgst_amount: number // Central GST (gst_rate/2)
  sgst_amount: number // State GST (gst_rate/2)
  igst_amount: number // Interstate GST (gst_rate) - used for interstate
  gst_type: "INTRASTATE" | "INTERSTATE" // CGST+SGST or IGST
  total_gst: number // Total GST amount
  
  total_amount: number // subtotal + total_gst (final payable amount)
  
  // Payment Details
  payment_status: "PAID" | "UNPAID" | "PARTIAL" // Payment status
  amount_paid: number // Amount already paid
  amount_pending: number // Remaining amount to be paid
  payment_mode: string // "CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "CREDIT"
  payment_date?: Date // Date when payment was made/received
  payment_reference?: string // Transaction ID, cheque number, etc.
  
  // Purchase Details
  purchase_date: Date
  invoice_number?: string // Supplier's invoice number
  
  // Additional Info
  location?: string // Storage location
  notes?: string
  
  // System fields
  is_inventory_updated: boolean // Flag to track inventory sync
  is_ledger_updated: boolean // Flag to track metal ledger sync
  
  created_at: Date
  updated_at: Date
}


const PurchaseSchema = new mongoose.Schema<IPurchase>(
  {
    user_id: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    purchase_reference: {
      type: String,
      required: [true, "Purchase reference is required"],
      unique: true,
      index: true,
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "Supplier ID is required"],
    },
    supplier_name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
    },
    supplier_phone: {
      type: String,
      required: [true, "Supplier phone is required"],
      trim: true,
    },
    supplier_gst: {
      type: String,
      trim: true,
      uppercase: true,
    },
    supplier_type: {
      type: String,
      enum: {
        values: ["SUPPLIER", "WHOLESALER", "KARIGAR"],
        message: "{VALUE} is not a valid supplier type",
      },
      uppercase: true,
    },
    item_name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: [2, "Item name must be at least 2 characters"],
    },
    item_type: {
      type: String,
      enum: {
        values: ["RAW", "JEWELLERY"],
        message: "{VALUE} is not a valid item type",
      },
      uppercase: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0.01, "Quantity must be greater than 0"],
    },
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    purity: {
      type: String,
      trim: true,
    },
    metal_type: {
      type: String,
      enum: {
        values: ["GOLD", "SILVER", "PLATINUM", "DIAMOND"],
        message: "{VALUE} is not a valid metal type",
      },
      uppercase: true,
    },
    rate_per_unit: {
      type: Number,
      required: [true, "Rate per unit is required"],
      min: [0.01, "Rate must be greater than 0"],
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
    gst_rate: {
      type: Number,
      required: [true, "GST rate is required"],
      min: [0, "GST rate cannot be negative"],
      max: [100, "GST rate cannot exceed 100%"],
      validate: {
        validator: function (v: number) {
          // Valid GST rates in India: 0, 3, 5, 12, 18, 28
          return [0, 3, 5, 12, 18, 28].includes(v)
        },
        message: (props) => `${props.value} is not a valid GST rate! Must be 0, 3, 5, 12, 18, or 28`,
      },
    },
    cgst_amount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "CGST amount cannot be negative"],
    },
    sgst_amount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "SGST amount cannot be negative"],
    },
    igst_amount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "IGST amount cannot be negative"],
    },
    gst_type: {
      type: String,
      required: [true, "GST type is required"],
      enum: {
        values: ["INTRASTATE", "INTERSTATE"],
        message: "{VALUE} is not a valid GST type",
      },
      default: "INTRASTATE",
    },
    total_gst: {
      type: Number,
      default: 0,
      min: [0, "Total GST cannot be negative"],
    },
    total_amount: {
      type: Number,
      default: 0,
      min: [0, "Total amount cannot be negative"],
    },
    payment_status: {
      type: String,
      required: [true, "Payment status is required"],
      enum: {
        values: ["PAID", "UNPAID", "PARTIAL"],
        message: "{VALUE} is not a valid payment status",
      },
      default: "UNPAID",
    },
    amount_paid: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Amount paid cannot be negative"],
    },
    amount_pending: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Amount pending cannot be negative"],
    },
    payment_mode: {
      type: String,
      required: [true, "Payment mode is required"],
      trim: true,
      default: "CASH",
    },
    payment_date: Date,
    payment_reference: {
      type: String,
      trim: true,
    },
    purchase_date: {
      type: Date,
      required: [true, "Purchase date is required"],
      default: Date.now,
    },
    invoice_number: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    is_inventory_updated: {
      type: Boolean,
      default: false,
    },
    is_ledger_updated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

/**
 * CRITICAL INDEXES FOR PERFORMANCE
 * 
 * 1. Unique purchase reference lookup
 *    Use case: Find purchase by reference number - O(1)
 */
PurchaseSchema.index({ purchase_reference: 1 }, { unique: true })

/**
 * 2. User's recent purchases
 *    Use case: Dashboard - show recent purchases
 *    Query: find({ user_id }).sort({ purchase_date: -1 })
 */
PurchaseSchema.index({ user_id: 1, purchase_date: -1 })

/**
 * 3. Supplier-wise purchase history
 *    Use case: View all purchases from a specific supplier
 *    Query: find({ user_id, supplier_id }).sort({ purchase_date: -1 })
 */
PurchaseSchema.index({ user_id: 1, supplier_id: 1, purchase_date: -1 })

/**
 * 4. Payment status filtering
 *    Use case: Find all unpaid/partial purchases
 *    Query: find({ user_id, payment_status: "UNPAID" })
 */
PurchaseSchema.index({ user_id: 1, payment_status: 1 })

/**
 * 5. Item-wise purchase tracking
 *    Use case: Find all purchases of a specific item
 *    Query: find({ user_id, item_name }).sort({ purchase_date: -1 })
 */
PurchaseSchema.index({ user_id: 1, item_name: 1, purchase_date: -1 })

/**
 * 6. Date range queries for reports
 *    Use case: Monthly/yearly purchase reports
 *    Query: find({ user_id, purchase_date: { $gte, $lte } })
 */
PurchaseSchema.index({ user_id: 1, created_at: -1 })

/**
 * 7. Category-wise purchases
 *    Use case: Category-wise purchase analytics
 */
PurchaseSchema.index({ user_id: 1, category: 1, purchase_date: -1 })

/**
 * Pre-save middleware: Calculate GST and payment amounts
 */
PurchaseSchema.pre("save", function (next) {
  // Calculate GST based on type
  if (this.gst_type === "INTRASTATE") {
    // Split GST into CGST and SGST
    this.cgst_amount = (this.subtotal * this.gst_rate) / 200 // Half of GST rate
    this.sgst_amount = (this.subtotal * this.gst_rate) / 200 // Half of GST rate
    this.igst_amount = 0
    this.total_gst = this.cgst_amount + this.sgst_amount
  } else {
    // Interstate - only IGST
    this.igst_amount = (this.subtotal * this.gst_rate) / 100
    this.cgst_amount = 0
    this.sgst_amount = 0
    this.total_gst = this.igst_amount
  }

  // Calculate total amount
  this.total_amount = this.subtotal + this.total_gst

  // Calculate pending amount
  this.amount_pending = this.total_amount - this.amount_paid

  // Update payment status based on amounts
  if (this.amount_paid === 0) {
    this.payment_status = "UNPAID"
  } else if (this.amount_paid >= this.total_amount) {
    this.payment_status = "PAID"
    this.amount_pending = 0
  } else {
    this.payment_status = "PARTIAL"
  }

  next()
})

/**
 * Static method: Generate unique purchase reference
 * Format: PUR-YYYYMMDD-XXXX (e.g., PUR-20260117-0001)
 */
PurchaseSchema.statics.generatePurchaseReference = async function (
  userId: string
): Promise<string> {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "") // YYYYMMDD

  // Find last purchase reference for today
  const lastPurchase = await this.findOne({
    user_id: userId,
    purchase_reference: new RegExp(`^PUR-${dateStr}-`),
  })
    .sort({ purchase_reference: -1 })
    .select("purchase_reference")
    .lean()

  let sequenceNumber = 1
  if (lastPurchase && lastPurchase.purchase_reference) {
    const lastSequence = parseInt(lastPurchase.purchase_reference.slice(-4))
    sequenceNumber = lastSequence + 1
  }

  const sequenceStr = sequenceNumber.toString().padStart(4, "0")
  return `PUR-${dateStr}-${sequenceStr}`
}


export default (mongoose.models.Purchase as IPurchaseModel) || 
  mongoose.model<IPurchase, IPurchaseModel>("Purchase", PurchaseSchema)
