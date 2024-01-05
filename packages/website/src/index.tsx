import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import NoirEditor from "@signorecello/noir_playground";

function getQueryParam(param: string) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div className="container flex flex-col w-full h-full py-12 px-6">
    <div className="title-container py-4">
      <h1 className="text-[#eee2de] self-center flex text-2xl font-normal font-bold">
        Noir Playground
      </h1>
      <p className="text-[#eee2de] self-center flex">
        This playground works entirely client-side. Enjoy!
      </p>
    </div>
    <NoirEditor
      baseUrl={
        process.env.NODE_ENV === "development"
          ? window.location.host
          : "https://play.noir-lang.org"
      }
      initialProject={getQueryParam("share") || undefined}
      style={{ width: "100%", height: "500px" }}
    />
  </div>
);
