import { useContext, useState } from "react";
import { AuthContext } from "@/components/auth/auth-context";
import LoginFirst from "@/components/auth/login-first";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import ContentEditor from "@/components/editor/ContentEditor";
import HashtagEditor from "@/components/editor/HashtagEditor";
import CoverImagePopover from "@/components/editor/CoverImagePopover";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";

function NewPost() {
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    hashtags: [],
  });
  const navigate = useNavigate();
  const { authStatus } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);
  const { toast } = useToast();

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleContentChange = (content) => {
    setNewPost({ ...newPost, content });
  };

  const handleSubmit = async () => {
    if (newPost.title.trim() === "") {
      alert("Judul tidak boleh kosong");
      return;
    } else if (newPost.content.trim() === "") {
      alert("Konten tidak boleh kosong");
      return;
    }

    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      const res = await api.post("post/create-with-hashtags", newPost, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      });

      if (res.data.status === "success") {
        toast({
          title: "Berhasil",
          description: "Artikel berhasil di Publish",
          action: (
            <ToastAction altText="Ke Halaman Artikel" onClick={handleNavigate}>
              Lihat Artikel
            </ToastAction>
          ),
        });

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Gagal Membuat Postingan",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan saat mengirim data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div>
      <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
      {authStatus.authStatus ? (
        <div className="flex flex-col justify-center gap-4 w-3/4 mx-auto">
          <CoverImagePopover />
          <div>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="rounded-md text-4xl outline-none text-black font-bold placeholder-neutral-800 w-full h-full"
              placeholder="Tulis Judul Artikel Disini.."
              required
            />
          </div>

          <div className="mt-2">
            <HashtagEditor
              selectedHashtags={newPost.hashtags.map(String)}
              onHashtagChange={(hashtags) =>
                setNewPost({
                  ...newPost,
                  hashtags: hashtags.map((tag) => Number(tag)),
                })
              }
            />
          </div>

          <div className="mt-2">
            <ContentEditor
              value={newPost.content}
              onChange={handleContentChange}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-fit mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Publish"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default NewPost;
