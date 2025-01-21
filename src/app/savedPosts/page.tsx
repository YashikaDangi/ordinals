"use client";

import { useEffect, useState } from "react";
import { Loader2, Heart, UserCircle, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { usePathname } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import CardComponent from "@/components/CardComponent";
import { CommentModal } from "@/components/CommentModal";
import { CollectionItem } from "@/types";
import SignoutButton from "@/components/signoutButton";

const SavedPostsPage = () => {
  // State Management
  const [savedPosts, setSavedPosts] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);

  const { data: session } = useSession();
  const pathname = usePathname();

  // Fetch saved posts
  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!session?.user?._id) return;

      try {
        setLoading(true);
        const response = await axios.get("/api/inscriptions/getSavedPosts");

        if (response.data.success) {
          // Transform the data structure to match CollectionItem format
          const transformedItems = response.data.savedItems.map(
            (item: any) => ({
              _id: item._id,
              inscription_id: item.itemId.inscription_id,
              collection_item_name: item.itemId.collection_item_name,
              likes: item.itemId.likes || [],
              comments: item.itemId.comments || [],
              description: item.itemId.description,
              // Add any other necessary fields from itemId
              ...item.itemId,
            })
          );

          setSavedPosts(transformedItems);

          // Initialize saved items
          setSavedItemIds(
            transformedItems.map((item: CollectionItem) => item._id)
          );
        } else {
          toast.error("Failed to fetch saved posts");
        }
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        toast.error("Error loading saved posts");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [session]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Interaction Handlers
  const handleLike = async (itemId: string) => {
    if (!session) {
      toast.error("Please login to like items");
      return;
    }

    try {
      const response = await axios.post("/api/inscriptions/like", { itemId });

      if (response.data.success) {
        setSavedPosts((prev) =>
          prev.map((item) =>
            item._id === itemId
              ? {
                  ...response.data.inscription,
                  collection_item_name: item.collection_item_name,
                  inscription_id: item.inscription_id,
                }
              : item
          )
        );
        toast.success("Updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };

  const handleSave = async (item: CollectionItem) => {
    if (!session) {
      toast.error("Please login to save items");
      return;
    }

    try {
      setSavedItemIds((prev) =>
        prev.includes(item._id)
          ? prev.filter((id) => id !== item._id)
          : [...prev, item._id]
      );

      const response = await axios.post("/api/inscriptions/save", {
        itemId: item._id,
      });

      if (response.data.success) {
        setSavedPosts((prev) => prev.filter((post) => post._id !== item._id));
        toast.success("Removed from saved items");
      }
    } catch (error) {
      setSavedItemIds((prev) =>
        prev.includes(item._id)
          ? prev.filter((id) => id !== item._id)
          : [...prev, item._id]
      );
      toast.error("Failed to update save status");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
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

      <div className="flex flex-1">
        {/* Fixed width sidebar */}
        <div className="fixed top-16 left-0 w-80 h-[calc(100vh-4rem)]">
          <Sidebar onSearch={handleSearch} />
        </div>

        {/* Main content with margin to account for sidebar */}
        <div className="flex-1 ml-80">
          <main className="min-h-[calc(100vh-4rem)] overflow-hidden">
            <div className="h-full overflow-y-auto pb-6">
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                  </div>
                ) : savedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-fr">
                    {savedPosts.map((item) => (
                      <CardComponent
                        key={item._id}
                        item={item}
                        session={session}
                        isSaved={savedItemIds.includes(item._id)}
                        onLike={handleLike}
                        onSave={handleSave}
                        onComment={setSelectedItem}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Heart className="w-16 h-16 mb-4 opacity-50" />
                    <h3 className="text-xl font-medium mb-2">
                      No saved items yet
                    </h3>
                    <p className="text-sm opacity-75">
                      Items you save will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Comment Modal */}
            <CommentModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onAddComment={(itemId: any, comment: any) => {
                setSavedPosts((prev) =>
                  prev.map((item) =>
                    item._id === itemId
                      ? {
                          ...item,
                          comments: [...(item.comments || []), comment],
                        }
                      : item
                  )
                );
              }}
              session={session}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SavedPostsPage;
