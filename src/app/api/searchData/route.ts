import { NextResponse } from "next/server";
import Inscriptions from "@/models/Inscriptions";
import connect from "@/database/mongo.config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const inscription_number = searchParams.get("inscription_number");
  console.log("Searching for:", inscription_number);

  if (!inscription_number) {
    return NextResponse.json(
      { success: false, message: "Inscription number is required" },
      { status: 400 }
    );
  }

  try {
    await connect();

    const result = await Inscriptions.find({ inscription_number })
      .limit(10)
      .lean();

    console.log(result);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "No results found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
