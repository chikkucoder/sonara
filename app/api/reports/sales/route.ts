import { createClient } from "@/lib/supabase/server"
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
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let query = supabase.from("sales").select("*").eq("user_id", user.id)

    if (startDate) {
      query = query.gte("sale_date", startDate)
    }
    if (endDate) {
      query = query.lte("sale_date", endDate)
    }

    const { data, error } = await query.order("sale_date", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch sales report" },
      { status: 500 },
    )
  }
}
