import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BookProvider } from "./context/BookContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BookProvider>
        <App />
      </BookProvider>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </AuthProvider>
  </StrictMode>
);
