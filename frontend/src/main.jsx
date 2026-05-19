import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Ensure this points to the right path;

// 1. Core Styles (Tailwind + Glassmorphism layers)

// 2. Optional: Standardizing the Viewport for Mobile
// This ensures that mobile browsers don't have weird "bounce" effects on the dark UI
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Note: Since you put AuthProvider inside App.jsx, 
      you don't need to wrap it here. This keeps main.jsx clean.
    */}
    <App />
  </React.StrictMode>,
);