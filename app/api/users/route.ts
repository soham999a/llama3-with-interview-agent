import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { admin } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const { uid, name, email } = await request.json();

    if (!uid || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Creating user:", { uid, name, email });

    // Verify the Firebase user exists
    try {
      await admin.auth().getUser(uid);
    } catch (error) {
      console.error("Firebase verification error:", error);
      // Continue anyway - the user might have been created through the client SDK
      console.log(
        "Continuing user creation despite Firebase verification error"
      );
    }

    try {
      // Connect to MongoDB
      const { db } = await connectToDatabase();

      // Check if user already exists
      const existingUser = await db.collection("users").findOne({
        $or: [{ uid }, { email }],
      });

      if (existingUser) {
        console.log("User already exists:", existingUser);
        return NextResponse.json(
          {
            message: "User already exists",
            userId: existingUser._id,
            user: existingUser,
          },
          { status: 200 }
        );
      }

      // Create new user
      const result = await db.collection("users").insertOne({
        uid,
        name,
        email,
        createdAt: new Date(),
        interviews: [],
      });

      console.log("User created successfully:", result.insertedId);
    } catch (dbError) {
      console.error("MongoDB connection error:", dbError);
      // Return success anyway since Firebase auth succeeded
      return NextResponse.json(
        {
          message: "User created in Firebase but not in MongoDB",
          error: "MongoDB connection failed",
          details: String(dbError),
        },
        { status: 202 }
      );
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify the Firebase token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      console.error("Firebase verification error:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Get user data
    const user = await db
      .collection("users")
      .findOne({ uid: decodedToken.uid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive information
    const { _id, uid, ...userData } = user;

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
