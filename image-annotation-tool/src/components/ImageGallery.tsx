import { useStore } from "../store";
import { RefObject, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CiCrop } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { MdOutlineAddComment, MdOutlineFileDownload } from "react-icons/md";
import ImageViewer from "./ImageViewer";
import CommentPopup from "./CommentPopup";
import CommentsSidebar from "./CommentsSidebar";
import { PiDotsThreeBold } from "react-icons/pi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaImage } from "react-icons/fa6";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredImages, setFilteredImages] = useState(images);
  const imageRef = useRef<HTMLImageElement>(null);

  // Debouncing logic
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredImages(images);
      } else {
        const filtered = images.filter((image) =>
          image.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredImages(filtered);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, images]);

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
      author: "User",
      content,
    });
  };

  // Function to handle rename action
  const handleRename = (imageId: string) => {
    const newName = prompt("Enter new name for the image:");
    if (newName) {
      console.log(`Renaming image ${imageId} to ${newName}`);
    }
  };

  // Function to handle download action
  const handleDownload = (imageUrl: string, imageName: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search images"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? "No images match your search"
              : "No images uploaded yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages?.map((image, index) => (
            <div
              className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer rounded-md"
              key={image.id}
            >
              <div className="p-4 flex justify-between border">
                <div className="flex gap-2 items-center">
                  <FaImage className="text-yellow-600" />
                  <h3 className="font-medium text-gray-900 w-[50%]">
                    {image.name.slice(0, 10)}
                    {image.name.length > 10 && "..."}
                  </h3>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="cursor-pointer">
                      <PiDotsThreeBold />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start cursor-pointer"
                        onClick={() => handleRename(image.id)}
                      >
                        Rename
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start cursor-pointer"
                        onClick={() => handleDownload(image.url, image.name)}
                      >
                        Download File
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div
                className="h-48 overflow-hidden"
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image.thumbnail || image.url}
                  alt={image.name}
                  className="w-full h-full object-cover transition duration-300 ease-in-out hover:scale-110 "
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-screen h-screen max-w-screen max-h-screen p-0">
          <DialogHeader className="bg-black flex z-10 p-4 w-full h-fit">
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 text-white cursor-pointer"
              >
                <CiCrop />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 text-white cursor-pointer"
              >
                <GoPencil />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 text-white cursor-pointer"
              >
                <MdOutlineAddComment />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 text-white cursor-pointer"
              >
                <MdOutlineFileDownload />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 text-white cursor-pointer"
                onClick={closeDialog}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          {selectedImageIndex !== null && (
            <div className="relative h-screen flex items-center justify-center bg-gray-800">
              <div className="w-full h-full flex ">
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
                className="absolute left-20 rounded-full bg-black/20 hover:bg-black/40 text-white"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-20 rounded-full bg-black/20 hover:bg-black/40 text-white"
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
