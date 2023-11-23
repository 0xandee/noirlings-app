import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { NoirEditor } from "@signorecello/noir_playground";

function getQueryParam(param: string) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div className="container">
    <div className="title-container">
      <h1>Noir Playground</h1>
      <p>This playground works entirely client-side. Enjoy!</p>
    </div>
    <NoirEditor
      height="300px"
      baseUrl={
        process.env.NODE_ENV === "development"
          ? window.location.host
          : "https://noir-playground.netlify.app"
      }
      initialCode={getQueryParam("share") || undefined}
    />
  </div>,
);
