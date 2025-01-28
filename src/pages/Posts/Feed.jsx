/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "@/api/api";
import { AuthContext } from "@/components/auth/auth-context";
import CardPost from "@/components/post/CardPost";

function Home({ type = "all" }) {
  const [posts, setPosts] = useState([]);
  const { authStatus } = useContext(AuthContext);

  useEffect(() => {
    const getPosts = async () => {
      try {
        if (!authStatus.authStatus) {
          const res = await api.get("post/get-detail-unauthenticated");
          setPosts(res.data.data);
        } else {
          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");

          if (type === "bookmark") {
            const res = await api.get("post/get-bookmarked", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            setPosts(res.data.data);
            return;
          }

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

  console.log(posts);

  return (
    <div>
      <div className="m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <CardPost
            key={post.postId}
            post={post}
            bookmarkPost={bookmarkPost}
            handleVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
