import { NextResponse } from "next/server"
import { fetchAnalytics } from "@/lib/data-service"

export async function GET() {
  try {
    const data = await fetchAnalytics()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

