"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { ApiResponse, CollectionItem } from "@/types";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { FaHeart, FaRegHeart, FaComment, FaBookmark } from "react-icons/fa"; // Importing icons
import axios from "axios";
import { CommentModal } from "@/components/CommentModal";

const DashboardView = () => {
  const [data, setData] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {}
  ); // Show/hide comments for each item
  const [selectedItem, setSelectedItem] = useState(null);

  const { data: session } = useSession();

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `/api/searchData?inscription_number=${searchQuery}`
        : `/api/getData?page=${page}`;

      const response = await fetch(url);
      const result: ApiResponse = await response.json();

      console.log("API Response: ", result);

      if (result.success && Array.isArray(result.data)) {
        const dataToSet = result.data;
        setData((prevData) =>
          searchQuery ? dataToSet : [...prevData, ...dataToSet]
        );
        setHasMore(dataToSet.length > 0);
      } else {
        console.error("Invalid data format or no data available");
        setHasMore(false);
      }
      const dataToSet = Array.isArray(result.data) ? result.data : [];
      console.log("API Response: ", dataToSet);
      console.log("Is result.data an array? ", Array.isArray(result.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search query change from the sidebar
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset page number on new search
  };

  useEffect(() => {
    fetchData();
  }, [page, searchQuery]);

  const handleLike = async (itemId: string) => {
    try {
      const response = await axios.post(`/api/inscriptions/like`, {
        itemId,
        action: "like",
      });

      if (response.data.success && response.data.inscription) {
        setData((prevData) =>
          prevData.map((item) =>
            item._id === itemId ? response.data.inscription : item
          )
        );
      } else {
        toast.error("Failed to like item");
      }
    } catch (error) {
      toast.error("Error liking item");
    }
  };
  const handleAddComment = async (itemId: string) => {
    if (!newComment.trim()) return;

    const currentUser = session?.user;
    if (!currentUser) {
      toast.error("Please login to comment");
      return;
    }

    // Create new comment object
    const newCommentObj = {
      text: newComment,
      author: currentUser.name || "Anonymous",
      date: new Date().toISOString(),
    };

    // Optimistically update UI
    setData((prevData) =>
      prevData.map((item) => {
        if (item._id === itemId) {
          return {
            ...item,
            comments: [...(item.comments || []), newCommentObj],
          };
        }
        return item;
      })
    );

    // Clear input
    setNewComment("");

    try {
      const response = await fetch(`/api/inscriptions/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          text: newComment,
        }),
      });

      const result: ApiResponse = await response.json();

      if (!result.success) {
        // Revert optimistic update on failure
        setData((prevData) =>
          prevData.map((item) => {
            if (item._id === itemId) {
              return {
                ...item,
                comments: (item.comments || []).slice(0, -1),
              };
            }
            return item;
          })
        );
        toast.error(result.message || "Failed to add comment");
      }
    } catch (error) {
      // Revert optimistic update on error
      setData((prevData) =>
        prevData.map((item) => {
          if (item._id === itemId) {
            return {
              ...item,
              comments: (item.comments || []).slice(0, -1),
            };
          }
          return item;
        })
      );
      toast.error("Error adding comment");
    }
  };

  useEffect(() => {
    if (session?.user?.savedItems) {
      setSavedItemIds(session.user.savedItems.map((item) => item._id));
    }
  }, [session]);

  const handleSave = async (item: CollectionItem) => {
    try {
      // Optimistic update
      setSavedItemIds((prev) =>
        prev.includes(item._id)
          ? prev.filter((id) => id !== item._id)
          : [...prev, item._id]
      );

      const { data: result } = await axios.post("/api/inscriptions/save", {
        itemId: item._id,
      });

      if (result.success) {
        setSavedItemIds(
          result.savedItems.map((item: CollectionItem) => item._id)
        );
        toast.success("Item saved successfully");
      } else {
        // Revert on failure
        setSavedItemIds((prev) =>
          prev.includes(item._id)
            ? prev.filter((id) => id !== item._id)
            : [...prev, item._id]
        );
        toast.error(result.error || "Failed to save item");
      }
    } catch (error) {
      // Revert on error
      setSavedItemIds((prev) =>
        prev.includes(item._id)
          ? prev.filter((id) => id !== item._id)
          : [...prev, item._id]
      );
      toast.error("Error saving item");
    }
  };

  const handleCommentToggle = (item: any) => {
    setSelectedItem(item);
  };
  
  return (
    <div className="flex h-screen">
      <div className="fixed top-0 left-0 w-64 bg-black h-full mt-10">
        <Sidebar onSearch={handleSearch} />
      </div>

      <main className="ml-64 flex-1 min-h-screen bg-black text-white overflow-y-auto  ">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 p-4 ">
          {data.length > 0 ? (
            data.map((item) => {
              const likeCount = Array.isArray(item.likes)
                ? item.likes.length
                : 0;
              const commentCount = Array.isArray(item.comments)
                ? item.comments.length
                : 0;
              const isLikedByUser = session?.user?._id
                ? item.likes.includes(session.user._id)
                : false;
              const isSaved = savedItemIds.includes(item._id);

              return (
                <div
                  key={item._id}
                  className="bg-gray-900 rounded-lg overflow-hidden relative group"
                >
                  <div className="relative pt-[100%]">
                    <img
                      src={`https://ordinals.com/content/${item.inscription_id}`}
                      alt="Inscription Preview"
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className={`p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors ${
                          isLikedByUser ? "text-red-600" : "text-white"
                        }`}
                        onClick={() => handleLike(item._id)}
                      >
                        {isLikedByUser ? (
                          <FaHeart className="w-6 h-6" />
                        ) : (
                          <FaRegHeart className="w-6 h-6" />
                        )}
                        <span className="sr-only">Like ({likeCount})</span>
                      </button>

                      <button
                        onClick={() => handleCommentToggle(item)}
                        className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors text-white"
                      >
                        <FaComment className="w-6 h-6" />
                      </button>

                      <button
                        onClick={() => handleSave(item)}
                        className={`p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors ${
                          isSaved ? "text-blue-500" : "text-white"
                        }`}
                      >
                        <FaBookmark className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-bold truncate">
                      {item.collection_item_name || "No name available"}
                    </h2>

                    <div className="flex gap-4 mt-2 text-sm text-gray-400">
                      <span>{likeCount} likes</span>
                      <span>{commentCount} comments</span>
                    </div>
                  </div>

                  {showComments[item._id] && (
                    <div className="p-4 border-t border-gray-800">
                      {Array.isArray(item.comments) &&
                        item.comments.length > 0 && (
                          <div className="max-h-40 overflow-y-auto">
                            <ul className="space-y-2">
                              {item.comments.map((comment, index) => (
                                <li key={index} className="text-sm">
                                  <span className="font-medium">
                                    {session?.user.name || "Anonymous"}
                                  </span>
                                  <span className="ml-2 text-gray-300">
                                    {comment.text}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      <div className="mt-4">
                        <textarea
                          className="w-full px-3 py-2 rounded bg-gray-800 text-white text-sm resize-none"
                          placeholder="Add a comment..."
                          rows={2}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                          className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          onClick={() => handleAddComment(item._id)}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-400">
              No data available
            </p>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-8">
            <Loader2 className="animate-spin text-white" size={24} />
          </div>
        )}
      </main>
      <CommentModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddComment={handleAddComment}
        newComment={newComment}
        setNewComment={setNewComment}
        session={session}
      />
    </div>
  );
};

export default DashboardView;
