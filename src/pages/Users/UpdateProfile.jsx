/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useContext, useEffect } from "react";
import LoginFirst from "@/components/auth/login-first";
import { AuthContext } from "@/components/auth/auth-context";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

function Profile() {
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const { authStatus } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);
  const navigate = useNavigate();
  const [imgPreview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      if (!authStatus.authStatus) {
        setIsDialogOpen(true);
        return;
      }
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
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
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const formData = new FormData();
      formData.append("image", file);
      formData.append("data", JSON.stringify(user));
      await api.post("user/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      alert("Profile updated");
      navigate(`/users/${authStatus.user.userId}`);
    } catch (error) {
      alert("Error updating profile");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
      <Card className="w-full max-w-lg p-6 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Profile Picture</Label>
          <Input type="file" onChange={handleFileChange} className="mt-2" />
          {(user.profile_image_url || imgPreview) && (
            <div className="mt-4 flex items-center gap-4">
              <img
                src={imgPreview || user.profile_image_url}
                alt="Profile"
                className="w-24 h-24 rounded-full border"
              />
              {imgPreview && (
                <Button variant="destructive" onClick={handleCancelFile}>
                  Cancel
                </Button>
              )}
            </div>
          )}
          {[
            { id: "name", label: "Name" },
            { id: "username", label: "Username" },
            { id: "full_name", label: "Full Name" },
            { id: "bio", label: "Bio" },
            { id: "location", label: "Location" },
            { id: "personal_url", label: "Personal Link" },
          ].map(({ id, label }) => (
            <div key={id} className="mt-4">
              <Label htmlFor={id}>{label}</Label>
              <Input
                type="text"
                id={id}
                name={id}
                value={user[id] || ""}
                onChange={(e) =>
                  setUser((u) => ({ ...u, [id]: e.target.value }))
                }
              />
            </div>
          ))}
          {loading ? (
            <Skeleton className="w-full h-10 mt-4" />
          ) : (
            <Button className="w-full mt-4" onClick={handleUpload}>
              Update
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
