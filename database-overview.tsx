import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Users, Network, Activity } from "lucide-react"

export function DatabaseOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Database Size</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5.2 GB</div>
          <p className="text-xs text-muted-foreground">250,000 nodes, 1.2M relationships</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Nodes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">50,000</div>
          <p className="text-xs text-muted-foreground">With profile properties</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Relationships</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">850,000</div>
          <p className="text-xs text-muted-foreground">FOLLOWS, LIKES, COMMENTS_ON</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Query Performance</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45ms</div>
          <p className="text-xs text-muted-foreground">Avg. response time</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Database Structure</CardTitle>
          <CardDescription>Core components of our social network graph database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Node Labels</h4>
              <p className="text-sm text-muted-foreground">User, Post, Comment, Group, Event, Location, Hashtag</p>
            </div>
            <div>
              <h4 className="font-medium">Relationship Types</h4>
              <p className="text-sm text-muted-foreground">
                FOLLOWS, FRIENDS_WITH, POSTED, COMMENTED_ON, LIKES, MEMBER_OF, TAGGED_IN, LOCATED_AT
              </p>
            </div>
            <div>
              <h4 className="font-medium">Indexes</h4>
              <p className="text-sm text-muted-foreground">User(id, email), Post(id), Group(name), Hashtag(name)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Database Configuration</CardTitle>
          <CardDescription>Neo4j instance configuration details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Version</h4>
                <p className="text-sm text-muted-foreground">Neo4j 5.11.0 Enterprise</p>
              </div>
              <div>
                <h4 className="font-medium">Memory</h4>
                <p className="text-sm text-muted-foreground">16GB Heap, 32GB Page Cache</p>
              </div>
              <div>
                <h4 className="font-medium">Deployment</h4>
                <p className="text-sm text-muted-foreground">Causal Cluster (3 nodes)</p>
              </div>
              <div>
                <h4 className="font-medium">Storage</h4>
                <p className="text-sm text-muted-foreground">SSD, 500GB allocated</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

