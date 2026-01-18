import mongoose from "mongoose"

/**
 * Inventory Model
 * 
 * Purpose: Track current stock of jewellery items with deduplication by item attributes
 * 
 * Deduplication Strategy:
 * - Items are considered identical if they have same: item_name, category, purity
 * - Quantities and values are aggregated for identical items
 * - Unique compound index ensures no duplicates
 * 
 * Performance Considerations:
 * - Compound unique index prevents duplicate inventory entries
 * - Indexes optimized for common query patterns (category, low stock alerts)
 * - Denormalized data for fast reads
 */

// Define static methods interface
interface IInventoryModel extends mongoose.Model<IInventory> {
  findOrCreate(userId: string, itemData: Partial<IInventory>): Promise<IInventory>
  addStock(session: mongoose.ClientSession, userId: string, itemData: any): Promise<IInventory>
  removeStock(session: mongoose.ClientSession, userId: string, itemData: any): Promise<IInventory>
}

export interface IInventory extends mongoose.Document {
  user_id: string
  item_name: string
  category: string
  
  // Metal details (for deduplication)
  purity?: string // e.g., "22K", "24K", "916"
  metal_type?: "GOLD" | "SILVER" | "PLATINUM" | "DIAMOND"
  
  // Stock tracking
  quantity: number // Available quantity
  
  // Weight tracking (for precious metals)
  weight?: number // Total weight in grams
  
  // Pricing
  rate: number // Current/average rate per unit
  total_value: number // quantity * rate (or weight * rate)
  
  // Reorder management
  min_stock_level?: number // Minimum stock threshold for alerts
  max_stock_level?: number // Maximum stock capacity
  reorder_point?: number // Stock level to trigger reorder
  
  // Storage
  location?: string // Physical storage location
  
  // Metadata
  last_purchase_date?: Date // When was this item last purchased
  last_sale_date?: Date // When was this item last sold
  
  created_at: Date
  updated_at: Date
}

const InventorySchema = new mongoose.Schema<IInventory>(
  {
    user_id: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    item_name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: [2, "Item name must be at least 2 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    purity: {
      type: String,
      trim: true,
      uppercase: true,
    },
    metal_type: {
      type: String,
      enum: {
        values: ["GOLD", "SILVER", "PLATINUM", "DIAMOND"],
        message: "{VALUE} is not a valid metal type",
      },
      uppercase: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: [0, "Rate cannot be negative"],
    },
    total_value: {
      type: Number,
      required: [true, "Total value is required"],
      min: [0, "Total value cannot be negative"],
    },
    min_stock_level: {
      type: Number,
      min: [0, "Minimum stock level cannot be negative"],
    },
    max_stock_level: {
      type: Number,
      min: [0, "Maximum stock level cannot be negative"],
    },
    reorder_point: {
      type: Number,
      min: [0, "Reorder point cannot be negative"],
    },
    location: {
      type: String,
      trim: true,
    },
    last_purchase_date: Date,
    last_sale_date: Date,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

/**
 * CRITICAL INDEXES FOR PERFORMANCE AND DEDUPLICATION
 * 
 * 1. UNIQUE compound index: Prevents duplicate inventory entries
 *    Deduplication key: user_id + item_name + category + purity
 *    This ensures one inventory record per unique item configuration
 */
InventorySchema.index(
  { user_id: 1, item_name: 1, category: 1, purity: 1 },
  { 
    unique: true,
    // Partial index: only when purity exists (for items without purity)
    partialFilterExpression: { purity: { $type: "string" } },
  }
)

/**
 * 2. Inventory without purity (general items)
 *    For items that don't have purity (e.g., silver coins, diamonds)
 */
InventorySchema.index(
  { user_id: 1, item_name: 1, category: 1 },
  { 
    unique: true,
    partialFilterExpression: { purity: { $exists: false } },
  }
)

/**
 * 3. Category-wise inventory lookup
 *    Use case: View all gold jewellery, all silver items
 *    Query: find({ user_id, category })
 */
InventorySchema.index({ user_id: 1, category: 1 })

/**
 * 4. Low stock alerts
 *    Use case: Find items below minimum stock level
 *    Query: find({ user_id, quantity: { $lt: min_stock_level } })
 */
InventorySchema.index({ user_id: 1, quantity: 1, min_stock_level: 1 })

/**
 * 5. Stock lookup
 *    Use case: Find items in stock
 *    Query: find({ user_id, quantity: { $gt: 0 } })
 */
InventorySchema.index({ user_id: 1, quantity: -1 })

/**
 * 6. Metal type filtering
 *    Use case: Get all gold inventory
 */
InventorySchema.index({ user_id: 1, metal_type: 1 })

/**
 * 7. Text search for item names
 *    Use case: Search inventory by item name
 */
InventorySchema.index({ user_id: 1, item_name: "text" })

/**
 * Static method: Find or create inventory item (for deduplication)
 * Returns existing item if found, creates new one otherwise
 */
InventorySchema.statics.findOrCreate = async function (
  userId: string,
  itemData: Partial<IInventory>
) {
  const query: any = {
    user_id: userId,
    item_name: itemData.item_name,
    category: itemData.category,
  }

  // Add purity to query if it exists
  if (itemData.purity) {
    query.purity = itemData.purity.toUpperCase()
  }

  // Try to find existing inventory item
  let inventoryItem = await this.findOne(query)

  if (!inventoryItem) {
    // Create new inventory item
    inventoryItem = await this.create({
      ...itemData,
      user_id: userId,
      purity: itemData.purity?.toUpperCase(),
    })
  }

  return inventoryItem
}

/**
 * Static method: Add stock (called during purchase)
 * Updates quantity, weight, and recalculates values
 */
InventorySchema.statics.addStock = async function (
  session: mongoose.ClientSession,
  userId: string,
  itemData: {
    item_name: string
    category: string
    purity?: string
    metal_type?: string
    quantity: number
    weight?: number
    rate: number
    location?: string
  }
) {
  const query: any = {
    user_id: userId,
    item_name: itemData.item_name,
    category: itemData.category,
  }

  if (itemData.purity) {
    query.purity = itemData.purity.toUpperCase()
  }

  // Use findOneAndUpdate with upsert for atomic operation
  const inventoryItem = await this.findOneAndUpdate(
    query,
    {
      $inc: {
        quantity: itemData.quantity,
        weight: itemData.weight || 0,
      },
      $set: {
        rate: itemData.rate, // Update to latest rate
        location: itemData.location || undefined,
        metal_type: itemData.metal_type || undefined,
        last_purchase_date: new Date(),
      },
    },
    {
      upsert: true,
      new: true,
      session,
      setDefaultsOnInsert: true,
    }
  )

  // Recalculate total value
  inventoryItem.total_value = inventoryItem.quantity * inventoryItem.rate
  await inventoryItem.save({ session })

  return inventoryItem
}

/**
 * Static method: Remove stock (called during sale)
 * Decreases quantity and weight
 */
InventorySchema.statics.removeStock = async function (
  session: mongoose.ClientSession,
  userId: string,
  itemData: {
    item_name: string
    category: string
    purity?: string
    quantity: number
    weight?: number
  }
) {
  const query: any = {
    user_id: userId,
    item_name: itemData.item_name,
    category: itemData.category,
  }

  if (itemData.purity) {
    query.purity = itemData.purity.toUpperCase()
  }

  const inventoryItem = await this.findOne(query).session(session)

  if (!inventoryItem) {
    throw new Error(`Inventory item not found: ${itemData.item_name}`)
  }

  if (inventoryItem.quantity < itemData.quantity) {
    throw new Error(
      `Insufficient stock for ${itemData.item_name}. Available: ${inventoryItem.quantity}, Requested: ${itemData.quantity}`
    )
  }

  // Decrease quantity and weight
  inventoryItem.quantity -= itemData.quantity
  inventoryItem.weight = (inventoryItem.weight || 0) - (itemData.weight || 0)
  inventoryItem.last_sale_date = new Date()

  // Recalculate total value
  inventoryItem.total_value = inventoryItem.quantity * inventoryItem.rate

  await inventoryItem.save({ session })

  return inventoryItem
}

export default (mongoose.models.Inventory as IInventoryModel) || 
  mongoose.model<IInventory, IInventoryModel>("Inventory", InventorySchema)

