export const schemaData = {
  nodes: [
    {
      id: "User",
      label: "User",
      color: "#4299E1", // blue
      properties: ["id", "name", "email", "joinDate", "age", "gender", "location"],
    },
    {
      id: "Post",
      label: "Post",
      color: "#48BB78", // green
      properties: ["id", "content", "timestamp", "visibility"],
    },
    {
      id: "Comment",
      label: "Comment",
      color: "#ED8936", // orange
      properties: ["id", "content", "timestamp"],
    },
    {
      id: "Group",
      label: "Group",
      color: "#9F7AEA", // purple
      properties: ["id", "name", "description", "createdAt"],
    },
    {
      id: "Hashtag",
      label: "Hashtag",
      color: "#F56565", // red
      properties: ["name", "count"],
    },
    {
      id: "Location",
      label: "Location",
      color: "#ECC94B", // yellow
      properties: ["name", "country", "latitude", "longitude"],
    },
  ],
  links: [
    {
      source: "User",
      target: "User",
      type: "FOLLOWS",
    },
    {
      source: "User",
      target: "User",
      type: "FRIENDS_WITH",
    },
    {
      source: "User",
      target: "Post",
      type: "POSTED",
    },
    {
      source: "User",
      target: "Post",
      type: "LIKES",
    },
    {
      source: "User",
      target: "Comment",
      type: "POSTED",
    },
    {
      source: "Comment",
      target: "Post",
      type: "COMMENTS_ON",
    },
    {
      source: "User",
      target: "Group",
      type: "MEMBER_OF",
    },
    {
      source: "Post",
      target: "Hashtag",
      type: "TAGGED_WITH",
    },
    {
      source: "User",
      target: "Location",
      type: "LOCATED_AT",
    },
  ],
}

