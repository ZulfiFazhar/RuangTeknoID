import { useState, useContext } from 'react'
import LoginFirst from "@/components/auth/login-first";
import { AuthContext } from "@/components/auth/auth-context";
import { useNavigate } from 'react-router-dom';
import api from "@/api/api";

function Profile() {
  const [file, setFile] = useState(null);
  const { authStatus } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);
  const navigate = useNavigate();
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // redirect to home
    navigate("/");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post(`imagekit/upload`, formData, {
        headers: {"Content-Type": "multipart/form-data"},
      });
      console.log("Upload success:", response.data);
      
      alert("Upload Success")
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className='mt-2'>
        <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
        <div>
          <h1 className='text-xl'>Foto Profil : </h1>
          <input type="file" onChange={handleFileChange} />
          <button className='bg-slate-100 px-2 rounded-md border border-black mt-2 block' onClick={handleUpload}>Upload</button>
        </div>
    </div>
  )
}

export default Profile