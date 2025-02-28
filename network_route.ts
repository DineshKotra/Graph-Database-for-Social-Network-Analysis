import { NextResponse } from "next/server"
import { fetchNetworkData } from "@/lib/data-service"

export async function GET() {
  try {
    const data = await fetchNetworkData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching network data:", error)
    return NextResponse.json({ error: "Failed to fetch network data" }, { status: 500 })
  }
}

