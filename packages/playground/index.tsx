import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoirEditor from "./src/index";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { AuthProvider } from "./src/hooks/useAuth";
import { ThemeProvider } from "./src/hooks/useTheme";
import AdvancedExercisesPage from "./src/pages/AdvancedExercisesPage";
import PlaygroundPage from "./src/pages/PlaygroundPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <NoirEditor
                baseUrl={
                  process.env.NODE_ENV === "development"
                    ? window.location.host
                    : "https://noir-playground.netlify.app"
                }
              />
            } />
            <Route path="/advanced" element={<AdvancedExercisesPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  </>
);
