"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { CiBookmark, CiHome, CiSearch } from "react-icons/ci";

interface SidebarProps {
  onSearch: (query: string) => void;
}

const Sidebar = ({ onSearch }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery) return;

    // Notify parent component about the search query
    onSearch(searchQuery);

    setIsSearching(false); // Optionally close the search input

    try {
      const response = await fetch(
        `/api/searchData?inscription_number=${searchQuery}`
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data); // Store search results
      } else {
        console.log("No results found");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setSearchResults([]);
    }
  };

  const handleClick = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setIsSearching(false);
    }
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleSavedPostsClick = () => {
    router.push("/saved-posts");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div ref={sidebarRef} className="p-6 w-64 h-full">
      <div className="mt-4 mb-6">
        <div className="flex items-center mb-4 space-x-2 ">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Inscription number"
            className="w-full p-1 rounded-3xl bg-white text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={handleSearchSubmit}
            className="bg-black text-white p-1 transition duration-300 flex items-center justify-center"
          >
            <CiSearch className="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        onClick={handleHomeClick}
        className="w-full bg-white text-gray-900 p-1 rounded-lg mb-4 flex items-center justify-start gap-3 hover:bg-gray-200 transition duration-300"
      >
        <CiHome className="w-5 h-5 text-gray-900" />
        <span className="font-medium">Home</span>
      </button>

      <button
        onClick={handleSavedPostsClick}
        className="w-full bg-white text-gray-900 p-1 rounded-lg mb-4 flex items-center justify-start gap-3 hover:bg-gray-200 transition duration-300"
      >
        <CiBookmark className="w-5 h-5 text-gray-900" />
        <span className="font-medium">Save</span>
      </button>
    </div>
  );
};

export default Sidebar;
