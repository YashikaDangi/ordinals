"use client";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Session } from "next-auth";
import { CollectionItem } from "@/types";

interface CardComponentProps {
  item: CollectionItem;
  session: Session | null;
  isSaved: boolean;
  onLike: (itemId: string) => void;
  onSave: (item: CollectionItem) => void;
  onComment: (item: CollectionItem) => void;
}

const CardComponent = ({
  item,
  session,
  isSaved,
  onLike,
  onSave,
  onComment,
}: CardComponentProps) => {
  const getIconButtonClasses = (isActive: boolean, color: string) => {
    return `p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 
            bg-black/30 hover:bg-black/50 
            ${isActive ? color : "text-white hover:" + color}`;
  };

  return (
    <div
      className="group relative bg-[#111111] rounded-xl overflow-hidden
                border border-gray-800/50 hover:border-purple-500/50
                transition-all duration-300 hover:shadow-lg h-full
                hover:shadow-purple-500/10 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative pt-[100%] overflow-hidden bg-[#0A0A0A] flex-shrink-0">
        <img
          src={`https://ordinals.com/content/${item.inscription_id}`}
          alt={item.collection_item_name || "Inscription"}
          className="absolute inset-0 w-full h-full object-cover
                   transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Action Buttons */}
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3
                    opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <button
            onClick={() => onLike(item._id)}
            className={getIconButtonClasses(
              item.likes?.includes(session?.user?._id as string) || false,
              "text-red-500"
            )}
          >
            <Heart className="w-5 h-5" />
          </button>

          <button
            onClick={() => onComment(item)}
            className="p-2.5 rounded-full backdrop-blur-sm bg-black/30 hover:bg-black/50
                     text-white hover:text-purple-400 transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          <button
            onClick={() => onSave(item)}
            className={getIconButtonClasses(isSaved, "text-purple-500")}
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow">
        <h2 className="text-lg font-medium text-white truncate">
          {item.collection_item_name || "Untitled Inscription"}
        </h2>

        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            {item.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            {item.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;