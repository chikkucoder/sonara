import mongoose from "mongoose"

export interface IInventory extends mongoose.Document {
  user_id: string
  item_name: string
  category: string
  quantity: number
  weight?: number
  purity?: string
  rate: number
  total_value: number
  location?: string
  created_at: Date
  updated_at: Date
}

const InventorySchema = new mongoose.Schema<IInventory>(
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
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    weight: Number,
    purity: String,
    rate: {
      type: Number,
      required: true,
    },
    total_value: {
      type: Number,
      required: true,
    },
    location: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

export default mongoose.models.Inventory || mongoose.model<IInventory>("Inventory", InventorySchema)
