import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import Collection from './Collection.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route  path="/" element={<App />} />
      <Route  path="/collection" element={<Collection />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
