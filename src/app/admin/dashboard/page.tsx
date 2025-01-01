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
    <div className="p-2">
      <div className="mb-4">
      <h1 className="text-white text-2xl font-serif ml-2 ">Ordinals</h1>
      <div className="flex justify-end gap-4">
        <h1 className="text-sm font-bold text-white">
          {session && session.user?.name}
        </h1>
        
        <SignoutButton type="Admin" />
        
      </div>
      </div>
      <DashboardView />
    </div>
  );
}
