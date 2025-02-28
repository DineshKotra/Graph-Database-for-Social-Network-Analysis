"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface AlgorithmVisualizerProps {
  algorithm: any
}

export function AlgorithmVisualizer({ algorithm }: AlgorithmVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !algorithm.visualData) return

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
    const simulation = d3
      .forceSimulation(algorithm.visualData.nodes as any)
      .force(
        "link",
        d3
          .forceLink(algorithm.visualData.links as any)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30))

    // Add links
    const link = g
      .append("g")
      .selectAll("line")
      .data(algorithm.visualData.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.value || 1))

    // Create a color scale based on algorithm type
    let colorScale

    if (algorithm.type === "centrality") {
      // Color scale for centrality values (0-1)
      colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, 1])
    } else if (algorithm.type === "community") {
      // Color scale for community detection (categorical)
      colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    } else {
      // Default color scale
      colorScale = d3.scaleOrdinal(d3.schemeSet2)
    }

    // Add nodes
    const node = g
      .append("g")
      .selectAll("circle")
      .data(algorithm.visualData.nodes)
      .enter()
      .append("circle")
      .attr("r", (d: any) => {
        // Size based on score for centrality algorithms
        if (algorithm.type === "centrality") {
          return 5 + (d.score || 0) * 20
        }
        // Size based on community size for community detection
        else if (algorithm.type === "community") {
          return 10
        }
        return 8
      })
      .attr("fill", (d: any) => {
        if (algorithm.type === "centrality") {
          return colorScale(d.score || 0)
        } else if (algorithm.type === "community") {
          return colorScale(d.community || 0)
        }
        return colorScale(d.group || 0)
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(d3.drag<SVGCircleElement, any>().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any)

    // Add labels
    const labels = g
      .append("g")
      .selectAll("text")
      .data(algorithm.visualData.nodes)
      .enter()
      .append("text")
      .text((d: any) => d.name)
      .attr("font-size", 10)
      .attr("dx", 12)
      .attr("dy", 4)
      .attr("fill", "currentColor")

    // Add title for hover
    node.append("title").text((d: any) => {
      if (algorithm.type === "centrality") {
        return `${d.name}\nScore: ${(d.score || 0).toFixed(3)}`
      } else if (algorithm.type === "community") {
        return `${d.name}\nCommunity: ${d.community || 0}`
      }
      return d.name
    })

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
  }, [algorithm])

  return <svg ref={svgRef} className="w-full h-full" />
}

