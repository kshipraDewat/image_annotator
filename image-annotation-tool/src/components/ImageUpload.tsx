import { ChangeEvent } from "react";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineFileUpload } from "react-icons/md";

export default function ImageUpload() {
  const { addImage } = useStore();
  const navigate = useNavigate();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addImage(event.target?.result as string, file.name);
        navigate("/collection"); // Redirect to gallery after upload
        toast.success("Image Uploaded Sucessfully!");
      };
      reader.readAsDataURL(file);
      e.target.value = ""; // Reset input
    }
  };

  return (
    <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        multiple
      />
      <MdOutlineFileUpload className="mr-2" />
      Upload Image
    </label>
  );
}
