import mongoose from "mongoose"

/**
 * MetalLedger Model
 * 
 * Purpose: Track gold/silver metal transactions (in/out) for accurate metal inventory management
 * 
 * This ledger tracks:
 * - Metal purchases (inflow)
 * - Metal sales (outflow)
 * - Metal conversions (e.g., old gold taken in exchange)
 * - Running balance for each metal type and purity
 * 
 * Performance Considerations:
 * - Compound indexes on user_id + metal_type + purity for fast balance queries
 * - Time-series pattern for efficient date range queries
 * - Denormalized running balance for O(1) current balance lookup
 */

// Define static methods interface
interface IMetalLedgerModel extends mongoose.Model<IMetalLedger> {
  getCurrentBalance(userId: string, metalType: string, purity: string): Promise<number>
  addTransaction(session: mongoose.ClientSession, transactionData: any): Promise<IMetalLedger>
  getMetalSummary(userId: string): Promise<any[]>
}

export interface IMetalLedger extends mongoose.Document {
  user_id: string
  
  // Transaction details
  transaction_type: "PURCHASE" | "SALE" | "EXCHANGE" | "ADJUSTMENT" // Type of transaction
  transaction_ref_id: string // Reference to Purchase/Sale/Exchange document
  transaction_ref_type: "Purchase" | "Sale" | "Exchange" | "Adjustment"
  
  // Metal details
  metal_type: "GOLD" | "SILVER" | "PLATINUM" | "DIAMOND" // Metal/gem type
  purity: string // e.g., "22K", "24K", "916", "999" for gold; "925" for silver
  
  // Quantity tracking
  weight_in: number // Inflow in grams (purchase, exchange in)
  weight_out: number // Outflow in grams (sale, exchange out)
  net_weight: number // weight_in - weight_out (for this transaction)
  
  // Running balance (denormalized for performance)
  running_balance: number // Cumulative balance in grams after this transaction
  
  // Financial details
  rate_per_gram: number // Rate at which transaction occurred
  total_value: number // Total value of this transaction
  
  // Transaction date
  transaction_date: Date
  
  // Additional context
  notes?: string
  
  created_at: Date
  updated_at: Date
}

const MetalLedgerSchema = new mongoose.Schema<IMetalLedger>(
  {
    user_id: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    transaction_type: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: {
        values: ["PURCHASE", "SALE", "EXCHANGE", "ADJUSTMENT"],
        message: "{VALUE} is not a valid transaction type",
      },
    },
    transaction_ref_id: {
      type: String,
      required: [true, "Transaction reference ID is required"],
    },
    transaction_ref_type: {
      type: String,
      required: [true, "Transaction reference type is required"],
      enum: {
        values: ["Purchase", "Sale", "Exchange", "Adjustment"],
        message: "{VALUE} is not a valid reference type",
      },
    },
    metal_type: {
      type: String,
      required: [true, "Metal type is required"],
      enum: {
        values: ["GOLD", "SILVER", "PLATINUM", "DIAMOND"],
        message: "{VALUE} is not a valid metal type",
      },
      uppercase: true,
    },
    purity: {
      type: String,
      required: [true, "Purity is required"],
      trim: true,
      validate: {
        validator: function (v: string) {
          // Allow common purities: 22K, 24K, 916, 999, 925, etc.
          return /^(\d{2,3}[K]?|\d{2,3}\.\d{1,2})$/i.test(v)
        },
        message: (props) => `${props.value} is not a valid purity format!`,
      },
    },
    weight_in: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Weight in cannot be negative"],
    },
    weight_out: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Weight out cannot be negative"],
    },
    net_weight: {
      type: Number,
      required: true,
      validate: {
        validator: function (this: IMetalLedger) {
          return this.net_weight === this.weight_in - this.weight_out
        },
        message: "Net weight must equal weight_in - weight_out",
      },
    },
    running_balance: {
      type: Number,
      required: true,
      default: 0,
    },
    rate_per_gram: {
      type: Number,
      required: [true, "Rate per gram is required"],
      min: [0, "Rate cannot be negative"],
    },
    total_value: {
      type: Number,
      required: [true, "Total value is required"],
      min: [0, "Total value cannot be negative"],
    },
    transaction_date: {
      type: Date,
      required: [true, "Transaction date is required"],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

/**
 * CRITICAL INDEXES FOR PERFORMANCE
 * 
 * 1. Current balance lookup by metal and purity
 *    Use case: Get current gold 22K balance
 *    Query: find({ user_id, metal_type: "GOLD", purity: "22K" }).sort({ created_at: -1 }).limit(1)
 */
MetalLedgerSchema.index({ user_id: 1, metal_type: 1, purity: 1, created_at: -1 })

/**
 * 2. Transaction reference lookup
 *    Use case: Find all ledger entries for a specific purchase
 *    Query: find({ transaction_ref_id })
 */
MetalLedgerSchema.index({ transaction_ref_id: 1 })

/**
 * 3. Date range queries for reports
 *    Use case: Get all gold transactions in a date range
 *    Query: find({ user_id, metal_type, transaction_date: { $gte, $lte } })
 */
MetalLedgerSchema.index({ user_id: 1, metal_type: 1, transaction_date: -1 })

/**
 * 4. Transaction type filtering
 *    Use case: Get all purchases for a specific metal
 */
MetalLedgerSchema.index({ user_id: 1, transaction_type: 1, metal_type: 1 })

/**
 * Pre-save middleware: Calculate net_weight
 */
MetalLedgerSchema.pre("save", function (next) {
  this.net_weight = this.weight_in - this.weight_out
  next()
})

/**
 * Static method: Get current balance for a metal and purity
 * Returns the running balance from the most recent transaction
 */
MetalLedgerSchema.statics.getCurrentBalance = async function (
  userId: string,
  metalType: string,
  purity: string
): Promise<number> {
  const lastEntry = await this.findOne({
    user_id: userId,
    metal_type: metalType.toUpperCase(),
    purity: purity.toUpperCase(),
  })
    .sort({ created_at: -1 })
    .select("running_balance")
    .lean()

  return lastEntry ? lastEntry.running_balance : 0
}

/**
 * Static method: Add metal transaction (atomic operation)
 * This method should be called within a MongoDB transaction
 */
MetalLedgerSchema.statics.addTransaction = async function (
  session: mongoose.ClientSession,
  transactionData: {
    user_id: string
    transaction_type: string
    transaction_ref_id: string
    transaction_ref_type: string
    metal_type: string
    purity: string
    weight_in?: number
    weight_out?: number
    rate_per_gram: number
    total_value: number
    transaction_date?: Date
    notes?: string
  }
) {
  // Get current balance
  const MetalLedger = this as unknown as IMetalLedgerModel
  const currentBalance = await MetalLedger.getCurrentBalance(
    transactionData.user_id,
    transactionData.metal_type,
    transactionData.purity
  )

  const weight_in = transactionData.weight_in || 0
  const weight_out = transactionData.weight_out || 0
  const net_weight = weight_in - weight_out
  const running_balance = currentBalance + net_weight

  // Create ledger entry
  const ledgerEntry = await this.create(
    [
      {
        ...transactionData,
        weight_in,
        weight_out,
        net_weight,
        running_balance,
        transaction_date: transactionData.transaction_date || new Date(),
      },
    ],
    { session }
  )

  return ledgerEntry[0]
}

/**
 * Static method: Get metal summary (total balance per metal/purity)
 */
MetalLedgerSchema.statics.getMetalSummary = async function (userId: string) {
  const summary = await this.aggregate([
    {
      $match: { user_id: userId },
    },
    {
      $sort: { created_at: -1 },
    },
    {
      $group: {
        _id: {
          metal_type: "$metal_type",
          purity: "$purity",
        },
        latest_entry: { $first: "$$ROOT" },
        total_weight_in: { $sum: "$weight_in" },
        total_weight_out: { $sum: "$weight_out" },
        total_value: { $sum: "$total_value" },
      },
    },
    {
      $project: {
        metal_type: "$_id.metal_type",
        purity: "$_id.purity",
        current_balance: "$latest_entry.running_balance",
        total_weight_in: 1,
        total_weight_out: 1,
        total_value: 1,
        last_transaction_date: "$latest_entry.transaction_date",
      },
    },
    {
      $sort: { metal_type: 1, purity: 1 },
    },
  ])

  return summary
}

export default (mongoose.models.MetalLedger as IMetalLedgerModel) || 
  mongoose.model<IMetalLedger, IMetalLedgerModel>("MetalLedger", MetalLedgerSchema)
