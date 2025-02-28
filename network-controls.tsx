"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RefreshCw } from "lucide-react"

export function NetworkControls() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [nodeSize, setNodeSize] = useState([5])
  const [linkStrength, setLinkStrength] = useState([50])
  const [showLabels, setShowLabels] = useState(true)
  const [algorithm, setAlgorithm] = useState("pagerank")

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Network Controls</CardTitle>
        <CardDescription>Adjust visualization parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="node-size">Node Size</Label>
            <span className="text-xs text-muted-foreground">{nodeSize[0]}</span>
          </div>
          <Slider id="node-size" min={1} max={20} step={1} value={nodeSize} onValueChange={setNodeSize} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="link-strength">Link Strength</Label>
            <span className="text-xs text-muted-foreground">{linkStrength[0]}%</span>
          </div>
          <Slider id="link-strength" min={10} max={100} step={5} value={linkStrength} onValueChange={setLinkStrength} />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
          <Label htmlFor="show-labels">Show Labels</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="algorithm">Algorithm</Label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger id="algorithm">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pagerank">PageRank</SelectItem>
              <SelectItem value="community">Community Detection</SelectItem>
              <SelectItem value="betweenness">Betweenness Centrality</SelectItem>
              <SelectItem value="closeness">Closeness Centrality</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between">
          <Button
            variant={isSimulating ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsSimulating(!isSimulating)}
          >
            {isSimulating ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Simulate
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

