import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ImageGallery from "./components/ImageGallery";
import AnnotationView from "./components/AnnotationView";
import ImageUpload from "./components/ImageUpload";
import Collection from "./Collection";
import Empty from "./assets/empty.svg";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className=" flex flex-col h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-2 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Image Annotation Tool
                </h1>
                <ImageUpload />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-full space-y-5">
              <img src={Empty} alt="empty" className="w-[225px]" />
              <h3 className="text-xl font-bold">Drop images here</h3>
              <p>or use Upload button to upload images</p>
              <ImageUpload />
            </div>
          </div>
        }
      />
      <Route path="/collection" element={<Collection />} />
    </Routes>
  );
}

export default App;
