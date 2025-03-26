import './App.css'
import { useState, useRef, useEffect } from 'react';
import { useStore } from './store';
import ImageUpload from './components/ImageUpload';
import uploaderImg from '../public/uploaderimg.jpg'


function App() {
  const { addImage } = useStore();


  const handleAddImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      addImage(event.target?.result as string, file.name);
    };
    reader.readAsDataURL(file);
  };


  return (


      <div className="flex flex-col w-full h-screen  overflow-hidden bg-gray-100">

        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Image Annotation Tool</h1>
          <ImageUpload onUpload={handleAddImage} />
        </div>


        <div className='flex flex-col gap-5 item-center justify-center m-auto '>
          <img src={uploaderImg} alt="" className='h-[30vh]' />
          <div className='flex m-auto'>
            <ImageUpload onUpload={handleAddImage} />
          </div>
        </div>

      </div>
 
  );
}

export default App;