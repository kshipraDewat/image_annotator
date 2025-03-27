import { RefObject, useState } from "react";
import { useStore } from "../store";

interface ImageViewerProps {
  imageRef: RefObject<HTMLImageElement>;
  imageUrl: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  setActiveCommentId: (id: string | null) => void;
}

export default function ImageViewer({
  imageRef,
  imageUrl,
  onClick,
  setActiveCommentId,
}: ImageViewerProps) {
  const { comments, currentImageId } = useStore();
  const imageComments = comments.filter(
    (comment) => comment.imageId === currentImageId
  );

  return (
    <div className="relative inline-block " onClick={onClick}>
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Annotation target"
        className="max-h-[80vh] max-w-full object-cover"
      />

      {imageComments.map((comment) => (
        <div
          key={comment.id}
          className="absolute w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${comment.x}%`,
            top: `${comment.y}%`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveCommentId(comment.id);
          }}
        >
          {imageComments.findIndex((c) => c.id === comment.id) + 1}
        </div>
      ))}
    </div>
  );
}
