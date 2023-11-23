import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/nunito";
import "./index.css";
import { NoirEditor } from "@signorecello/noir_playground";

function getQueryParam(param: string) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="container">
      <h1>Noir Playground</h1>
      <p>This playground works entirely client-side. Enjoy!</p>
      <p>
        Visit the&nbsp;
        <a href="https://github.com/signorecello/noir-playground">
          Github Repo
        </a>
        &nbsp;to know more
      </p>
      <NoirEditor
        height="300px"
        baseUrl={
          process.env.NODE_ENV === "development"
            ? window.location.host
            : "https://noir-playground.netlify.app"
        }
        initialCode={getQueryParam("share") || undefined}
      />
    </div>
  </React.StrictMode>,
);
