import { useState, useContext, useEffect } from "react";
import LoginFirst from "@/components/auth/login-first";
import { AuthContext } from "@/components/auth/auth-context";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";

function Profile() {
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const { authStatus } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);
  const navigate = useNavigate();
  const [imgPreview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [imgUrl, setImgUrl] = useState(localStorage.getItem("imgUrl") || "");
  // const [fileId, setFileId] = useState(localStorage.getItem("fileId") || "");

  useEffect(() => {
    const getUser = async () => {
      if (!authStatus.authStatus) {
        setIsDialogOpen(true);
        return;
      }

      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("tes")
        const res = await api.get("user/users/get-details", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        });
        setUser(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, []);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // redirect to home
    navigate("/");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleCancelFile = () => {
    setFile(null);
    setPreview(null);
  }

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    setLoading(l => true);

    // try {
    //   await api.delete(`imagekit/delete/${fileId}`);
    //   console.log("Previous image deleted");
    // } catch (error) {
    //   console.error("Error deleting previous image:", error);
    // }

    // const formData = new FormData();
    // formData.append("image", file);

    // try {
    //   const response = await api.post(`imagekit/upload`, formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   });
    //   const url = response.data.data.url;
    //   const newFileId = response.data.data.fileId;
    //   setImgUrl(url);
    //   setFileId(newFileId);
    //   localStorage.setItem("imgUrl", url);
    //   localStorage.setItem("fileId", newFileId);
    //   console.log("Upload success:", response.data);
    //   console.log("IMG URL:", url);

    //   alert("Upload Success");
    // } catch (error) {
    //   console.error("Upload error:", error);
    // }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      const formData = new FormData();
      formData.append("image", file);
      formData.append("data", JSON.stringify(user));

      const res = await api.post("user/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(l => false);
      alert("Profile updated");
      navigate(`/users/${authStatus.user.userId}`);
    } catch (error) {
      alert("Error updating profile");
    }
  };

  return (
    <div className="mt-2">
      <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
      <div>
        <h1>Foto Profil</h1>
        <input type="file" onChange={handleFileChange} />

        {(user.profile_image_url || imgPreview) && 
        <>
          <img src={imgPreview || user.profile_image_url} alt="img" className="w-40" />
          {imgPreview && 
            <button
              className="bg-red-500 text-white px-2 py-1 rounded-md ml-2"
              onClick={handleCancelFile}
            >Cancel</button>
          }
        </>
        }

        <div className="mt-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={e => setUser(u => ({ ...u, name: e.target.value }))}
            className="block px-2 py-1 bg-slate-100 border border-black rounded-md"
          />
        </div>

        <div className="mt-2">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username || ""}
            onChange={e => setUser(u => ({ ...u, username: e.target.value }))}
            className="block px-2 py-1 bg-slate-100 border border-black rounded-md"
          />
        </div>

        <div className="mt-2">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={user.full_name || ""}
            onChange={e => setUser(u => ({ ...u, full_name: e.target.value }))}
            className="block px-2 py-1 bg-slate-100 border border-black rounded-md"
          />
        </div>

        <div className="mt-2">
          <label htmlFor="bio">Bio</label>
          <input
            type="text"
            id="bio"
            name="bio"
            value={user.bio || ""}
            onChange={e => setUser(u => ({ ...u, bio: e.target.value }))}
            className="block px-2 py-1 bg-slate-100 border border-black rounded-md"
          />
        </div>

        <div className="mt-2">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={user.location || ""}
            onChange={e => setUser(u => ({ ...u, location: e.target.value }))}
            className="block px-2 py-1 bg-slate-100 border border-black rounded-md"
          />
        </div>

        <div className="mt-2">
          <label htmlFor="personal_url">Personal Link</label>
          <input
            type="text"
            id="personal_url"
            name="personal_url"
            value={user.personal_url || ""}
            onChange={e => setUser(u => ({ ...u, personal_url: e.target.value }))}
            className="block px-2 py-1 bg-slate-100 border border-black rounded-md"
          />
        </div>    

        {loading && <p className="text-5xl font-bold my-3">Loading...</p>}

        <button
          className="bg-slate-100 px-2 rounded-md border border-black mt-2 block"
          onClick={handleUpload}
        >
          Update
        </button>  
      </div>
    </div>
  );
}

export default Profile;
