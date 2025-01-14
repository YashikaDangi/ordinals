import {
  CustomSession,
  authOptions,
} from "@/app/api/auth/[...nextauth]/options";
import SignoutButton from "@/components/signoutButton";
import DashboardView from "@/views/DashboardView";
import { getServerSession } from "next-auth";

import React from "react";

export default async function AdminDashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);


  return (
    <div>
      {/* Header */}
      <div className="bg-black flex justify-between items-center px-4 py-4 shadow-lg">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12c0 5.2 3.2 9.6 7.8 11.2.6.2.8-.2.8-.6V20.3c-3.2.6-3.8-1.4-3.8-1.4-.6-1.4-1.2-1.8-1.2-1.8-1-.8.2-.8.2-.8 1.2.2 1.8 1.2 1.8 1.2 1 .2 2.4.2 3.4.2.2-.8.6-1.2 1-1.4-2.4-.4-4.8-1.2-4.8-5.2 0-1 .4-2 1-2.6-.2-.4-.4-1-.4-2 0-1.6 1.2-2.8 2.8-2.8.6 0 1.2.2 1.8.4.6-.2 1.4-.6 2.2-.6.8 0 1.6.4 2.2.6.6-.2 1.2-.4 1.8-.4 1.6 0 2.8 1.2 2.8 2.8 0 1-.2 1.6-.4 2 .6.8 1 1.8 1 2.6 0 4-2.4 4.8-4.8 5.2.8.6 1.2 1.6 1.2 3v4.4c0 .4.2.8.8.6 4.6-1.6 7.8-6 7.8-11.2 0-6.6-5.4-12-12-12z" />
          </svg>
          <h1 className="text-white text-2xl font-serif">Explore</h1>
        </div>

        {/* Center section */}
        {/* <div className="flex gap-4">
          <div className="flex items-center bg-white text-black px-4 py-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 21v-6m0 0v-4a2 2 0 012-2h0a2 2 0 012 2v4m-4 0h4"
              />
            </svg>
            <button className="ml-2">
              Home
            </button>
          </div>
        </div> */}

        {/* Right section */}
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-bold text-white">
            {session && session.user?.name}
          </h1>
          <SignoutButton type="Admin" />
        </div>
      </div>

      {/* DashboardView */}
      <div className="mt-4 px-4">
        <DashboardView />
      </div>
    </div>
  );
}
