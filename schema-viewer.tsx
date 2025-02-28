"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { schemaData } from "@/lib/schema-data"

export function SchemaViewer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("visual")

  useEffect(() => {
    if (activeTab !== "visual") return

    const renderSchema = () => {
      if (!svgRef.current) return
      setLoading(true)

      const width = svgRef.current.clientWidth
      const height = 600

      // Clear previous graph
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
      const simulation = d3
        .forceSimulation(schemaData.nodes as any)
        .force(
          "link",
          d3
            .forceLink(schemaData.links as any)
            .id((d: any) => d.id)
            .distance(150),
        )
        .force("charge", d3.forceManyBody().strength(-800))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(80))

      // Define arrow markers for relationships
      svg
        .append("defs")
        .selectAll("marker")
        .data(["end"])
        .enter()
        .append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", "#999")
        .attr("d", "M0,-5L10,0L0,5")

      // Add links with labels
      const link = g.append("g").selectAll("g").data(schemaData.links).enter().append("g")

      link
        .append("path")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
        .attr("marker-end", "url(#arrow)")

      const linkText = link
        .append("text")
        .attr("dy", -5)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .attr("font-size", 10)
        .text((d) => d.type)

      // Add nodes
      const nodeGroups = g
        .append("g")
        .selectAll("g")
        .data(schemaData.nodes)
        .enter()
        .append("g")
        .call(d3.drag<SVGGElement, any>().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any)

      // Node circles
      nodeGroups
        .append("circle")
        .attr("r", 30)
        .attr("fill", (d) => d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)

      // Node labels
      nodeGroups
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", 5)
        .attr("fill", "#fff")
        .attr("font-weight", "bold")
        .attr("font-size", 12)
        .text((d) => d.label)

      // Properties as small circles around the main node
      nodeGroups.each(function (d) {
        if (!d.properties || d.properties.length === 0) return

        const node = d3.select(this)
        const numProps = d.properties.length
        const radius = 40

        d.properties.forEach((prop: string, i: number) => {
          const angle = (i / numProps) * 2 * Math.PI
          const x = radius * Math.cos(angle)
          const y = radius * Math.sin(angle)

          node
            .append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 8)
            .attr("fill", "#f0f0f0")
            .attr("stroke", d.color)
            .attr("stroke-width", 1)

          node
            .append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("dy", 3)
            .attr("font-size", 7)
            .attr("fill", "#333")
            .text(prop.substring(0, 3))

          node.append("title").text(prop)
        })
      })

      // Update positions on simulation tick
      simulation.on("tick", () => {
        // Update link paths
        link.selectAll("path").attr("d", (d: any) => {
          const dx = d.target.x - d.source.x
          const dy = d.target.y - d.source.y
          const dr = Math.sqrt(dx * dx + dy * dy)

          // Calculate points for the link path
          const sourceX = d.source.x + (dx * 30) / dr
          const sourceY = d.source.y + (dy * 30) / dr
          const targetX = d.target.x - (dx * 30) / dr
          const targetY = d.target.y - (dy * 30) / dr

          return `M${sourceX},${sourceY}L${targetX},${targetY}`
        })

        // Update link text positions
        linkText
          .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
          .attr("y", (d: any) => (d.source.y + d.target.y) / 2)

        // Update node positions
        nodeGroups.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
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

      // Reset zoom
      const resetZoom = () => {
        svg
          .transition()
          .duration(750)
          .call(
            zoom.transform as any,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node() as any).invert([width / 2, height / 2]),
          )
      }

      // Add zoom controls
      const zoomIn = () => {
        svg.transition().call(zoom.scaleBy as any, 1.5)
      }

      const zoomOut = () => {
        svg.transition().call(zoom.scaleBy as any, 0.75)
      }

      // Expose zoom functions to window for button access
      ;(window as any).schemaZoomIn = zoomIn
      ;(window as any).schemaZoomOut = zoomOut
      ;(window as any).schemaResetZoom = resetZoom

      setLoading(false)
    }

    renderSchema()

    // Handle window resize
    const handleResize = () => {
      renderSchema()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [activeTab])

  const handleZoomIn = () => {
    ;(window as any).schemaZoomIn?.()
  }

  const handleZoomOut = () => {
    ;(window as any).schemaZoomOut?.()
  }

  const handleResetZoom = () => {
    ;(window as any).schemaResetZoom?.()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Database Schema</CardTitle>
        <CardDescription>Visual representation of the social network graph schema</CardDescription>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="visual">Visual Schema</TabsTrigger>
            <TabsTrigger value="cypher">Cypher Schema</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="visual" className="mt-0">
          <div className="relative h-[600px] w-full border rounded-md">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleResetZoom}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <svg ref={svgRef} className="h-full w-full" />
          </div>
        </TabsContent>

        <TabsContent value="cypher" className="mt-0">
          <div className="rounded-md bg-muted p-4 font-mono text-sm overflow-auto max-h-[600px]">
            <pre className="whitespace-pre-wrap">
              {`// Define constraints and indexes
CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT post_id IF NOT EXISTS FOR (p:Post) REQUIRE p.id IS UNIQUE;
CREATE INDEX user_email IF NOT EXISTS FOR (u:User) ON (u.email);
CREATE INDEX post_timestamp IF NOT EXISTS FOR (p:Post) ON (p.timestamp);
CREATE INDEX hashtag_name IF NOT EXISTS FOR (h:Hashtag) ON (h.name);

// User nodes
CREATE (u:User {
  id: "user123",
  name: "John Doe",
  email: "john@example.com",
  joinDate: "2023-01-15",
  age: 28,
  gender: "male",
  location: "New York"
})

// Post nodes
CREATE (p:Post {
  id: "post789",
  content: "Hello world!",
  timestamp: "2023-03-10T14:30:00Z",
  visibility: "public"
})

// Comment nodes
CREATE (c:Comment {
  id: "comment456",
  content: "Great post!",
  timestamp: "2023-03-10T15:45:00Z"
})

// Group nodes
CREATE (g:Group {
  id: "group101",
  name: "Tech Enthusiasts",
  description: "A group for tech lovers",
  createdAt: "2022-05-20"
})

// Hashtag nodes
CREATE (h:Hashtag {
  name: "tech",
  count: 1250
})

// Location nodes
CREATE (l:Location {
  name: "New York",
  country: "USA",
  latitude: 40.7128,
  longitude: -74.0060
})

// User-User relationships
MATCH (u1:User {id: "user123"}), (u2:User {id: "user456"})
CREATE (u1)-[:FOLLOWS {since: "2023-02-01", weight: 0.8}]->(u2)

MATCH (u1:User {id: "user123"}), (u2:User {id: "user789"})
CREATE (u1)-[:FRIENDS_WITH {since: "2022-11-15", strength: 0.9}]->(u2)

// User-Content relationships
MATCH (u:User {id: "user123"}), (p:Post {id: "post789"})
CREATE (u)-[:POSTED {timestamp: "2023-03-10T14:30:00Z"}]->(p)

MATCH (u:User {id: "user456"}), (p:Post {id: "post789"})
CREATE (u)-[:LIKES {timestamp: "2023-03-10T16:20:00Z"}]->(p)

MATCH (u:User {id: "user456"}), (c:Comment {id: "comment456"})
CREATE (u)-[:POSTED {timestamp: "2023-03-10T15:45:00Z"}]->(c)

MATCH (c:Comment {id: "comment456"}), (p:Post {id: "post789"})
CREATE (c)-[:COMMENTS_ON]->(p)

// User-Group relationships
MATCH (u:User {id: "user123"}), (g:Group {id: "group101"})
CREATE (u)-[:MEMBER_OF {joinDate: "2022-06-15", role: "admin"}]->(g)

// Content-Hashtag relationships
MATCH (p:Post {id: "post789"}), (h:Hashtag {name: "tech"})
CREATE (p)-[:TAGGED_WITH {position: 10}]->(h)

// User-Location relationships
MATCH (u:User {id: "user123"}), (l:Location {name: "New York"})
CREATE (u)-[:LOCATED_AT {since: "2020-01-01"}]->(l)`}
            </pre>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  )
}

