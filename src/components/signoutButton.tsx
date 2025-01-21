"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface SignoutButtonProps {
  type?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function SignoutButton({
  type,
  className,
  children,
}: SignoutButtonProps) {
  const handleSignOut = () => {
    signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  // If a custom className is provided, use it; otherwise, use default styles
  const buttonClasses =
    className ||
    `
    inline-flex items-center gap-2 px-4 py-2
    bg-[#1F1F1F] hover:bg-red-500/10
    text-red-500 rounded-lg 
    transition-all duration-200 
    font-medium text-sm
    border border-red-500/20 hover:border-red-500/30
    hover:shadow-lg hover:shadow-red-500/10
    focus:outline-none focus:ring-2 focus:ring-red-500/20
    active:transform active:scale-95
  `;

  return (
    <button
      onClick={handleSignOut}
      className={buttonClasses}
      type="button"
      aria-label="Sign out"
    >
      {children || (
        <>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </>
      )}
    </button>
  );
}
