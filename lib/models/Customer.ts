import mongoose from "mongoose"

/**
 * Customer Model
 * 
 * Purpose: Manage customer data with deduplication by phone number
 * Supports both B2C (individual) and B2B (business) customers
 * 
 * Performance Considerations:
 * - Phone number is unique per user for O(1) lookups
 * - Indexes optimized for search and filtering
 * - Aggregated purchase statistics for analytics
 */

// Define static methods interface
interface ICustomerModel extends mongoose.Model<ICustomer> {
  findOrCreateByPhone(userId: string, customerData: Partial<ICustomer>): Promise<ICustomer>
}

export interface ICustomer extends mongoose.Document {
  user_id: string
  customer_type: "B2C" | "B2B" // Individual or Business
  
  // Personal Details (B2C)
  name: string
  phone: string // Primary deduplication key
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  
  // Business Details (B2B)
  business_name?: string
  contact_person?: string
  gst_number?: string
  pan_number?: string
  
  // Purchase History
  total_purchases: number // Count of sales
  total_purchase_value: number // Total spent
  last_purchase_date?: Date
  lifetime_discount_given: number // Total discounts
  
  // Credit Management (for B2B)
  credit_limit?: number // Maximum credit allowed
  outstanding_balance: number // Current pending amount
  payment_terms?: "IMMEDIATE" | "15_DAYS" | "30_DAYS" | "45_DAYS" | "60_DAYS"
  
  // Status
  is_active: boolean
  loyalty_tier?: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" // Customer tier
  
  // Notes
  notes?: string
  
  created_at: Date
  updated_at: Date
}

const CustomerSchema = new mongoose.Schema<ICustomer>(
  {
    user_id: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
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
    name: {
      type: String,
      required: [true, "Customer name is required"],
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
        message: (props) => `${props.value} is not a valid Indian phone number!`,
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true
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
          if (!v) return true
          return /^\d{6}$/.test(v)
        },
        message: (props) => `${props.value} is not a valid pincode!`,
      },
    },
    business_name: {
      type: String,
      trim: true,
      maxlength: [200, "Business name cannot exceed 200 characters"],
    },
    contact_person: {
      type: String,
      trim: true,
      maxlength: [100, "Contact person name cannot exceed 100 characters"],
    },
    gst_number: {
      type: String,
      trim: true,
      uppercase: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v)
        },
        message: (props) => `${props.value} is not a valid GST number!`,
      },
    },
    pan_number: {
      type: String,
      trim: true,
      uppercase: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true
          return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v)
        },
        message: (props) => `${props.value} is not a valid PAN number!`,
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
    lifetime_discount_given: {
      type: Number,
      default: 0,
      min: 0,
    },
    credit_limit: {
      type: Number,
      min: 0,
    },
    outstanding_balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    payment_terms: {
      type: String,
      enum: {
        values: ["IMMEDIATE", "15_DAYS", "30_DAYS", "45_DAYS", "60_DAYS"],
        message: "{VALUE} is not a valid payment term",
      },
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    loyalty_tier: {
      type: String,
      enum: {
        values: ["BRONZE", "SILVER", "GOLD", "PLATINUM"],
        message: "{VALUE} is not a valid loyalty tier",
      },
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

// 1. Unique phone per user (deduplication)
CustomerSchema.index({ user_id: 1, phone: 1 }, { unique: true })

// 2. Active customers lookup
CustomerSchema.index({ user_id: 1, is_active: 1 })

// 3. Recent customers
CustomerSchema.index({ user_id: 1, last_purchase_date: -1 })

// 4. Customer type filtering
CustomerSchema.index({ user_id: 1, customer_type: 1 })

// 5. Text search on name
CustomerSchema.index({ user_id: 1, name: "text" })

// 6. GST lookup (sparse - only for B2B)
CustomerSchema.index({ user_id: 1, gst_number: 1 }, { sparse: true })

// 7. Outstanding balance (for credit management)
CustomerSchema.index({ user_id: 1, outstanding_balance: -1 })

/**
 * Pre-save middleware
 */
CustomerSchema.pre("save", function (next) {
  // Clean phone number
  if (this.phone) {
    this.phone = this.phone.replace(/\s/g, "")
  }
  
  // Set loyalty tier based on total purchase value
  if (this.total_purchase_value > 0) {
    if (this.total_purchase_value >= 1000000) {
      this.loyalty_tier = "PLATINUM"
    } else if (this.total_purchase_value >= 500000) {
      this.loyalty_tier = "GOLD"
    } else if (this.total_purchase_value >= 200000) {
      this.loyalty_tier = "SILVER"
    } else {
      this.loyalty_tier = "BRONZE"
    }
  }
  
  next()
})

/**
 * Static method: Find or create customer by phone
 */
CustomerSchema.statics.findOrCreateByPhone = async function (
  userId: string,
  customerData: Partial<ICustomer>
) {
  const phone = customerData.phone?.replace(/\s/g, "")
  
  if (!phone) {
    throw new Error("Phone number is required")
  }

  // Try to find existing customer
  let customer = await this.findOne({ user_id: userId, phone })

  if (customer) {
    // Update existing customer with latest data
    customer.name = customerData.name || customer.name
    customer.email = customerData.email || customer.email
    customer.address = customerData.address || customer.address
    customer.city = customerData.city || customer.city
    customer.state = customerData.state || customer.state
    customer.pincode = customerData.pincode || customer.pincode
    customer.business_name = customerData.business_name || customer.business_name
    customer.contact_person = customerData.contact_person || customer.contact_person
    customer.gst_number = customerData.gst_number || customer.gst_number
    customer.pan_number = customerData.pan_number || customer.pan_number
    
    await customer.save()
  } else {
    // Create new customer
    customer = await this.create({
      ...customerData,
      user_id: userId,
      phone,
    })
  }

  return customer
}

export default (mongoose.models.Customer as ICustomerModel) || 
  mongoose.model<ICustomer, ICustomerModel>("Customer", CustomerSchema)
