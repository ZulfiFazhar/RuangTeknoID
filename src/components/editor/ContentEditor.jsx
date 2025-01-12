import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import {
  ListOrdered,
  List,
  Link2,
  Quote,
  SquareCode,
  CodeXml,
} from "lucide-react";

import PropTypes from "prop-types";

const ContentEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextStyle,
      Underline,
      Link,
    ],
    content: value || "<p>Mulai menulis artikel...</p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-md">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center p-2 border-b bg-gray-50 gap-2">
        {/* Bold */}
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant="outline"
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
        >
          <b>B</b>
        </Button>
        {/* Italic */}
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant="outline"
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
        >
          <i>I</i>
        </Button>
        {/* Underline */}
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          variant="outline"
          className={editor.isActive("underline") ? "bg-gray-200" : ""}
        >
          <u>U</u>
        </Button>
        {/* Link */}
        <Button
          onClick={() => {
            const url = prompt("Masukkan URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          variant="outline"
          className={editor.isActive("link") ? "bg-gray-200" : ""}
        >
          <Link2 />
        </Button>
        {/* Unordered List */}
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant="outline"
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
        >
          <List />
        </Button>
        {/* Ordered List */}
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant="outline"
          className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
        >
          <ListOrdered />
        </Button>
        {/* Paragraph */}
        <Button
          onClick={() => editor.chain().focus().setParagraph().run()}
          variant="outline"
          className={editor.isActive("paragraph") ? "bg-gray-200" : ""}
        >
          Text
        </Button>
        {/* Heading */}
        {[1, 2, 3].map((level) => (
          <Button
            key={level}
            onClick={() => editor.chain().focus().setHeading({ level }).run()}
            variant="outline"
            className={
              editor.isActive("heading", { level }) ? "bg-gray-200" : ""
            }
          >
            H{level}
          </Button>
        ))}
        {/* Blockquote */}
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          variant="outline"
          className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
        >
          <Quote />
        </Button>
        {/* Code */}
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          variant="outline"
          className={editor.isActive("code") ? "bg-gray-200" : ""}
        >
          <CodeXml />
        </Button>
        {/* Code Block */}
        <Button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          variant="outline"
          className={editor.isActive("codeBlock") ? "bg-gray-200" : ""}
        >
          <SquareCode />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="p-4" />
    </div>
  );
};

ContentEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ContentEditor;
