"use client";
import { useState } from "react";
import RichTextEditor from "../../../../components/admin/textEditor";

export default function Page() {
  const [content, setContent] = useState("");

  return (
    <div className="p-6">
      <RichTextEditor value={content} onChange={setContent} />

      <h2 className="mt-6 font-bold">Preview:</h2>
      <div
        className="border p-3 mt-2 max-w-100"
        dangerouslySetInnerHTML={{ __html: content }}
        />

        <div>{content}</div>
          
    </div>
  );
}