import connect from "@/database/mongo.config";
import SavedItem from "@/models/SavedItem";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions); // authOptions should be your NextAuth.js configuration
        // console.log(session);
        if (!session || !session.user) {
          return new Response("Unauthorized", { status: 401 });
        }
        if (!session?.user?._id) { // Check specifically for user ID
          return new Response("Unauthorized - User ID required", { status: 401 });
        }
  
      await connect();
  
      const userId = session.user._id;
    //   console.log(userId)
  
      // Fetch saved items for the user
      const savedItems = await SavedItem.find({ userId }).populate("itemId");
      console.log(savedItems)
  
      return new Response(JSON.stringify({ success: true, savedItems }), {
        status: 200,
      });
    } catch (error) {
      console.error("Error fetching saved items:", error);
      return new NextResponse(
        JSON.stringify({ success: false, error: "error" }), // Use actual error message
        { status: 500 }
      );
    }
  }
  
  export const dynamic = 'force-dynamic';
