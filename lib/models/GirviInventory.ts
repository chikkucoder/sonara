import mongoose from "mongoose"

export interface IGirviInventory extends mongoose.Document {
  user_id: string
  customer_name: string
  customer_phone: string
  item_name: string
  weight: number
  purity: string
  rate: number
  loan_amount: number
  interest_rate: number
  loan_date: Date
  maturity_date: Date
  status: "active" | "closed" | "extended"
  created_at: Date
  updated_at: Date
}

const GirviInventorySchema = new mongoose.Schema<IGirviInventory>(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    customer_phone: {
      type: String,
      required: true,
    },
    item_name: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    purity: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    loan_amount: {
      type: Number,
      required: true,
    },
    interest_rate: {
      type: Number,
      required: true,
    },
    loan_date: {
      type: Date,
      required: true,
    },
    maturity_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "extended"],
      default: "active",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

export default mongoose.models.GirviInventory || mongoose.model<IGirviInventory>("GirviInventory", GirviInventorySchema)
