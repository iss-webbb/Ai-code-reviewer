"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const Page = () => {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("typescript");
  const [review, setReview] = useState<{ type: string; message: string }[]>([]);
  const [preload, setPreload] = useState(false);
  const [err, setErr] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<
    {
      review: { type: string; message: string }[];
      code: string;
      lang: string;
      timestamp: string;
    }[]
  >(() => {
    if (typeof window === "undefined") return [];
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
    try {
      const data = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, lang }),
      }).then((res) => res.json());
      const cleared = data.Message.replace(/```json|```/g, "").trim();
      const parsedReview = JSON.parse(cleared);
      setReview(parsedReview);
      const entry = {
        review: parsedReview,
        code,
        lang,
        timestamp: new Date().toISOString(),
      };
      const updated = [...history, entry];
      setHistory(updated);
      localStorage.setItem("history", JSON.stringify(updated));
    } catch {
      setErr("Something went wrong parsing the review.");
    } finally {
      setPreload(false);
    }
  }

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
          <h1
            className="cursor-pointer"
            onClick={() => setShowHistory(!showHistory)}
          >
            history
          </h1>
          {showHistory && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowHistory(false)}
            />
          )}

          <div
            className={`fixed top-0 left-0 h-full w-80 bg-white text-black p-4 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              showHistory ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="cursor-pointer"
              >
                X
              </button>
            </div>

            {history.length === 0 && <p>No history yet</p>}

            <ul className="space-y-3">
              {history.map((item, index) => (
                <li key={index} className="border-b pb-2">
                  <p className="text-green-500">{item.timestamp.slice(0, 10)}</p>
                  <p>{item.code}</p>
                  <ul className="text-xs text-gray-600 mt-1">
                    {item.review?.map((r, i) => (
                      <div key={i} className="mt-1">
                        <span
                          className={`${color[r.type]} text-white px-1 p-0.5 rounded text-10`}
                        >
                          {r.type}
                        </span>
                        <span className="ml-2">{r.message}</span>
                      </div>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

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
