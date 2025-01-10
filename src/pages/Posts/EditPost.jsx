import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../../components/auth/auth-context";
import LoginFirst from "../../components/auth/login-first";
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';    


function EditPost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [ post,  setPost] = useState({
    title: '',
    content: '',
    hashtags: []
  })
  const [ hashtags, setHashtags] = useState([])
  const { authStatus } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const getAllHashtag = async () => {
        try {
            const hashtags = await api.get("hashtag/get")
            setHashtags(hashtags.data.data)
        } catch (error) {
            alert("Error getting hashtags data")
        }
    }

    const getPostDetail = async () => {
        try {
          const res = await api.get(`/post/get-with-hashtags/${postId}`)
          // parse hashtags from string to int
          const hashtags = res.data.data.hashtags.map(hashtagId => parseInt(hashtagId))
          setPost({title: res.data.data.post.title, content: res.data.data.post.content, hashtags})
        } catch (error) {
          console.log(error);
        }
    }

    getAllHashtag()
    getPostDetail()
  }, [])

  const handleSubmit = async (e) => {
    // check if title and content is not empty
    if(post.title.length === 0 || post.content.length === 0) {
      alert("Title dan content tidak boleh kosong")
      return
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");


    const res = await api.put(`post/update-post-and-hashtags/${postId}`,
      post,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      })
    if(res.data.status === "success") {
      alert("Postingan berhasil dibuat")
      // Redirect to home page
      navigate('/');
    } else {
      alert("Postingan gagal dibuat")
    }

  }


  return (
    <div>
      <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
        {authStatus.authStatus ? 
          <div>
            <p>title</p>
            <input type="text" value={post.title} onChange={e => setPost({...post, title: e.target.value})} className='outline-2 border-black border w-full bg-gray-100 px-4 py-2 rounded-md mb-4' />
            <p>content</p>
            <textarea value={post.content} onChange={e => setPost({...post, content: e.target.value})} className='outline-2 border-black border w-full bg-gray-100 px-4 py-2 rounded-md mb-4' />
            <p>hashtags</p>
            <div className=''>
              {hashtags.map(tag => (
                <div key={tag.hashtagId} className=' '>
                <input type="checkbox" checked={post.hashtags.includes(tag.hashtagId)} onChange={e => {
                  if (e.target.checked) {
                    setPost(lp => ({...lp, hashtags: [...lp.hashtags, tag.hashtagId]}))
                  } else {
                    setPost(lp => ({...lp, hashtags: lp.hashtags.filter(ht => ht!== tag.hashtagId)}))
                  }
                }} className='outline-2 border-black border bg-gray-100 px-4 py-2 rounded-md mt-4' />
                <label>#{tag.name}</label>
                </div>
              ))}
            </div>
      
            <button onClick={handleSubmit} className='m-2 px-2 py-1 bg-slate-200 rounded-md'>Submit</button>
          </div> 
          : 
          null}
    </div> 
  )
}

export default EditPost;
