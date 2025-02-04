/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/components/auth/auth-context";
import api from "@/api/api";
import LoadingPage from "@/components/ui/loading-page";
import CardPost from "@/components/post/CardPost";
import Discussions from "@/pages/Discussions/FeedDiscussions";
import { Button } from "@/components/ui/button";

export default function SearchResult({ type = "all" }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchKeyword = params.get("keyword");
  const { authStatus } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authStatus.authStatus) {
          const response = await api.get(
            "/post/search?keyword=" + searchKeyword
          );
          setPosts(response.data.data);
        } else {
          const accessToken = localStorage.getItem("accessToken");

          if (type === "bookmark") {
            const response = await api.get("post/get-bookmarked", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            setPosts(response.data.data);
            return;
          }

          const response = await api.get(
            "/post/auth-search?keyword=" + searchKeyword,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setPosts(response.data.data);
        }
      } catch (err) {
        setError("Keyword tidak ditemukan", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchKeyword]);

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
      alert("Error bookmarking post", error);
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
      alert("Error voting", error);
    }
  };

  const handlePageChange = (page) => {
    if (currentPage !== page) setCurrentPage(page);
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>{error}</div>;
  }
  console.log(posts);
  return (
    <div className="grid gap-4 w-4/5 m-auto mt-0">
      <h1 className="text-xl font-bold text-zinc-400">
        Hasil pencarian untuk{" "}
        <span className="text-black">{searchKeyword}</span>
      </h1>
      <div className="flex mb-2 gap-2 bg-gray-100 w-fit p-2 rounded-lg">
        <Button
          variant="outline"
          className={`p-4 rounded-lg hover:bg-white ${
            currentPage === 1 ? "" : "border-none bg-transparent shadow-none"
          }`}
          onClick={() => handlePageChange(1)}
        >
          Artikel
        </Button>
        <Button
          variant="outline"
          className={`p-4 rounded-lg hover:bg-white ${
            currentPage === 2 ? "" : "border-none bg-transparent shadow-none"
          }`}
          onClick={() => handlePageChange(2)}
        >
          Diskusi
        </Button>
      </div>
      <div>
        {currentPage === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <CardPost
                key={post.postId}
                post={post}
                bookmarkPost={bookmarkPost}
                handleVote={handleVote}
              />
            ))}
          </div>
        )}
        {currentPage === 2 && <Discussions type="bookmark" />}
      </div>
    </div>
  );
}
