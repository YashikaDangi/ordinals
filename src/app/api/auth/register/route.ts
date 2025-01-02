// import { NextRequest, NextResponse } from "next/server";
// import connect  from "@/database/mongo.config";
// import { User } from "@/models/User";
// import { registerSchema } from "@/validator/authValidationSchema";
// import vine, { errors } from "@vinejs/vine";
// import ErrorReporter from "@/validator/ErrorReporter";
// import bcrypt from "bcryptjs";

// interface UserPayload {
//   name: string;
//   email: string;
//   password: string;
//   avtar?: string;
// }


// export async function POST(request: NextRequest) {
//   try {
//     connect();
//     const body: UserPayload = await request.json();
//     vine.errorReporter = () => new ErrorReporter();
//     const validator = vine.compile(registerSchema);
//     const output = await validator.validate(body);
//     try {
//       const user = await User.findOne({ email: output.email });
//       if (user) {
//         return NextResponse.json(
//           {
//             status: 400,
//             errors: {
//               email: "Email is already used.",
//             },
//           },
//           { status: 200 }
//         );
//       } else {
//         // * To Hash the password
//         const salt = bcrypt.genSaltSync(10);
//         output.password = bcrypt.hashSync(output.password, salt);
//         await User.create(output);
//         return NextResponse.json(
//           { status: 200, msg: "User Created successfully!" },
//           { status: 200 }
//         );
//       }
//     } catch (error) {
//       return NextResponse.json({ error }, { status: 500 });
//     }
//   } catch (error) {
//     if (error instanceof errors.E_VALIDATION_ERROR) {
//       return NextResponse.json(
//         { status: 400, errors: error.messages },
//         { status: 200 }
//       );
//     }
//   }
// }
// export const dynamic = 'force-dynamic';


import { NextRequest, NextResponse } from "next/server";
import connect from "@/database/mongo.config";
import { User } from "@/models/User";
import { registerSchema } from "@/validator/authValidationSchema";
import vine, { errors } from "@vinejs/vine";
import ErrorReporter from "@/validator/ErrorReporter";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const body = await request.json();

    // Validation
    vine.errorReporter = () => new ErrorReporter();
    const validator = vine.compile(registerSchema);
    const output = await validator.validate(body);

    // Check for existing user
    const user = await User.findOne({ email: output.email });
    if (user) {
      return NextResponse.json(
        { status: 400, errors: { email: "Email is already used." } },
        { status: 400 }
      );
    }

    // Hash password and create user
    const salt = bcrypt.genSaltSync(10);
    output.password = bcrypt.hashSync(output.password, salt);
    const newUser = await User.create(output);

    return NextResponse.json(
      { status: 200, message: "User created successfully", user: newUser },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        { status: 400, errors: error.messages },
        { status: 400 }
      );
    }

    console.error("Server error:", error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
