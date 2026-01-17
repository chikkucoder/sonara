/**
 * Purchase Utility Functions
 * 
 * Helper functions for purchase-related operations
 * These can be imported and used across the application
 */

/**
 * Calculate GST amounts based on subtotal and GST rate
 * 
 * @param subtotal - Amount before GST
 * @param gstRate - GST percentage (0, 3, 5, 12, 18, 28)
 * @param gstType - "INTRASTATE" or "INTERSTATE"
 * @returns Object with GST breakdown
 */
export function calculateGST(
  subtotal: number,
  gstRate: number,
  gstType: "INTRASTATE" | "INTERSTATE"
) {
  const validGSTRates = [0, 3, 5, 12, 18, 28]
  
  if (!validGSTRates.includes(gstRate)) {
    throw new Error(`Invalid GST rate: ${gstRate}. Must be one of ${validGSTRates.join(", ")}`)
  }

  if (gstType === "INTRASTATE") {
    const halfRate = gstRate / 2
    const cgstAmount = Number(((subtotal * halfRate) / 100).toFixed(2))
    const sgstAmount = Number(((subtotal * halfRate) / 100).toFixed(2))
    const totalGST = Number((cgstAmount + sgstAmount).toFixed(2))

    return {
      cgst_amount: cgstAmount,
      sgst_amount: sgstAmount,
      igst_amount: 0,
      total_gst: totalGST,
      total_amount: Number((subtotal + totalGST).toFixed(2)),
    }
  } else {
    const igstAmount = Number(((subtotal * gstRate) / 100).toFixed(2))

    return {
      cgst_amount: 0,
      sgst_amount: 0,
      igst_amount: igstAmount,
      total_gst: igstAmount,
      total_amount: Number((subtotal + igstAmount).toFixed(2)),
    }
  }
}

/**
 * Determine payment status based on amounts paid and total
 * 
 * @param amountPaid - Amount already paid
 * @param totalAmount - Total amount to be paid
 * @returns Payment status: "PAID", "UNPAID", or "PARTIAL"
 */
export function determinePaymentStatus(
  amountPaid: number,
  totalAmount: number
): "PAID" | "UNPAID" | "PARTIAL" {
  if (amountPaid <= 0) {
    return "UNPAID"
  } else if (amountPaid >= totalAmount) {
    return "PAID"
  } else {
    return "PARTIAL"
  }
}

/**
 * Calculate pending amount
 * 
 * @param totalAmount - Total amount to be paid
 * @param amountPaid - Amount already paid
 * @returns Pending amount (never negative)
 */
export function calculatePendingAmount(
  totalAmount: number,
  amountPaid: number
): number {
  const pending = totalAmount - amountPaid
  return Math.max(0, Number(pending.toFixed(2)))
}

/**
 * Validate Indian phone number
 * 
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function validateIndianPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\s/g, "")
  return /^[6-9]\d{9}$/.test(cleanPhone)
}

/**
 * Validate GST number
 * 
 * @param gst - GST number to validate
 * @returns true if valid, false otherwise
 */
export function validateGSTNumber(gst: string): boolean {
  if (!gst) return false
  const cleanGST = gst.toUpperCase().replace(/\s/g, "")
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(cleanGST)
}

/**
 * Validate PAN number
 * 
 * @param pan - PAN number to validate
 * @returns true if valid, false otherwise
 */
export function validatePANNumber(pan: string): boolean {
  if (!pan) return false
  const cleanPAN = pan.toUpperCase().replace(/\s/g, "")
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPAN)
}

/**
 * Validate email address
 * 
 * @param email - Email to validate
 * @returns true if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (!email) return false
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

/**
 * Validate Indian pincode
 * 
 * @param pincode - Pincode to validate
 * @returns true if valid, false otherwise
 */
export function validatePincode(pincode: string): boolean {
  if (!pincode) return false
  return /^\d{6}$/.test(pincode)
}

/**
 * Format currency in Indian Rupees
 * 
 * @param amount - Amount to format
 * @returns Formatted string (e.g., "₹1,23,456.78")
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format weight in grams
 * 
 * @param weight - Weight in grams
 * @returns Formatted string (e.g., "15.50 g")
 */
export function formatWeight(weight: number): string {
  return `${weight.toFixed(2)} g`
}

/**
 * Calculate subtotal from quantity and rate
 * 
 * @param quantity - Quantity of items
 * @param rate - Rate per unit
 * @returns Subtotal amount
 */
export function calculateSubtotal(quantity: number, rate: number): number {
  return Number((quantity * rate).toFixed(2))
}

/**
 * Calculate subtotal from weight and rate (for precious metals)
 * 
 * @param weight - Weight in grams
 * @param ratePerGram - Rate per gram
 * @returns Subtotal amount
 */
export function calculateSubtotalByWeight(
  weight: number,
  ratePerGram: number
): number {
  return Number((weight * ratePerGram).toFixed(2))
}

/**
 * Generate purchase summary text
 * 
 * @param purchase - Purchase object
 * @returns Human-readable summary
 */
export function generatePurchaseSummary(purchase: any): string {
  const lines: string[] = []
  
  lines.push(`Purchase Reference: ${purchase.purchase_reference}`)
  lines.push(`Supplier: ${purchase.supplier_name} (${purchase.supplier_phone})`)
  lines.push(`Item: ${purchase.item_name} x ${purchase.quantity}`)
  
  if (purchase.weight && purchase.purity) {
    lines.push(`Weight: ${formatWeight(purchase.weight)} (${purchase.purity})`)
  }
  
  lines.push(`Subtotal: ${formatINR(purchase.subtotal)}`)
  lines.push(`GST (${purchase.gst_rate}%): ${formatINR(purchase.total_gst)}`)
  lines.push(`Total: ${formatINR(purchase.total_amount)}`)
  lines.push(`Paid: ${formatINR(purchase.amount_paid)}`)
  
  if (purchase.amount_pending > 0) {
    lines.push(`Pending: ${formatINR(purchase.amount_pending)}`)
  }
  
  lines.push(`Status: ${purchase.payment_status}`)
  
  return lines.join("\n")
}

/**
 * Parse purity string to numeric value (for sorting/comparison)
 * 
 * @param purity - Purity string (e.g., "22K", "916", "999")
 * @returns Numeric value
 */
export function parsePurity(purity: string): number {
  if (!purity) return 0
  
  const upperPurity = purity.toUpperCase().trim()
  
  // Handle karat format (22K, 24K, etc.)
  if (upperPurity.endsWith("K")) {
    const karat = parseFloat(upperPurity)
    return karat
  }
  
  // Handle fineness format (916, 999, 925, etc.)
  return parseFloat(upperPurity)
}

/**
 * Convert karat to fineness
 * 
 * @param karat - Karat value (e.g., 22)
 * @returns Fineness value (e.g., 916)
 */
export function karatToFineness(karat: number): number {
  return Number(((karat / 24) * 1000).toFixed(0))
}

/**
 * Convert fineness to karat
 * 
 * @param fineness - Fineness value (e.g., 916)
 * @returns Karat value (e.g., 22)
 */
export function finenessToKarat(fineness: number): number {
  return Number(((fineness / 1000) * 24).toFixed(2))
}

/**
 * Check if stock is below minimum level
 * 
 * @param currentStock - Current stock quantity
 * @param minStockLevel - Minimum stock level threshold
 * @returns true if below minimum, false otherwise
 */
export function isLowStock(
  currentStock: number,
  minStockLevel?: number
): boolean {
  if (!minStockLevel) return false
  return currentStock <= minStockLevel
}

/**
 * Calculate metal value in rupees
 * 
 * @param weight - Weight in grams
 * @param ratePerGram - Rate per gram in rupees
 * @returns Total value
 */
export function calculateMetalValue(
  weight: number,
  ratePerGram: number
): number {
  return Number((weight * ratePerGram).toFixed(2))
}

/**
 * Get payment mode display name
 * 
 * @param paymentMode - Payment mode code
 * @returns Human-readable payment mode
 */
export function getPaymentModeDisplay(paymentMode: string): string {
  const modes: { [key: string]: string } = {
    CASH: "Cash",
    UPI: "UPI",
    BANK_TRANSFER: "Bank Transfer",
    CHEQUE: "Cheque",
    CREDIT: "Credit",
    DEBIT_CARD: "Debit Card",
    CREDIT_CARD: "Credit Card",
  }
  
  return modes[paymentMode] || paymentMode
}

/**
 * Get payment status badge color
 * 
 * @param status - Payment status
 * @returns Tailwind color class
 */
export function getPaymentStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    PAID: "green",
    UNPAID: "red",
    PARTIAL: "yellow",
  }
  
  return colors[status] || "gray"
}

/**
 * Get metal type display name
 * 
 * @param metalType - Metal type code
 * @returns Human-readable metal type
 */
export function getMetalTypeDisplay(metalType: string): string {
  const metals: { [key: string]: string } = {
    GOLD: "Gold",
    SILVER: "Silver",
    PLATINUM: "Platinum",
    DIAMOND: "Diamond",
  }
  
  return metals[metalType] || metalType
}

/**
 * Batch calculate GST for multiple items
 * 
 * @param items - Array of items with subtotal and gst_rate
 * @param gstType - GST type for all items
 * @returns Total GST breakdown
 */
export function calculateBatchGST(
  items: Array<{ subtotal: number; gst_rate: number }>,
  gstType: "INTRASTATE" | "INTERSTATE"
) {
  let totalCGST = 0
  let totalSGST = 0
  let totalIGST = 0
  let grandTotal = 0
  let grandSubtotal = 0

  for (const item of items) {
    const gst = calculateGST(item.subtotal, item.gst_rate, gstType)
    totalCGST += gst.cgst_amount
    totalSGST += gst.sgst_amount
    totalIGST += gst.igst_amount
    grandTotal += gst.total_amount
    grandSubtotal += item.subtotal
  }

  return {
    cgst_amount: Number(totalCGST.toFixed(2)),
    sgst_amount: Number(totalSGST.toFixed(2)),
    igst_amount: Number(totalIGST.toFixed(2)),
    total_gst: Number((totalCGST + totalSGST + totalIGST).toFixed(2)),
    subtotal: Number(grandSubtotal.toFixed(2)),
    total_amount: Number(grandTotal.toFixed(2)),
  }
}

/**
 * Type definitions for better TypeScript support
 */
export interface PurchaseItem {
  item_name: string
  category: string
  quantity: number
  rate_per_unit: number
  weight?: number
  purity?: string
  metal_type?: string
}

export interface GSTCalculation {
  cgst_amount: number
  sgst_amount: number
  igst_amount: number
  total_gst: number
  total_amount: number
}

export interface PaymentInfo {
  payment_status: "PAID" | "UNPAID" | "PARTIAL"
  amount_paid: number
  amount_pending: number
  payment_mode: string
  payment_date?: Date
  payment_reference?: string
}
