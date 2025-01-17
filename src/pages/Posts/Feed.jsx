/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "@/api/api";
import { AuthContext } from "@/components/auth/auth-context";
import CardPost from "@/components/post/CardPost";

function Home() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [replies, setReplies] = useState({});
  const { authStatus } = useContext(AuthContext);

  useEffect(() => {
    const getPosts = async () => {
      try {
        if (!authStatus.authStatus) {
          const res = await api.get("post/get");
          setPosts(res.data.data);
        } else {
          const accessToken = localStorage.getItem("accessToken");

          const res = await api.get("post/recommedations", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setPosts(res.data.data);
        }
      } catch (error) {
        alert("Error getting posts");
      }
    };

    getPosts();
  }, []);

  const bookmarkPost = async (postId) => {
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

      // update post state
      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post.postId === postId) {
            return {
              ...post,
              isBookmarked: !post.isBookmarked,
            };
          }
          return post;
        });
      });
    } catch (error) {
      alert("Error bookmarking post");
    }
  };

  const handleVote = async (postId, voteType, curUserVote) => {
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
      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post.postId === postId) {
            return {
              ...post,
              userVote: vote,
              votes: post.votes + votesIncrement,
            };
          }
          return post;
        });
      });
    } catch (error) {
      alert("Error voting");
    }
  };

  const handleToggleComment = async (postId) => {
    // If already open, close it
    if (comments[postId]) {
      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        delete updatedComments[postId];
        return updatedComments;
      });
      return;
    }

    // Get top level comments of this post
    try {
      const comments = await api.get(`/comment/get-by-postid/${postId}`);
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: comments.data.data,
      }));
    } catch (error) {
      alert("Error getting comments");
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

  return (
    <div>
      <div className="m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <CardPost key={post.id} post={post} bookmarkPost={bookmarkPost} />
        ))}
      </div>

      {/* ganti code ini */}
      {/* {posts.map((post) => (
        <div
          key={post.postId}
          className="w-full bg-gray-300 mb-2 p-2 rounded-md mt-2"
        >
          <h1 className="text-xl font-bold">{post.title}</h1>
          <p>{post.content}</p>
          <Link
            to={`/posts/${post.postId}`}
            state={{ fromLink: true }}
            className="text-blue-600"
          >
            See post details...
          </Link>
          <button
            className={`block ${
              post.isBookmarked ? "bg-gray-400" : "bg-gray-200"
            } px-2 py-1 rounded-md mt-2`}
            onClick={() => bookmarkPost(post.postId)}
          >
            bookmark
          </button>

          <div className="flex w-1/4 mt-3 justify-between items-center">
            <button
              onClick={() => handleVote(post.postId, "up", post.userVote)}
              className={`px-2 py-1 rounded-md ${
                post.userVote == 1 ? "bg-gray-400" : "bg-gray-200"
              }`}
            >
              Up Vote
            </button>
            <span className="text-lg">{post.votes}</span>
            <button
              onClick={() => handleVote(post.postId, "down", post.userVote)}
              className={`px-2 py-1 rounded-md ${
                post.userVote == -1 ? "bg-gray-400" : "bg-gray-200"
              }`}
            >
              Down Vote
            </button>
          </div>

          <button
            className={`block ${
              comments[post.postId] ? "bg-gray-400" : "bg-gray-200"
            } text-xs px-2 py-1 rounded-md mt-3`}
            onClick={() => handleToggleComment(post.postId)}
          >
            {comments[post.postId] ? "Hide Comments" : "View Comments"}
          </button>
          {comments[post.postId] &&
            (comments[post.postId].length > 0 ? (
              comments[post.postId].map((comment) => (
                <div
                  key={comment.commentId}
                  className="ml-5 mt-4 border-t border-black"
                >
                  <p className="mb-2">
                    <Link
                      to={`/users/${comment.userId}`}
                      className="text-blue-800 underline font-bold"
                    >
                      @{comment.name}
                    </Link>{" "}
                    : {comment.content}
                  </p>
                  <button
                    className={`block ${
                      replies[comment.commentId] ? "bg-gray-400" : "bg-gray-200"
                    } text-xs px-2 py-1 rounded-md`}
                    onClick={() => handleToggleReply(comment.commentId)}
                  >
                    {replies[comment.commentId]
                      ? "Hide Replies"
                      : "View Replies"}
                  </button>
                  {replies[comment.commentId] &&
                    (replies[comment.commentId].length > 0 ? (
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
                        </div>
                      ))
                    ) : (
                      <div>There is no reply</div>
                    ))}
                </div>
              ))
            ) : (
              <div>There is no comment</div>
            ))}
        </div>
      ))} */}
    </div>
  );
}

export default Home;
