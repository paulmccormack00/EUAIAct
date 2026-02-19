export const ROLES = {
  all: { id: "all", label: "All provisions", icon: "📋", description: "Complete Act" },
  provider: { 
    id: "provider", label: "Provider of AI", icon: "🏗", 
    description: "You develop, train, or place AI systems or GPAI models on the market",
    articles: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,25,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,71,72,73,74,78,79,80,81,82,83,84,95,96,99,100,101,111,112,113]
  },
  deployer: { 
    id: "deployer", label: "Deployer of AI", icon: "⚙", 
    description: "You use AI systems under your authority in a professional capacity",
    articles: [1,2,3,4,5,6,7,9,13,14,15,20,25,26,27,43,49,50,57,58,60,61,62,71,72,73,74,78,85,86,87,95,96,99,111,112,113]
  },
  affected: { 
    id: "affected", label: "Affected person", icon: "👤", 
    description: "You are subject to decisions made by AI systems and want to understand your rights",
    articles: [1,2,3,4,5,50,77,85,86,87,95,96,99,112,113]
  },
};
