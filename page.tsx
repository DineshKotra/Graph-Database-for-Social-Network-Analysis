import { DatabaseOverview } from "@/components/database-overview"
import { QueryExplorer } from "@/components/query-explorer"
import { SchemaViewer } from "@/components/schema-viewer"
import { AlgorithmsDemo } from "@/components/algorithms-demo"
import { NetworkVisualization } from "@/components/network-visualization"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background p-4 md:p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Social Network Graph Database</h1>
        <p className="text-muted-foreground">
          Explore the power of Neo4j for modeling and analyzing social network data
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <NetworkVisualization />

          <div className="lg:col-span-1 space-y-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schema">Schema</TabsTrigger>
                <TabsTrigger value="queries">Queries</TabsTrigger>
                <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <DatabaseOverview />
              </TabsContent>

              <TabsContent value="schema">
                <SchemaViewer />
              </TabsContent>

              <TabsContent value="queries">
                <QueryExplorer />
              </TabsContent>

              <TabsContent value="algorithms">
                <AlgorithmsDemo />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}

