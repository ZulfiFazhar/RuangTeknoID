import {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'
import { AuthContext } from '../../components/auth/auth-context'

function Posts() {
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


  return (
    <div>
        {
            posts.map((post) => (
                <div key={post.postId}  className='w-full bg-gray-300 mb-2 p-2 rounded-md'>
                    <h1 className='text-xl font-bold'>{post.title}</h1>
                    <p>{post.content}</p>
                    <Link to={`/posts/${post.postId}`} className='text-blue-600'>See post details...</Link>
                    <button className={`block ${post.isBookmarked ? "bg-gray-400" : "bg-gray-200"} px-2 py-1 rounded-md`} onClick={() => bookmarkPost(post.postId)}>bookmark</button>
                </div>
            ))
        }
    </div>
  )
}

export default Posts