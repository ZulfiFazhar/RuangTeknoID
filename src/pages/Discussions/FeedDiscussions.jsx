/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useContext, useMemo } from "react";
// import { Link } from "react-router-dom";
import api from "@/api/api";
import { AuthContext } from "@/components/auth/auth-context";
import CardDiscus from "@/components/discussion/CardDiscus";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function Discussions({ type = "all" }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
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
          if (type === "bookmark") {
            const response = await api.get(
              "/discussion/get-questions-ud-bookmarked",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "x-refresh-token": refreshToken,
                },
              }
            );
            setQuestions(response.data.data);
          } else {
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
      } finally {
        setLoading(false); // Nonaktifkan loading setelah fetch selesai
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

  const SkeletonItems = useMemo(
    () => (
      <div className="grid gap-4 mt-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="w-full h-[18rem]">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ))}
      </div>
    ),
    []
  );

  return (
    <div className="m-auto h-full">
      {loading || questions.length === 0
        ? SkeletonItems
        : questions.map((question) => (
            <div className="grid gap-4" key={question.discussionId}>
              <CardDiscus
                question={question}
                bookmarkDiscussion={bookmarkDiscussion}
              />
              <Separator />
            </div>
          ))}
    </div>
  );
}

export default Discussions;
