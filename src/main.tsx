import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <Toaster 
          position="top-right" 
          containerStyle={{
            top: 80, 
          }}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: '#1f2937',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600'
            },
          }}
        />
        <App />
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
