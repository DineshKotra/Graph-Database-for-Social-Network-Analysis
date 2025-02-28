export const algorithmExamples = [
  {
    id: "pagerank",
    name: "PageRank",
    type: "centrality",
    description: "Measures the influence of users in the social network based on their connections",
    query: `// Run PageRank to find influential users
CALL gds.graph.project(
  'socialGraph',
  'User',
  {
    FOLLOWS: {
      orientation: 'NATURAL',
      properties: ['weight']
    }
  },
  {
    relationshipProperties: ['weight']
  }
)

// Execute PageRank algorithm
CALL gds.pageRank.stream('socialGraph', {
  maxIterations: 20,
  dampingFactor: 0.85,
  relationshipWeightProperty: 'weight'
})
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score
RETURN user.name AS userName, 
       score AS pageRankScore
ORDER BY pageRankScore DESC
LIMIT 10

// Clean up
CALL gds.graph.drop('socialGraph')`,
    metrics: [
      {
        name: "Convergence",
        value: "18 iterations",
        description: "Algorithm converged before max iterations",
      },
      {
        name: "Execution Time",
        value: "245ms",
        description: "Total algorithm execution time",
      },
      {
        name: "Memory Usage",
        value: "42MB",
        description: "Peak memory usage during execution",
      },
    ],
    visualData: {
      nodes: [
        { id: "user1", name: "John", score: 0.85, group: 1 },
        { id: "user2", name: "Emma", score: 0.72, group: 1 },
        { id: "user3", name: "Michael", score: 0.68, group: 2 },
        { id: "user4", name: "Sarah", score: 0.65, group: 2 },
        { id: "user5", name: "David", score: 0.58, group: 1 },
        { id: "user6", name: "Alice", score: 0.52, group: 3 },
        { id: "user7", name: "Bob", score: 0.48, group: 3 },
        { id: "user8", name: "Carol", score: 0.45, group: 2 },
        { id: "user9", name: "Dave", score: 0.42, group: 3 },
        { id: "user10", name: "Eve", score: 0.38, group: 1 },
        { id: "user11", name: "Frank", score: 0.35, group: 2 },
        { id: "user12", name: "Grace", score: 0.32, group: 3 },
        { id: "user13", name: "Henry", score: 0.28, group: 1 },
        { id: "user14", name: "Ivy", score: 0.25, group: 2 },
        { id: "user15", name: "Jack", score: 0.22, group: 3 },
      ],
      links: [
        { source: "user1", target: "user2", value: 3 },
        { source: "user1", target: "user3", value: 2 },
        { source: "user1", target: "user5", value: 2 },
        { source: "user2", target: "user4", value: 3 },
        { source: "user2", target: "user6", value: 1 },
        { source: "user3", target: "user7", value: 2 },
        { source: "user3", target: "user8", value: 1 },
        { source: "user4", target: "user1", value: 3 },
        { source: "user4", target: "user9", value: 2 },
        { source: "user5", target: "user10", value: 1 },
        { source: "user6", target: "user11", value: 2 },
        { source: "user7", target: "user12", value: 1 },
        { source: "user8", target: "user13", value: 2 },
        { source: "user9", target: "user14", value: 1 },
        { source: "user10", target: "user15", value: 2 },
        { source: "user11", target: "user1", value: 3 },
        { source: "user12", target: "user2", value: 2 },
        { source: "user13", target: "user3", value: 1 },
        { source: "user14", target: "user4", value: 2 },
        { source: "user15", target: "user5", value: 1 },
        { source: "user6", target: "user1", value: 3 },
        { source: "user7", target: "user2", value: 2 },
        { source: "user8", target: "user3", value: 1 },
        { source: "user9", target: "user4", value: 2 },
        { source: "user10", target: "user5", value: 1 },
      ],
    },
  },
  {
    id: "louvain",
    name: "Louvain Community Detection",
    type: "community",
    description: "Identifies communities of users based on their connection patterns",
    query: `// Run Louvain algorithm for community detection
CALL gds.graph.project(
  'socialGraph',
  'User',
  {
    FRIENDS_WITH: {
      orientation: 'UNDIRECTED'
    }
  }
)

// Execute Louvain algorithm
CALL gds.louvain.stream('socialGraph', {
  includeIntermediateCommunities: true
})
YIELD nodeId, communityId, intermediateCommunityIds
WITH gds.util.asNode(nodeId) AS user, 
     communityId,
     intermediateCommunityIds
RETURN user.name AS userName,
       communityId,
       intermediateCommunityIds
ORDER BY communityId, userName

// Clean up
CALL gds.graph.drop('socialGraph')`,
    metrics: [
      {
        name: "Communities",
        value: "5",
        description: "Number of communities detected",
      },
      {
        name: "Modularity",
        value: "0.78",
        description: "Quality of the community partitioning",
      },
      {
        name: "Execution Time",
        value: "185ms",
        description: "Total algorithm execution time",
      },
    ],
    visualData: {
      nodes: [
        { id: "user1", name: "John", community: 0, group: 0 },
        { id: "user2", name: "Emma", community: 0, group: 0 },
        { id: "user3", name: "Michael", community: 0, group: 0 },
        { id: "user4", name: "Sarah", community: 0, group: 0 },
        { id: "user5", name: "David", community: 0, group: 0 },
        { id: "user6", name: "Alice", community: 1, group: 1 },
        { id: "user7", name: "Bob", community: 1, group: 1 },
        { id: "user8", name: "Carol", community: 1, group: 1 },
        { id: "user9", name: "Dave", community: 1, group: 1 },
        { id: "user10", name: "Eve", community: 2, group: 2 },
        { id: "user11", name: "Frank", community: 2, group: 2 },
        { id: "user12", name: "Grace", community: 2, group: 2 },
        { id: "user13", name: "Henry", community: 3, group: 3 },
        { id: "user14", name: "Ivy", community: 3, group: 3 },
        { id: "user15", name: "Jack", community: 4, group: 4 },
      ],
      links: [
        { source: "user1", target: "user2", value: 1 },
        { source: "user1", target: "user3", value: 1 },
        { source: "user2", target: "user4", value: 1 },
        { source: "user3", target: "user5", value: 1 },
        { source: "user4", target: "user5", value: 1 },
        { source: "user6", target: "user7", value: 1 },
        { source: "user6", target: "user8", value: 1 },
        { source: "user7", target: "user9", value: 1 },
        { source: "user8", target: "user9", value: 1 },
        { source: "user10", target: "user11", value: 1 },
        { source: "user10", target: "user12", value: 1 },
        { source: "user11", target: "user12", value: 1 },
        { source: "user13", target: "user14", value: 1 },
        { source: "user1", target: "user6", value: 1 },
        { source: "user6", target: "user10", value: 1 },
        { source: "user10", target: "user13", value: 1 },
      ],
    },
  },
  {
    id: "betweenness",
    name: "Betweenness Centrality",
    type: "centrality",
    description: "Identifies bridge users who connect different communities in the network",
    query: `// Run Betweenness Centrality to find bridge users
CALL gds.graph.project(
  'socialGraph',
  'User',
  {
    FRIENDS_WITH: {
      orientation: 'UNDIRECTED'
    },
    FOLLOWS: {
      orientation: 'NATURAL'
    }
  }
)

// Execute Betweenness Centrality algorithm
CALL gds.betweenness.stream('socialGraph')
YIELD nodeId, score
WITH gds.util.asNode(nodeId) AS user, score
RETURN user.name AS userName, 
       score AS betweennessScore,
       score / (gds.graph.nodeCount('socialGraph') - 1) * (gds.graph.nodeCount('socialGraph') - 2) AS normalizedScore
ORDER BY betweennessScore DESC
LIMIT 10

// Clean up
CALL gds.graph.drop('socialGraph')`,
    metrics: [
      {
        name: "Max Score",
        value: "245.6",
        description: "Highest betweenness centrality score",
      },
      {
        name: "Execution Time",
        value: "320ms",
        description: "Total algorithm execution time",
      },
      {
        name: "Memory Usage",
        value: "56MB",
        description: "Peak memory usage during execution",
      },
    ],
    visualData: {
      nodes: [
        { id: "user1", name: "John", score: 0.95, group: 1 },
        { id: "user2", name: "Emma", score: 0.82, group: 1 },
        { id: "user3", name: "Michael", score: 0.75, group: 2 },
        { id: "user4", name: "Sarah", score: 0.68, group: 2 },
        { id: "user5", name: "David", score: 0.45, group: 1 },
        { id: "user6", name: "Alice", score: 0.92, group: 3 },
        { id: "user7", name: "Bob", score: 0.35, group: 3 },
        { id: "user8", name: "Carol", score: 0.28, group: 2 },
        { id: "user9", name: "Dave", score: 0.22, group: 3 },
        { id: "user10", name: "Eve", score: 0.88, group: 4 },
        { id: "user11", name: "Frank", score: 0.32, group: 4 },
        { id: "user12", name: "Grace", score: 0.25, group: 4 },
        { id: "user13", name: "Henry", score: 0.78, group: 5 },
        { id: "user14", name: "Ivy", score: 0.3, group: 5 },
        { id: "user15", name: "Jack", score: 0.18, group: 5 },
      ],
      links: [
        { source: "user1", target: "user2", value: 1 },
        { source: "user1", target: "user3", value: 1 },
        { source: "user1", target: "user6", value: 1 },
        { source: "user2", target: "user4", value: 1 },
        { source: "user2", target: "user5", value: 1 },
        { source: "user3", target: "user4", value: 1 },
        { source: "user3", target: "user8", value: 1 },
        { source: "user5", target: "user4", value: 1 },
        { source: "user6", target: "user7", value: 1 },
        { source: "user6", target: "user9", value: 1 },
        { source: "user6", target: "user10", value: 1 },
        { source: "user7", target: "user9", value: 1 },
        { source: "user8", target: "user4", value: 1 },
        { source: "user10", target: "user11", value: 1 },
        { source: "user10", target: "user12", value: 1 },
        { source: "user10", target: "user13", value: 1 },
        { source: "user11", target: "user12", value: 1 },
        { source: "user13", target: "user14", value: 1 },
        { source: "user13", target: "user15", value: 1 },
        { source: "user14", target: "user15", value: 1 },
      ],
    },
  },
  {
    id: "triangle-count",
    name: "Triangle Count & Clustering",
    type: "community",
    description: "Measures the clustering and interconnectedness of the social network",
    query: `// Run Triangle Count to analyze network clustering
CALL gds.graph.project(
  'socialGraph',
  'User',
  {
    FRIENDS_WITH: {
      orientation: 'UNDIRECTED'
    }
  }
)

// Execute Triangle Count algorithm
CALL gds.triangleCount.stream('socialGraph')
YIELD nodeId, triangleCount, localClusteringCoefficient
WITH gds.util.asNode(nodeId) AS user, 
     triangleCount,
     localClusteringCoefficient
RETURN user.name AS userName,
       triangleCount,
       localClusteringCoefficient,
       CASE 
         WHEN localClusteringCoefficient >= 0.7 THEN 'Highly Clustered'
         WHEN localClusteringCoefficient >= 0.4 THEN 'Moderately Clustered'
         ELSE 'Loosely Connected'
       END AS clusterCategory
ORDER BY triangleCount DESC, localClusteringCoefficient DESC
LIMIT 10

// Clean up
CALL gds.graph.drop('socialGraph')`,
    metrics: [
      {
        name: "Global Clustering",
        value: "0.65",
        description: "Average clustering coefficient",
      },
      {
        name: "Total Triangles",
        value: "1,245",
        description: "Total number of triangles in the network",
      },
      {
        name: "Execution Time",
        value: "145ms",
        description: "Total algorithm execution time",
      },
    ],
    visualData: {
      nodes: [
        { id: "user1", name: "John", community: 0, triangles: 8, group: 0 },
        { id: "user2", name: "Emma", community: 0, triangles: 7, group: 0 },
        { id: "user3", name: "Michael", community: 0, triangles: 6, group: 0 },
        { id: "user4", name: "Sarah", community: 0, triangles: 5, group: 0 },
        { id: "user5", name: "David", community: 0, triangles: 4, group: 0 },
        { id: "user6", name: "Alice", community: 1, triangles: 6, group: 1 },
        { id: "user7", name: "Bob", community: 1, triangles: 5, group: 1 },
        { id: "user8", name: "Carol", community: 1, triangles: 4, group: 1 },
        { id: "user9", name: "Dave", community: 1, triangles: 3, group: 1 },
        { id: "user10", name: "Eve", community: 2, triangles: 5, group: 2 },
        { id: "user11", name: "Frank", community: 2, triangles: 4, group: 2 },
        { id: "user12", name: "Grace", community: 2, triangles: 3, group: 2 },
        { id: "user13", name: "Henry", community: 3, triangles: 2, group: 3 },
        { id: "user14", name: "Ivy", community: 3, triangles: 1, group: 3 },
        { id: "user15", name: "Jack", community: 3, triangles: 1, group: 3 },
      ],
      links: [
        { source: "user1", target: "user2", value: 1 },
        { source: "user1", target: "user3", value: 1 },
        { source: "user1", target: "user4", value: 1 },
        { source: "user1", target: "user5", value: 1 },
        { source: "user2", target: "user3", value: 1 },
        { source: "user2", target: "user4", value: 1 },
        { source: "user2", target: "user5", value: 1 },
        { source: "user3", target: "user4", value: 1 },
        { source: "user3", target: "user5", value: 1 },
        { source: "user4", target: "user5", value: 1 },
        { source: "user6", target: "user7", value: 1 },
        { source: "user6", target: "user8", value: 1 },
        { source: "user6", target: "user9", value: 1 },
        { source: "user7", target: "user8", value: 1 },
        { source: "user7", target: "user9", value: 1 },
        { source: "user8", target: "user9", value: 1 },
        { source: "user10", target: "user11", value: 1 },
        { source: "user10", target: "user12", value: 1 },
        { source: "user11", target: "user12", value: 1 },
        { source: "user13", target: "user14", value: 1 },
        { source: "user13", target: "user15", value: 1 },
        { source: "user1", target: "user6", value: 1 },
        { source: "user6", target: "user10", value: 1 },
        { source: "user10", target: "user13", value: 1 },
      ],
    },
  },
  {
    id: "shortest-path",
    name: "Shortest Path",
    type: "pathfinding",
    description: "Finds the shortest paths between users in the social network",
    query: `// Run Shortest Path to find connections between users
CALL gds.graph.project(
  'socialGraph',
  'User',
  {
    FRIENDS_WITH: {
      orientation: 'UNDIRECTED',
      properties: ['strength']
    },
    FOLLOWS: {
      orientation: 'NATURAL',
      properties: ['weight']
    }
  },
  {
    relationshipProperties: ['strength', 'weight']
  }
)

// Execute Shortest Path algorithm
MATCH (source:User {id: 'user123'}), (target:User {id: 'user789'})
CALL gds.shortestPath.dijkstra.stream('socialGraph', {
  sourceNode: source,
  targetNode: target,
  relationshipWeightProperty: 'strength'
})
YIELD index, sourceNode, targetNode, totalCost, nodeIds, costs, path
RETURN
  gds.util.asNode(sourceNode).name AS sourceUserName,
  gds.util.asNode(targetNode).name AS targetUserName,
  totalCost,
  [nodeId IN nodeIds | gds.util.asNode(nodeId).name] AS pathNames,
  costs

// Clean up
CALL gds.graph.drop('socialGraph')`,
    metrics: [
      {
        name: "Path Length",
        value: "4 hops",
        description: "Number of connections in the shortest path",
      },
      {
        name: "Path Cost",
        value: "2.8",
        description: "Total weighted cost of the path",
      },
      {
        name: "Execution Time",
        value: "65ms",
        description: "Total algorithm execution time",
      },
    ],
    visualData: {
      nodes: [
        { id: "user1", name: "John", group: 1 },
        { id: "user2", name: "Emma", group: 1 },
        { id: "user3", name: "Michael", group: 2 },
        { id: "user4", name: "Sarah", group: 2 },
        { id: "user5", name: "David", group: 3 },
        { id: "user6", name: "Alice", group: 3 },
        { id: "user7", name: "Bob", group: 4 },
        { id: "user8", name: "Carol", group: 4 },
        { id: "user9", name: "Dave", group: 5 },
        { id: "user10", name: "Eve", group: 5 },
      ],
      links: [
        { source: "user1", target: "user2", value: 1 },
        { source: "user2", target: "user3", value: 1 },
        { source: "user3", target: "user4", value: 1 },
        { source: "user4", target: "user5", value: 1 },
        { source: "user5", target: "user6", value: 1 },
        { source: "user6", target: "user7", value: 1 },
        { source: "user7", target: "user8", value: 1 },
        { source: "user8", target: "user9", value: 1 },
        { source: "user9", target: "user10", value: 1 },
        { source: "user1", target: "user3", value: 1, highlight: true },
        { source: "user3", target: "user6", value: 1, highlight: true },
        { source: "user6", target: "user10", value: 1, highlight: true },
      ],
    },
  },
]

