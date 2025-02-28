export const queryExamples = [
  {
    id: "friends-of-friends",
    name: "Friends of Friends",
    description: "Find friends of friends who are not already friends with the user",
    query: `// Find friends of friends who are not already friends
MATCH (user:User {id: "user123"})-[:FRIENDS_WITH]->(friend:User)
MATCH (friend)-[:FRIENDS_WITH]->(fof:User)
WHERE NOT (user)-[:FRIENDS_WITH]->(fof) 
  AND user <> fof
RETURN fof.name AS suggestedFriend, 
       count(friend) AS mutualFriends,
       collect(friend.name) AS mutualFriendNames
ORDER BY mutualFriends DESC
LIMIT 10`,
    executionTime: 45,
    queryPlan: "NodeByLabelScan → Expand → Expand → Filter → Aggregate",
    results: {
      columns: ["suggestedFriend", "mutualFriends", "mutualFriendNames"],
      rows: [
        ["Alice Johnson", 3, "Bob Smith, Carol White, Dave Brown"],
        ["Emma Davis", 2, "Bob Smith, Carol White"],
        ["Frank Miller", 2, "Dave Brown, Eve Wilson"],
        ["Grace Taylor", 1, "Carol White"],
        ["Henry Moore", 1, "Dave Brown"],
      ],
      total: 12,
    },
  },
  {
    id: "influential-users",
    name: "Most Influential Users",
    description: "Find the most influential users based on followers and engagement",
    query: `// Find influential users based on followers and engagement
MATCH (user:User)
OPTIONAL MATCH (user)<-[:FOLLOWS]-(follower:User)
OPTIONAL MATCH (user)<-[:LIKES]-(liker:User)
WITH user, 
     count(DISTINCT follower) AS followerCount,
     count(DISTINCT liker) AS likeCount
RETURN user.name AS userName,
       user.id AS userId,
       followerCount,
       likeCount,
       followerCount * 1.0 + likeCount * 0.5 AS influenceScore
ORDER BY influenceScore DESC
LIMIT 10`,
    executionTime: 125,
    queryPlan: "NodeByLabelScan → OptionalExpand → OptionalExpand → Aggregate → Sort",
    results: {
      columns: ["userName", "userId", "followerCount", "likeCount", "influenceScore"],
      rows: [
        ["John Smith", "user456", 245, 189, 339.5],
        ["Emma Wilson", "user789", 198, 267, 331.5],
        ["Michael Brown", "user234", 176, 203, 277.5],
        ["Sarah Davis", "user567", 154, 187, 247.5],
        ["David Jones", "user890", 132, 156, 210.0],
      ],
      total: 50,
    },
  },
  {
    id: "content-engagement",
    name: "Content Engagement",
    description: "Analyze engagement metrics for user content",
    query: `// Analyze engagement metrics for user content
MATCH (user:User {id: "user123"})-[:POSTED]->(post:Post)
OPTIONAL MATCH (post)<-[:LIKES]-(liker:User)
OPTIONAL MATCH (post)<-[:COMMENTS_ON]-(comment:Comment)
OPTIONAL MATCH (comment)<-[:POSTED]-(commenter:User)
WITH post, 
     count(DISTINCT liker) AS likeCount,
     count(DISTINCT comment) AS commentCount,
     collect(DISTINCT commenter.name) AS commenters
RETURN post.id AS postId,
       post.content AS content,
       post.timestamp AS postedAt,
       likeCount,
       commentCount,
       commenters,
       likeCount + commentCount * 2 AS engagementScore
ORDER BY engagementScore DESC
LIMIT 5`,
    executionTime: 87,
    queryPlan: "NodeByLabelScan → Expand → OptionalExpand → OptionalExpand → OptionalExpand → Aggregate → Sort",
    results: {
      columns: ["postId", "content", "postedAt", "likeCount", "commentCount", "commenters", "engagementScore"],
      rows: [
        [
          "post123",
          "Just launched our new product!",
          "2023-05-15T10:30:00Z",
          45,
          12,
          ["Alice", "Bob", "Carol", "Dave"],
          69,
        ],
        ["post456", "Check out this amazing view!", "2023-06-02T14:15:00Z", 38, 8, ["Emma", "Frank", "Grace"], 54],
        [
          "post789",
          "Happy to announce our partnership with...",
          "2023-04-20T09:45:00Z",
          32,
          7,
          ["Henry", "Ivy", "Jack"],
          46,
        ],
        [
          "post234",
          "What do you think about this design?",
          "2023-05-28T16:20:00Z",
          25,
          9,
          ["Kelly", "Liam", "Mike", "Nina"],
          43,
        ],
        ["post567", "Throwback to last year's conference", "2023-03-10T11:05:00Z", 29, 5, ["Oscar", "Penny"], 39],
      ],
      total: 24,
    },
  },
  {
    id: "community-detection",
    name: "Community Detection",
    description: "Identify communities based on user interactions",
    query: `// Identify communities based on user interactions
CALL gds.graph.project(
  'socialGraph',
  ['User'],
  {
    FRIENDS_WITH: {
      orientation: 'UNDIRECTED'
    }
  }
)

// Run Louvain algorithm for community detection
CALL gds.louvain.stream('socialGraph')
YIELD nodeId, communityId
WITH gds.util.asNode(nodeId) AS user, communityId
RETURN communityId,
       count(*) AS communitySize,
       collect(user.name) AS members
ORDER BY communitySize DESC
LIMIT 5

// Clean up
CALL gds.graph.drop('socialGraph')`,
    executionTime: 320,
    queryPlan: "ProcedureCall → ProcedureCall → Projection → Aggregate → Sort",
    results: {
      columns: ["communityId", "communitySize", "members"],
      rows: [
        [0, 24, ["John", "Emma", "Michael", "Sarah", "David", "..."]],
        [1, 18, ["Alice", "Bob", "Carol", "Dave", "Eve", "..."]],
        [2, 15, ["Frank", "Grace", "Henry", "Ivy", "Jack", "..."]],
        [3, 12, ["Kelly", "Liam", "Mike", "Nina", "Oscar", "..."]],
        [4, 9, ["Penny", "Quinn", "Robert", "Susan", "Tom", "..."]],
      ],
      total: 8,
    },
  },
  {
    id: "recommendation-engine",
    name: "Content Recommendation",
    description: "Recommend content based on user interests and connections",
    query: `// Recommend content based on user interests and connections
MATCH (user:User {id: "user123"})
MATCH (user)-[:FOLLOWS]->(friend:User)
MATCH (friend)-[:POSTED]->(post:Post)
WHERE NOT (user)-[:LIKES]->(post)
  AND NOT (user)-[:POSTED]->(post)

// Find hashtags the user has engaged with
OPTIONAL MATCH (user)-[:POSTED]->(:Post)-[:TAGGED_WITH]->(userTag:Hashtag)
OPTIONAL MATCH (post)-[:TAGGED_WITH]->(postTag:Hashtag)
WITH user, friend, post, collect(DISTINCT userTag.name) AS userTags, 
     collect(DISTINCT postTag.name) AS postTags

// Calculate similarity score
WITH user, friend, post, userTags, postTags,
     size([tag IN postTags WHERE tag IN userTags]) AS tagOverlap,
     size(userTags) AS userTagCount,
     size(postTags) AS postTagCount

// Calculate recommendation score
WITH user, friend, post,
     CASE WHEN userTagCount = 0 OR postTagCount = 0 THEN 0
          ELSE toFloat(tagOverlap) / sqrt(userTagCount * postTagCount)
     END AS contentSimilarity,
     timestamp() - apoc.date.parse(post.timestamp, 'ms', 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') AS recency

RETURN post.id AS postId,
       post.content AS content,
       friend.name AS postedBy,
       contentSimilarity,
       recency,
       contentSimilarity * 0.7 + (1 - recency/2592000000) * 0.3 AS recommendationScore
ORDER BY recommendationScore DESC
LIMIT 10`,
    executionTime: 245,
    queryPlan: "NodeByLabelScan → Expand → Expand → Filter → OptionalExpand → OptionalExpand → Projection → Sort",
    results: {
      columns: ["postId", "content", "postedBy", "contentSimilarity", "recency", "recommendationScore"],
      rows: [
        ["post345", "New developments in graph database technology", "Emma Wilson", 0.82, 172800000, 0.724],
        ["post678", "The future of social networks", "Michael Brown", 0.75, 259200000, 0.675],
        ["post901", "How to optimize your Neo4j queries", "Sarah Davis", 0.67, 86400000, 0.669],
        ["post234", "Graph algorithms for beginners", "David Jones", 0.58, 345600000, 0.566],
        ["post567", "Building recommendation engines with Neo4j", "John Smith", 0.63, 432000000, 0.551],
      ],
      total: 28,
    },
  },
  {
    id: "shortest-path",
    name: "Shortest Path",
    description: "Find the shortest connection path between two users",
    query: `// Find shortest path between two users
MATCH path = shortestPath(
  (user1:User {id: "user123"})-[:FRIENDS_WITH|FOLLOWS*1..6]-(user2:User {id: "user789"})
)
UNWIND nodes(path) AS person
RETURN person.name AS person
ORDER BY id(person)`,
    executionTime: 65,
    queryPlan: "NodeByLabelScan → ShortestPath → Projection → Sort",
    results: {
      columns: ["person"],
      rows: [["John Doe"], ["Bob Smith"], ["Carol White"], ["Emma Wilson"]],
      total: 4,
    },
  },
  {
    id: "user-similarity",
    name: "User Similarity",
    description: "Calculate similarity between users based on shared interests",
    query: `// Calculate similarity between users based on shared interests
MATCH (user:User {id: "user123"})
MATCH (otherUser:User)
WHERE user <> otherUser

// Find common liked content
OPTIONAL MATCH (user)-[:LIKES]->(content1)<-[:LIKES]-(otherUser)
WITH user, otherUser, count(DISTINCT content1) AS commonLikes

// Find common group memberships
OPTIONAL MATCH (user)-[:MEMBER_OF]->(group)<-[:MEMBER_OF]-(otherUser)
WITH user, otherUser, commonLikes, count(DISTINCT group) AS commonGroups

// Find common hashtag interests
OPTIONAL MATCH (user)-[:POSTED]->(:Post)-[:TAGGED_WITH]->(tag)<-[:TAGGED_WITH]-(:Post)<-[:POSTED]-(otherUser)
WITH user, otherUser, commonLikes, commonGroups, count(DISTINCT tag) AS commonTags

// Calculate Jaccard similarity for likes
OPTIONAL MATCH (user)-[:LIKES]->(userLikes)
WITH user, otherUser, commonLikes, commonGroups, commonTags, count(DISTINCT userLikes) AS totalUserLikes

OPTIONAL MATCH (otherUser)-[:LIKES]->(otherUserLikes)
WITH user, otherUser, commonLikes, commonGroups, commonTags, totalUserLikes, count(DISTINCT otherUserLikes) AS totalOtherUserLikes

// Calculate similarity score
WITH user, otherUser, commonLikes, commonGroups, commonTags, totalUserLikes, totalOtherUserLikes,
     CASE WHEN totalUserLikes + totalOtherUserLikes - commonLikes = 0 THEN 0
          ELSE toFloat(commonLikes) / (totalUserLikes + totalOtherUserLikes - commonLikes)
     END AS likesSimilarity

RETURN otherUser.name AS otherUser,
       commonLikes,
       commonGroups,
       commonTags,
       likesSimilarity,
       (likesSimilarity * 0.5) + (commonGroups * 0.3 / 10) + (commonTags * 0.2 / 20) AS similarityScore
ORDER BY similarityScore DESC
LIMIT 10`,
    executionTime: 178,
    queryPlan:
      "NodeByLabelScan → Filter → OptionalExpand → OptionalExpand → OptionalExpand → OptionalExpand → OptionalExpand → Projection → Sort",
    results: {
      columns: ["otherUser", "commonLikes", "commonGroups", "commonTags", "likesSimilarity", "similarityScore"],
      rows: [
        ["Emma Wilson", 28, 3, 12, 0.65, 0.451],
        ["Michael Brown", 22, 4, 8, 0.58, 0.41],
        ["Sarah Davis", 19, 2, 15, 0.52, 0.38],
        ["David Jones", 24, 1, 7, 0.48, 0.304],
        ["Alice Johnson", 15, 3, 9, 0.42, 0.3],
      ],
      total: 49,
    },
  },
]

