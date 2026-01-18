import mongoose from "mongoose"

/**
 * Supplier Model
 * 
 * Purpose: Deduplicate suppliers by phone number and maintain consistent supplier data
 * Indexing: Unique index on phone for deduplication, compound index on user_id + phone
 * 
 * Performance Considerations:
 * - Phone number is unique per user to enable O(1) lookups
 * - Sparse index on GST for businesses only
 * - Text index on name for search functionality
 */

// Define static methods interface
interface ISupplierModel extends mongoose.Model<ISupplier> {
  findOrCreateByPhone(userId: string, supplierData: Partial<ISupplier>): Promise<ISupplier>
}

export interface ISupplier extends mongoose.Document {
  user_id: string
  name: string
  phone: string // Primary deduplication key
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  gst_number?: string
  pan_number?: string
  bank_name?: string
  account_number?: string
  ifsc_code?: string
  
  // Business metadata
  total_purchases: number // Aggregated count
  total_purchase_value: number // Aggregated value
  last_purchase_date?: Date
  
  // Status
  is_active: boolean
  
  created_at: Date
  updated_at: Date
}

const SupplierSchema = new mongoose.Schema<ISupplier>(
  {
    user_id: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (v: string) {
          // Indian phone number validation: 10 digits
          return /^[6-9]\d{9}$/.test(v)
        },
        message: (props) => `${props.value} is not a valid Indian phone number! Must be 10 digits starting with 6-9`,
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true // Email is optional
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"],
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, "City cannot exceed 100 characters"],
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, "State cannot exceed 100 characters"],
    },
    pincode: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true // Pincode is optional
          return /^\d{6}$/.test(v)
        },
        message: (props) => `${props.value} is not a valid pincode! Must be 6 digits`,
      },
    },
    gst_number: {
      type: String,
      trim: true,
      uppercase: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true // GST is optional
          // GST format: 22AAAAA0000A1Z5
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v)
        },
        message: (props) => `${props.value} is not a valid GST number! Format: 22AAAAA0000A1Z5`,
      },
    },
    pan_number: {
      type: String,
      trim: true,
      uppercase: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true // PAN is optional
          // PAN format: AAAAA9999A
          return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v)
        },
        message: (props) => `${props.value} is not a valid PAN number! Format: AAAAA9999A`,
      },
    },
    bank_name: String,
    account_number: String,
    ifsc_code: {
      type: String,
      trim: true,
      uppercase: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true // IFSC is optional
          return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v)
        },
        message: (props) => `${props.value} is not a valid IFSC code!`,
      },
    },
    total_purchases: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_purchase_value: {
      type: Number,
      default: 0,
      min: 0,
    },
    last_purchase_date: Date,
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

/**
 * CRITICAL INDEXES FOR PERFORMANCE
 * 
 * 1. Compound unique index: Ensures one supplier per phone per user
 *    Use case: Deduplication during purchase creation
 *    Query: findOne({ user_id, phone }) - O(1) lookup
 */
SupplierSchema.index({ user_id: 1, phone: 1 }, { unique: true })

/**
 * 2. Active suppliers lookup
 *    Use case: Fetching active suppliers for dropdown/autocomplete
 *    Query: find({ user_id, is_active: true })
 */
SupplierSchema.index({ user_id: 1, is_active: 1 })

/**
 * 3. Recent suppliers lookup
 *    Use case: Show recently transacted suppliers
 *    Query: find({ user_id }).sort({ last_purchase_date: -1 })
 */
SupplierSchema.index({ user_id: 1, last_purchase_date: -1 })

/**
 * 4. Text search index for autocomplete
 *    Use case: Search suppliers by name
 *    Query: find({ user_id, $text: { $search: "search term" } })
 */
SupplierSchema.index({ user_id: 1, name: "text" })

/**
 * 5. GST lookup (sparse index - only for suppliers with GST)
 *    Use case: Find supplier by GST number
 */
SupplierSchema.index({ user_id: 1, gst_number: 1 }, { sparse: true })

/**
 * Pre-save middleware: Normalize data
 */
SupplierSchema.pre("save", function (next) {
  // Remove spaces from phone number
  if (this.phone) {
    this.phone = this.phone.replace(/\s/g, "")
  }
  next()
})

/**
 * Static method: Find or create supplier by phone (upsert pattern)
 * This ensures supplier deduplication
 */
SupplierSchema.statics.findOrCreateByPhone = async function (
  userId: string,
  supplierData: Partial<ISupplier>
) {
  const phone = supplierData.phone?.replace(/\s/g, "")
  
  if (!phone) {
    throw new Error("Phone number is required for supplier")
  }

  // Try to find existing supplier
  let supplier = await this.findOne({ user_id: userId, phone })

  if (supplier) {
    // Update existing supplier with latest data (keep aggregated fields)
    supplier.name = supplierData.name || supplier.name
    supplier.email = supplierData.email || supplier.email
    supplier.address = supplierData.address || supplier.address
    supplier.city = supplierData.city || supplier.city
    supplier.state = supplierData.state || supplier.state
    supplier.pincode = supplierData.pincode || supplier.pincode
    supplier.gst_number = supplierData.gst_number || supplier.gst_number
    supplier.pan_number = supplierData.pan_number || supplier.pan_number
    supplier.bank_name = supplierData.bank_name || supplier.bank_name
    supplier.account_number = supplierData.account_number || supplier.account_number
    supplier.ifsc_code = supplierData.ifsc_code || supplier.ifsc_code
    
    await supplier.save()
  } else {
    // Create new supplier
    supplier = await this.create({
      ...supplierData,
      user_id: userId,
      phone,
    })
  }

  return supplier
}

export default (mongoose.models.Supplier as ISupplierModel) || 
  mongoose.model<ISupplier, ISupplierModel>("Supplier", SupplierSchema)
