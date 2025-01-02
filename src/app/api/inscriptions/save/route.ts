
import { getServerSession } from "next-auth/next";
import connect from "@/database/mongo.config";
import { authOptions } from "../../auth/[...nextauth]/options";
import Inscription from "@/models/Inscriptions";
import SavedItem from "@/models/SavedItem";
export async function POST(request: Request) {
  try {
    // Get session from the API route (not from React component)
    const session = await getServerSession(authOptions); // authOptions should be your NextAuth.js configuration
    console.log(session);
    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connect();

    const { itemId } = await request.json();
    const userId = session.user._id; // Use user id from session
    console.log(userId, itemId);

    if (!userId) {
      throw new Error("User ID is missing from session.");
    }

    // Check if the item exists
    const inscription = await Inscription.findById(itemId);
    if (!inscription) {
      return new Response("Item not found", { status: 404 });
    }

    // Check if the item is already saved
    const existingSavedItem = await SavedItem.findOne({ userId, itemId });
    if (!existingSavedItem) {
      // Save the item
      const savedItem = new SavedItem({ userId, itemId });
      await savedItem.save();
    }

    const savedItems = await SavedItem.find({ userId }).populate("itemId");

    return new Response(JSON.stringify({ success: true, savedItems }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error saving item:", error);
    return new Response(
      JSON.stringify({ success: false, error: "error.message " }),
      { status: 500 }
    );
  }
}


export const dynamic = 'force-dynamic';
