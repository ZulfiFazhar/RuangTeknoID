import {useState, useEffect} from 'react'
import api from '../../api/api'
import { useParams } from 'react-router-dom'

function Post() {
  const { postId } = useParams()
  const [post, setPost] = useState({})
  useEffect(() => {
    const getPost = async () => {
        const res = await api.get(`/post/get/${postId}`)
        setPost(res.data.data)
    }
    getPost()
  }, [])

  return (
    <div className='w-full '>
        <h1 className='text-xl font-bold'>{post.title}</h1>
        <p>{post.content}</p>
    </div>
  )
}

export default Post