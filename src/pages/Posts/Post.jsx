import {useState, useEffect} from 'react'
import api from '../../api/api'
import { useParams, Link } from 'react-router-dom'

function Post() {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  useEffect(() => {
    const getPostDetail = async () => {
      try {
        const res = await api.get(`/post/get-detail/${postId}`)
        setPost(res.data.data)
      } catch (error) {
        console.log(error)
      }
        
    }
    getPostDetail()
  }, [])
  console.log(post)

  if(!post) return <p>Loading...</p>

  return (
    <div className='w-full '>
        <h1 className='text-xl'>Post Detail</h1>
        <p>title : {post.post.title}</p>
        <p>content : {post.post.content}</p>
        <p>views : {post.post.views}</p>
        <p>votes : {post.post.votes}</p>

        <h1 className='text-xl mt-4'>Author</h1>
        <p>username : {post.user.username}</p>
        <p>email : {post.user.email}</p>
        <Link to={`/users/${post.user.userId}`} className='underline text-blue-500'>Go to author page</Link>

        <h1 className='text-xl mt-4'>Hashtags</h1>
        {post.hashtags.map((hashtag, index) => (
          <p key={index} className='inline mr-3'>#{hashtag}</p>
        ))}
    </div>
  )
}

export default Post