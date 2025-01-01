"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

export default function SignoutButton({ type }: { type?: string }) {
  return (
    <div>
      <button
        onClick={() =>
          signOut({
            callbackUrl: type == "Admin" ? "/admin/login" : "/login",
            redirect: true,
          })
        }
        className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
      >
        <FaSignOutAlt className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}
