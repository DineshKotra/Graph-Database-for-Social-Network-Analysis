"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, Play, Copy } from "lucide-react"
import { queryExamples } from "@/lib/query-examples"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function QueryExplorer() {
  const [activeTab, setActiveTab] = useState("friends-of-friends")
  const [isRunning, setIsRunning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentQuery, setCurrentQuery] = useState(queryExamples[0])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const query = queryExamples.find((q) => q.id === value) || queryExamples[0]
    setCurrentQuery(query)
    setShowResults(false)
  }

  const handleRunQuery = () => {
    setIsRunning(true)
    setShowResults(false)

    // Simulate query execution
    setTimeout(() => {
      setIsRunning(false)
      setShowResults(true)
    }, 1500)
  }

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(currentQuery.query)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Query Explorer</CardTitle>
        <CardDescription>Explore common social network analysis queries in Cypher</CardDescription>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-max">
              {queryExamples.map((example) => (
                <TabsTrigger key={example.id} value={example.id}>
                  {example.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">{currentQuery.name}</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyQuery}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="default" size="sm" onClick={handleRunQuery} disabled={isRunning}>
                  {isRunning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Query
                    </>
                  )}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{currentQuery.description}</p>
            <pre className="bg-card p-4 rounded-md overflow-x-auto text-sm">{currentQuery.query}</pre>
          </div>

          {showResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Query Results</h3>
                <Badge variant="outline">{currentQuery.executionTime} ms</Badge>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {currentQuery.results.columns.map((column, i) => (
                        <TableHead key={i}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentQuery.results.rows.map((row, i) => (
                      <TableRow key={i}>
                        {row.map((cell, j) => (
                          <TableCell key={j}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {currentQuery.results.rows.length} of {currentQuery.results.total} results
                </span>
                <span>Query Plan: {currentQuery.queryPlan}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

