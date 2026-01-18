import mongoose from "mongoose"

export interface IPrivateSale extends mongoose.Document {
  user_id: string
  customer_name?: string
  customer_phone?: string
  item_name: string
  quantity: number
  rate: number
  total_amount: number
  sale_date: Date
  sale_type?: string
  payment_mode: string
  created_at: Date
  updated_at: Date
}

const PrivateSaleSchema = new mongoose.Schema<IPrivateSale>(
  {
    user_id: {
      type: String,
      required: true,
    },
    customer_name: String,
    customer_phone: String,
    item_name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    sale_date: {
      type: Date,
      required: true,
    },
    sale_type: String,
    payment_mode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

// Compound indexes for faster queries
PrivateSaleSchema.index({ user_id: 1, sale_date: -1 })
PrivateSaleSchema.index({ user_id: 1, created_at: -1 })

export default mongoose.models.PrivateSale || mongoose.model<IPrivateSale>("PrivateSale", PrivateSaleSchema)
