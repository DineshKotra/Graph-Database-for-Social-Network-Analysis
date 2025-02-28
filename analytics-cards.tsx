"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAnalytics } from "@/lib/data-service"
import { Users, TrendingUp, Network, Activity } from "lucide-react"

interface AnalyticsData {
  totalUsers: number
  totalConnections: number
  avgConnections: number
  communities: number
  density: number
  mostInfluential: {
    name: string
    score: number
  }
}

export function AnalyticsCards() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchAnalytics()
        setAnalytics(data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load analytics:", error)
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 w-1/2 bg-muted rounded"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-1/3 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium">
            <Users className="mr-2 h-4 w-4 text-primary" />
            Network Size
          </CardTitle>
          <CardDescription>Total users and connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalUsers}</div>
          <p className="text-xs text-muted-foreground">{analytics.totalConnections} connections</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium">
            <Network className="mr-2 h-4 w-4 text-primary" />
            Communities
          </CardTitle>
          <CardDescription>Detected community clusters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.communities}</div>
          <p className="text-xs text-muted-foreground">Network density: {analytics.density.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium">
            <TrendingUp className="mr-2 h-4 w-4 text-primary" />
            Top Influencer
          </CardTitle>
          <CardDescription>Highest PageRank score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.mostInfluential.name}</div>
          <p className="text-xs text-muted-foreground">Score: {analytics.mostInfluential.score.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium">
            <Activity className="mr-2 h-4 w-4 text-primary" />
            Connectivity
          </CardTitle>
          <CardDescription>Average connections per user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.avgConnections.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Connections per user</p>
        </CardContent>
      </Card>
    </div>
  )
}

