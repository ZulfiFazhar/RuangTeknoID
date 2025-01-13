import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MultiSelect } from "@/components/ui/multi-select";
import api from "@/api/api";

function HashtagEditor({ onHashtagChange, selectedHashtags = [] }) {
  const [hashtags, setHashtags] = useState([]);
  const [selectedHashtagIds, setSelectedHashtagIds] =
    useState(selectedHashtags);

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const response = await api.get("hashtag/get");
        const fetchedHashtags = response.data.data.map((tag) => ({
          value: tag.hashtagId,
          label: `#${tag.name}`,
        }));

        setHashtags(fetchedHashtags);
      } catch (error) {
        console.error("Error fetching hashtags:", error);
      }
    };

    fetchHashtags();
  }, []);

  const handleHashtagChange = (newHashtags) => {
    setSelectedHashtagIds(newHashtags);
    if (onHashtagChange) {
      onHashtagChange(newHashtags);
    }
  };

  return (
    <div>
      <MultiSelect
        options={hashtags}
        onValueChange={handleHashtagChange}
        defaultValue={selectedHashtagIds}
        placeholder="Pilih hashtag"
        variant="inverted"
        className="shadow-none"
        maxCount={5}
      />
    </div>
  );
}

HashtagEditor.propTypes = {
  onHashtagChange: PropTypes.func,
  selectedHashtags: PropTypes.arrayOf(PropTypes.string),
};

export default HashtagEditor;
