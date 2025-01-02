import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connect from "@/database/mongo.config";
import { authOptions } from "../../auth/[...nextauth]/options";
import Inscription from "@/models/Inscriptions";
import { ApiResponse } from "@/types";
import { auth } from "@/database/auth";

interface SaveRequest {
  itemId: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connect();

    const { itemId, text } = await request.json();
    if (!itemId || !text) {
      return new Response("Item ID and comment text are required", { status: 400 });
    }

    const inscription = await Inscription.findById(itemId);
    if (!inscription) {
      return new Response("Item not found", { status: 404 });
    }

    // Add new comment
    inscription.comments.push({ userId: session.user._id, text });
    await inscription.save();

    return new Response(
      JSON.stringify({ success: true, data: inscription }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return new Response(
      JSON.stringify({ success: false, error: "error.message" }),
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
