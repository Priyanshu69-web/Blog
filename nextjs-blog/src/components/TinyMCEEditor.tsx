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

  useEffect(() => {
    // Update TinyMCE theme when dark mode changes
    if (editorRef.current && typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      const editor = editorRef.current;
      if (editor) {
        editor.getBody().style.color = isDark ? "#e2e8f0" : "#1e293b";
        editor.getBody().style.backgroundColor = isDark ? "#1e293b" : "#ffffff";
      }
    }
  }, [value]);

  if (!tinymceLoaded) {
    return (
      <div className="flex items-center justify-center h-64 bg-background rounded-md border border-border">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark");

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
          license_key: "gpl",
          suffix: ".min",
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
          content_style: isDark 
            ? "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color: #e2e8f0; background-color: #1e293b; }"
            : "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color: #1e293b; background-color: #ffffff; }",
          skin: isDark ? "oxide-dark" : "oxide",
          content_css: isDark ? "dark" : "default",
        }}
      />
    </div>
  );
}
