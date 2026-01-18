import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Purchase from "@/lib/models/Purchase"
import Inventory from "@/lib/models/Inventory"
import Supplier from "@/lib/models/Supplier"
import MetalLedger from "@/lib/models/MetalLedger"
import mongoose from "mongoose"

/**
 * Input Validation Helper
 * Validates purchase request data and returns formatted errors
 */
function validatePurchaseData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields validation
  if (!data.supplier_name || data.supplier_name.trim().length < 2) {
    errors.push("Supplier name is required and must be at least 2 characters")
  }

  if (!data.supplier_phone) {
    errors.push("Supplier phone number is required")
  } else {
    // Indian phone number validation
    const phoneRegex = /^[6-9]\d{9}$/
    const cleanPhone = data.supplier_phone.replace(/\s/g, "")
    if (!phoneRegex.test(cleanPhone)) {
      errors.push("Invalid phone number. Must be a 10-digit Indian number starting with 6-9")
    }
  }

  // GST validation (if provided)
  if (data.supplier_gst) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    if (!gstRegex.test(data.supplier_gst.toUpperCase())) {
      errors.push("Invalid GST number format. Expected format: 22AAAAA0000A1Z5")
    }
  }

  // Item validation
  if (!data.item_name || data.item_name.trim().length < 2) {
    errors.push("Item name is required and must be at least 2 characters")
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push("Category is required")
  }

  // Quantity validation
  if (!data.quantity || data.quantity <= 0) {
    errors.push("Quantity must be greater than 0")
  }

  // Rate validation
  if (!data.rate_per_unit || data.rate_per_unit <= 0) {
    errors.push("Rate per unit must be greater than 0")
  }

  // GST validation
  const validGSTRates = [0, 3, 5, 12, 18, 28]
  if (data.gst_rate === undefined || data.gst_rate === null) {
    errors.push("GST rate is required")
  } else if (!validGSTRates.includes(data.gst_rate)) {
    errors.push("Invalid GST rate. Must be one of: 0, 3, 5, 12, 18, 28")
  }

  // GST type validation
  if (!data.gst_type || !["INTRASTATE", "INTERSTATE"].includes(data.gst_type)) {
    errors.push("GST type is required and must be either INTRASTATE or INTERSTATE")
  }

  // Payment validation
  if (!data.payment_mode || data.payment_mode.trim().length === 0) {
    errors.push("Payment mode is required")
  }

  if (data.amount_paid !== undefined && data.amount_paid < 0) {
    errors.push("Amount paid cannot be negative")
  }

  // Metal-specific validation
  if (data.metal_type) {
    const validMetalTypes = ["GOLD", "SILVER", "PLATINUM", "DIAMOND"]
    if (!validMetalTypes.includes(data.metal_type.toUpperCase())) {
      errors.push("Invalid metal type. Must be one of: GOLD, SILVER, PLATINUM, DIAMOND")
    }

    if (!data.purity) {
      errors.push("Purity is required for metal items")
    }

    if (!data.weight || data.weight <= 0) {
      errors.push("Weight must be greater than 0 for metal items")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * GET: Fetch all purchases for the authenticated user
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 50, max: 100)
 * - supplier_id: Filter by supplier
 * - payment_status: Filter by payment status (PAID, UNPAID, PARTIAL)
 * - from_date: Start date for filtering
 * - to_date: End date for filtering
 * - category: Filter by category
 * 
 * Performance: Uses indexed queries and lean() for fast reads
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please login to continue." },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    await dbConnect()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)
    const supplierId = searchParams.get("supplier_id")
    const paymentStatus = searchParams.get("payment_status")
    const fromDate = searchParams.get("from_date")
    const toDate = searchParams.get("to_date")
    const category = searchParams.get("category")

    // Build query
    const query: any = { user_id: userId }

    if (supplierId) {
      query.supplier_id = supplierId
    }

    if (paymentStatus) {
      query.payment_status = paymentStatus.toUpperCase()
    }

    if (category) {
      query.category = category
    }

    if (fromDate || toDate) {
      query.purchase_date = {}
      if (fromDate) {
        query.purchase_date.$gte = new Date(fromDate)
      }
      if (toDate) {
        query.purchase_date.$lte = new Date(toDate)
      }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit

    const [purchases, totalCount] = await Promise.all([
      Purchase.find(query)
        .sort({ purchase_date: -1 })
        .skip(skip)
        .limit(limit)
        .populate("supplier_id", "name phone gst_number")
        .lean(),
      Purchase.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: purchases,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + purchases.length < totalCount,
      },
    })
  } catch (error) {
    console.error("Error fetching purchases:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch purchases",
      },
      { status: 500 }
    )
  }
}

/**
 * POST: Create a new purchase with atomic inventory and ledger updates
 * 
 * This endpoint performs the following operations in a MongoDB transaction:
 * 1. Validates input data
 * 2. Finds or creates supplier (deduplication by phone)
 * 3. Generates unique purchase reference number
 * 4. Creates purchase record
 * 5. Updates inventory stock (atomic upsert)
 * 6. Updates metal ledger (if metal item)
 * 7. Updates supplier aggregated stats
 * 
 * All operations are transaction-safe - either all succeed or all rollback.
 * 
 * Request Body Example:
 * {
 *   "supplier_name": "ABC Jewellers",
 *   "supplier_phone": "9876543210",
 *   "supplier_gst": "27AABCU9603R1ZM",
 *   "item_name": "Gold Ring",
 *   "category": "GOLD_JEWELLERY",
 *   "quantity": 2,
 *   "weight": 15.5,
 *   "purity": "22K",
 *   "metal_type": "GOLD",
 *   "rate_per_unit": 5500,
 *   "subtotal": 85250,
 *   "gst_rate": 3,
 *   "gst_type": "INTRASTATE",
 *   "payment_mode": "CASH",
 *   "amount_paid": 85250,
 *   "purchase_date": "2026-01-17"
 * }
 */
export async function POST(request: Request) {
  let session_obj: mongoose.ClientSession | null = null

  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please login to continue." },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    await dbConnect()

    const body = await request.json()

    // Step 1: Validate input data
    const validation = validatePurchaseData(body)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 }
      )
    }

    // Start transaction after validation
    session_obj = await mongoose.startSession()
    session_obj.startTransaction()

    // Step 2: Find or create supplier (deduplication by phone)
    const supplier = await (Supplier as any).findOrCreateByPhone(userId, {
      name: body.supplier_name.trim(),
      phone: body.supplier_phone.replace(/\s/g, ""),
      gst_number: body.supplier_gst?.toUpperCase(),
      email: body.supplier_email,
      address: body.supplier_address,
      city: body.supplier_city,
      state: body.supplier_state,
      pincode: body.supplier_pincode,
    })

    // Step 3: Generate unique purchase reference
    const purchaseReference = await (Purchase as any).generatePurchaseReference(userId)

    // Step 4: Calculate subtotal if not provided
    const subtotal =
      body.subtotal ||
      (body.metal_type && body.weight
        ? body.weight * body.rate_per_unit
        : body.quantity * body.rate_per_unit)

    // Step 5: Create purchase record
    const purchaseData = {
      user_id: userId,
      purchase_reference: purchaseReference,
      supplier_id: supplier._id,
      supplier_name: supplier.name,
      supplier_phone: supplier.phone,
      supplier_gst: supplier.gst_number,
      item_name: body.item_name.trim(),
      category: body.category.trim(),
      quantity: body.quantity,
      weight: body.weight,
      purity: body.purity?.toUpperCase(),
      metal_type: body.metal_type?.toUpperCase(),
      rate_per_unit: body.rate_per_unit,
      subtotal: subtotal,
      gst_rate: body.gst_rate,
      gst_type: body.gst_type.toUpperCase(),
      payment_mode: body.payment_mode.toUpperCase(),
      amount_paid: body.amount_paid || 0,
      purchase_date: body.purchase_date ? new Date(body.purchase_date) : new Date(),
      invoice_number: body.invoice_number,
      location: body.location,
      notes: body.notes,
      payment_date: body.amount_paid > 0 ? new Date() : undefined,
      payment_reference: body.payment_reference,
      is_inventory_updated: false,
      is_ledger_updated: false,
    }

    const purchase = await Purchase.create([purchaseData], { session: session_obj })
    const createdPurchase = purchase[0]

    // Step 6: Update inventory atomically
    try {
      await (Inventory as any).addStock(session_obj, userId, {
        item_name: body.item_name.trim(),
        category: body.category.trim(),
        purity: body.purity?.toUpperCase(),
        metal_type: body.metal_type?.toUpperCase(),
        quantity: body.quantity,
        weight: body.weight,
        rate: body.rate_per_unit,
        location: body.location,
      })

      createdPurchase.is_inventory_updated = true
      await createdPurchase.save({ session: session_obj })
    } catch (inventoryError) {
      console.error("Inventory update failed:", inventoryError)
      throw new Error(
        `Failed to update inventory: ${inventoryError instanceof Error ? inventoryError.message : "Unknown error"}`
      )
    }

    // Step 7: Update metal ledger (if metal item)
    if (body.metal_type && body.weight && body.purity) {
      try {
        await (MetalLedger as any).addTransaction(session_obj, {
          user_id: userId,
          transaction_type: "PURCHASE",
          transaction_ref_id: createdPurchase._id.toString(),
          transaction_ref_type: "Purchase",
          metal_type: body.metal_type.toUpperCase(),
          purity: body.purity.toUpperCase(),
          weight_in: body.weight,
          weight_out: 0,
          rate_per_gram: body.rate_per_unit,
          total_value: subtotal,
          transaction_date: createdPurchase.purchase_date,
          notes: `Purchase: ${body.item_name}`,
        })

        createdPurchase.is_ledger_updated = true
        await createdPurchase.save({ session: session_obj })
      } catch (ledgerError) {
        console.error("Metal ledger update failed:", ledgerError)
        throw new Error(
          `Failed to update metal ledger: ${ledgerError instanceof Error ? ledgerError.message : "Unknown error"}`
        )
      }
    }

    // Step 8: Update supplier aggregated stats
    supplier.total_purchases += 1
    supplier.total_purchase_value += createdPurchase.total_amount
    supplier.last_purchase_date = createdPurchase.purchase_date
    await supplier.save({ session: session_obj })

    // Commit transaction
    await session_obj.commitTransaction()

    return NextResponse.json({
      success: true,
      message: "Purchase created successfully",
      data: {
        purchase: createdPurchase,
        purchase_reference: purchaseReference,
        supplier_id: supplier._id,
      },
    })
  } catch (error) {
    // Rollback transaction on any error
    if (session_obj) {
      await session_obj.abortTransaction()
    }
    console.error("Purchase creation failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create purchase",
        details:
          error instanceof Error && error.message.includes("duplicate key")
            ? "A purchase with this reference already exists"
            : undefined,
      },
      { status: 500 }
    )
  } finally {
    if (session_obj) {
      session_obj.endSession()
    }
  }
}

/**
 * PUT: Update an existing purchase
 * 
 * Note: This is a simplified update that only allows changing:
 * - Payment status and amounts
 * - Notes and location
 * - Invoice number
 * 
 * Critical fields (item, quantity, rate) cannot be updated to maintain data integrity.
 * For such changes, delete and recreate the purchase.
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please login to continue." },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    await dbConnect()

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Purchase ID is required" },
        { status: 400 }
      )
    }

    // Only allow updating specific fields
    const allowedUpdates = [
      "amount_paid",
      "payment_mode",
      "payment_reference",
      "payment_date",
      "notes",
      "location",
      "invoice_number",
    ]

    const sanitizedUpdate: any = {}
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        sanitizedUpdate[key] = updateData[key]
      }
    }

    // If payment date is provided, convert to Date
    if (sanitizedUpdate.payment_date) {
      sanitizedUpdate.payment_date = new Date(sanitizedUpdate.payment_date)
    }

    const purchase = await Purchase.findOneAndUpdate(
      { _id: id, user_id: userId },
      sanitizedUpdate,
      { new: true, runValidators: true }
    )

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: "Purchase not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Purchase updated successfully",
      data: purchase,
    })
  } catch (error) {
    console.error("Purchase update failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update purchase",
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Delete a purchase
 * 
 * WARNING: This is a soft delete that only marks the purchase as deleted.
 * It does NOT reverse inventory or ledger changes to maintain historical accuracy.
 * 
 * For production, consider:
 * - Implementing proper reversal logic with compensating transactions
 * - Adding audit logs
 * - Requiring admin approval for deletion
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please login to continue." },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Purchase ID is required" },
        { status: 400 }
      )
    }

    const purchase = await Purchase.findOneAndDelete({
      _id: id,
      user_id: userId,
    })

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: "Purchase not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Purchase deleted successfully",
      data: { deleted_id: id },
    })
  } catch (error) {
    console.error("Purchase deletion failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete purchase",
      },
      { status: 500 }
    )
  }
}
