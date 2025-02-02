/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/components/auth/auth-context";
import api from "@/api/api";
import LoadingPage from "@/components/ui/loading-page";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowBigUp,
  ArrowBigDown,
  Bookmark,
  Share,
  MessageCircleMore,
  Eye,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import formatDate from "@/lib/formatDate";
import ReactMarkdown from "react-markdown";
import MarkdownComponent from "@/components/ui/markdown-component";

function Discussion() {
  const [question, setQuestion] = useState(null);
  const [answerInput, setAnswerInput] = useState("");
  const [answers, setAnswers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { discussionId } = useParams();
  const { authStatus } = useContext(AuthContext);
  const [botAnswer, setBotAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    if (location.state?.fromLink) {
      // Increment the post view count
      const incrementViewCount = async () => {
        try {
          let userId = null;
          if (authStatus.authStatus) {
            userId = authStatus.user.userId;
          }
          const res = await api.put(
            `/discussion/increment-views/${discussionId}`,
            { userId }
          );
          if (res.data.status !== "success") {
            alert("Error incrementing view count");
          }
        } catch (error) {
          alert("Error incrementing view count");
        }
      };
      incrementViewCount();

      // Clear state to avoid increasing view count on reload
      window.history.replaceState(
        {},
        document.title,
        navigate(location.pathname)
      );
    }

    const fetchQuestion = async () => {
      try {
        if (!authStatus.authStatus) {
          const response = await api.get(
            `/discussion/get-discussion-author/${discussionId}`
          );
          setQuestion(response.data.data);
        } else {
          const response = await api.get(
            `/discussion/get-discussion-ud-author/${discussionId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "x-refresh-token": refreshToken,
              },
            }
          );

          setQuestion(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAnswers = async () => {
      if (!authStatus.authStatus) {
        const response = await api.get(
          `/discussion/get-answers-user/${discussionId}`
        );
        setAnswers(response.data.data);
        return;
      } else {
        try {
          const response = await api.get(
            `/discussion/get-answers-user-ud/${discussionId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "x-refresh-token": refreshToken,
              },
            }
          );
          setAnswers(response.data.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchQuestion();
    fetchAnswers();
  }, []);

  const handleSendAnswer = async () => {
    if (!authStatus.authStatus) {
      alert("You must login first");
      return;
    }

    try {
      const response = await api.post(
        "/discussion/create-answer",
        {
          answerTo: question.discussion.discussionId,
          content: answerInput,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );

      // Reset answer input state
      setAnswerInput("");

      // Update answers state
      setAnswers((prevAnswers) => {
        return [response.data.data.newAnswer, ...prevAnswers];
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = async (voteType, curUserVote) => {
    // Check auth status
    if (!authStatus.authStatus) {
      alert("You need to be login to vote");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    let vote;
    let votesIncrement;
    if (curUserVote == 1) {
      vote = voteType == "up" ? 0 : -1;
      votesIncrement = voteType == "up" ? -1 : -2;
    } else if (curUserVote == 0) {
      vote = voteType == "up" ? 1 : -1;
      votesIncrement = voteType == "up" ? 1 : -1;
    } else if (curUserVote == -1) {
      vote = voteType == "up" ? 1 : 0;
      votesIncrement = voteType == "up" ? 2 : 1;
    }

    try {
      const res = await api.put(
        `discussion/votes/${discussionId}`,
        { vote },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );

      // update discussion state
      setQuestion((prevQuestion) => {
        const updatedQuestion = { ...prevQuestion };
        updatedQuestion.discussion.votes += votesIncrement;
        updatedQuestion.userDiscussion.userVote = vote;
        return updatedQuestion;
      });
    } catch (error) {
      alert("Error voting");
    }
  };

  const handleDelete = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      const res = await api.delete(`/discussion/delete/${discussionId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      });

      if (res.data.status === "success") {
        alert("Discussion deleted successfully");
        navigate("/discussions");
      } else {
        alert("Error deleting discussion");
      }
    } catch (error) {
      alert("Error deleting discussion");
    }
  };

  const handleVoteAnswer = async (voteType, curUserVote, answerId) => {
    // Check auth status
    if (!authStatus.authStatus) {
      alert("You need to be login to vote");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    let vote;
    let votesIncrement;
    if (curUserVote == 1) {
      vote = voteType == "up" ? 0 : -1;
      votesIncrement = voteType == "up" ? -1 : -2;
    } else if (curUserVote == 0) {
      vote = voteType == "up" ? 1 : -1;
      votesIncrement = voteType == "up" ? 1 : -1;
    } else if (curUserVote == -1) {
      vote = voteType == "up" ? 1 : 0;
      votesIncrement = voteType == "up" ? 2 : 1;
    }

    try {
      const res = await api.put(
        `discussion/votes/${answerId}`,
        { vote },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );

      // update answer state
      setAnswers((prevAnswers) => {
        const updatedAnswers = prevAnswers.map((answer) => {
          if (answer.discussion.discussionId === answerId) {
            const updatedAnswer = { ...answer };
            updatedAnswer.discussion.votes += votesIncrement;
            updatedAnswer.userDiscussion.userVote = vote;
            return updatedAnswer;
          } else {
            return answer;
          }
        });
        return updatedAnswers;
      });
    } catch (error) {
      alert("Error voting");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!authStatus.authStatus) {
      alert("You must login first");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      const res = await api.delete(`/discussion/delete/${answerId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      });

      if (res.data.status === "success") {
        alert("Answer deleted successfully");

        // Update answers state
        setAnswers((prevAnswers) => {
          return prevAnswers.filter(
            (answer) => answer.discussion.discussionId !== answerId
          );
        });
      } else {
        alert("Error deleting answer");
      }
    } catch (error) {
      alert("Error deleting answer");
    }
  };

  const handleBotAnswer = async () => {
    console.log("AI Answer Clicked");
    setLoading(true);
    try {
      const res = await api.post("/gemini/answer-text", {
        question:
          "Pertanyaan: " +
          question.discussion.title +
          ". Detail: " +
          question.discussion.content,
      });
      const answer = res.data.data.answer;
      setBotAnswer(answer);

      try {
        const response = await api.post(
          "/discussion/create-bot-answer", // Endpoint baru untuk menyimpan jawaban bot
          {
            answerTo: question.discussion.discussionId,
            content: answer,
          }
        );

        // Reset answer input state
        setAnswerInput("");

        // Update answers state
        setAnswers((prevAnswers) => {
          return [response.data.data.newAnswer, ...prevAnswers];
        });
      } catch (error) {
        console.log("Error adding bot answer:", error);
      }
    } catch (error) {
      console.log("Error generating bot answer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated botAnswer", botAnswer);
  }, [botAnswer]);

  console.log("Answer", answers);

  if (!question) {
    return <LoadingPage />;
  }

  return (
    <div className="w-4/5 m-auto h-full mt-4 pb-10">
      {/* new */}
      <div className="grid gap-2">
        {/* haashtag */}
        <div className="flex gap-2">
          {question.hashtags.map((hashtag, index) => (
            <Badge key={index} className="w-fit rounded-full py-1 px-3">
              #{hashtag}
            </Badge>
          ))}
        </div>

        {/* title */}
        <div className="">
          <MarkdownComponent
            content={question.discussion.title}
            className="text-3xl font-bold"
          />
        </div>

        {/* user info */}
        <div>
          <Link
            to={`/users/${question.discussion.userId}`}
            className="flex flex-row items-center gap-4"
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-bold">{question.author.name}</p>
              <p className="text-xs text-neutral-600">
                Diposting {formatDate(question.discussion.createdAt)}
              </p>
            </div>
          </Link>
        </div>

        {/* content */}
        <MarkdownComponent content={question.discussion.content} />

        {/* action */}
        <div>
          <TooltipProvider>
            <div className="flex justify-between items-center w-full">
              {/* Votes */}
              <div className="border-2 border-secondary rounded-lg flex text-neutral-600">
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      // onClick={() => handleVote("up", userPost.userVote)}
                      className={`m-0 p-2 rounded-l-lg flex gap-1 hover:bg-emerald-100 hover:text-emerald-600 `}
                    >
                      <ArrowBigUp className={``} />{" "}
                      <span className={`pr-1 font-bold ml-0 `}>
                        {question.discussion.votes}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Upvote</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      className={`m-0 p-2 rounded-r-l  hover:bg-rose-100 hover:text-rose-600 rounded-r-lg border-l-2 border-secondary `}
                      // onClick={() => handleVote("down", userPost.userVote)}
                    >
                      <ArrowBigDown />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Downvote</TooltipContent>
                </Tooltip>
              </div>

              {/* Action */}
              <div className="flex gap-2 text-neutral-600">
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      className={`cursor-pointer flex gap-1 items-center hover:text-amber-600 hover:bg-amber-100 p-2 rounded-lg`}
                      // onClick={toggleComments}
                    >
                      <MessageCircleMore size={20} />{" "}
                      <span className="font-bold ml-0">1</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Replies</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <button
                      className={`cursor-pointer hover:text-fuchsia-600 hover:bg-fuchsia-100 p-2 rounded-lg `}
                      // onClick={() => bookmarkPost()}
                    >
                      <Bookmark size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Bookmark</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <button className="cursor-pointer hover:text-blue-600 hover:bg-blue-100 p-2 rounded-lg">
                      <Share size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>
        </div>

        {/* input for answering the question */}
        <div className="flex items-center gap-2 mt-4">
          <textarea
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            type="text"
            placeholder="Jawab disini.."
            className="border border-gray-300 h-full rounded-md w-full px-3 py-2"
          />
          <Button onClick={() => handleSendAnswer(null)}>Send</Button>
        </div>

        {/*  Jawaban */}
        <div className="grid gap-2">
          {/* AI Answer Button */}
          <div className="flex flex-col justify-start items-start">
            {loading ? (
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            ) : (
              <Button
                variant="link"
                onClick={handleBotAnswer}
                className="m-0 p-0"
              >
                <Sparkles />
                Answer with AI
              </Button>
            )}
          </div>
          {answers.map((answer) => (
            <div key={answer.discussion.discussionId} className="">
              <div className="flex flex-row items-start gap-3">
                <Link to={`/users/${answer.author.userId}`}>
                  <Avatar className="w-9 h-9">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col w-full">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">
                        {answer.author.name}
                      </p>
                      <p className="text-[0.75rem] text-neutral-600">
                        {formatDate(answer.discussion.createdAt)}
                      </p>
                    </div>
                    {answer.author.userId === authStatus.user?.userId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-full">
                            <MoreVertical size={20} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <button
                              onClick={() =>
                                handleDeleteAnswer(
                                  answer.discussion.discussionId
                                )
                              }
                            >
                              Hapus Balasan
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <div>
                    <MarkdownComponent content={answer.discussion.content} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* old */}
      {/* <div className="w-full bg-gray-300 mb-2 p-2 rounded-md">
        <h1 className="text-xl font-bold">Question :</h1>
        <p>Title : {question.discussion.title}</p>
        <p>Content : {question.discussion.content}</p>
        <p>UserId : {question.discussion.userId}</p>
        <p>DiscussionId : {question.discussion.discussionId}</p>
        <p>Views : {question.discussion.views}</p>
        <p>Votes : {question.discussion.votes}</p>
        <p>Created At : {question.discussion.createdAt}</p>
        <p>Updated At : {question.discussion.updatedAt}</p>

        <h1 className="text-xl font-bold mt-2">Author :</h1>
        <p>UserId : {question.author.userId}</p>
        <p>
          Name :{" "}
          <Link
            to={`/users/${question.author.userId}`}
            className="text-blue-500 underline"
          >
            {question.author.name}
          </Link>
        </p>

        <h1 className="text-xl font-bold mt-2">Hashtags :</h1>
        <div className="flex *:mr-2 ">
          {question.hashtags?.map((hashtag) => (
            <p key={hashtag}>#{hashtag}</p>
          ))}
        </div>

        <div className="flex w-1/4 mt-3 justify-between items-center">
          <button
            onClick={() => handleVote("up", question.userDiscussion?.userVote)}
            className={`px-2 py-1 rounded-md border border-black ${
              question.userDiscussion?.userVote === 1
                ? "bg-gray-500"
                : "bg-gray-300"
            }`}
          >
            Up Vote
          </button>
          <span className="text-lg">{question.discussion.votes}</span>
          <button
            onClick={() =>
              handleVote("down", question.userDiscussion?.userVote)
            }
            className={`px-2 py-1 rounded-md border border-black ${
              question.userDiscussion?.userVote === -1
                ? "bg-gray-500"
                : "bg-gray-300"
            }`}
          >
            Down Vote
          </button>
        </div> */}

      {/* Delete button */}
      {/* {question.author.userId === authStatus.user?.userId && (
          <>
            <Link
              to={`/discussions/edit/${question.discussion.discussionId}`}
              className="bg-blue-500 text-white px-2 py-1 rounded-md mt-2 mr-2"
            >
              Edit Discussion
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-2 py-1 rounded-md mt-2"
            >
              Delete Discussion
            </button>
          </>
        )} */}
      {/* </div> */}

      {/* input for answering the question */}
      {/* <div className="flex items-center">
        <input
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
          type="text"
          placeholder="Jawab di sini, bang"
          className="border border-black mt-2 mb-1 rounded-md px-2 py-1 w-full"
        />
        <button
          onClick={() => handleSendAnswer(null)}
          className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
        >
          Send
        </button>
      </div> */}

      {/* Answers section */}
      {/* <div>
        {answers.map((answer) => (
          <div
            key={answer.discussion.discussionId}
            className="w-full bg-gray-300 mb-2 p-2 rounded-md"
          >
            <p>UserId : {answer.discussion.userId}</p>
            <p>
              Username :{" "}
              <Link
                to={`/users/${answer.author.userId}`}
                className="text-blue-500 underline"
              >
                {answer.author.name}
              </Link>
            </p>
            <p>Content : {answer.discussion.content}</p>
            <p>DiscussionId : {answer.discussion.discussionId}</p>
            <p>Votes : {answer.discussion.votes}</p>
            <p>Created At : {answer.discussion.createdAt}</p>
            <p>Updated At : {answer.discussion.updatedAt}</p>

            <div className="flex w-1/4 mt-3 justify-between items-center">
              <button
                onClick={() =>
                  handleVoteAnswer(
                    "up",
                    answer.userDiscussion?.userVote,
                    answer.discussion.discussionId
                  )
                }
                className={`px-2 py-1 rounded-md border border-black ${
                  answer.userDiscussion?.userVote === 1
                    ? "bg-gray-500"
                    : "bg-gray-300"
                }`}
              >
                Up Vote
              </button>
              <span className="text-lg">{answer.discussion.votes}</span>
              <button
                onClick={() =>
                  handleVoteAnswer(
                    "down",
                    answer.userDiscussion?.userVote,
                    answer.discussion.discussionId
                  )
                }
                className={`px-2 py-1 rounded-md border border-black ${
                  answer.userDiscussion?.userVote === -1
                    ? "bg-gray-500"
                    : "bg-gray-300"
                }`}
              >
                Down Vote
              </button>
            </div>

            {answer.author.userId === authStatus.user?.userId && (
              <>
                <button
                  onClick={() =>
                    handleDeleteAnswer(answer.discussion.discussionId)
                  }
                  className="bg-red-500 text-white px-2 py-1 rounded-md mt-2"
                >
                  Delete Answer
                </button>
              </>
            )}
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default Discussion;
