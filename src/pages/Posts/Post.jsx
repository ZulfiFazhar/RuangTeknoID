import {useState, useEffect, useContext} from 'react'
import api from '../../api/api'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import  { AuthContext } from '../../components/auth/auth-context'

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [replyInput, setReplyInput] = useState({});
  const [comments, setComments] = useState({});
  const [replies, setReplies] = useState({});
  const { authStatus } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.fromLink) {
      // Increment the post view count
      const incrementViewCount = async () => {
        try {
          const userId = authStatus.user?.userId;
          const res = await api.post(`/post/add-view/${postId}`, {
            userId
          });
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

    const getComments = async () => {
      // Get top level comments of this post
      try {
        const comments = await api.get(`/comment/get-by-postid/${postId}`);
        setComments(prevComments => comments.data.data);
      } catch (error) {
        alert("Error getting comments");
      }
    }

    getPostDetail()
    getComments()
  }, [])

  const handleToggleReply = async (commentId) => {
    // If already open, close it
    if(replies[commentId]) {
      setReplies(prevReplies => {
        const updatedReplies = {...prevReplies}
        delete updatedReplies[commentId]
        return updatedReplies
      })
      return;
    }

    // Get replies of this comment
    try {
      const replies = await api.get(`/comment/get-replies/${commentId}`);
      setReplies(prevReplies => ({...prevReplies, [commentId]: replies.data.data}));
    } catch (error) {
      alert("Error getting replies");
    }
  }

  const handleSendComment = async (replyTo) => {
    if(!authStatus.authStatus){
      alert("You must be logged in to comment");
      return;
    }

    if(replyTo) {
      if(replyInput[replyTo].length === 0) {
        alert("Reply cannot be empty");
        return;
      }
    }else{
      if(commentInput.length === 0) {
        alert("Comment cannot be empty");
        return;
      }
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const content = replyTo ? replyInput[replyTo] : commentInput;
      const res = await api.post(`/comment/create/${postId}`, {
        replyTo,
        content
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      })

      if(replyTo) {
        // clear reply input
        setReplyInput(prevReplyInput => {
          const updatedReplyInput = {...prevReplyInput}
          updatedReplyInput[replyTo] = ""
          return updatedReplyInput
        });
          
        // update replies state
        setReplies(prevReplies => {
          const updatedReplies = {...prevReplies}
          updatedReplies[replyTo] = [res.data.data, ...prevReplies[replyTo]];
          return updatedReplies
        });
      }else{
        // clear comment input
        setCommentInput('');
  
        // update comments state
        setComments(prevComments => [{...res.data.data, name: post.user.name} , ...prevComments]);
      }
    } catch (error) {
      alert("Error sending comment");
      return;
    }
  }

  const handleDeleteComment = async (commentId, isComment, parentCommentId = null) => {
    if(!authStatus.authStatus){
      alert("You must be logged in to delete comment");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      const res = await api.delete(`/comment/delete/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      })

      if(isComment){
        // update comments state
        setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
      }else{
        // update replies state
        setReplies(prevReplies => ({...prevReplies, [parentCommentId]: prevReplies[parentCommentId].filter(reply => reply.commentId !== commentId)}));
      }
      
      alert("Comment deleted");
    } catch (error) {
      alert("Error deleting comment");
    }
  };

  if(!post) return <p>Loading...</p>

  return (
    <div className='w-full '>
        <h1 className='text-xl'>Post Detail</h1>
        <p>title : {post.post.title}</p>
        <p>content : {post.post.content}</p>
        <p>views : {post.post.views}</p>
        <p>votes : {post.post.votes}</p>

        <h1 className='text-xl mt-4'>Author</h1>
        <p>username : {post.user.name}</p>
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

        <div className='mt-5 text-xl font-bold'>Comments</div>

        <div className='flex items-center'>
          <input value={commentInput} onChange={(e) => setCommentInput(e.target.value)} type="text" placeholder='Comment di sini, mang' className='border border-black mt-2 mb-1 rounded-md px-2 py-1 w-full' />
          <button onClick={() => handleSendComment(null)} className='bg-blue-500 text-white px-2 py-1 rounded-md ml-2'>Send</button>
        </div>

        {
          comments.length > 0 ?
            comments.map((comment) => (
              <div key={comment.commentId} className='mt-4 border-t border-black'>
                <p className='mb-2'><Link to={`/users/${comment.userId}`} className='text-blue-800 underline font-bold'>@{comment.name}</Link> : {comment.content}</p>
                {
                  comment.userId == authStatus.user?.userId &&
                  <button onClick={() => handleDeleteComment(comment.commentId, true)} className={`bg-red-500 text-white mb-2 text-xs px-2 py-1 rounded-md`}>
                  Delete Comment
                  </button>
                }
                <button className={`block ${replies[comment.commentId] ? "bg-gray-400" : "bg-gray-200"} text-xs px-2 py-1 rounded-md`} onClick={() => handleToggleReply(comment.commentId)}>
                  {replies[comment.commentId] ? "Hide Replies" : "View Replies"}
                </button>
                {
                  replies[comment.commentId] && 
                  (
                    <>
                    <div className='flex items-center ml-5'>
                      <input value={replyInput[comment.commentId] || ""} onChange={(e) => setReplyInput(pr => ({...pr, [comment.commentId]:e.target.value}))} type="text" placeholder='Reply di sini, mang' className='border border-black mt-2 mb-1 rounded-md px-2 py-1 w-full' />
                      <button onClick={() => handleSendComment(comment.commentId, false)} className='bg-blue-500 text-white px-2 py-1 rounded-md ml-2'>Send</button>
                    </div>
                    {
                      replies[comment.commentId].length > 0 ?
                        replies[comment.commentId].map((reply) => (
                          <div key={reply.commentId} className='ml-5 mt-2 border-t border-black'>
                            <p><Link to={`/users/${comment.userId}`} className='text-blue-800 underline font-bold'>@{comment.name}</Link> : {reply.content}</p>
                            {
                              reply.userId == authStatus.user?.userId &&
                              <button onClick={() => handleDeleteComment(reply.commentId, false, comment.commentId)} className={`bg-red-500 text-white mb-2 text-xs px-2 py-1 rounded-md`}>
                              Delete Reply
                              </button>
                            }
                          </div>
                        ))
                      : <div>There is no reply</div>
                    }
                    </>
                  )
                }
              </div>
            ))
          : <div>There is no comment</div>
        } 

        <div className='min-h-screen'></div>
    </div>
  )
}

export default Post