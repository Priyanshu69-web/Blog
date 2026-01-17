"use client";

import { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
}

export function TinyMCEEditor({ value, onChange, height = 500 }: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);
  const [tinymceLoaded, setTinymceLoaded] = useState(false);

  useEffect(() => {
    // Check if TinyMCE is already loaded
    if (typeof window !== "undefined" && (window as any).tinymce) {
      setTinymceLoaded(true);
      return;
    }

    // Load TinyMCE script dynamically
    const script = document.createElement("script");
    script.src = "/tinymce/tinymce.min.js";
    script.async = true;
    script.onload = () => {
      setTinymceLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts before load
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  if (!tinymceLoaded) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800 rounded-md border border-slate-700">
        <p className="text-slate-400">Loading editor...</p>
      </div>
    );
  }

  return (
    <div>
      <Editor
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        value={value}
        onEditorChange={(content) => {
          onChange(content);
        }}
        init={{
          base_url: "/tinymce",
          suffix: ".min",
          license_key: "gpl",
          height: height,
          menubar: true,
          plugins: [
            "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
            "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
            "insertdatetime", "media", "table", "code", "help", "wordcount"
          ],
          toolbar: "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help | code | link image media | table",
          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color: #e2e8f0; }",
          skin: "oxide-dark",
          content_css: "dark",
        }}
      />
    </div>
  );
}
