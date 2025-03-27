import { useStore } from "../store";
import { RefObject, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CiCrop } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { MdOutlineFileDownload } from "react-icons/md";
import ImageViewer from "./ImageViewer";
import CommentPopup from "./CommentPopup";
import CommentsSidebar from "./CommentsSidebar";

export default function ImageGallery() {
  const {
    images,
    generateThumbnail,
    comments,
    currentImageId,
    setCurrentImage,
    addComment,
    addReply,
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Get comments for the current image
  const currentImageComments = comments.filter(
    (comment) =>
      comment.imageId ===
      (selectedImageIndex !== null ? images[selectedImageIndex].id : "")
  );

  useEffect(() => {
    images.forEach((image) => {
      if (!image.thumbnail) {
        generateThumbnail(image.id);
      }
    });
  }, [images, generateThumbnail]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setCurrentImage(images[index].id);
    setIsDialogOpen(true);
    setActiveCommentId(null);
    setClickPosition(null);
  };

  const clickPop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPosition({ x, y });
    setActiveCommentId(null);
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null) {
      const newIndex =
        selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
      setCurrentImage(images[newIndex].id);
      setActiveCommentId(null);
      setClickPosition(null);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      const newIndex =
        selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1;
      setSelectedImageIndex(newIndex);
      setCurrentImage(images[newIndex].id);
      setActiveCommentId(null);
      setClickPosition(null);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setActiveCommentId(null);
    setClickPosition(null);
  };

  const handleAddReply = (content: string) => {
    if (!activeCommentId) return;
    addReply(activeCommentId, {
      author: "User", // You might want to get this from user input
      content,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Image Gallery</h1>
      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={image.thumbnail || image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">
                  {image.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(parseInt(image.id)).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none p-0">
          <DialogHeader className="bg-black flex z-10 p-4 w-full h-fit">
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 hover:bg-black/40 text-white"
              >
                <CiCrop />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 hover:bg-black/40 text-white"
              >
                <GoPencil />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 hover:bg-black/40 text-white"
              >
                <MdOutlineFileDownload />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 hover:bg-black/40 text-white"
                onClick={closeDialog}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          {selectedImageIndex !== null && (
            <div className="relative h-full flex items-center justify-center bg-gray-700">
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex gap-5 w-full h-full">
                  <ImageViewer
                    imageRef={imageRef}
                    imageUrl={images[selectedImageIndex].url}
                    onClick={clickPop}
                    setActiveCommentId={setActiveCommentId}
                    comments={currentImageComments}
                    activeCommentId={activeCommentId}
                  />

                  {clickPosition && currentImageId && (
                    <CommentPopup
                      position={clickPosition}
                      imageId={currentImageId}
                      onClose={() => setClickPosition(null)}
                    />
                  )}

                  {activeCommentId && (
                    <CommentsSidebar
                      comment={currentImageComments.find(
                        (c) => c.id === activeCommentId
                      )}
                      onClose={() => setActiveCommentId(null)}
                      onAddReply={handleAddReply}
                    />
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 rounded-full bg-black/20 hover:bg-black/40 text-white"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 rounded-full bg-black/20 hover:bg-black/40 text-white"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-sm bg-black/40 text-white inline-block px-3 py-1 rounded-full">
                  {selectedImageIndex + 1} / {images.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
