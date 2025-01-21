import connect from "@/database/mongo.config";
import Inscription from "@/models/Inscriptions";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - User ID required" },
        { status: 401 }
      );
    }

    const userId = session.user._id;
    console.log(userId)

    // Connect to the database
    await connect();

    // Query liked posts
    const likedPosts = await Inscription.find({ likes: userId }).select(
        "collection_item_name inscription_id content_type"
      );
  
      console.log("Liked Posts:", likedPosts);
  

    if (!likedPosts || likedPosts.length === 0) {
      return NextResponse.json(
        { success: true, likedPosts: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, likedPosts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch liked posts" },
      { status: 500 }
    );
  }
}
