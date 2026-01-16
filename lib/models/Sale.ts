import mongoose from "mongoose"

export interface ISale extends mongoose.Document {
  user_id: string
  item_name: string
  quantity: number
  rate: number
  total_amount: number
  sale_date: Date
  payment_mode: string
  customer_name?: string
  customer_phone?: string
  created_at: Date
  updated_at: Date
}

const SaleSchema = new mongoose.Schema<ISale>(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
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
      index: true,
    },
    payment_mode: {
      type: String,
      required: true,
    },
    customer_name: String,
    customer_phone: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

export default mongoose.models.Sale || mongoose.model<ISale>("Sale", SaleSchema)
