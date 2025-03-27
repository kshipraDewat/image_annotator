import { RefObject } from "react";
import { Comment } from "../store";

interface ImageViewerProps {
  imageRef: RefObject<HTMLImageElement>;
  imageUrl: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  setActiveCommentId: (id: string | null) => void;
  comments: Comment[];
  activeCommentId: string | null;
}

export default function ImageViewer({
  imageRef,
  imageUrl,
  onClick,
  setActiveCommentId,
  comments,
  activeCommentId,
}: ImageViewerProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative" onClick={onClick}>
        <img
          ref={imageRef}
          src={imageUrl}
          alt=""
          className="max-h-[80vh] max-w-full object-contain "
        />
        {/* Render comment markers */}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`absolute w-4 h-4 rounded-full cursor-pointer ${
              activeCommentId === comment.id
                ? "bg-blue-500 ring-2 ring-white"
                : "bg-blue-500"
            }`}
            style={{
              left: `${comment.x}%`,
              top: `${comment.y}%`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveCommentId(comment.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
