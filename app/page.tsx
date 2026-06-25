"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkDown from 'react-markdown';
import remarkGfm from "remark-gfm";


const Page = () => {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("typescript");
  const [review, setReview] = useState("");
  const [preload, setPreload] = useState(false);
  const [err, setErr] = useState("")

  async function handleReview() {
    setPreload(true);
    const data = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, lang }),
    }).then((res) => res.json());
    setReview(data.Message);
    setErr(data.error)
    setPreload(false);
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4">
        <div className="flex items-center justify-between">
          <h1>Code</h1>
          <div className="flex items-center gap-2">
            <h1>Language:</h1>{" "}
            <select className="text-black bg-white p-1 rounded cursor-pointer" value={lang} onChange={(e) => setLang(e.target.value)}>
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
            <div><article className="pb-5 pt-4 prose prose-sm max-w-none"><ReactMarkDown remarkPlugins={[remarkGfm]}>{review}</ReactMarkDown></article>
          <p className="flex-1 flex items-center justify-center">{err}</p></div>
          
        )}

      </div>
    </div>
  );
};

export default Page;
