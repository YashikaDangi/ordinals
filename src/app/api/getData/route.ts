import { NextResponse } from "next/server";
import Inscriptions from "@/models/Inscriptions";
import connect from "@/database/mongo.config";

export async function GET() {
  try {
    // Connect to the database
    console.log("Connecting to database...");
    await connect();
    console.log("Connected successfully!");

    // Fetch the first 1000 records using the Inscription model
    console.log("Fetching first 1000 inscriptions...");
    const data = await Inscriptions.find({}).limit(100); // Fetch using Mongoose model

    console.log("Fetched data:", data.length);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching data:", error.message);

    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch data." },
      { status: 500 }
    );
  }
}
