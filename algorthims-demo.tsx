"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, Play, BarChart4, Network, Users, TrendingUp } from "lucide-react"
import { algorithmExamples } from "@/lib/algorithm-examples"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AlgorithmVisualizer } from "@/components/algorithm-visualizer"

export function AlgorithmsDemo() {
  const [activeTab, setActiveTab] = useState("pagerank")
  const [isRunning, setIsRunning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentAlgorithm, setCurrentAlgorithm] = useState(algorithmExamples[0])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const algorithm = algorithmExamples.find((a) => a.id === value) || algorithmExamples[0]
    setCurrentAlgorithm(algorithm)
    setShowResults(false)
  }

  const handleRunAlgorithm = () => {
    setIsRunning(true)
    setShowResults(false)

    // Simulate algorithm execution
    setTimeout(() => {
      setIsRunning(false)
      setShowResults(true)
    }, 2000)
  }

  const getAlgorithmIcon = (type: string) => {
    switch (type) {
      case "centrality":
        return <TrendingUp className="h-5 w-5" />
      case "community":
        return <Users className="h-5 w-5" />
      case "pathfinding":
        return <Network className="h-5 w-5" />
      default:
        return <BarChart4 className="h-5 w-5" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Graph Algorithms</CardTitle>
        <CardDescription>Explore Neo4j's graph algorithms for social network analysis</CardDescription>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-max">
              {algorithmExamples.map((algorithm) => (
                <TabsTrigger key={algorithm.id} value={algorithm.id}>
                  {algorithm.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getAlgorithmIcon(currentAlgorithm.type)}
                <h3 className="font-medium">{currentAlgorithm.name}</h3>
                <Badge variant="outline">{currentAlgorithm.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{currentAlgorithm.description}</p>

              <div className="rounded-md bg-muted p-4 mb-4">
                <h4 className="text-sm font-medium mb-2">Cypher Implementation</h4>
                <pre className="bg-card p-4 rounded-md overflow-x-auto text-sm">{currentAlgorithm.query}</pre>
              </div>

              <Button variant="default" onClick={handleRunAlgorithm} disabled={isRunning} className="w-full">
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Algorithm...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run {currentAlgorithm.name}
                  </>
                )}
              </Button>
            </div>
          </div>

          {showResults && (
            <div className="space-y-4">
              <h3 className="font-medium">Algorithm Results</h3>
              <div className="h-[400px] border rounded-md p-4">
                <AlgorithmVisualizer algorithm={currentAlgorithm} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentAlgorithm.metrics.map((metric, i) => (
                  <Card key={i}>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">{metric.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

