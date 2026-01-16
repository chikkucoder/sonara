import mongoose from "mongoose"

export interface IShop extends mongoose.Document {
  user_id: string
  shop_name: string
  shop_address: string
  shop_phone: string
  shop_gst?: string
  created_at: Date
  updated_at: Date
}

const ShopSchema = new mongoose.Schema<IShop>(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    shop_name: {
      type: String,
      required: true,
    },
    shop_address: {
      type: String,
      required: true,
    },
    shop_phone: {
      type: String,
      required: true,
    },
    shop_gst: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

export default mongoose.models.Shop || mongoose.model<IShop>("Shop", ShopSchema)
