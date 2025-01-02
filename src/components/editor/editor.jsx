// src/components/editor/editor.jsx
import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Code from "@editorjs/code";
import Table from "@editorjs/table";
import LinkTool from "@editorjs/link";
import Quote from "@editorjs/quote";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import { Button } from "@/components/ui/button";
import Parser from "editorjs-parser";

const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        text: "",
        level: 1,
      },
    },
    {
      type: "paragraph",
      data: {
        text: " ",
      },
    },
  ],
};

const EditorComponent = () => {
  const ejInstance = useRef();
  const [savedData, setSavedData] = useState(null); // State untuk menyimpan data postingan
  const [htmlOutput, setHtmlOutput] = useState(""); // State untuk menyimpan HTML
  const parser = new Parser(); // Instansiasi parser

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: "Title",
          },
        },
        paragraph: {
          class: Paragraph,
          config: {
            placeholder: "Tell your story...",
          },
        },
        list: List,
        image: ImageTool,
        code: Code,
        table: Table,
        linkTool: LinkTool,
        quote: Quote,
        checklist: Checklist,
        embed: Embed,
      },
      data: DEFAULT_INITIAL_DATA,
      autofocus: true,
      onReady: () => {
        ejInstance.current = editor;
        console.log("Editor.js is ready to work!");
      },
    });
  };

  const savePost = async () => {
    if (ejInstance.current) {
      const content = await ejInstance.current.saver.save();
      setSavedData(content); // Simpan data ke state
      const html = parser.parse(content); // Konversi JSON Editor.js ke HTML
      setHtmlOutput(html); // Simpan HTML ke state
      console.log("Post saved:", content);
      console.log("HTML Output:", html);
    }
  };

  useEffect(() => {
    if (ejInstance.current === null) {
      console.log("Initializing editor with data:", DEFAULT_INITIAL_DATA);
      initEditor();
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  return (
    <div>
      <article id="editorjs" className="prose mb-4"></article>
      <Button onClick={savePost}>Save Post</Button>
      {savedData && (
        <div className="px-4 py-10 max-w-3xl mx-auto sm:px-6 sm:py-12 lg:max-w-4xl lg:py-16 lg:px-8 xl:max-w-6xl">
          <h2 className="text-lg font-bold">Saved Post</h2>
          <article
            className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert mx-auto"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          ></article>
        </div>
      )}
    </div>
  );
};

export default EditorComponent;
