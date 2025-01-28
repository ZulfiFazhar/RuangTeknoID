/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useContext } from "react";
import api from "@/api/api";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@/components/auth/auth-context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowBigUp,
  ArrowBigDown,
  Bookmark,
  Share,
  MessageCircleMore,
} from "lucide-react";
import Feed from "@/pages/Posts/Feed";
import ContentEditor from "@/components/editor/ContentEditor";
import LoadingPage from "@/components/ui/loading-page";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [userPost, setUserPost] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState({});
  const [comments, setComments] = useState({});
  const [replies, setReplies] = useState({});
  const [showComments, setShowComments] = useState(false);
  const { authStatus } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.fromLink) {
      // Increment the post view count
      const incrementViewCount = async () => {
        try {
          const userId = authStatus.user?.userId;
          const res = await api.post(`/post/add-view/${postId}`, {
            userId,
          });
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

    const getPostDetail = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await api.get(`/post/get-detail/${postId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        });
        setPost((lp) => res.data.data);
      } catch (error) {
        console.log("Error getting post detail");
      }
    };

    const getUserPost = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await api.post(
          `/post/get-up/${postId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "x-refresh-token": refreshToken,
            },
          }
        );
        setUserPost((prevUserPost) => res.data.data);
        console.log("User post: ", userPost);
      } catch (error) {
        alert("Error getting user post");
      }
    };

    const getComments = async () => {
      // Get top level comments of this post
      try {
        const comments = await api.get(`/comment/get-by-postid/${postId}`);
        setComments((prevComments) => comments.data.data);
      } catch (error) {
        alert("Error getting comments");
      }
    };

    getPostDetail();

    if (authStatus.authStatus) {
      getUserPost();
      getComments();
    }

    getComments();
  }, []);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const bookmarkPost = async () => {
    // Check auth status
    if (!authStatus.authStatus) {
      alert("You need to be login to bookmark a post");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      await api.post(
        `post/toggle-bookmark/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );

      // update userpost state
      setUserPost((prevUserPost) => {
        const updatedUserPost = { ...prevUserPost };
        updatedUserPost.isBookmarked = !prevUserPost.isBookmarked;
        return updatedUserPost;
      });
    } catch (error) {
      alert("Error bookmarking post");
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
      await api.post(
        `post/votes/${postId}`,
        { vote },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );

      // update post state
      setPost((prevPost) => {
        const updatedPost = { ...prevPost };
        updatedPost.post.votes += votesIncrement;
        return updatedPost;
      });

      // update user post state
      setUserPost((prevUserPost) => {
        const updatedUserPost = { ...prevUserPost };
        updatedUserPost.userVote = vote;
        return updatedUserPost;
      });
    } catch (error) {
      alert("Error voting");
    }
  };

  const handleToggleReply = async (commentId) => {
    // If already open, close it
    if (replies[commentId]) {
      setReplies((prevReplies) => {
        const updatedReplies = { ...prevReplies };
        delete updatedReplies[commentId];
        return updatedReplies;
      });
      return;
    }

    // Get replies of this comment
    try {
      const replies = await api.get(`/comment/get-replies/${commentId}`);
      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: replies.data.data,
      }));
    } catch (error) {
      alert("Error getting replies");
    }
  };

  const handleSendComment = async (replyTo) => {
    if (!authStatus.authStatus) {
      alert("You must be logged in to comment");
      return;
    }

    if (replyTo) {
      if (replyInput[replyTo].length === 0) {
        alert("Reply cannot be empty");
        return;
      }
    } else {
      if (commentInput.length === 0) {
        alert("Comment cannot be empty");
        return;
      }
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const content = replyTo ? replyInput[replyTo] : commentInput;
      const res = await api.post(
        `/comment/create/${postId}`,
        {
          replyTo,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );

      if (replyTo) {
        // clear reply input
        setReplyInput((prevReplyInput) => {
          const updatedReplyInput = { ...prevReplyInput };
          updatedReplyInput[replyTo] = "";
          return updatedReplyInput;
        });

        // update replies state
        setReplies((prevReplies) => {
          const updatedReplies = { ...prevReplies };
          updatedReplies[replyTo] = [res.data.data, ...prevReplies[replyTo]];
          return updatedReplies;
        });
      } else {
        // clear comment input
        setCommentInput("");

        // update comments state
        setComments((prevComments) => [
          { ...res.data.data, name: authStatus.user.name },
          ...prevComments,
        ]);
      }
    } catch (error) {
      alert("Error sending comment");
      return;
    }
  };

  const handleDeleteComment = async (
    commentId,
    isComment,
    parentCommentId = null
  ) => {
    if (!authStatus.authStatus) {
      alert("You must be logged in to delete comment");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      const res = await api.delete(`/comment/delete/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      });

      if (isComment) {
        // update comments state
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.commentId !== commentId)
        );
      } else {
        // update replies state
        setReplies((prevReplies) => ({
          ...prevReplies,
          [parentCommentId]: prevReplies[parentCommentId].filter(
            (reply) => reply.commentId !== commentId
          ),
        }));
      }

      alert("Comment deleted");
    } catch (error) {
      alert("Error deleting comment");
    }
  };
  console.log("Post data: " + JSON.stringify(post));
  if (!post) return <LoadingPage />;
  return (
    <div>
      {/* new */}
      <div className="w-4/5 m-auto grid gap-6 mb-10">
        <img
          className="w-full h-80 object-cover rounded-xl mt-2"
          src={
            post.post.image_cover ||
            `https://images.unsplash.com/photo-1724166573009-4634b974ebb2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
          }
          alt="react js"
        />

        <div>
          <Link
            to={`/users/${post.user.userId}`}
            className="flex flex-row items-center gap-4"
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-bold">{post.user.name}</p>
              <p className="text-xs text-neutral-600">
                Diposting pada {post.post.createdAt}
              </p>
            </div>
          </Link>
        </div>

        <h1 className="font-bold text-2xl m-0 p-0">{post.post.title}</h1>

        <div className="flex flex-row flex-wrap gap-2.5">
          {post.hashtags.map((hashtag, index) => (
            <Badge
              key={index}
              className="w-fit cursor-pointer"
              variant="outline"
            >
              #{hashtag}
            </Badge>
          ))}
        </div>

        <div
          dangerouslySetInnerHTML={{ __html: post.post.content }}
          className="text-justify grid gap-2"
        />

        <div>
          <TooltipProvider>
            <div className="flex justify-between items-center w-full">
              {/* Votes */}
              <div className="border-2 border-secondary rounded-lg flex text-neutral-600">
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      onClick={() => handleVote("up", userPost.userVote)}
                      className={`m-0 p-2 rounded-l-lg flex gap-1 hover:bg-emerald-100 hover:text-emerald-600 `}
                    >
                      <ArrowBigUp
                        className={`${
                          userPost.userVote == 1
                            ? "fill-emerald-600 text-emerald-600"
                            : ""
                        }`}
                      />{" "}
                      <span
                        className={`pr-1 font-bold ml-0 ${
                          userPost.userVote == 1 ? "text-emerald-600" : ""
                        }`}
                      >
                        {post.post.votes}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Upvote</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      className="m-0 p-2 rounded-r-l  hover:bg-rose-100 hover:text-rose-600 rounded-r-lg border-l-2 border-secondary"
                      onClick={() => handleVote("down", userPost.userVote)}
                    >
                      <ArrowBigDown
                        className={
                          userPost.userVote == -1
                            ? "fill-rose-600 text-rose-600"
                            : ""
                        }
                      />
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
                      className={`cursor-pointer flex gap-1 items-center hover:text-amber-600 hover:bg-amber-100 p-2 rounded-lg ${
                        showComments ? "text-amber-600 bg-amber-100" : ""
                      }`}
                      onClick={toggleComments}
                    >
                      <MessageCircleMore size={20} />{" "}
                      <span className="font-bold ml-0">1</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Comment</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <button
                      className="cursor-pointer hover:text-fuchsia-600 hover:bg-fuchsia-100 p-2 rounded-lg"
                      onClick={() => bookmarkPost()}
                    >
                      <Bookmark
                        size={20}
                        className={
                          userPost.isBookmarked
                            ? "fill-fuchsia-600 text-fuchsia-600"
                            : ""
                        }
                      />
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

        {showComments && (
          <div className="grid gap-4">
            <ContentEditor />
            <Button onClick={() => handleSendComment(null)} className="w-fit">
              Send
            </Button>
          </div>
        )}

        <div className="grid gap-4">
          <h2 className="text-lg font-bold">Artikel Rekomendasi</h2>
          <Feed />
        </div>
      </div>

      {/* old */}
      <h1 className="text-xl">Post Detail</h1>
      <p>title : {post.post.title}</p>
      <p>content : {post.post.content}</p>
      <p>views : {post.post.views}</p>
      <p>votes : {post.post.votes}</p>

      <h1 className="text-xl mt-4">Author</h1>
      <p>username : {post.user.name}</p>
      <p>email : {post.user.email}</p>
      <Link
        to={`/users/${post.user.userId}`}
        className="underline text-blue-500"
      >
        Go to author page
      </Link>

      <h1 className="text-xl mt-4">Hashtags</h1>
      {post.hashtags.map((hashtag, index) => (
        <p key={index} className="inline mr-3">
          #{hashtag}
        </p>
      ))}

      <button
        className={`block ${
          userPost.isBookmarked ? "bg-gray-400" : "bg-gray-200"
        } px-2 py-1 rounded-md mt-2`}
        onClick={() => bookmarkPost()}
      >
        bookmark
      </button>

      <div className="flex w-1/4 mt-3 justify-between items-center">
        <button
          onClick={() => handleVote("up", userPost.userVote)}
          className={`px-2 py-1 rounded-md ${
            userPost.userVote == 1 ? "bg-gray-400" : "bg-gray-200"
          }`}
        >
          Up Vote
        </button>
        <span className="text-lg">{post.post.votes}</span>
        <button
          onClick={() => handleVote("down", userPost.userVote)}
          className={`px-2 py-1 rounded-md ${
            userPost.userVote == -1 ? "bg-gray-400" : "bg-gray-200"
          }`}
        >
          Down Vote
        </button>
      </div>

      <div className="mt-5"></div>
      {authStatus.user?.userId == post.user.userId && (
        <Link
          to={`/posts/edit/${post.post.postId}`}
          className="underline text-blue-500"
        >
          Edit Post
        </Link>
      )}

      <div className="mt-5 text-xl font-bold">Comments</div>

      <div className="flex items-center">
        <input
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          type="text"
          placeholder="Comment di sini, mang"
          className="border border-black mt-2 mb-1 rounded-md px-2 py-1 w-full"
        />
        <button
          onClick={() => handleSendComment(null)}
          className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
        >
          Send
        </button>
      </div>

      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.commentId} className="mt-4 border-t border-black">
            <p className="mb-2">
              <Link
                to={`/users/${comment.userId}`}
                className="text-blue-800 underline font-bold"
              >
                @{comment.name}
              </Link>{" "}
              : {comment.content}
            </p>
            {comment.userId == authStatus.user?.userId && (
              <button
                onClick={() => handleDeleteComment(comment.commentId, true)}
                className={`bg-red-500 text-white mb-2 text-xs px-2 py-1 rounded-md`}
              >
                Delete Comment
              </button>
            )}
            <button
              className={`block ${
                replies[comment.commentId] ? "bg-gray-400" : "bg-gray-200"
              } text-xs px-2 py-1 rounded-md`}
              onClick={() => handleToggleReply(comment.commentId)}
            >
              {replies[comment.commentId] ? "Hide Replies" : "View Replies"}
            </button>
            {replies[comment.commentId] && (
              <>
                <div className="flex items-center ml-5">
                  <input
                    value={replyInput[comment.commentId] || ""}
                    onChange={(e) =>
                      setReplyInput((pr) => ({
                        ...pr,
                        [comment.commentId]: e.target.value,
                      }))
                    }
                    type="text"
                    placeholder="Reply di sini, mang"
                    className="border border-black mt-2 mb-1 rounded-md px-2 py-1 w-full"
                  />
                  <button
                    onClick={() => handleSendComment(comment.commentId, false)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                  >
                    Send
                  </button>
                </div>
                {replies[comment.commentId].length > 0 ? (
                  replies[comment.commentId].map((reply) => (
                    <div
                      key={reply.commentId}
                      className="ml-5 mt-2 border-t border-black"
                    >
                      <p>
                        <Link
                          to={`/users/${comment.userId}`}
                          className="text-blue-800 underline font-bold"
                        >
                          @{comment.name}
                        </Link>{" "}
                        : {reply.content}
                      </p>
                      {reply.userId == authStatus.user?.userId && (
                        <button
                          onClick={() =>
                            handleDeleteComment(
                              reply.commentId,
                              false,
                              comment.commentId
                            )
                          }
                          className={`bg-red-500 text-white mb-2 text-xs px-2 py-1 rounded-md`}
                        >
                          Delete Reply
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div>There is no reply</div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <div>There is no comment</div>
      )}

      <div className="min-h-screen"></div>
    </div>
  );
}

export default Post;
