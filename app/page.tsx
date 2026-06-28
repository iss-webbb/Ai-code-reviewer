"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";


const Page = () => {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("typescript");
  const [review, setReview] = useState<{ type: string; message: string }[]>([]);
  const [preload, setPreload] = useState(false);
  const [err, setErr] = useState("");
  const [history, setHistory] = useState<
    {
      review: { type: string; message: string }[];
      code: string;
      lang: string;
      timestamp: string;
    }[]
  >(() => {
    if(typeof window === undefined) return [];
    const saved = localStorage.getItem("history");
    return saved ? JSON.parse(saved) : [];
  });
  const color: Record<string, string> = {
    bug: "bg-red-500",
    performance: "bg-yellow-500",
    style: "bg-blue-500",
    security: "bg-orange-500",
  };

  async function handleReview() {
    setPreload(true);
    const data = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, lang }),
    }).then((res) => res.json());
    const cleared = data.Message.replace(/```json|```/g, "").trim();
    setReview(JSON.parse(cleared));
    const entry = {
      review,
      code,
      lang,
      timestamp: new Date().toISOString(),
    };
    const updated = [...history, entry];
    setHistory(updated);
    localStorage.setItem("history", JSON.stringify(updated));
    setErr(data.error);
    setPreload(false);
  }

  console.log(history)

  function exampleCode() {
    setCode(`function fetchData(url) {
  var data = []
  for (var i = 0; i < 1000; i++) {
    data.push(fetch(url))
  }
    return data
}`);
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4">
        <div className="flex items-center justify-between">
          <h1 >history</h1>
          <button
            className="bg-white text-black p-1 rounded cursor-pointer"
            onClick={exampleCode}
          >
            Example Code
          </button>
          <div className="flex items-center gap-2">
            <h1>Language:</h1>{" "}
            <select
              className="text-black bg-white p-1 rounded cursor-pointer"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="javascript">javascript</option>
              <option value="react">react</option>
              <option value="go">go</option>
              <option value="typescript">typescript</option>
              <option value="python">python</option>
              <option value="c">c</option>
              <option value="cpp">cpp</option>
            </select>
          </div>
        </div>
        <Editor
          height="600px"
          theme="vs-dark"
          language={lang}
          value={code}
          onChange={(value) => setCode(value ?? " ")}
        />
        <div className="flex justify-end">
          <button
            className="p-3 cursor-pointer rounded bg-white text-black"
            onClick={handleReview}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="w-1/2 p-4 flex flex-col h-full">
        <h2>Code Review</h2>
        {preload ? (
          <h4 className="flex-1 flex items-center justify-center">
            Reviewing...
          </h4>
        ) : (
          <div>
            <article className="pb-5 pt-4 prose prose-sm max-w-none">
              {review.map((item, index) => (
                <div key={index}>
                  <span
                    className={`${color[item.type]} text-white px-1 p-0.5 rounded text-10 mr-2`}
                  >
                    {item.type}
                  </span>
                  <span>{item.message}</span>
                </div>
              ))}
            </article>
            <p className="flex-1 flex items-center justify-center">{err}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
