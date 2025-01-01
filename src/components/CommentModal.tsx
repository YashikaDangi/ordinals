import { X } from "lucide-react";

export const CommentModal = ({
  item,
  onClose,
  onAddComment,
  newComment,
  setNewComment,
  session,
}: any) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg w-full max-w-4xl h-[80vh] flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side - Image */}
        <div className="w-[60%] bg-black">
          <img
            src={`https://ordinals.com/content/${item.inscription_id}`}
            alt="Inscription Preview"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right side - Comments */}
        <div className="w-[40%] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center">
            <h3 className="font-semibold flex-1 text-white ">
              {item.collection_item_name || "No name available"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Comments list */}
          <div className="flex-1 overflow-y-auto p-4">
            {item.comments?.length > 0 ? (
              <div className="space-y-4">
                {item.comments.map((comment: any, index: any) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-sm">
                        {comment.author}
                      </span>
                      <p className="text-gray-300 text-sm mt-1">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">No comments yet</p>
            )}
          </div>

          {/* Comment input */}
          <div className="p-4 border-t border-gray-800">
            <textarea
              className="w-full px-3 py-2 rounded bg-gray-800 text-white text-sm resize-none focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Add a comment..."
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 w-full"
              onClick={() => onAddComment(item._id)}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
