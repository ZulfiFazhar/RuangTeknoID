import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import PropTypes from "prop-types";

const MarkdownEditor = ({ value, onChange }) => {
  const [markdownValue, setMarkdownValue] = useState(value || "");

  const handleEditorChange = (value) => {
    setMarkdownValue(value);
    onChange(value); // Mengembalikan output markdown
  };

  return (
    <div className="border border-gray-300 rounded-md w-full">
      <SimpleMDE
        value={markdownValue}
        onChange={handleEditorChange}
        options={{
          spellChecker: false,
          toolbar: [
            "bold",
            "italic",
            "heading",
            "|",
            "quote",
            "unordered-list",
            "ordered-list",
            "|",
            "link",
            "image",
            "code",
            "clean-block",
            "|",
            "preview",
          ],
          placeholder: "Mulai menulis...",
        }}
      />
    </div>
  );
};

MarkdownEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default MarkdownEditor;
