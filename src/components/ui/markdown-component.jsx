/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Anda bisa memilih tema yang Anda suka

const MarkdownComponent = ({ content, className }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <div className={`markdown text-justify grid gap-1 mt-2 ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownComponent;
