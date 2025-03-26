import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface ImageState {
  images: Array<{
    id: string;
    url: string;
    name: string;
  }>;
  currentImageId: string | null;
  comments: Comment[];
  addImage: (url: string, name: string) => void;
  setCurrentImage: (id: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'replies'>) => void;
  addReply: (commentId: string, reply: Omit<Reply, 'id' | 'createdAt'>) => void;
  updateComment: (commentId: string, content: string) => void;
  updateReply: (commentId: string, replyId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  deleteReply: (commentId: string, replyId: string) => void;
}

export const useStore = create<ImageState>()(
  persist(
    (set) => ({
      images: [],
      currentImageId: null,
      comments: [],
      addImage: (url, name) =>
        set((state) => {
          const id = Date.now().toString();
          return {
            images: [...state.images, { id, url, name }],
            currentImageId: id,
          };
        }),
      setCurrentImage: (id) => set({ currentImageId: id }),
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
      updateComment: (commentId, content) =>
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === commentId ? { ...comment, content } : comment
          ),
        })),
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
      deleteComment: (commentId) =>
        set((state) => ({
          comments: state.comments.filter((comment) => comment.id !== commentId),
        })),
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
    }),
    {
      name: 'image-annotation-store',
    }
  )
);