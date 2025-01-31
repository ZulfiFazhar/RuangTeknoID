/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/components/auth/auth-context";
import LoginFirst from "@/components/auth/login-first";
// import api from "@/api/api";
import { Link, useNavigate } from "react-router-dom";
// import CardPost from "@/components/post/CardPost";
import Feed from "@/pages/Posts/Feed";

// function Bookmark() {
//   const [posts, setPosts] = useState([]);
//   const { authStatus } = useContext(AuthContext);
//   const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);

//   useEffect(() => {
//     const getBookmarkedPosts = async () => {
//       if (!authStatus.authStatus) {
//         setIsDialogOpen(true);
//         return;
//       }
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         const refreshToken = localStorage.getItem("refreshToken");
//         const res = await api.get("post/get-bookmarked", {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "x-refresh-token": refreshToken,
//           },
//         });
//         setPosts(res.data.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     getBookmarkedPosts();
//   }, []);

//   const handleCloseDialog = () => {
//     setIsDialogOpen(false);
//   };

//   const bookmarkPost = async (postId) => {
//     // Check auth status
//     if (!authStatus.authStatus) {
//       alert("You need to be login to bookmark a post");
//       return;
//     }

//     const accessToken = localStorage.getItem("accessToken");
//     const refreshToken = localStorage.getItem("refreshToken");

//     try {
//       await api.post(
//         `post/toggle-bookmark/${postId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "x-refresh-token": refreshToken,
//           },
//         }
//       );

//       // update post state
//       setPosts((prevPosts) => {
//         return prevPosts.map((post) => {
//           if (post.postId === postId) {
//             return {
//               ...post,
//               isBookmarked: !post.isBookmarked,
//             };
//           }
//           return post;
//         });
//       });
//     } catch (error) {
//       alert("Error bookmarking post");
//     }
//   };

//   return (
//     <div>
//       <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
//       {authStatus.authStatus ? (
//         <div className="w-4/5 mt-2 m-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {posts.map((post) => (
//             <CardPost key={post.postId} post={post} bookmarkPost={bookmarkPost} />
//           ))}
//           {/* {posts.map((post) => (
//             <div
//               key={post.postId}
//               className="w-full bg-gray-300 mb-2 p-2 rounded-md"
//             >
//               <h1 className="text-xl font-bold">{post.title}</h1>
//               <p>{post.content}</p>
//               <Link to={`/posts/${post.postId}`} className="text-blue-600">
//                 See post details...
//               </Link>
//               <button
//                 className={`block ${
//                   post.isBookmarked ? "bg-gray-400" : "bg-gray-200"
//                 } px-2 py-1 rounded-md`}
//                 onClick={() => bookmarkPost(post.postId)}
//               >
//                 bookmark
//               </button>
//             </div>
//           ))} */}
//         </div>
//       ) : null}
//     </div>
//   );
// }

function Bookmark() {
  const { authStatus } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);
  const navigate = useNavigate();

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // redirect to home
    navigate("/");
  };

  return (
    <div >
      <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
      <div className="w-4/5 mt-2 m-auto">
        <Feed type='bookmark' />
      </div>
    </div>
  )
}

export default Bookmark;
