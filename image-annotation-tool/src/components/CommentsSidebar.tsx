import { Comment } from "../store";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface CommentsSidebarProps {
  comment: Comment | undefined;
  onClose: () => void;
  onAddReply: (content: string) => void;
}

export default function CommentsSidebar({
  comment,
  onClose,
  onAddReply,
}: CommentsSidebarProps) {
  const [replyContent, setReplyContent] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");

  if (!comment) return null;

  const handleAddReply = () => {
    if (!replyContent.trim() || !replyAuthor.trim()) return;
    onAddReply(replyContent);
    setReplyContent("");
    setReplyAuthor("");
  };

  return (
    <div className="w-50  absolute right-0 mt-2 mr-2  bg-white  border-l border-gray-200 p-4 overflow-y-auto scroll-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Comment</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div className="border-b pb-2">
          <div className="flex items-center space-x-2 mb-2">
            <span className=" font-medium text-xs">
              Author: {comment.author}
            </span>
          </div>
          <p>{comment.content}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">
            Replies ({comment.replies.length})
          </h4>
          <div className="space-y-3 mb-4">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="pl-4 border-l-2 border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-xs">
                    replied by: {reply.author}
                  </span>
                </div>
                <p className="text-sm">{reply.content}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Your name"
              className="w-full p-2 border rounded text-sm"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
            />
            <textarea
              placeholder="Add a reply..."
              className="w-full p-2 border rounded text-sm"
              rows={2}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button size="sm" className="w-full" onClick={handleAddReply}>
              Add Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
