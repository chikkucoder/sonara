import mongoose from "mongoose"

export interface IGirvi extends mongoose.Document {
  user_id: string
  customer_name: string
  customer_phone?: string
  customer_address?: string
  aadhar_no?: string
  item_name: string
  item_type: string
  metal_type: string
  weight?: number
  purity?: string
  loan_amount: number
  interest_rate: number
  girvi_date: Date
  due_date: Date
  status: string
  description?: string
  created_at: Date
  updated_at: Date
}

const GirviSchema = new mongoose.Schema<IGirvi>(
  {
    user_id: {
      type: String,
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    customer_phone: String,
    customer_address: String,
    aadhar_no: String,
    item_name: {
      type: String,
      required: true,
    },
    item_type: {
      type: String,
      required: true,
    },
    metal_type: {
      type: String,
      required: true,
    },
    weight: Number,
    purity: String,
    loan_amount: {
      type: Number,
      required: true,
    },
    interest_rate: {
      type: Number,
      required: true,
    },
    girvi_date: {
      type: Date,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'active',
    },
    description: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

// Compound indexes for faster queries
GirviSchema.index({ user_id: 1, status: 1 })
GirviSchema.index({ user_id: 1, created_at: -1 })
GirviSchema.index({ user_id: 1, due_date: 1 })

export default mongoose.models.Girvi || mongoose.model<IGirvi>("Girvi", GirviSchema)
