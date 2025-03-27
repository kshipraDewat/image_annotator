import React from "react";
import ImageGallery from "./components/ImageGallery";
import { Route, Routes } from "react-router-dom";
import ImageUpload from "./components/ImageUpload";

const Collection = () => {
  return (
    <div className=" h-screen flex flex-col  ">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Image Annotation Tool
          </h1>
          <ImageUpload />
        </div>
      </div>
      <ImageGallery />
    </div>
  );
};

export default Collection;
