import {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'
import { AuthContext } from '../components/auth/auth-context'

function Home() {
  const [posts, setPosts] = useState([])
  const {authStatus} = useContext(AuthContext)
  useEffect(() => {
    const getPosts = async () => {
      try {
        if(!authStatus.authStatus) {
          const res = await api.get("post/get")
          setPosts(res.data.data)
        }else{
          const accessToken = localStorage.getItem("accessToken")
          const refreshToken = localStorage.getItem("refreshToken")
            const res = await api.post("post/get-up-details", {}, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "x-refresh-token": refreshToken,
              },
            })
            setPosts(res.data.data)
        }
      } catch (error) {
        alert("Error getting posts")
      }
    }

    getPosts()

  }, [])

  const bookmarkPost = async (postId) => {
    // Check auth status
    if (!authStatus.authStatus) {
      alert("You need to be login to bookmark a post")
      return
    }

    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")

    try {
      await api.post(`post/toggle-bookmark/${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      })

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
      alert("Error bookmarking post")
    }

  }

  const handleVote = async (postId, voteType, curUserVote) => {
    // Check auth status
    if (!authStatus.authStatus) {
      alert("You need to be login to vote")
      return
    }

    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")
    
    let vote;
    let votesIncrement;
    if(curUserVote == 1) {
      vote = voteType == "up" ? 0 : -1
      votesIncrement = voteType == "up" ? -1 : -2 
    } else if (curUserVote == 0) {
      vote = voteType == "up" ? 1 : -1
      votesIncrement = voteType == "up" ? 1 : -1
    } else if (curUserVote == -1) {
      vote = voteType == "up" ? 1 : 0
      votesIncrement = voteType == "up" ? 2 : 1
    }

    try {
      await api.post(`post/votes/${postId}`, 
        { vote }, 
        {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      })

      // update post state
      setPosts(prevPosts => {
        return prevPosts.map((post) => {
          if (post.postId === postId) {
            return {
              ...post,
              userVote: vote,
              votes : post.votes + votesIncrement,
            };
          }
          return post;
        });
      })
    } catch(error) {
      alert("Error voting")
    }
  }

  return (
    <div>
        {
            posts.map((post) => (
                <div key={post.postId}  className='w-full bg-gray-300 mb-2 p-2 rounded-md'>
                    <h1 className='text-xl font-bold'>{post.title}</h1>
                    <p>{post.content}</p>
                    <Link to={`/posts/${post.postId}`} state={{ fromLink : true }} className='text-blue-600'>See post details...</Link>
                    <button className={`block ${post.isBookmarked ? "bg-gray-400" : "bg-gray-200"} px-2 py-1 rounded-md mt-2`} onClick={() => bookmarkPost(post.postId)}>bookmark</button>
                    <div className='flex w-1/4 mt-3 justify-between items-center'>
                      <button onClick={() => handleVote(post.postId, "up", post.userVote)} className={`px-2 py-1 rounded-md ${post.userVote == 1 ? "bg-gray-400" : "bg-gray-200"}`}>Up Vote</button>
                      <span className='text-lg'>{post.votes}</span>
                      <button onClick={() => handleVote(post.postId, "down", post.userVote)} className={`px-2 py-1 rounded-md ${post.userVote == -1 ? "bg-gray-400" : "bg-gray-200"}`}>Down Vote</button>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default Home