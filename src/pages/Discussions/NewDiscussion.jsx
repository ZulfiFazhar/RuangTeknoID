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
  });

  const { authStatus } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
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
        const res = await api.post("discussion/create", discussion, {
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
