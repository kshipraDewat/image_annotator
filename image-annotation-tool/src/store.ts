import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Comment {
  id: string;
  imageId: string;
  x: number;
  y: number;
  author: string;
  content: string;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface Image {
  id: string;
  url: string;
  name: string;
  thumbnail?: string;
}

interface ImageState {
  images: Image[];
  currentImageId: string | null;
  comments: Comment[];
  addImage: (url: string, name: string) => void;
  setCurrentImage: (id: string) => void;
  addComment: (comment: Omit<Comment, "id" | "createdAt" | "replies">) => void;
  addReply: (commentId: string, reply: Omit<Reply, "id" | "createdAt">) => void;
  updateComment: (commentId: string, content: string) => void;
  updateReply: (commentId: string, replyId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  deleteReply: (commentId: string, replyId: string) => void;
  generateThumbnail: (imageId: string) => Promise<void>;
}

export const useStore = create<ImageState>()(
  persist(
    (set, get) => ({
      images: [],
      currentImageId: null,
      comments: [],

      // Add a new image to the gallery
      addImage: (url, name) =>
        set((state) => {
          const id = Date.now().toString();
          return {
            images: [...state.images, { id, url, name }],
            currentImageId: id,
          };
        }),

      // Set the currently viewed image
      setCurrentImage: (id) => set({ currentImageId: id }),

      // Add a new comment to an image
      addComment: (comment) =>
        set((state) => ({
          comments: [
            ...state.comments,
            {
              ...comment,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              replies: [],
            },
          ],
        })),

      // Add a reply to an existing comment
      addReply: (commentId, reply) =>
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: [
                    ...comment.replies,
                    {
                      ...reply,
                      id: Date.now().toString(),
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : comment
          ),
        })),

      // Update a comment's content
      updateComment: (commentId, content) =>
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === commentId ? { ...comment, content } : comment
          ),
        })),

      // Update a reply's content
      updateReply: (commentId, replyId, content) =>
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === replyId ? { ...reply, content } : reply
                  ),
                }
              : comment
          ),
        })),

      // Delete a comment and all its replies
      deleteComment: (commentId) =>
        set((state) => ({
          comments: state.comments.filter((comment) => comment.id !== commentId),
        })),

      // Delete a specific reply from a comment
      deleteReply: (commentId, replyId) =>
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.filter((reply) => reply.id !== replyId),
                }
              : comment
          ),
        })),

      // Generate a thumbnail for an image
      generateThumbnail: async (imageId) => {
        const image = get().images.find((img) => img.id === imageId);
        if (!image || image.thumbnail) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = image.url;

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Create thumbnail at 200px width
        const ratio = 200 / img.width;
        canvas.width = 200;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL("image/jpeg", 0.7);

        set((state) => ({
          images: state.images.map((img) =>
            img.id === imageId ? { ...img, thumbnail } : img
          ),
        }));
      },
    }),
    {
      name: "image-annotation-store", // LocalStorage key
      partialize: (state) => ({
        images: state.images,
        comments: state.comments,
      }), // Only persist these properties
    }
  )
);

// Utility function to get comments for a specific image
export const getCommentsForImage = (imageId: string, comments: Comment[]) => {
  return comments.filter((comment) => comment.imageId === imageId);
};