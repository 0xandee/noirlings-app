import React from "react";
import ReactDOM from "react-dom/client";
import NoirEditor from "./src/index";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <NoirEditor
    style={{ width: "100%", height: "300px" }}
    baseUrl={
      process.env.NODE_ENV === "development"
        ? window.location.host
        : "https://noir-playground.netlify.app"
    }
  />
);
