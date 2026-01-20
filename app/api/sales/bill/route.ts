import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Sale from "@/lib/models/Sale"
import User from "@/lib/models/User"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(request.url)
    const saleId = searchParams.get("id")

    if (!saleId) {
      return NextResponse.json({ error: "Sale ID required" }, { status: 400 })
    }

    await dbConnect()

    const sale = await Sale.findOne({ _id: saleId, user_id: userId }).lean() as any
    const user = await User.findById(userId).select('shop_name shop_address phone email gst_no').lean() as any

    if (!sale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 })
    }

    // Fetch customer details for address
    const Customer = (await import('@/lib/models/Customer')).default
    const customer = await Customer.findById(sale.customer_id).select('address city state pincode business_name contact_person').lean() as any

    // Map sale data to bill format
    const billData = {
      invoice_no: sale.invoice_number,
      sale_date: sale.invoice_date || sale.created_at,
      sale_type: sale.customer_type?.toLowerCase() || 'b2c',
      customer_name: sale.customer_name,
      customer_phone: sale.customer_phone,
      customer_address: customer?.address || '',
      business_name: customer?.business_name || sale.customer_name,
      contact_person: customer?.contact_person || '',
      gst_no: sale.customer_gst || '',
      business_phone: sale.customer_phone,
      business_address: customer?.address || '',
      payment_terms: sale.payment_terms,
      due_date: sale.due_date,
      items: sale.items.map((item: any) => ({
        item_name: item.item_name,
        purity: item.purity,
        gross_weight: item.gross_weight,
        weight: item.weight,
        quantity: item.quantity,
        rate: item.base_price / item.quantity || 0,
        making_charges: item.making_charges,
        amount: item.item_total
      })),
      subtotal: sale.total_base_price,
      discount: sale.total_discount_amount,
      gst: sale.total_gst,
      total: sale.grand_total,
      amount_paid: sale.amount_paid || 0,
      amount_pending: sale.amount_pending || 0,
      payment_method: sale.payment_mode,
      payment_status: sale.payment_status || 'UNPAID',
      warranty_years: sale.warranty_years || 0
    }

    // Generate bill HTML
    const billHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${sale.invoice_no}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .shop-name { 
      font-size: 28px; 
      font-weight: bold; 
      color: #C9A962;
      margin-bottom: 5px;
    }
    .shop-address { 
      font-size: 14px; 
      color: #666;
      margin-bottom: 3px;
    }
    .invoice-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 5px;
    }
    .customer-section, .invoice-info {
      flex: 1;
    }
    .section-title {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 10px;
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    .detail-row {
      margin-bottom: 5px;
      font-size: 13px;
    }
    .detail-label {
      font-weight: bold;
      color: #555;
      min-width: 100px;
      display: inline-block;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-bottom: 30px;
    }
    th { 
      background: #333; 
      color: white; 
      padding: 12px; 
      text-align: left;
      font-size: 13px;
    }
    td { 
      padding: 10px; 
      border-bottom: 1px solid #ddd;
      font-size: 13px;
    }
    .text-right { text-align: right; }
    .totals {
      margin-left: auto;
      width: 300px;
      border-top: 2px solid #333;
      padding-top: 15px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .total-row.grand-total {
      border-top: 2px solid #333;
      margin-top: 10px;
      padding-top: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #C9A962;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
    .thank-you {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="shop-name">${user?.shop_name || "Ratan Jewellers"}</div>
    <div class="shop-address">${user?.shop_address || "Shop No. 123, Sarafa Bazar, Indore, MP"}</div>
    <div class="shop-address">Phone: ${user?.phone || "+91 98765 43210"} | Email: ${user?.email || "info@ratanjewellers.com"}</div>
    <div class="shop-address">GSTIN: ${user?.gst_no || "27XXXXX1234X1ZX"}</div>
  </div>

  <div class="invoice-details">
    <div class="customer-section">
      <div class="section-title">${billData.sale_type === 'b2b' ? 'BUSINESS DETAILS' : 'CUSTOMER DETAILS'}</div>
      ${billData.sale_type === 'b2b' ? `
        <div class="detail-row"><span class="detail-label">Business Name:</span> ${billData.business_name}</div>
        <div class="detail-row"><span class="detail-label">Contact Person:</span> ${billData.contact_person || '-'}</div>
        <div class="detail-row"><span class="detail-label">GST No:</span> ${billData.gst_no}</div>
        <div class="detail-row"><span class="detail-label">Phone:</span> ${billData.business_phone}</div>
        <div class="detail-row"><span class="detail-label">Address:</span> ${billData.business_address || '-'}</div>
      ` : `
        <div class="detail-row"><span class="detail-label">Name:</span> ${billData.customer_name}</div>
        <div class="detail-row"><span class="detail-label">Phone:</span> ${billData.customer_phone}</div>
        <div class="detail-row"><span class="detail-label">Address:</span> ${billData.customer_address || '-'}</div>
      `}
    </div>
    <div class="invoice-info">
      <div class="section-title">INVOICE DETAILS</div>
      <div class="detail-row"><span class="detail-label">Invoice No:</span> ${billData.invoice_no}</div>
      <div class="detail-row"><span class="detail-label">Date:</span> ${new Date(billData.sale_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
      <div class="detail-row"><span class="detail-label">Type:</span> ${billData.sale_type === 'b2b' ? 'B2B (Wholesale)' : 'B2C (Retail)'}</div>
      ${billData.sale_type === 'b2b' && billData.payment_terms ? `
        <div class="detail-row"><span class="detail-label">Payment Terms:</span> ${billData.payment_terms}</div>
        ${billData.due_date ? `<div class="detail-row"><span class="detail-label">Due Date:</span> ${new Date(billData.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>` : ''}
      ` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>S.No</th>
        <th>Item</th>
        <th class="text-right">Purity</th>
        <th class="text-right">Gross Wt (g)</th>
        <th class="text-right">Net Wt (g)</th>
        <th class="text-right">Rate</th>
        <th class="text-right">Making</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${billData.items.map((item: any, index: number) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.item_name}</td>
          <td class="text-right">${item.purity || '-'}</td>
          <td class="text-right">${item.gross_weight ? item.gross_weight.toFixed(2) : '-'}</td>
          <td class="text-right">${item.weight ? item.weight.toFixed(2) : '-'}</td>
          <td class="text-right">₹${(item.rate || 0).toLocaleString('en-IN')}</td>
          <td class="text-right">₹${(item.making_charges || 0).toLocaleString('en-IN')}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">₹${(item.amount || 0).toLocaleString('en-IN')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>₹${(billData.subtotal || 0).toLocaleString('en-IN')}</span>
    </div>
    ${billData.discount > 0 ? `
      <div class="total-row" style="color: red;">
        <span>Discount:</span>
        <span>- ₹${(billData.discount || 0).toLocaleString('en-IN')}</span>
      </div>
    ` : ''}
    <div class="total-row">
      <span>GST (3%):</span>
      <span>₹${(billData.gst || 0).toLocaleString('en-IN')}</span>
    </div>
    <div class="total-row grand-total">
      <span>TOTAL:</span>
      <span>₹${(billData.total || 0).toLocaleString('en-IN')}</span>
    </div>
    ${billData.amount_paid > 0 ? `
      <div class="total-row" style="color: green;">
        <span>Amount Paid:</span>
        <span>₹${(billData.amount_paid || 0).toLocaleString('en-IN')}</span>
      </div>
    ` : ''}
    ${billData.amount_pending > 0 ? `
      <div class="total-row" style="color: orange;">
        <span>Amount Pending:</span>
        <span>₹${(billData.amount_pending || 0).toLocaleString('en-IN')}</span>
      </div>
    ` : ''}
    <div class="total-row">
      <span>Payment Method:</span>
      <span>${billData.payment_method ? billData.payment_method.toUpperCase() : (billData.payment_terms === 'immediate' ? 'IMMEDIATE' : 'CREDIT')}</span>
    </div>
    <div class="total-row">
      <span>Payment Status:</span>
      <span style="color: ${billData.payment_status === 'PAID' ? 'green' : (billData.payment_status === 'PARTIAL' ? 'orange' : 'red')};">${billData.payment_status ? billData.payment_status.toUpperCase() : 'UNPAID'}</span>
    </div>
    ${billData.warranty_years > 0 ? `
      <div class="total-row" style="border-top: 1px dashed #ddd; margin-top: 10px; padding-top: 10px;">
        <span>Warranty:</span>
        <span>${billData.warranty_years} ${billData.warranty_years === 1 ? 'Year' : 'Years'}</span>
      </div>
    ` : ''}
  </div>

  <div class="footer">
    <div class="thank-you">Thank You for Your Business!</div>
    <div>This is a computer generated invoice and does not require signature.</div>
    <div style="margin-top: 10px;">For any queries, please contact us at the above mentioned details.</div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
    `

    return new NextResponse(billHTML, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Error generating bill:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate bill" },
      { status: 500 }
    )
  }
}
