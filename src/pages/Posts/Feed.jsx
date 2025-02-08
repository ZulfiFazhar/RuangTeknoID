/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "@/api/api";
import { AuthContext } from "@/components/auth/auth-context";
import CardPost from "@/components/post/CardPost";
import { Skeleton } from "@/components/ui/skeleton";

function Feed({ type = "all" }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authStatus } = useContext(AuthContext);

  useEffect(() => {
    const getPosts = async () => {
      try {
        if (!authStatus.authStatus) {
          const res = await api.get("post/get-detail-unauthenticated");
          setPosts(res.data.data);
        } else {
          const accessToken = localStorage.getItem("accessToken");

          if (type === "bookmark") {
            const res = await api.get("post/get-bookmarked", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            setPosts(res.data.data);
            setLoading(false);
            return;
          }

          try {
            const res = await api.get("post/recommedations", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            setPosts(res.data.data);
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.warn(
                "Recommendations not found, fetching unauthenticated data..."
              );
              const fallbackRes = await api.get(
                "post/get-detail-unauthenticated"
              );
              setPosts(fallbackRes.data.data);
            } else {
              throw error;
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [authStatus.authStatus, type]);

  const bookmarkPost = async (postId) => {
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

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === postId
            ? { ...post, isBookmarked: !post.isBookmarked }
            : post
        )
      );
    } catch (error) {
      alert("Error bookmarking post");
    }
  };

  const handleVote = async (postId, voteType, curUserVote) => {
    if (!authStatus.authStatus) {
      alert("You need to be login to vote");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    let vote, votesIncrement;
    if (curUserVote == 1) {
      vote = voteType == "up" ? 0 : -1;
      votesIncrement = voteType == "up" ? -1 : -2;
    } else if (curUserVote == 0) {
      vote = voteType == "up" ? 1 : -1;
      votesIncrement = voteType == "up" ? 1 : -1;
    } else if (curUserVote == -1) {
      vote = voteType == "up" ? 1 : 0;
      votesIncrement = voteType == "up" ? 2 : 1;
    } else {
      vote = voteType == "up" ? 1 : -1;
      votesIncrement = voteType == "up" ? 1 : -1;
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

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === postId
            ? { ...post, userVote: vote, votes: post.votes + votesIncrement }
            : post
        )
      );
    } catch (error) {
      alert("Error voting");
    }
  };

  const SkeletonItems = useMemo(
    () =>
      [...Array(12)].map((_, index) => (
        <div key={index} className="h-[22rem] w-full">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      )),
    []
  );

  return (
    <div>
      <div className="m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading || posts.length === 0
          ? SkeletonItems
          : posts.map((post) => (
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

export default Feed;
