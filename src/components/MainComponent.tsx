"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2, Heart, MessageCircle, Bookmark } from "lucide-react";
import { ApiResponse, CollectionItem } from "@/types";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import axios from "axios";
import { CommentModal } from "@/components/CommentModal";
import CardComponent from "./CardComponent";

interface MainComponentProps {
  currentPath: string;
  searchQuery: string;
  session: Session | null;
}

const MainComponent = ({
  currentPath,
  searchQuery,
  session,
}: MainComponentProps) => {
  // State Management
  const [data, setData] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);

  // Refs to track current state without triggering re-renders
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const isSearchingRef = useRef(false);

  // Data Fetching based on current path
  const fetchData = useCallback(
    async (pageNum: number, isNewSearch = false) => {
      if (loadingRef.current || (!hasMoreRef.current && !isNewSearch)) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        let url = `/api/getData?page=${pageNum}`;

        if (currentPath === "/savedPosts") {
          url = `/api/inscriptions/saved?page=${pageNum}`;
        } else if (currentPath === "/likedPosts") {
          url = `/api/inscriptions/liked?page=${pageNum}`;
        } else if (searchQuery) {
          url = `/api/searchData?inscription_number=${encodeURIComponent(
            searchQuery
          )}`;
          isSearchingRef.current = true;
        } else {
          url = `/api/getData?page=1`;
        }

        const response = await fetch(url);
        const result: ApiResponse = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setData((prev) => {
            if (isNewSearch || pageNum === 1) {
              return result.data;
            }
            return [...prev, ...result.data];
          });

          hasMoreRef.current = result.data.length > 0;
          setHasMore(result.data.length > 0);
        } else {
          hasMoreRef.current = false;
          setHasMore(false);
        }
      } catch (error) {
        toast.error("Failed to load items");
        console.error("Error fetching data:", error);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [currentPath, searchQuery]
  );

  // Combined effect for handling search and path changes
  useEffect(() => {
    setPage(1);
    hasMoreRef.current = true;
    setHasMore(true);
    fetchData(1, true);
  }, [currentPath, searchQuery, fetchData]);

  // Infinite Scroll Handler
  const handleScroll = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (
      target.isIntersecting &&
      hasMoreRef.current &&
      !loadingRef.current &&
      !isSearchingRef.current
    ) {
      setPage((prev) => prev + 1);
    }
  }, []); // Remove dependencies since we're using refs

  // Setup scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleScroll, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });

    const sentinel = document.getElementById("scroll-sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [handleScroll]);

  // Handle pagination
  useEffect(() => {
    if (page > 1 && !isSearchingRef.current) {
      fetchData(page, false);
    }
  }, [page, fetchData]);

  // Interaction Handlers
  const handleLike = async (itemId: string) => {
    if (!session) {
      toast.error("Please login to like items");
      return;
    }

    try {
      const response = await axios.post("/api/inscriptions/like", { itemId });

      if (response.data.success) {
        setData((prev) =>
          prev.map((item) =>
            item._id === itemId ? response.data.inscription : item
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
        toast.success(
          savedItemIds.includes(item._id)
            ? "Removed from saved items"
            : "Added to saved items"
        );
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

  const getIconButtonClasses = (isActive: boolean, color: string) => {
    return `p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 
            bg-black/30 hover:bg-black/50 
            ${isActive ? color : "text-white hover:" + color}`;
  };

  return (
    <main className="h-screen pt-16 overflow-hidden bg-[#0A0A0A]">
      <div className="h-full overflow-y-auto pb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-fr">
            {data.map((item) => (
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
        </div>

        {/* Loading & Scroll Sentinel */}
        <div id="scroll-sentinel" className="h-4">
          {loading && (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
          )}
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddComment={(itemId:any, comment:any) => {
          setData((prev) =>
            prev.map((item) =>
              item._id === itemId
                ? { ...item, comments: [...(item.comments || []), comment] }
                : item
            )
          );
        }}
        session={session}
      />
    </main>
  );
};

export default MainComponent;
