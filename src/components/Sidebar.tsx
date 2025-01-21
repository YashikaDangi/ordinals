"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { CiBookmark, CiHeart, CiHome, CiSearch } from "react-icons/ci";
import { usePathname } from "next/navigation";
import _ from "lodash";

interface SidebarProps {
  onSearch: (query: string) => void;
}

const Sidebar = ({ onSearch }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Create a debounced search function
  const debouncedSearch = useCallback(
    _.debounce((query: string) => {
      // if (!query.trim()) return;
      onSearch(query);
      setIsSearching(false);
    }, 500),
    [onSearch]
  );

  // Handle input change with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);
    debouncedSearch(query);
  };

  // Clear debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const navigationItems = [
    { icon: CiHome, label: "Home", path: "/" },
    { icon: CiBookmark, label: "Saved", path: "/savedPosts" },
    { icon: CiHeart, label: "Likes", path: "/likedPosts" },
  ];

  return (
    <aside
      ref={sidebarRef}
      className="fixed left-0 top-16 bottom-0 w-80 bg-[#111111] border-r border-[#1F1F1F] overflow-y-auto"
    >
      <div className="flex flex-col h-full p-4">
        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search inscriptions..."
              className="w-full px-4 py-2.5 bg-[#1F1F1F] text-[#F0F0F0] 
                       placeholder-[#808080] rounded-lg
                       border border-[#2A2A2A] focus:border-[#9D5CFF]
                       focus:outline-none transition-colors duration-200"
            />
            <div
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2
                       text-[#808080]"
            >
              <CiSearch
                className={`w-5 h-5 ${isSearching ? "animate-pulse" : ""}`}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className={`
                  w-full flex items-center px-4 py-2.5 rounded-lg
                  transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-[#9D5CFF] text-white"
                      : "text-[#808080] hover:bg-[#2A2A2A] hover:text-white"
                  }
                `}
              >
                <item.icon
                  className={`
                  w-5 h-5 mr-3 transition-transform duration-200
                  ${isActive ? "text-white" : "text-[#808080]"}
                  group-hover:scale-110 group-hover:text-white
                `}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6" />
      </div>
    </aside>
  );
};

export default Sidebar;
