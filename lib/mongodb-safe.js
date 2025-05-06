import { MongoClient } from "mongodb";

// Mock MongoDB client for environments without MongoDB
class MockMongoClient {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    console.log("Using mock MongoDB client");
    this.isConnected = true;
    return this;
  }

  db() {
    return {
      collection: (name) => ({
        findOne: async () => null,
        find: () => ({
          toArray: async () => [],
          sort: () => ({
            toArray: async () => [],
          }),
        }),
        insertOne: async () => ({ insertedId: "mock-id" }),
        updateOne: async () => ({ modifiedCount: 1 }),
        deleteOne: async () => ({ deletedCount: 1 }),
        countDocuments: async () => 0,
        aggregate: () => ({
          toArray: async () => [],
        }),
      }),
    };
  }
}

// Determine if we should use a real or mock client
const shouldUseMockClient = () => {
  // Check if we're in a Vercel preview deployment or if MongoDB URI is missing
  return (
    process.env.VERCEL_ENV === "preview" ||
    !process.env.MONGODB_URI ||
    process.env.MONGODB_URI.includes("your_mongodb_uri")
  );
};

let client;
let clientPromise;

try {
  if (shouldUseMockClient()) {
    console.log("Using mock MongoDB client");
    client = new MockMongoClient();
    clientPromise = client.connect();
  } else {
    const uri = process.env.MONGODB_URI;
    const options = {};

    if (process.env.NODE_ENV === "development") {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      // In production mode, it's best to not use a global variable.
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
  }
} catch (error) {
  console.error("MongoDB connection error:", error);
  // Fallback to mock client
  client = new MockMongoClient();
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Helper function to connect to the database
export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "interview-agent");
  return { client, db };
}
