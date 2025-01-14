"use client";

import { useState, useEffect } from "react";
import { CollectionItem } from "@/types"; // Ensure correct import
import { useSession } from "next-auth/react";

const SavedPosts = () => {
  const [savedItems, setSavedItems] = useState<CollectionItem[]>([]);
  const { data: session } = useSession();
  console.log(session)

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const response = await fetch("/api/inscriptions/getSavedPosts");
        const result = await response.json();

        if (result.success) {
          setSavedItems(result.savedItems); // Set saved items
        } else {
          console.error("Failed to fetch saved items:", result.error);
        }
      } catch (error) {
        console.error("Error fetching saved items:", error);
      }
    };

    if (session?.user?.savedItems) {
      setSavedItems(session.user.savedItems);
    } else {
      fetchSavedItems();
    }
  }, [session]);

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h2 className="text-xl font-bold mb-4">Saved Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {savedItems.length > 0 ? (
          savedItems.map((savedItem) => (
            <div key={savedItem._id} className="bg-gray-800 rounded-lg p-4">
              <img
                src={`https://ordinals.com/content/${savedItem.itemId.inscription_id}`}
                alt="Saved Inscription"
                className="w-full h-auto rounded"
              />
              <h3 className="text-white text-lg mt-2">
                {savedItem.itemId.collection_item_name || "No name available"}
              </h3>
            </div>
          ))
        ) : (
          <p>No saved posts available</p>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
