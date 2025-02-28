"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Node {
  id: string
  name: string
  group: number
  pageRank: number
  community?: number
  betweenness?: number
}

interface Link {
  source: string
  target: string
  value: number
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

export function NetworkVisualization() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<GraphData | null>(null)
  const [visualizationType, setVisualizationType] = useState("pagerank")
  const [nodeSize, setNodeSize] = useState([5])
  const [linkStrength, setLinkStrength] = useState([50])
  const [showLabels, setShowLabels] = useState(true)
  const [simulation, setSimulation] = useState<any>(null)

  useEffect(() => {
    // Simulated data - in production, this would come from Neo4j
    const sampleData: GraphData = {
      nodes: Array.from({ length: 50 }, (_, i) => ({
        id: `user${i}`,
        name: `User ${i}`,
        group: Math.floor(Math.random() * 5),
        pageRank: Math.random(),
        community: Math.floor(Math.random() * 3),
        betweenness: Math.random(),
      })),
      links: [],
    }

    // Generate random connections
    for (let i = 0; i < sampleData.nodes.length; i++) {
      const numLinks = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numLinks; j++) {
        const target = Math.floor(Math.random() * sampleData.nodes.length)
        if (i !== target) {
          sampleData.links.push({
            source: sampleData.nodes[i].id,
            target: sampleData.nodes[target].id,
            value: Math.random() * 2 + 1,
          })
        }
      }
    }

    setData(sampleData)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current) return

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height)

    const g = svg.append("g")

    // Add zoom functionality
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svg.call(zoom as any)

    // Create a force simulation
    const sim = d3
      .forceSimulation(data.nodes as any)
      .force(
        "link",
        d3
          .forceLink(data.links as any)
          .id((d: any) => d.id)
          .distance(100 * (linkStrength[0] / 50)),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30))

    setSimulation(sim)

    // Add links
    const link = g
      .append("g")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value))

    // Color scale based on visualization type
    const getNodeColor = (d: Node) => {
      const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
      switch (visualizationType) {
        case "pagerank":
          return colorScale(d.pageRank)
        case "community":
          return d3.schemeCategory10[d.community || 0]
        case "betweenness":
          return colorScale(d.betweenness || 0)
        default:
          return colorScale(d.pageRank)
      }
    }

    // Node size based on visualization type
    const getNodeSize = (d: Node) => {
      const baseSize = nodeSize[0]
      switch (visualizationType) {
        case "pagerank":
          return baseSize + d.pageRank * 20
        case "community":
          return baseSize + 5
        case "betweenness":
          return baseSize + (d.betweenness || 0) * 20
        default:
          return baseSize
      }
    }

    // Add nodes
    const node = g
      .append("g")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", getNodeSize)
      .attr("fill", getNodeColor)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(d3.drag<SVGCircleElement, Node>().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any)

    // Add labels if enabled
    if (showLabels) {
      const labels = g
        .append("g")
        .selectAll("text")
        .data(data.nodes)
        .enter()
        .append("text")
        .text((d) => d.name)
        .attr("font-size", 10)
        .attr("dx", 12)
        .attr("dy", 4)
        .attr("fill", "currentColor")

      // Update label positions
      sim.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y)

        node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

        labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
      })
    } else {
      // Update without labels
      sim.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y)

        node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)
      })
    }

    // Add tooltips
    node.append("title").text((d) => {
      let tooltip = `${d.name}\n`
      switch (visualizationType) {
        case "pagerank":
          tooltip += `PageRank: ${d.pageRank.toFixed(3)}`
          break
        case "community":
          tooltip += `Community: ${d.community}`
          break
        case "betweenness":
          tooltip += `Betweenness: ${d.betweenness?.toFixed(3)}`
          break
      }
      return tooltip
    })

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) sim.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) sim.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Cleanup
    return () => {
      sim.stop()
    }
  }, [data, visualizationType, nodeSize, linkStrength, showLabels])

  const handleZoomIn = () => {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().scaleBy as any, 1.5)
  }

  const handleZoomOut = () => {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().scaleBy as any, 0.75)
  }

  const handleReset = () => {
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom().transform as any, d3.zoomIdentity)

    if (simulation) {
      simulation.alpha(1).restart()
    }
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Network Visualization</CardTitle>
        <CardDescription>Interactive visualization of the social network graph database</CardDescription>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Select value={visualizationType} onValueChange={setVisualizationType}>
              <SelectTrigger>
                <SelectValue placeholder="Select visualization type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pagerank">PageRank</SelectItem>
                <SelectItem value="community">Community Detection</SelectItem>
                <SelectItem value="betweenness">Betweenness Centrality</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Node Size</Label>
                <span className="text-sm text-muted-foreground">{nodeSize[0]}</span>
              </div>
              <Slider min={1} max={20} step={1} value={nodeSize} onValueChange={setNodeSize} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Link Strength</Label>
                <span className="text-sm text-muted-foreground">{linkStrength[0]}%</span>
              </div>
              <Slider min={10} max={100} step={5} value={linkStrength} onValueChange={setLinkStrength} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
            <Label htmlFor="show-labels">Show Labels</Label>
          </div>
          <div className="relative h-[600px] w-full border rounded-lg">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading network data...</span>
              </div>
            ) : (
              <svg ref={svgRef} className="w-full h-full" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

