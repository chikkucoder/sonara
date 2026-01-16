import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date required" }, { status: 400 })
    }

    // Get opening stock (items added before the selected date)
    const { data: openingStock, error: openingError } = await supabase
      .from("inventory_normal")
      .select("*")
      .eq("user_id", user.id)
      .lt("inventory_date", date)

    if (openingError) throw openingError

    // Get items added on the selected date
    const { data: addedItems, error: addedError } = await supabase
      .from("inventory_normal")
      .select("*")
      .eq("user_id", user.id)
      .eq("inventory_date", date)

    if (addedError) throw addedError

    // Get items sold on the selected date
    const { data: soldItems, error: soldError } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", user.id)
      .eq("sale_date", date)

    if (soldError) throw soldError

    return NextResponse.json({
      openingStock: openingStock || [],
      addedItems: addedItems || [],
      soldItems: soldItems || [],
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch inventory report" },
      { status: 500 },
    )
  }
}
