"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchNetworkData } from "@/lib/data-service"
import { Loader2 } from "lucide-react"

interface Node {
  id: string
  name: string
  group: number
  pageRank: number
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

export function NetworkGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<GraphData | null>(null)
  const [activeTab, setActiveTab] = useState("network")

  useEffect(() => {
    const loadData = async () => {
      try {
        const graphData = await fetchNetworkData()
        setData(graphData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load network data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current) return

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height)

    // Create a force simulation
    const simulation = d3
      .forceSimulation(data.nodes as any)
      .force(
        "link",
        d3
          .forceLink(data.links as any)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30))

    // Add links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value))

    // Create a color scale for groups
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    // Add nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => 5 + d.pageRank * 15)
      .attr("fill", (d) => color(d.group.toString()))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(d3.drag<SVGCircleElement, Node>().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any)

    // Add labels
    const labels = svg
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

    // Add title for hover
    node.append("title").text((d) => `${d.name}\nPageRank: ${d.pageRank.toFixed(2)}`)

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

      labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
    })

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Resize handler
    const handleResize = () => {
      if (!svgRef.current) return
      const newWidth = svgRef.current.clientWidth
      const newHeight = svgRef.current.clientHeight

      svg.attr("width", newWidth).attr("height", newHeight)
      simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2))
      simulation.alpha(0.3).restart()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [data])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Network Visualization</CardTitle>
        <CardDescription>Interactive visualization of social network connections and communities</CardDescription>
        <Tabs defaultValue="network" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="influence">Influence</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[600px] w-full">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading network data...</span>
            </div>
          ) : (
            <svg ref={svgRef} className="h-full w-full" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

