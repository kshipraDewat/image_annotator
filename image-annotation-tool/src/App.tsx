import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ImageGallery from "./components/ImageGallery";
import AnnotationView from "./components/AnnotationView";
import ImageUpload from "./components/ImageUpload";
import Collection from "./Collection";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className=" flex flex-col h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Image Annotation Tool
                </h1>
                <ImageUpload />
              </div>
            </div>
            <div className=" flex item-center justify-center m-auto  ">
              <ImageUpload />
            </div>
          </div>
        }
      />
      <Route path="/annotate/:imageId" element={<AnnotationView />} />
      <Route path="/collection" element={<Collection />} />
    </Routes>
  );
}

export default App;
