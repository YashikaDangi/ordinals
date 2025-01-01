import connect from "@/database/mongo.config";
import { auth } from "@/database/auth";
import SavedItem from "@/models/SavedItem";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions); // authOptions should be your NextAuth.js configuration
        // console.log(session);
        if (!session || !session.user) {
          return new Response("Unauthorized", { status: 401 });
        }
      if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
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
      return new Response(
        JSON.stringify({ success: false, error: "error.message " }),
        {
          status: 500,
        }
      );
    }
  }
  