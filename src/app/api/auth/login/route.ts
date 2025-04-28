import connect from "@/database/mongo.config";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import vine, { errors } from "@vinejs/vine";
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/validator/authValidationSchema";

export async function POST(request: NextRequest) {
  try {
    // Ensure database connection
    await connect();
    const body = await request.json();
    console.log("Request body received:", body);
    const validator = vine.compile(loginSchema);
    const output = await validator.validate(body);
    console.log("Validation passed:", output);
    const user = await User.findOne({ email: output.email });
    if (user) {
      const checkPassword = bcrypt.compareSync(output.password!, user.password);
      if (checkPassword) {
        return NextResponse.json(
          { status: 200, message: "User Logged in successfully!" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { status: 400, errors: { email: "Please check your credentials." } },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: 400,
        errors: { email: "No User found in our system with above email." },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Occurred:", error);
    // if (error instanceof errors.E_VALIDATION_ERROR) {
    //   return NextResponse.json(
    //     { status: 400, errors: error.messages },
    //     { status: 200 }
    //   );
    // }
    return NextResponse.json(
      { status: 500, errors: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
