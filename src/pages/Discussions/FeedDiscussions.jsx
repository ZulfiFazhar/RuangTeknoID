/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useContext } from "react";
// import { Link } from "react-router-dom";
import api from "@/api/api";
import { AuthContext } from "@/components/auth/auth-context";
import CardDiscus from "@/components/discussion/CardDiscus";
import { Separator } from "@/components/ui/separator";

function Discussions({ type = "all" }) {
  const [questions, setQuestions] = useState([]);
  const { authStatus } = useContext(AuthContext);

  useEffect(() => {
    const fetchQuestionsUD = async () => {
      try {
        if (!authStatus.authStatus) {
          const response = await api.get("/discussion/get-questions");
          setQuestions(response.data.data);
        } else {
          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");
          if(type == "bookmark"){
            const response = await api.get("/discussion/get-questions-ud-bookmarked", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "x-refresh-token": refreshToken,
              },
            });
            setQuestions(response.data.data);
          }else{
            const response = await api.get("/discussion/get-questions-ud", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "x-refresh-token": refreshToken,
              },
            });
            setQuestions(response.data.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuestionsUD();
  }, [type, authStatus.authStatus]);

  const bookmarkDiscussion = async (discussionId) => {
    if (!authStatus.authStatus) {
      alert("You need to be login to bookmark a discussion");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      await api.post(
        `discussion/toggle-bookmark/${discussionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );

      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.discussionId === discussionId
            ? { ...question, isBookmarked: !question.isBookmarked }
            : question
        )
      );
    } catch (error) {
      alert("Error bookmarking discussion");
    }
  };

  return (
    <div className="m-auto h-full">
      {questions.map((question) => (
        <div className="grid gap-4" key={question.discussionId}>
          <CardDiscus question={question} bookmarkDiscussion={bookmarkDiscussion} />
          <Separator />
        </div>
      ))}
      {/* {questions.map((question) => (
        <div
          key={question.discussionId}
          className="w-full bg-gray-300 mb-2 p-2 rounded-md"
        >
          <h1 className="text-xl font-bold">{question.title}</h1>
          <p>{question.content}</p>
          <Link
            to={`/discussions/${question.discussionId}`}
            state={{ fromLink: true }}
            className="text-blue-600"
          >
            See discussion detail
          </Link>
          <p>views : {question.views}</p>
          <p>votes : {question.votes}</p>

          <div className="flex w-1/4 mt-3 justify-between items-center">
            <Link
              to={`/discussions/${question.discussionId}`}
              state={{ fromLink: true }}
              className={`px-2 py-1 rounded-md border border-black ${
                question.userVote === 1 ? "bg-gray-500" : "bg-gray-300"
              }`}
            >
              Up Vote
            </Link>
            <span className="text-lg">{question.votes}</span>
            <Link
              to={`/discussions/${question.discussionId}`}
              state={{ fromLink: true }}
              className={`px-2 py-1 rounded-md border border-black ${
                question.userVote === -1 ? "bg-gray-500" : "bg-gray-300"
              }`}
            >
              Down Vote
            </Link>
          </div>
        </div>
      ))} */}
    </div>
  );
}

export default Discussions;
