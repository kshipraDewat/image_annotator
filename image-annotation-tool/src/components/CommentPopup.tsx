import { useState } from "react";
import { Button } from "./ui/button";
import { useStore } from "../store";

interface CommentPopupProps {
  position: { x: number; y: number };
  imageId: string;
  onClose: () => void;
}

export default function CommentPopup({
  position,
  imageId,
  onClose,
}: CommentPopupProps) {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const { addComment } = useStore();

  const handleSubmit = () => {
    if (!content.trim() || !author.trim()) return;

    addComment({
      imageId,
      x: position.x,
      y: position.y,
      author,
      content,
    });
    onClose();
  };

  return (
    <div
      className="absolute w-60 border bg-white p-4 rounded shadow-lg z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      <div className="space-y-2 ">
        <input
          type="text"
          placeholder="Your name"
          className="w-50 p-2 border rounded"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="Add your comment..."
          className=" w-50 p-2 border rounded"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="cursor-pointer">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
