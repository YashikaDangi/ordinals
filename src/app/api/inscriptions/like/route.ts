import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ApiResponse, CollectionItem } from "@/types";
import { authOptions } from "../../auth/[...nextauth]/options";
import connect from "@/database/mongo.config";
import { auth } from "@/database/auth";
import Inscription from "@/models/Inscriptions";

interface LikeRequest {
  itemId: string;
}
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log({ session }, "IN /api/inscriptions/like");
    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connect();

    const { itemId } = await request.json();
    if (!itemId) {
      return new Response("Item ID is required", { status: 400 });
    }

    const inscription = await Inscription.findById(itemId);
    // console.log(`INSCRIPTION ${inscription.inscription_number}`);
    if (!inscription) {
      return new Response("Item not found", { status: 404 });
    }

    // Toggle like status
    const hasLiked = inscription.likes.includes(session.user._id);
    if (hasLiked) {
      // Remove like
      inscription.likes = inscription.likes.filter(
        (like: string) => like.toString() !== session.user._id
      );
      // console.log("DISLIKED BY ", session.user._id);
      // console.log("new likes: ", inscription.likes);
    } else {
      // Add like
      inscription.likes.push(session.user._id);
      // console.log("LIKED");
    }

    await inscription.save();
    console.log(inscription);

    return NextResponse.json({ success: true, inscription });
  } catch (error) {
    console.error("Error liking item:", error);
    return new Response(
      JSON.stringify({ success: false, error: "error.message" }),
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
