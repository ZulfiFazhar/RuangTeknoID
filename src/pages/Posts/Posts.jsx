import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'

function Posts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getPosts = async () => {
        const res = await api.get("post/get")
        setPosts(res.data.data)
    }

    getPosts()

  }, [])

  return (
    <div>
        {
            posts.map((post) => (
                <div key={post.postId}  className='w-full bg-gray-300 mb-2 p-2 rounded-md'>
                    <h1 className='text-xl font-bold'>{post.title}</h1>
                    <p>{post.content}</p>
                    <Link to={`/posts/${post.postId}`} className='text-blue-600'>See post details...</Link>
                </div>
            ))
        }
    </div>
  )
}

export default Posts