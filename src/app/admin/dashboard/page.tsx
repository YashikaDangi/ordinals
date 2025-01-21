import {
  CustomSession,
  authOptions,
} from "@/app/api/auth/[...nextauth]/options";
import SignoutButton from "@/components/signoutButton";
import DashboardView from "@/views/DashboardView";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { UserCircle, LogOut } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Ordinsta",
  description:
    "Manage your Ordinsta platform, view analytics, and control platform settings.",
};

export default async function AdminDashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="bg-[#111111] border-b border-[#1F1F1F] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-4 py-3">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.png"
                  alt="Ordinsta Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-[#F0F0F0] text-xl md:text-2xl font-serif tracking-wide">
                Ordinsta
              </h1>
            </div>

            {/* User Profile and Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-[#1F1F1F] group hover:bg-[#2A2A2A] transition-colors duration-200">
                  <UserCircle className="h-6 w-6 text-[#9D5CFF] group-hover:text-[#B685FF] transition-colors duration-200" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-[#F0F0F0]">
                    {session?.user?.name || "Administrator"}
                  </p>
                  <p className="text-xs text-[#808080]">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-[#1F1F1F]" />
              <SignoutButton
                type="Admin"
                className="flex items-center space-x-2 px-4 py-2 
                          bg-[#1F1F1F] hover:bg-red-500/10
                          text-red-500 rounded-lg transition-all 
                          duration-200 text-sm font-medium
                          border border-red-500/20 hover:border-red-500/30"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SignoutButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <DashboardView />
      </main>
    </div>
  );
}
