import { useEffect, useState, useContext } from "react";
// import { Link } from "react-router-dom";
import api from "@/api/api";
import { AuthContext } from "@/components/auth/auth-context";
import CardDiscus from "@/components/discussion/CardDiscus";
import { Separator } from "@/components/ui/separator";

function Discussions() {
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
          const response = await api.get("/discussion/get-questions-ud", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "x-refresh-token": refreshToken,
            },
          });
          setQuestions(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuestionsUD();
  }, []);

  return (
    <div className="w-4/5 m-auto h-full">
      <h1 className="text-2xl font-bold">Forum Diskusi</h1>
      {questions.map((question) => (
        <div className="grid gap-4" key={question.discussionId}>
          <CardDiscus question={question} />
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
