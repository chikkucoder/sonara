/**
 * Sales Utility Functions
 * 
 * Comprehensive helper functions for the Sales module
 * Includes pricing calculations, invoice formatting, payment tracking,
 * customer management, and analytics.
 */

import { Types } from "mongoose"

// ============================================================================
// Type Definitions
// ============================================================================

export type GSTType = "INTRASTATE" | "INTERSTATE"
export type PaymentMode = "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | "CREDIT"
export type PaymentStatus = "PAID" | "UNPAID" | "PARTIAL"
export type SaleStatus = "COMPLETED" | "CANCELLED" | "RETURNED" | "EXCHANGE"
export type CustomerType = "B2C" | "B2B"
export type LoyaltyTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"

export interface ISaleItemInput {
  item_name: string
  category: string
  quantity: number
  weight?: number
  purity?: number
  gold_rate?: number
  making_charges?: number
  stone_charges?: number
  other_charges?: number
  discount_percentage?: number
  hsn_code?: string
  inventory_id?: string
}

export interface ISaleItemPricing {
  item_name: string
  category: string
  quantity: number
  weight: number
  purity: number
  gold_rate: number
  making_charges: number
  stone_charges: number
  other_charges: number
  base_price: number
  discount_percentage: number
  discount_amount: number
  taxable_amount: number
  cgst_percentage: number
  sgst_percentage: number
  igst_percentage: number
  cgst_amount: number
  sgst_amount: number
  igst_amount: number
  total_gst: number
  item_total: number
  hsn_code: string
  inventory_id?: Types.ObjectId
}

export interface ISaleTotals {
  total_items: number
  total_quantity: number
  total_weight: number
  total_base_price: number
  total_making_charges: number
  total_stone_charges: number
  total_other_charges: number
  total_discount_amount: number
  total_taxable_amount: number
  total_cgst: number
  total_sgst: number
  total_igst: number
  total_gst: number
  grand_total: number
}

export interface IPaymentBreakdown {
  payment_status: PaymentStatus
  amount_paid: number
  amount_pending: number
  payment_mode: PaymentMode[]
  payment_details: Array<{
    mode: PaymentMode
    amount: number
    transaction_id?: string
    payment_date: Date
  }>
}

// ============================================================================
// Pricing Calculation Functions
// ============================================================================

/**
 * Calculate detailed pricing for a single sale item
 * 
 * Formula:
 * 1. Base Price = (gold_rate × weight) + making_charges + stone_charges + other_charges
 * 2. Discount Amount = base_price × (discount_percentage / 100)
 * 3. Taxable Amount = base_price - discount_amount
 * 4. GST Calculation:
 *    - INTRASTATE: CGST = 1.5%, SGST = 1.5% (total 3%)
 *    - INTERSTATE: IGST = 3%
 * 5. Item Total = taxable_amount + total_gst
 */
export function calculateItemPricing(
  item: ISaleItemInput,
  gstType: GSTType
): ISaleItemPricing {
  // Default values
  const weight = item.weight || 0
  const purity = item.purity || 0
  const goldRate = item.gold_rate || 0
  const makingCharges = item.making_charges || 0
  const stoneCharges = item.stone_charges || 0
  const otherCharges = item.other_charges || 0
  const discountPercentage = item.discount_percentage || 0

  // Step 1: Calculate base price
  const metalValue = goldRate * weight
  const basePrice = metalValue + makingCharges + stoneCharges + otherCharges

  // Step 2: Calculate discount
  const discountAmount = (basePrice * discountPercentage) / 100

  // Step 3: Calculate taxable amount
  const taxableAmount = basePrice - discountAmount

  // Step 4: Calculate GST
  let cgstPercentage = 0
  let sgstPercentage = 0
  let igstPercentage = 0
  let cgstAmount = 0
  let sgstAmount = 0
  let igstAmount = 0

  if (gstType === "INTRASTATE") {
    cgstPercentage = 1.5
    sgstPercentage = 1.5
    cgstAmount = (taxableAmount * cgstPercentage) / 100
    sgstAmount = (taxableAmount * sgstPercentage) / 100
  } else {
    igstPercentage = 3.0
    igstAmount = (taxableAmount * igstPercentage) / 100
  }

  const totalGst = cgstAmount + sgstAmount + igstAmount

  // Step 5: Calculate item total
  const itemTotal = taxableAmount + totalGst

  return {
    item_name: item.item_name,
    category: item.category,
    quantity: item.quantity,
    weight,
    purity,
    gold_rate: goldRate,
    making_charges: makingCharges,
    stone_charges: stoneCharges,
    other_charges: otherCharges,
    base_price: parseFloat(basePrice.toFixed(2)),
    discount_percentage: discountPercentage,
    discount_amount: parseFloat(discountAmount.toFixed(2)),
    taxable_amount: parseFloat(taxableAmount.toFixed(2)),
    cgst_percentage: cgstPercentage,
    sgst_percentage: sgstPercentage,
    igst_percentage: igstPercentage,
    cgst_amount: parseFloat(cgstAmount.toFixed(2)),
    sgst_amount: parseFloat(sgstAmount.toFixed(2)),
    igst_amount: parseFloat(igstAmount.toFixed(2)),
    total_gst: parseFloat(totalGst.toFixed(2)),
    item_total: parseFloat(itemTotal.toFixed(2)),
    hsn_code: item.hsn_code || "7113",
    inventory_id: item.inventory_id ? new Types.ObjectId(item.inventory_id) : undefined,
  }
}

/**
 * Calculate totals for all items in a sale
 */
export function calculateSaleTotals(items: ISaleItemPricing[]): ISaleTotals {
  const totals: ISaleTotals = {
    total_items: items.length,
    total_quantity: 0,
    total_weight: 0,
    total_base_price: 0,
    total_making_charges: 0,
    total_stone_charges: 0,
    total_other_charges: 0,
    total_discount_amount: 0,
    total_taxable_amount: 0,
    total_cgst: 0,
    total_sgst: 0,
    total_igst: 0,
    total_gst: 0,
    grand_total: 0,
  }

  items.forEach(item => {
    totals.total_quantity += item.quantity
    totals.total_weight += item.weight
    totals.total_base_price += item.base_price
    totals.total_making_charges += item.making_charges
    totals.total_stone_charges += item.stone_charges
    totals.total_other_charges += item.other_charges
    totals.total_discount_amount += item.discount_amount
    totals.total_taxable_amount += item.taxable_amount
    totals.total_cgst += item.cgst_amount
    totals.total_sgst += item.sgst_amount
    totals.total_igst += item.igst_amount
    totals.total_gst += item.total_gst
    totals.grand_total += item.item_total
  })

  // Round all totals to 2 decimal places
  Object.keys(totals).forEach(key => {
    if (typeof totals[key as keyof ISaleTotals] === "number") {
      totals[key as keyof ISaleTotals] = parseFloat(
        (totals[key as keyof ISaleTotals] as number).toFixed(2)
      )
    }
  })

  return totals
}

/**
 * Calculate loyalty discount based on customer tier
 */
export function calculateLoyaltyDiscount(
  tier: LoyaltyTier,
  baseAmount: number
): number {
  const discountPercentages: Record<LoyaltyTier, number> = {
    BRONZE: 0,
    SILVER: 2,
    GOLD: 5,
    PLATINUM: 10,
  }

  const discountPercentage = discountPercentages[tier] || 0
  return parseFloat(((baseAmount * discountPercentage) / 100).toFixed(2))
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate Indian phone number
 * Format: 10 digits starting with 6-9
 */
export function validateIndianPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate GST number
 * Format: 22AAAAA0000A1Z5 (2 digits state code + 10 chars PAN + 1 char entity + 1 char Z + 1 check digit)
 */
export function validateGSTNumber(gst: string): boolean {
  const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/
  return gstRegex.test(gst)
}

/**
 * Validate PAN number
 * Format: AAAAA0000A (5 chars + 4 digits + 1 char)
 */
export function validatePANNumber(pan: string): boolean {
  const panRegex = /^[A-Z]{5}\d{4}[A-Z]{1}$/
  return panRegex.test(pan)
}

/**
 * Validate pincode
 * Format: 6 digits
 */
export function validatePincode(pincode: string): boolean {
  const pincodeRegex = /^\d{6}$/
  return pincodeRegex.test(pincode)
}

/**
 * Validate discount percentage
 */
export function validateDiscount(discount: number, maxDiscount: number = 50): boolean {
  return discount >= 0 && discount <= maxDiscount
}

/**
 * Validate quantity
 */
export function validateQuantity(quantity: number): boolean {
  return quantity > 0 && Number.isInteger(quantity)
}

/**
 * Validate weight (in grams)
 */
export function validateWeight(weight: number): boolean {
  return weight > 0 && weight <= 10000 // Max 10kg per item
}

/**
 * Validate purity (in percentage or fineness)
 */
export function validatePurity(purity: number, isPurity: boolean = true): boolean {
  if (isPurity) {
    return purity > 0 && purity <= 100 // Percentage
  }
  return purity >= 333 && purity <= 999 // Fineness (8K to 24K)
}

/**
 * Validate gold rate
 */
export function validateGoldRate(rate: number): boolean {
  return rate > 0 && rate <= 100000 // Max ₹1,00,000 per gram
}

// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Format amount in INR currency
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
 */
export function formatWeight(weight: number): string {
  return `${weight.toFixed(3)}g`
}

/**
 * Format date in Indian format (DD/MM/YYYY)
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

/**
 * Format invoice number with padding
 */
export function formatInvoiceNumber(counter: number): string {
  return counter.toString().padStart(4, "0")
}

/**
 * Normalize phone number (remove spaces, dashes, +91)
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-+]/g, "").replace(/^91/, "")
}

// ============================================================================
// Conversion Functions
// ============================================================================

/**
 * Convert karat to fineness
 * e.g., 22K = 916, 18K = 750, 14K = 585
 */
export function karatToFineness(karat: number): number {
  return Math.round((karat / 24) * 1000)
}

/**
 * Convert fineness to karat
 * e.g., 916 = 22K, 750 = 18K, 585 = 14K
 */
export function finenessoKarat(fineness: number): number {
  return parseFloat(((fineness / 1000) * 24).toFixed(2))
}

/**
 * Convert grams to other units
 */
export function convertWeight(
  weight: number,
  toUnit: "kg" | "mg" | "tola" | "oz"
): number {
  const conversions = {
    kg: weight / 1000,
    mg: weight * 1000,
    tola: weight / 11.664, // 1 tola = 11.664 grams
    oz: weight / 28.3495, // 1 oz = 28.3495 grams
  }
  return parseFloat(conversions[toUnit].toFixed(4))
}

// ============================================================================
// Payment Tracking Functions
// ============================================================================

/**
 * Calculate payment status based on amount paid and grand total
 */
export function calculatePaymentStatus(
  amountPaid: number,
  grandTotal: number
): PaymentStatus {
  if (amountPaid === 0) return "UNPAID"
  if (amountPaid >= grandTotal) return "PAID"
  return "PARTIAL"
}

/**
 * Calculate payment breakdown
 */
export function calculatePaymentBreakdown(
  amountPaid: number,
  grandTotal: number,
  paymentDetails: Array<{
    mode: PaymentMode
    amount: number
    transaction_id?: string
    payment_date: Date
  }>
): IPaymentBreakdown {
  const paymentStatus = calculatePaymentStatus(amountPaid, grandTotal)
  const amountPending = Math.max(0, grandTotal - amountPaid)
  const paymentModes = [...new Set(paymentDetails.map(p => p.mode))]

  return {
    payment_status: paymentStatus,
    amount_paid: parseFloat(amountPaid.toFixed(2)),
    amount_pending: parseFloat(amountPending.toFixed(2)),
    payment_mode: paymentModes,
    payment_details: paymentDetails,
  }
}

/**
 * Validate payment details
 */
export function validatePayment(
  paymentDetails: Array<{ mode: PaymentMode; amount: number }>,
  grandTotal: number
): { valid: boolean; error?: string } {
  const totalPaid = paymentDetails.reduce((sum, p) => sum + p.amount, 0)

  if (totalPaid > grandTotal) {
    return {
      valid: false,
      error: `Total payment (${formatINR(totalPaid)}) exceeds grand total (${formatINR(grandTotal)})`,
    }
  }

  for (const payment of paymentDetails) {
    if (payment.amount <= 0) {
      return {
        valid: false,
        error: `Invalid payment amount for ${payment.mode}`,
      }
    }
  }

  return { valid: true }
}

// ============================================================================
// Analytics & Reporting Functions
// ============================================================================

/**
 * Generate sale summary
 */
export function generateSaleSummary(sale: any): string {
  const lines = [
    `Invoice: ${sale.invoice_number}`,
    `Date: ${formatDate(sale.sale_date)}`,
    `Customer: ${sale.customer_name} (${sale.customer_phone})`,
    `Items: ${sale.items.length}`,
    `Total Weight: ${formatWeight(sale.total_weight)}`,
    `Grand Total: ${formatINR(sale.grand_total)}`,
    `Payment Status: ${sale.payment_status}`,
  ]

  if (sale.payment_status !== "PAID") {
    lines.push(`Amount Pending: ${formatINR(sale.amount_pending)}`)
  }

  return lines.join("\n")
}

/**
 * Calculate customer lifetime value (CLV)
 */
export function calculateCustomerLTV(
  totalPurchases: number,
  totalPurchaseValue: number,
  averageOrderValue?: number
): number {
  const aov = averageOrderValue || (totalPurchaseValue / totalPurchases || 0)
  const estimatedLifetimeOrders = totalPurchases * 2 // Simple estimation
  return parseFloat((aov * estimatedLifetimeOrders).toFixed(2))
}

/**
 * Determine loyalty tier based on total purchase value
 */
export function determineLoyaltyTier(totalPurchaseValue: number): LoyaltyTier {
  if (totalPurchaseValue >= 1000000) return "PLATINUM" // ₹10L+
  if (totalPurchaseValue >= 500000) return "GOLD"      // ₹5L+
  if (totalPurchaseValue >= 200000) return "SILVER"    // ₹2L+
  return "BRONZE"                                      // < ₹2L
}

/**
 * Calculate sales metrics for a period
 */
export interface ISalesMetrics {
  total_sales: number
  total_revenue: number
  average_order_value: number
  total_items_sold: number
  total_weight_sold: number
  total_discount_given: number
  total_gst_collected: number
  payment_status_breakdown: Record<PaymentStatus, number>
  payment_mode_breakdown: Record<PaymentMode, number>
}

export function calculateSalesMetrics(sales: any[]): ISalesMetrics {
  const metrics: ISalesMetrics = {
    total_sales: sales.length,
    total_revenue: 0,
    average_order_value: 0,
    total_items_sold: 0,
    total_weight_sold: 0,
    total_discount_given: 0,
    total_gst_collected: 0,
    payment_status_breakdown: { PAID: 0, UNPAID: 0, PARTIAL: 0 },
    payment_mode_breakdown: {
      CASH: 0,
      CARD: 0,
      UPI: 0,
      BANK_TRANSFER: 0,
      CHEQUE: 0,
      CREDIT: 0,
    },
  }

  sales.forEach(sale => {
    metrics.total_revenue += sale.grand_total || 0
    metrics.total_items_sold += sale.items?.length || 0
    metrics.total_weight_sold += sale.total_weight || 0
    metrics.total_discount_given += sale.total_discount_amount || 0
    metrics.total_gst_collected += sale.total_gst || 0

    // Payment status breakdown
    if (sale.payment_status) {
      metrics.payment_status_breakdown[sale.payment_status as PaymentStatus]++
    }

    // Payment mode breakdown
    if (sale.payment_mode && Array.isArray(sale.payment_mode)) {
      sale.payment_mode.forEach((mode: PaymentMode) => {
        metrics.payment_mode_breakdown[mode]++
      })
    }
  })

  metrics.average_order_value = metrics.total_sales > 0
    ? parseFloat((metrics.total_revenue / metrics.total_sales).toFixed(2))
    : 0

  return metrics
}

// ============================================================================
// Inventory Integration Functions
// ============================================================================

/**
 * Check if sufficient inventory is available for sale
 */
export function checkInventoryAvailability(
  requestedQuantity: number,
  availableQuantity: number,
  reservedQuantity: number = 0
): { available: boolean; shortage: number } {
  const actualAvailable = availableQuantity - reservedQuantity
  const shortage = Math.max(0, requestedQuantity - actualAvailable)

  return {
    available: shortage === 0,
    shortage,
  }
}

/**
 * Calculate inventory turnover rate
 */
export function calculateInventoryTurnover(
  totalSales: number,
  averageInventory: number
): number {
  if (averageInventory === 0) return 0
  return parseFloat((totalSales / averageInventory).toFixed(2))
}

// ============================================================================
// Export all utilities
// ============================================================================

export default {
  // Pricing
  calculateItemPricing,
  calculateSaleTotals,
  calculateLoyaltyDiscount,

  // Validation
  validateIndianPhone,
  validateEmail,
  validateGSTNumber,
  validatePANNumber,
  validatePincode,
  validateDiscount,
  validateQuantity,
  validateWeight,
  validatePurity,
  validateGoldRate,

  // Formatting
  formatINR,
  formatWeight,
  formatDate,
  formatInvoiceNumber,
  normalizePhone,

  // Conversion
  karatToFineness,
  finenessoKarat,
  convertWeight,

  // Payment
  calculatePaymentStatus,
  calculatePaymentBreakdown,
  validatePayment,

  // Analytics
  generateSaleSummary,
  calculateCustomerLTV,
  determineLoyaltyTier,
  calculateSalesMetrics,

  // Inventory
  checkInventoryAvailability,
  calculateInventoryTurnover,
}
