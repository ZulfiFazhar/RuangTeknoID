import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import api from '../../api/api';

function NewPost() {
    const { authStatus } = useContext(AuthContext);
    const [ newPost,  setNewPost] = useState({
        title: '',
        content: '',
        hashtags: []
    })
    const [ hashtags, setHashtags] = useState([])

    if (!authStatus.authStatus) {
        return (
            <div>
                <h1>Anda harus login terlebih dahulu untuk membuat postingan baru.</h1>
            </div>
        )
    }

    useEffect(() => {
      const getAllHashtag = async () => {
        const hashtags = await api.get("hashtag/get")
        setHashtags(hashtags.data.data)
      }

      getAllHashtag()
    }, [])


    const handleSubmit = async (e) => {
      // check if title and content is not empty
      if(newPost.title.length === 0 || newPost.content.length === 0) {
        alert("Title dan content tidak boleh kosong")
        return
      }

      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");


      const newPostId = await api.post("post/create-with-hashtags",
        newPost,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        })
      if(newPostId.data.status === "success") {
        alert("Postingan berhasil dibuat")
      } else {
        alert("Postingan gagal dibuat")
      }
    }


  return (
    <div>
      <p>title</p>
      <input type="text" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className='outline-2 border-black border w-full bg-gray-100 px-4 py-2 rounded-md mb-4' />
      <p>content</p>
      <textarea value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} className='outline-2 border-black border w-full bg-gray-100 px-4 py-2 rounded-md mb-4' />
      <p>hashtags</p>
      <div className=''>
        {hashtags.map(tag => (
          <div key={tag.hashtagId} className=' '>
          <input type="checkbox" value={tag.hashtagId} onChange={e => {
            if (e.target.checked) {
              setNewPost({...newPost, hashtags: [...newPost.hashtags, tag.hashtagId]})
            } else {
              setNewPost({...newPost, hashtags: newPost.hashtags.filter(tag => tag!== e.target.value)})
            }
          }} className='outline-2 border-black border bg-gray-100 px-4 py-2 rounded-md mt-4' />
          <label>#{tag.name}</label>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className='m-2 px-2 py-1 bg-slate-200 rounded-md'>Submit</button>
    </div>
  )
}

export default NewPost
