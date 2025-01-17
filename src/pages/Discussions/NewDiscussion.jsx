import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/auth/auth-context";
import LoginFirst from "@/components/auth/login-first";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/api";

function NewDiscussion() {
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState({
    title: "",
    content: "",
    hashtags: [],
  });
  const [hashtags, setHashtags] = useState([]);

  const { authStatus } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const getAllHashtag = async () => {
      try {
        const hashtags = await api.get("hashtag/get");
        setHashtags(hashtags.data.data);
      } catch (error) {
        alert("Error getting hashtags data");
      }
    };

    getAllHashtag();
  }, []);

  const handleSubmit = async (e) => {
    // check if title and content is not empty
    if (discussion.title.length === 0 || discussion.content.length === 0) {
      alert("Title dan content tidak boleh kosong");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");


    try {
        const res = await api.post("discussion/create-hashtags", discussion, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "x-refresh-token": refreshToken,
            },
        });

        alert("Discussion created successfully");
        navigate(`/discussions/${res.data.data.discussionId}`);
    } catch (error) {
        alert("Error creating new discussion");
    }
  };

  console.log(discussion);

  return (
    <div>
      <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
      {authStatus.authStatus ? (
        <div>
          <p>title</p>
          <input
            type="text"
            value={discussion.title}
            onChange={(e) => setDiscussion({ ...discussion, title: e.target.value })}
            className="outline-2 border-black border w-full bg-gray-100 px-4 py-2 rounded-md mb-4"
          />
          <p>content</p>
          <textarea
            value={discussion.content}
            onChange={(e) => setDiscussion({ ...discussion, content: e.target.value })}
            className="outline-2 border-black border w-full bg-gray-100 px-4 py-2 rounded-md mb-4"
          />

          <p>hashtags</p>
          <div className="">
            {hashtags.map((tag) => (
              <div key={tag.hashtagId} className=" ">
                <input
                  type="checkbox"
                  checked={discussion.hashtags.includes(tag.hashtagId)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setDiscussion((prevDis) => ({
                        ...prevDis,
                        hashtags: [...prevDis.hashtags, tag.hashtagId],
                      }));
                    } else {
                      setDiscussion((prevDis) => ({
                        ...prevDis,
                        hashtags: prevDis.hashtags.filter(
                          (ht) => ht !== tag.hashtagId
                        ),
                      }));
                    }
                  }}
                  className="outline-2 border-black border bg-gray-100 px-4 py-2 rounded-md mt-4"
                />
                <label>#{tag.name}</label>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="m-2 px-2 py-1 bg-slate-200 rounded-md"
          >
            Submit
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default NewDiscussion;
