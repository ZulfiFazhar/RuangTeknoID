import {useState, useEffect, useContext} from 'react'
import api from '../../api/api'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import  { AuthContext } from '../../components/auth/auth-context'

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const { authStatus } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.fromLink) {
      // Increment the post view count
      const incrementViewCount = async () => {
        try {
          const res = await api.post(`/post/add-view/${postId}`);
          if(res.data.status !== "success") {
            alert("Error incrementing view count");
          }
        } catch (error) {
            alert("Error incrementing view count");
        }
      };
      incrementViewCount();

      // Clear state to avoid increasing view count on reload
      window.history.replaceState({}, document.title, navigate(location.pathname));
    }


    const getPostDetail = async () => {
      try {
        const res = await api.get(`/post/get-detail/${postId}`)
        setPost(lp => res.data.data);
      } catch (error) {
        console.log(error);
      }
        
    }
    getPostDetail()
  }, [])

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

        <div className='mt-5'></div>
        {
          authStatus.user?.userId == post.user.userId &&
          <Link to={`/posts/edit/${post.post.postId}`} className='underline text-blue-500'>Edit Post</Link>
        }

    </div>
  )
}

export default Post