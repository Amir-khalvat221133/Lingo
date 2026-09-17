import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // ثبت service worker با خطا مواجه شد؛ اپ همچنان به‌صورت عادی (بدون قابلیت آفلاین/نصب) کار می‌کنه
    });
  });
}