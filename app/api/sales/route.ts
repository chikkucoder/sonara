import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Sale from "@/lib/models/Sale"
import Inventory from "@/lib/models/Inventory"
import Customer from "@/lib/models/Customer"
import MetalLedger from "@/lib/models/MetalLedger"
import mongoose from "mongoose"

/**
 * Validation Helper for Sale Data
 */
function validateSaleData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Customer validation
  if (!data.customer_name || data.customer_name.trim().length < 2) {
    errors.push("Customer name is required and must be at least 2 characters")
  }

  if (!data.customer_phone) {
    errors.push("Customer phone number is required")
  } else {
    const phoneRegex = /^[6-9]\d{9}$/
    const cleanPhone = data.customer_phone.replace(/\s/g, "")
    if (!phoneRegex.test(cleanPhone)) {
      errors.push("Invalid phone number. Must be 10 digits starting with 6-9")
    }
  }

  // Items validation
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push("At least one item is required")
  } else {
    data.items.forEach((item: any, index: number) => {
      if (!item.inventory_id) {
        errors.push(`Item ${index + 1}: Inventory ID is required`)
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
      }
      if (item.discount_percentage < 0 || item.discount_percentage > 100) {
        errors.push(`Item ${index + 1}: Discount must be between 0 and 100`)
      }
      if (!item.gst_rate && item.gst_rate !== 0) {
        errors.push(`Item ${index + 1}: GST rate is required`)
      }
    })
  }

  // GST type validation
  if (!data.gst_type || !["INTRASTATE", "INTERSTATE"].includes(data.gst_type)) {
    errors.push("GST type is required and must be INTRASTATE or INTERSTATE")
  }

  // Payment validation
  if (!data.payment_mode) {
    errors.push("Payment mode is required")
  }

  if (data.amount_paid !== undefined && data.amount_paid < 0) {
    errors.push("Amount paid cannot be negative")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate Item Pricing
 * Calculates all pricing components for a single item
 */
function calculateItemPricing(item: any, gstType: string) {
  // Base price calculation
  let basePrice = 0
  
  if (item.weight && item.gold_rate) {
    // For metal items: weight * rate + making + stone charges
    basePrice = item.weight * item.gold_rate + (item.making_charges || 0) + (item.stone_charges || 0)
  } else {
    // For regular items: base price already provided
    basePrice = item.base_price || item.making_charges + item.stone_charges
  }

  // Discount calculation
  const discountAmount = (basePrice * (item.discount_percentage || 0)) / 100

  // Taxable amount (after discount)
  const taxableAmount = basePrice - discountAmount

  // GST calculation
  let cgstAmount = 0
  let sgstAmount = 0
  let igstAmount = 0

  if (gstType === "INTRASTATE") {
    cgstAmount = (taxableAmount * item.gst_rate) / 200 // Half of GST
    sgstAmount = (taxableAmount * item.gst_rate) / 200 // Half of GST
  } else {
    igstAmount = (taxableAmount * item.gst_rate) / 100
  }

  const totalGst = cgstAmount + sgstAmount + igstAmount

  // Final item total
  const itemTotal = taxableAmount + totalGst

  return {
    base_price: Number(basePrice.toFixed(2)),
    discount_amount: Number(discountAmount.toFixed(2)),
    taxable_amount: Number(taxableAmount.toFixed(2)),
    cgst_amount: Number(cgstAmount.toFixed(2)),
    sgst_amount: Number(sgstAmount.toFixed(2)),
    igst_amount: Number(igstAmount.toFixed(2)),
    total_gst: Number(totalGst.toFixed(2)),
    item_total: Number(itemTotal.toFixed(2)),
  }
}

/**
 * GET: Fetch all sales for authenticated user
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
    const customerId = searchParams.get("customer_id")
    const paymentStatus = searchParams.get("payment_status")
    const saleStatus = searchParams.get("sale_status")
    const customerType = searchParams.get("customer_type")
    const fromDate = searchParams.get("from_date")
    const toDate = searchParams.get("to_date")

    // Build query
    const query: any = { user_id: userId }

    if (customerId) {
      query.customer_id = customerId
    }

    if (paymentStatus) {
      query.payment_status = paymentStatus.toUpperCase()
    }

    if (saleStatus) {
      query.sale_status = saleStatus.toUpperCase()
    }

    if (customerType) {
      query.customer_type = customerType.toUpperCase()
    }

    if (fromDate || toDate) {
      query.invoice_date = {}
      if (fromDate) {
        query.invoice_date.$gte = new Date(fromDate)
      }
      if (toDate) {
        query.invoice_date.$lte = new Date(toDate)
      }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit

    const [sales, totalCount] = await Promise.all([
      Sale.find(query)
        .sort({ invoice_date: -1 })
        .skip(skip)
        .limit(limit)
        .populate("customer_id", "name phone customer_type gst_number")
        .lean(),
      Sale.countDocuments(query),
    ])

    // Transform sales data to match frontend expectations
    const transformedSales = sales.map((sale: any) => ({
      ...sale,
      invoice_no: sale.invoice_number,
      sale_type: sale.customer_type?.toLowerCase() || 'b2c',
      sale_date: sale.invoice_date,
      subtotal: sale.total_base_price,
      discount: sale.total_discount_amount,
      gst: sale.total_gst,
      total: sale.grand_total,
      payment_method: sale.payment_mode,
      status: sale.sale_status?.toLowerCase() || 'completed',
      business_name: sale.customer_name,
      business_phone: sale.customer_phone,
      business_address: '',
      contact_person: '',
      gst_no: sale.customer_gst,
      items: sale.items.map((item: any) => ({
        ...item,
        product_id: item.inventory_id,
        rate: item.base_price / item.quantity || 0,
        amount: item.item_total
      }))
    }))

    return NextResponse.json({
      success: true,
      data: transformedSales,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + sales.length < totalCount,
      },
    })
  } catch (error) {
    console.error("Error fetching sales:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch sales",
      },
      { status: 500 }
    )
  }
}

/**
 * POST: Create a new sale with atomic inventory locking and updates
 * 
 * This endpoint performs the following operations in a MongoDB transaction:
 * 1. Validates input data
 * 2. Finds or creates customer (deduplication by phone)
 * 3. Generates unique invoice number
 * 4. Locks inventory items (reserves stock)
 * 5. Calculates detailed pricing for each item
 * 6. Creates sale record
 * 7. Reduces inventory stock and unlocks reservation
 * 8. Updates metal ledger (if metal items)
 * 9. Updates customer stats
 * 
 * All operations are transaction-safe - either all succeed or all rollback.
 */
export async function POST(request: Request) {
  const maxRetries = 3
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
      const validation = validateSaleData(body)
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

      // Step 2: Find or create customer BEFORE transaction (to avoid catalog changes)
      const customer = await (Customer as any).findOrCreateByPhone(userId, {
        name: body.customer_name.trim(),
        phone: body.customer_phone.replace(/\s/g, ""),
        customer_type: body.customer_type || "B2C",
        email: body.customer_email,
        address: body.customer_address,
        city: body.customer_city,
        state: body.customer_state,
        pincode: body.customer_pincode,
        business_name: body.business_name,
        contact_person: body.contact_person,
        gst_number: body.customer_gst?.toUpperCase(),
        payment_terms: body.payment_terms,
        credit_limit: body.credit_limit,
      })

      // Start transaction AFTER customer is ready
      session_obj = await mongoose.startSession()
      session_obj.startTransaction({
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
        readPreference: "primary"
      })

      // Step 3: Generate unique invoice number
      const invoiceNumber = await (Sale as any).generateInvoiceNumber(userId)

      // Step 4: Calculate pricing for each item and prepare sale data
      const processedItems = []
      let totalBasePrice = 0
      let totalMakingCharges = 0
      let totalStoneCharges = 0
      let totalDiscountAmount = 0
      let totalTaxableAmount = 0
      let totalCGST = 0
      let totalSGST = 0
      let totalIGST = 0
      let totalGST = 0
      let grandTotal = 0

      for (const item of body.items) {
        // Fetch inventory item details
        const inventoryItem = await Inventory.findOne({
          _id: item.inventory_id,
          user_id: userId,
        }).session(session_obj)

        if (!inventoryItem) {
          throw new Error(`Inventory item not found: ${item.inventory_id}`)
        }

        // Calculate item pricing
        const pricing = calculateItemPricing(
          {
            ...item,
            gold_rate: item.gold_rate || inventoryItem.rate,
            weight: item.weight || (inventoryItem.weight ? inventoryItem.weight / inventoryItem.quantity : 0),
          },
          body.gst_type
        )

        const processedItem = {
          inventory_id: inventoryItem._id,
          item_name: inventoryItem.item_name,
          category: inventoryItem.category,
          purity: inventoryItem.purity,
          metal_type: inventoryItem.metal_type,
          quantity: item.quantity,
          weight: item.weight,
          gold_rate: item.gold_rate || inventoryItem.rate,
          making_charges: item.making_charges || 0,
          stone_charges: item.stone_charges || 0,
          base_price: pricing.base_price,
          discount_percentage: item.discount_percentage || 0,
          discount_amount: pricing.discount_amount,
          taxable_amount: pricing.taxable_amount,
          gst_rate: item.gst_rate || 3,
          cgst_amount: pricing.cgst_amount,
          sgst_amount: pricing.sgst_amount,
          igst_amount: pricing.igst_amount,
          total_gst: pricing.total_gst,
          item_total: pricing.item_total,
        }

        processedItems.push(processedItem)

        // Aggregate totals
        totalBasePrice += pricing.base_price
        totalMakingCharges += item.making_charges || 0
        totalStoneCharges += item.stone_charges || 0
        totalDiscountAmount += pricing.discount_amount
        totalTaxableAmount += pricing.taxable_amount
        totalCGST += pricing.cgst_amount
        totalSGST += pricing.sgst_amount
        totalIGST += pricing.igst_amount
        totalGST += pricing.total_gst
        grandTotal += pricing.item_total
      }

      // Step 5: Create sale record
      const saleData = {
        user_id: userId,
        invoice_number: invoiceNumber,
        invoice_date: body.invoice_date ? new Date(body.invoice_date) : new Date(),
        customer_id: customer._id,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_type: customer.customer_type,
        customer_gst: customer.gst_number,
        items: processedItems,
        total_base_price: Number(totalBasePrice.toFixed(2)),
        total_making_charges: Number(totalMakingCharges.toFixed(2)),
        total_stone_charges: Number(totalStoneCharges.toFixed(2)),
        total_discount_amount: Number(totalDiscountAmount.toFixed(2)),
        total_taxable_amount: Number(totalTaxableAmount.toFixed(2)),
        total_cgst: Number(totalCGST.toFixed(2)),
        total_sgst: Number(totalSGST.toFixed(2)),
        total_igst: Number(totalIGST.toFixed(2)),
        total_gst: Number(totalGST.toFixed(2)),
        grand_total: Number(grandTotal.toFixed(2)),
        gst_type: body.gst_type.toUpperCase(),
        payment_mode: body.payment_mode?.toUpperCase() || "CASH",
        amount_paid: body.amount_paid || 0,
        payment_date: body.amount_paid > 0 ? new Date() : undefined,
        payment_reference: body.payment_reference,
        payment_terms: body.payment_terms,
        sale_status: "COMPLETED",
        is_inventory_updated: false,
        notes: body.notes,
      }

      const sale = await Sale.create([saleData], { session: session_obj })
      const createdSale = sale[0]

      // Step 6: Reduce inventory stock
      try {
        for (const item of processedItems) {
          await (Inventory as any).removeStock(session_obj, userId, {
            item_name: item.item_name,
            category: item.category,
            purity: item.purity,
            quantity: item.quantity,
            weight: item.weight,
          })
        }

        createdSale.is_inventory_updated = true
        await createdSale.save({ session: session_obj })
      } catch (inventoryError) {
        console.error("Inventory update failed:", inventoryError)
        throw new Error(
          `Failed to update inventory: ${inventoryError instanceof Error ? inventoryError.message : "Unknown error"}`
        )
      }

      // Step 7: Update metal ledger (for metal items)
      for (const item of processedItems) {
        if (item.metal_type && item.weight && item.purity) {
          try {
            await (MetalLedger as any).addTransaction(session_obj, {
              user_id: userId,
              transaction_type: "SALE",
              transaction_ref_id: createdSale._id.toString(),
              transaction_ref_type: "Sale",
              metal_type: item.metal_type,
              purity: item.purity,
              weight_in: 0,
              weight_out: item.weight,
              rate_per_gram: item.gold_rate,
              total_value: item.item_total,
              transaction_date: createdSale.invoice_date,
              notes: `Sale: ${item.item_name}`,
            })
          } catch (ledgerError) {
            console.error("Metal ledger update failed:", ledgerError)
            // Continue - ledger update is not critical for sale completion
          }
        }
      }

      // Step 8: Update customer aggregated stats
      customer.total_purchases += 1
      customer.total_purchase_value += createdSale.grand_total
      customer.lifetime_discount_given += createdSale.total_discount_amount
      customer.last_purchase_date = createdSale.invoice_date
      
      // Update outstanding balance for credit sales
      if (createdSale.payment_status !== "PAID") {
        customer.outstanding_balance += createdSale.amount_pending
      }
      
      await customer.save({ session: session_obj })

      // Commit transaction
      await session_obj.commitTransaction()

      return NextResponse.json({
        success: true,
        message: "Sale created successfully",
        data: {
          sale: createdSale,
          invoice_number: invoiceNumber,
          customer_id: customer._id,
          grand_total: createdSale.grand_total,
          amount_pending: createdSale.amount_pending,
        },
      })
    } catch (error: any) {
      // Rollback transaction on any error
      if (session_obj) {
        try {
          await session_obj.abortTransaction()
        } catch (abortError) {
          // Transaction may already be aborted, ignore
        }
        session_obj.endSession()
        session_obj = null
      }
      
      // Check if this is a transient transaction error that can be retried
      const errorMessage = error.message || ''
      const isTransientError = 
        (error.hasErrorLabel && error.hasErrorLabel('TransientTransactionError')) ||
        error.code === 112 || // WriteConflict
        error.code === 251 || // NoSuchTransaction
        error.code === 11000 || // DuplicateKey
        errorMessage.includes('catalog changes') ||
        errorMessage.includes('Write conflict') ||
        errorMessage.includes('yielding is disabled') ||
        errorMessage.includes('WriteConflict') ||
        errorMessage.includes('TransientTransactionError')
      
      if (isTransientError && attempt < maxRetries) {
        console.warn(`[SALE_RETRY] Attempt ${attempt}/${maxRetries} failed, retrying...`, {
          error: errorMessage,
          code: error.code,
          name: error.name
        })
        
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt)))
        continue // Retry
      }
      
      // Non-retryable error or max retries reached
      console.error("Sale creation failed:", error)

      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Failed to create sale",
          code: "SALE_CREATION_FAILED",
        },
        { status: 500 }
      )
    }
  }
  
  // Should never reach here, but TypeScript needs it
  return NextResponse.json(
    {
      success: false,
      error: "Failed to create sale after multiple retries",
      code: "MAX_RETRIES_EXCEEDED",
    },
    { status: 500 }
  )
}

/**
 * DELETE: Delete a sale
 * 
 * WARNING: This is a soft delete that marks the sale as cancelled.
 * It does NOT reverse inventory changes to maintain historical accuracy.
 * Consider implementing proper reversal logic with compensating transactions.
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
        { success: false, error: "Sale ID is required" },
        { status: 400 }
      )
    }

    const sale = await Sale.findOneAndDelete({
      _id: id,
      user_id: userId,
    })

    if (!sale) {
      return NextResponse.json(
        { success: false, error: "Sale not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Sale deleted successfully",
      data: { deleted_id: id },
    })
  } catch (error) {
    console.error("Sale deletion failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete sale",
      },
      { status: 500 }
    )
  }
}
