import mongoose from "mongoose"

/**
 * Sale Model
 * 
 * Purpose: Record all sales transactions with detailed pricing breakdown
 * 
 * Features:
 * - Unique invoice generation
 * - Customer deduplication via customer_id
 * - Multi-item sales with detailed pricing
 * - Complete GST calculation
 * - Payment tracking
 * 
 * Performance Considerations:
 * - Indexed on invoice_number for O(1) lookup
 * - Compound indexes for report queries
 * - Denormalized customer data for fast reads
 */

// Define static methods interface
interface ISaleModel extends mongoose.Model<ISale> {
  generateInvoiceNumber(userId: string): Promise<string>
}

// Sale Item sub-document
export interface ISaleItem {
  inventory_id: mongoose.Types.ObjectId // Reference to Inventory
  item_name: string
  category: string
  purity?: string
  metal_type?: "GOLD" | "SILVER" | "PLATINUM" | "DIAMOND"
  
  // Quantity
  quantity: number
  weight?: number // Weight in grams
  
  // Pricing breakdown
  gold_rate?: number // Rate per gram for gold/silver
  making_charges: number // Making charges amount
  stone_charges: number // Stone/diamond charges
  base_price: number // gold_rate * weight + making + stone
  
  // Discount
  discount_percentage: number // Discount %
  discount_amount: number // Calculated discount
  
  // After discount
  taxable_amount: number // base_price - discount_amount
  
  // GST
  gst_rate: number // GST percentage
  cgst_amount: number
  sgst_amount: number
  igst_amount: number
  total_gst: number
  
  // Final
  item_total: number // taxable_amount + total_gst
}

export interface ISale extends mongoose.Document {
  user_id: string
  
  // Invoice
  invoice_number: string // Format: INV-YYYYMMDD-XXXX
  invoice_date: Date
  
  // Customer Information (denormalized for performance)
  customer_id: mongoose.Types.ObjectId
  customer_name: string
  customer_phone: string
  customer_type: "B2C" | "B2B"
  customer_gst?: string // For B2B
  
  // Items
  items: ISaleItem[]
  
  // Pricing Summary
  total_base_price: number // Sum of all item base prices
  total_making_charges: number
  total_stone_charges: number
  total_discount_amount: number
  total_taxable_amount: number // After discount
  total_cgst: number
  total_sgst: number
  total_igst: number
  total_gst: number
  grand_total: number // Final amount
  
  // GST Type
  gst_type: "INTRASTATE" | "INTERSTATE"
  
  // Payment
  payment_mode: "CASH" | "UPI" | "CARD" | "BANK_TRANSFER" | "CHEQUE" | "CREDIT"
  payment_status: "PAID" | "UNPAID" | "PARTIAL"
  amount_paid: number
  amount_pending: number
  payment_date?: Date
  payment_reference?: string
  
  // Credit terms (for B2B)
  payment_terms?: "IMMEDIATE" | "15_DAYS" | "30_DAYS" | "45_DAYS" | "60_DAYS"
  due_date?: Date
  
  // Status
  sale_status: "COMPLETED" | "PENDING" | "CANCELLED"
  is_inventory_updated: boolean
  
  // Notes
  notes?: string
  
  created_at: Date
  updated_at: Date
}


const SaleSchema = new mongoose.Schema<ISale>(
  {
    user_id: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    invoice_number: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      index: true,
    },
    invoice_date: {
      type: Date,
      required: [true, "Invoice date is required"],
      default: Date.now,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer ID is required"],
    },
    customer_name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customer_phone: {
      type: String,
      required: [true, "Customer phone is required"],
      trim: true,
    },
    customer_type: {
      type: String,
      required: [true, "Customer type is required"],
      enum: {
        values: ["B2C", "B2B"],
        message: "{VALUE} is not a valid customer type",
      },
      default: "B2C",
    },
    customer_gst: {
      type: String,
      trim: true,
      uppercase: true,
    },
    items: [
      {
        inventory_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        item_name: {
          type: String,
          required: true,
          trim: true,
        },
        category: {
          type: String,
          required: true,
          trim: true,
        },
        purity: String,
        metal_type: {
          type: String,
          enum: ["GOLD", "SILVER", "PLATINUM", "DIAMOND"],
        },
        quantity: {
          type: Number,
          required: true,
          min: [0.01, "Quantity must be greater than 0"],
        },
        weight: Number,
        gold_rate: Number,
        making_charges: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        stone_charges: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        base_price: {
          type: Number,
          required: true,
          min: 0,
        },
        discount_percentage: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
          max: 100,
        },
        discount_amount: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        taxable_amount: {
          type: Number,
          required: true,
          min: 0,
        },
        gst_rate: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        cgst_amount: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        sgst_amount: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        igst_amount: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        total_gst: {
          type: Number,
          required: true,
          min: 0,
        },
        item_total: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total_base_price: {
      type: Number,
      required: true,
      min: 0,
    },
    total_making_charges: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total_stone_charges: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total_discount_amount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total_taxable_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    total_cgst: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total_sgst: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total_igst: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total_gst: {
      type: Number,
      required: true,
      min: 0,
    },
    grand_total: {
      type: Number,
      required: true,
      min: 0,
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
    payment_mode: {
      type: String,
      required: [true, "Payment mode is required"],
      enum: {
        values: ["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE", "CREDIT"],
        message: "{VALUE} is not a valid payment mode",
      },
      default: "CASH",
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
      min: 0,
    },
    amount_pending: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    payment_date: Date,
    payment_reference: String,
    payment_terms: {
      type: String,
      enum: {
        values: ["IMMEDIATE", "15_DAYS", "30_DAYS", "45_DAYS", "60_DAYS"],
        message: "{VALUE} is not a valid payment term",
      },
    },
    due_date: Date,
    sale_status: {
      type: String,
      required: [true, "Sale status is required"],
      enum: {
        values: ["COMPLETED", "PENDING", "CANCELLED"],
        message: "{VALUE} is not a valid sale status",
      },
      default: "PENDING",
    },
    is_inventory_updated: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

/**
 * CRITICAL INDEXES FOR PERFORMANCE
 */

// 1. Unique invoice number
SaleSchema.index({ invoice_number: 1 }, { unique: true })

// 2. User's recent sales
SaleSchema.index({ user_id: 1, invoice_date: -1 })

// 3. Customer-wise sales
SaleSchema.index({ user_id: 1, customer_id: 1, invoice_date: -1 })

// 4. Payment status filtering
SaleSchema.index({ user_id: 1, payment_status: 1 })

// 5. Sale status filtering
SaleSchema.index({ user_id: 1, sale_status: 1 })

// 6. Date range queries
SaleSchema.index({ user_id: 1, created_at: -1 })

// 7. Customer type filtering
SaleSchema.index({ user_id: 1, customer_type: 1 })

/**
 * Pre-save middleware: Calculate payment amounts
 */
SaleSchema.pre("save", function (next) {
  // Calculate pending amount
  this.amount_pending = this.grand_total - this.amount_paid

  // Update payment status
  if (this.amount_paid === 0) {
    this.payment_status = "UNPAID"
  } else if (this.amount_paid >= this.grand_total) {
    this.payment_status = "PAID"
    this.amount_pending = 0
  } else {
    this.payment_status = "PARTIAL"
  }

  // Set due date if payment terms provided
  if (this.payment_terms && this.payment_terms !== "IMMEDIATE") {
    const days = parseInt(this.payment_terms.split("_")[0])
    const dueDate = new Date(this.invoice_date)
    dueDate.setDate(dueDate.getDate() + days)
    this.due_date = dueDate
  }

  next()
})

/**
 * Static method: Generate unique invoice number
 * Format: INV-YYYYMMDD-XXXX
 */
SaleSchema.statics.generateInvoiceNumber = async function (
  userId: string
): Promise<string> {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "") // YYYYMMDD

  // Find last invoice for today
  const lastSale = await this.findOne({
    user_id: userId,
    invoice_number: new RegExp(`^INV-${dateStr}-`),
  })
    .sort({ invoice_number: -1 })
    .select("invoice_number")
    .lean()

  let sequenceNumber = 1
  if (lastSale && lastSale.invoice_number) {
    const lastSequence = parseInt(lastSale.invoice_number.slice(-4))
    sequenceNumber = lastSequence + 1
  }

  const sequenceStr = sequenceNumber.toString().padStart(4, "0")
  return `INV-${dateStr}-${sequenceStr}`
}

export default (mongoose.models.Sale as ISaleModel) || 
  mongoose.model<ISale, ISaleModel>("Sale", SaleSchema)


