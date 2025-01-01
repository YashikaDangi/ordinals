"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";

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
    router.push("/dashboard");
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
    <div ref={sidebarRef} className="bg-black p-6 w-64">
      <div className="mb-8"></div>
      <button
        onClick={handleHomeClick}
        className="w-full bg-gray-800 text-white p-2 rounded-lg mb-4"
      >
        Home
      </button>
      <button
        onClick={handleSavedPostsClick}
        className="w-full bg-gray-800 text-white p-2 rounded-lg mb-4"
      >
        Saved Posts
      </button>

      <div className="mt-2">
        {isSearching ? (
          <div className="flex items-center">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by inscription number"
              className="w-full p-2 rounded-l-3xl bg-black text-white placeholder-gray-400"
            />

            <button
              onClick={handleSearchSubmit}
              className=" bg-black text-white rounded-r-3xl"
            >
              <AiOutlineSearch />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsSearching(true)}
            className="w-full bg-gray-800 text-white p-2 rounded-lg mb-4 flex items-center justify-center"
          >
            <AiOutlineSearch className="mr-2" />
            Search
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
