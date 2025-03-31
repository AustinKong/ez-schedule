import { Provider } from "@/compoenents/ui/provider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
);
