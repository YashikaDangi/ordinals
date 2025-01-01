// /types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      name?: string | null;
      email?: string | null;
      savedItems?: Array<any>; // Adjust the type to match your data structure
    };
  }

  interface User {
    _id: string;
    savedItems?: Array<any>; // Adjust the type to match your data structure
  }
}
