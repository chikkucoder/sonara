/**
 * Sales Utilities - Optimized Pricing & Validation
 * 
 * High-performance helpers for sale processing
 * - Price calculations with precision
 * - Validation with detailed error messages
 * - Batch operations support
 */

import Decimal from 'decimal.js'

// Configure decimal precision (prevents floating point errors)
Decimal.set({ precision: 10, rounding: Decimal.ROUND_HALF_UP })

/**
 * Item Pricing Result Interface
 */
export interface ItemPricing {
  base_price: number
  discount_amount: number
  taxable_amount: number
  cgst_amount: number
  sgst_amount: number
  igst_amount: number
  total_gst: number
  item_total: number
}

/**
 * Calculate detailed pricing for a single item
 * Uses Decimal.js to avoid floating-point precision errors
 * 
 * @param item - Item data with pricing components
 * @param gstType - INTRASTATE or INTERSTATE
 * @returns Detailed pricing breakdown
 */
export function calculateItemPricing(
  item: {
    weight?: number
    gold_rate?: number
    making_charges?: number
    stone_charges?: number
    base_price?: number
    discount_percentage?: number
    gst_rate: number
  },
  gstType: 'INTRASTATE' | 'INTERSTATE'
): ItemPricing {
  // Step 1: Calculate base price
  let basePrice: Decimal
  
  if (item.weight && item.gold_rate) {
    // For metal items: weight × rate + making + stone
    const metalValue = new Decimal(item.weight).times(item.gold_rate)
    const making = new Decimal(item.making_charges || 0)
    const stone = new Decimal(item.stone_charges || 0)
    basePrice = metalValue.plus(making).plus(stone)
  } else {
    // For non-metal items: making + stone
    const making = new Decimal(item.making_charges || 0)
    const stone = new Decimal(item.stone_charges || 0)
    basePrice = item.base_price ? new Decimal(item.base_price) : making.plus(stone)
  }

  // Step 2: Calculate discount
  const discountPercentage = new Decimal(item.discount_percentage || 0)
  const discountAmount = basePrice.times(discountPercentage).dividedBy(100)

  // Step 3: Calculate taxable amount (after discount)
  const taxableAmount = basePrice.minus(discountAmount)

  // Step 4: Calculate GST
  const gstRate = new Decimal(item.gst_rate)
  let cgstAmount = new Decimal(0)
  let sgstAmount = new Decimal(0)
  let igstAmount = new Decimal(0)

  if (gstType === 'INTRASTATE') {
    // Split GST into CGST and SGST (half each)
    cgstAmount = taxableAmount.times(gstRate).dividedBy(200)
    sgstAmount = taxableAmount.times(gstRate).dividedBy(200)
  } else {
    // INTERSTATE: Full GST as IGST
    igstAmount = taxableAmount.times(gstRate).dividedBy(100)
  }

  const totalGst = cgstAmount.plus(sgstAmount).plus(igstAmount)

  // Step 5: Calculate final item total
  const itemTotal = taxableAmount.plus(totalGst)

  // Return all values as numbers (rounded to 2 decimals)
  return {
    base_price: basePrice.toDecimalPlaces(2).toNumber(),
    discount_amount: discountAmount.toDecimalPlaces(2).toNumber(),
    taxable_amount: taxableAmount.toDecimalPlaces(2).toNumber(),
    cgst_amount: cgstAmount.toDecimalPlaces(2).toNumber(),
    sgst_amount: sgstAmount.toDecimalPlaces(2).toNumber(),
    igst_amount: igstAmount.toDecimalPlaces(2).toNumber(),
    total_gst: totalGst.toDecimalPlaces(2).toNumber(),
    item_total: itemTotal.toDecimalPlaces(2).toNumber(),
  }
}

/**
 * Batch calculate pricing for multiple items
 * More efficient than calculating one by one
 * 
 * @param items - Array of items
 * @param gstType - GST type
 * @returns Array of pricing results
 */
export function batchCalculateItemPricing(
  items: Array<{
    weight?: number
    gold_rate?: number
    making_charges?: number
    stone_charges?: number
    discount_percentage?: number
    gst_rate: number
  }>,
  gstType: 'INTRASTATE' | 'INTERSTATE'
): ItemPricing[] {
  return items.map(item => calculateItemPricing(item, gstType))
}

/**
 * Calculate sale totals from processed items
 * 
 * @param pricedItems - Items with calculated pricing
 * @returns Aggregated totals
 */
export function calculateSaleTotals(
  pricedItems: Array<{
    base_price: number
    making_charges?: number
    stone_charges?: number
    discount_amount: number
    taxable_amount: number
    cgst_amount: number
    sgst_amount: number
    igst_amount: number
    total_gst: number
    item_total: number
  }>
) {
  let totalBasePrice = new Decimal(0)
  let totalMakingCharges = new Decimal(0)
  let totalStoneCharges = new Decimal(0)
  let totalDiscountAmount = new Decimal(0)
  let totalTaxableAmount = new Decimal(0)
  let totalCGST = new Decimal(0)
  let totalSGST = new Decimal(0)
  let totalIGST = new Decimal(0)
  let totalGST = new Decimal(0)
  let grandTotal = new Decimal(0)

  for (const item of pricedItems) {
    totalBasePrice = totalBasePrice.plus(item.base_price)
    totalMakingCharges = totalMakingCharges.plus(item.making_charges || 0)
    totalStoneCharges = totalStoneCharges.plus(item.stone_charges || 0)
    totalDiscountAmount = totalDiscountAmount.plus(item.discount_amount)
    totalTaxableAmount = totalTaxableAmount.plus(item.taxable_amount)
    totalCGST = totalCGST.plus(item.cgst_amount)
    totalSGST = totalSGST.plus(item.sgst_amount)
    totalIGST = totalIGST.plus(item.igst_amount)
    totalGST = totalGST.plus(item.total_gst)
    grandTotal = grandTotal.plus(item.item_total)
  }

  return {
    total_base_price: totalBasePrice.toDecimalPlaces(2).toNumber(),
    total_making_charges: totalMakingCharges.toDecimalPlaces(2).toNumber(),
    total_stone_charges: totalStoneCharges.toDecimalPlaces(2).toNumber(),
    total_discount_amount: totalDiscountAmount.toDecimalPlaces(2).toNumber(),
    total_taxable_amount: totalTaxableAmount.toDecimalPlaces(2).toNumber(),
    total_cgst: totalCGST.toDecimalPlaces(2).toNumber(),
    total_sgst: totalSGST.toDecimalPlaces(2).toNumber(),
    total_igst: totalIGST.toDecimalPlaces(2).toNumber(),
    total_gst: totalGST.toDecimalPlaces(2).toNumber(),
    grand_total: grandTotal.toDecimalPlaces(2).toNumber(),
  }
}

/**
 * Validation Error Interface
 */
export interface ValidationError {
  field: string
  message: string
}

/**
 * Validate sale data with detailed error reporting
 * 
 * @param data - Sale request data
 * @returns Validation result
 */
export function validateSaleData(data: any): {
  isValid: boolean
  errors: ValidationError[]
} {
  const errors: ValidationError[] = []

  // Customer validation
  if (!data.customer_name || typeof data.customer_name !== 'string') {
    errors.push({
      field: 'customer_name',
      message: 'Customer name is required',
    })
  } else if (data.customer_name.trim().length < 2) {
    errors.push({
      field: 'customer_name',
      message: 'Customer name must be at least 2 characters',
    })
  } else if (data.customer_name.trim().length > 100) {
    errors.push({
      field: 'customer_name',
      message: 'Customer name cannot exceed 100 characters',
    })
  }

  if (!data.customer_phone) {
    errors.push({
      field: 'customer_phone',
      message: 'Customer phone number is required',
    })
  } else {
    const phoneRegex = /^[6-9]\d{9}$/
    const cleanPhone = data.customer_phone.replace(/\s/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      errors.push({
        field: 'customer_phone',
        message: 'Invalid phone number. Must be 10 digits starting with 6-9',
      })
    }
  }

  // Customer type validation
  if (data.customer_type && !['B2C', 'B2B'].includes(data.customer_type)) {
    errors.push({
      field: 'customer_type',
      message: 'Customer type must be B2C or B2B',
    })
  }

  // GST number validation for B2B
  if (data.customer_type === 'B2B' && data.customer_gst) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    if (!gstRegex.test(data.customer_gst)) {
      errors.push({
        field: 'customer_gst',
        message: 'Invalid GST number format',
      })
    }
  }

  // Items validation
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push({
      field: 'items',
      message: 'At least one item is required',
    })
  } else {
    data.items.forEach((item: any, index: number) => {
      const prefix = `items[${index}]`

      if (!item.inventory_id) {
        errors.push({
          field: `${prefix}.inventory_id`,
          message: 'Inventory ID is required',
        })
      }

      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push({
          field: `${prefix}.quantity`,
          message: 'Quantity must be greater than 0',
        })
      }

      if (item.discount_percentage !== undefined) {
        if (typeof item.discount_percentage !== 'number' ||
            item.discount_percentage < 0 ||
            item.discount_percentage > 100) {
          errors.push({
            field: `${prefix}.discount_percentage`,
            message: 'Discount must be between 0 and 100',
          })
        }
      }

      if (item.gst_rate === undefined || item.gst_rate === null) {
        errors.push({
          field: `${prefix}.gst_rate`,
          message: 'GST rate is required',
        })
      } else if (typeof item.gst_rate !== 'number' || item.gst_rate < 0 || item.gst_rate > 28) {
        errors.push({
          field: `${prefix}.gst_rate`,
          message: 'GST rate must be between 0 and 28',
        })
      }
    })
  }

  // GST type validation
  if (!data.gst_type || !['INTRASTATE', 'INTERSTATE'].includes(data.gst_type)) {
    errors.push({
      field: 'gst_type',
      message: 'GST type is required and must be INTRASTATE or INTERSTATE',
    })
  }

  // Payment validation
  if (!data.payment_mode) {
    errors.push({
      field: 'payment_mode',
      message: 'Payment mode is required',
    })
  } else if (!['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CHEQUE', 'CREDIT'].includes(data.payment_mode)) {
    errors.push({
      field: 'payment_mode',
      message: 'Invalid payment mode',
    })
  }

  if (data.amount_paid !== undefined && data.amount_paid < 0) {
    errors.push({
      field: 'amount_paid',
      message: 'Amount paid cannot be negative',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Check inventory availability for sale items
 * Returns items that are out of stock or insufficient
 * 
 * @param items - Items to check
 * @param inventoryData - Current inventory state
 * @returns Out of stock items
 */
export function checkInventoryAvailability(
  items: Array<{ inventory_id: string; quantity: number; item_name: string }>,
  inventoryData: Array<{ _id: string; available_quantity: number; item_name: string }>
): Array<{ item_name: string; requested: number; available: number }> {
  const unavailable: Array<{ item_name: string; requested: number; available: number }> = []

  for (const item of items) {
    const inventoryItem = inventoryData.find(inv => inv._id.toString() === item.inventory_id)
    
    if (!inventoryItem) {
      unavailable.push({
        item_name: item.item_name,
        requested: item.quantity,
        available: 0,
      })
    } else if (inventoryItem.available_quantity < item.quantity) {
      unavailable.push({
        item_name: inventoryItem.item_name,
        requested: item.quantity,
        available: inventoryItem.available_quantity,
      })
    }
  }

  return unavailable
}

/**
 * Generate invoice number with retry logic
 * Format: INV-YYYYMMDD-XXXX
 * 
 * @param userId - User ID
 * @param SaleModel - Sale mongoose model
 * @param maxRetries - Maximum retry attempts
 * @returns Unique invoice number
 */
export async function generateInvoiceNumber(
  userId: string,
  SaleModel: any,
  maxRetries: number = 3
): Promise<string> {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Find last invoice for today
    const lastSale = await SaleModel.findOne({
      user_id: userId,
      invoice_number: new RegExp(`^INV-${dateStr}-`),
    })
      .sort({ invoice_number: -1 })
      .select('invoice_number')
      .lean()

    let sequenceNumber = 1
    if (lastSale && lastSale.invoice_number) {
      const lastSequence = parseInt(lastSale.invoice_number.slice(-4))
      sequenceNumber = lastSequence + 1
    }

    const sequenceStr = sequenceNumber.toString().padStart(4, '0')
    const invoiceNumber = `INV-${dateStr}-${sequenceStr}`

    // Check if this number already exists (race condition)
    const exists = await SaleModel.exists({ invoice_number: invoiceNumber })
    
    if (!exists) {
      return invoiceNumber
    }

    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)))
  }

  // Fallback: Use timestamp
  const timestamp = Date.now().toString().slice(-4)
  return `INV-${dateStr}-${timestamp}`
}

/**
 * Format currency for Indian Rupee
 * 
 * @param amount - Amount to format
 * @returns Formatted string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Sanitize customer input to prevent injection
 * 
 * @param data - Raw customer data
 * @returns Sanitized data
 */
export function sanitizeCustomerData(data: any) {
  return {
    name: data.name?.toString().trim().substring(0, 100) || '',
    phone: data.phone?.toString().replace(/\D/g, '').substring(0, 10) || '',
    email: data.email?.toString().toLowerCase().trim().substring(0, 100) || undefined,
    address: data.address?.toString().trim().substring(0, 500) || undefined,
    city: data.city?.toString().trim().substring(0, 100) || undefined,
    state: data.state?.toString().trim().substring(0, 100) || undefined,
    pincode: data.pincode?.toString().replace(/\D/g, '').substring(0, 6) || undefined,
  }
}
