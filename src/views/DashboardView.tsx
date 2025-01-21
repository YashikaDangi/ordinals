// DashboardView.tsx
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MainComponent from "@/components/MainComponent";

const DashboardView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="flex">
      {/* Fixed width sidebar */}
      <div className="fixed top-0 left-0 w-80 h-screen">
        <Sidebar
          onSearch={(query) => {
            setSearchQuery(query);
          }}
        />
      </div>

      {/* Main content with margin to account for sidebar */}
      <div className="flex-1 ml-80">
        <MainComponent
          currentPath={pathname}
          searchQuery={searchQuery}
          session={session}
        />
      </div>
    </div>
  );
};

export default DashboardView;
