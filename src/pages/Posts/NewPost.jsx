import { useContext, useState } from "react";
import { AuthContext } from "@/components/auth/auth-context";
import LoginFirst from "@/components/auth/login-first";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import ContentEditor from "@/components/editor/ContentEditor2";
import HashtagEditor from "@/components/editor/HashtagEditor";
import CoverImagePopover from "@/components/editor/CoverImagePopover";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

function NewPost() {
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState({
    title: "",
    image_cover: "",
    content: "",
    hashtags: [],
  });
  const [coverImage, setCoverImage] = useState("");
  const { authStatus } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);
  const { toast } = useToast();

  const handleImageSelected = (imageUrl) => {
    setCoverImage(imageUrl);
    setNewPost({ ...newPost, image_cover: imageUrl });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleContentChange = (content) => {
    setNewPost({ ...newPost, content });
    console.log("Content Updated:", content);
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
            <ToastAction
              altText="Ke Halaman Artikel"
              onClick={() => handleNavigate(res.data.data.postId)}
            >
              Lihat Artikel
            </ToastAction>
          ),
        });

        setTimeout(() => {
          navigate(`/posts/${res.data.data.postId}`);
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

  const handleNavigate = (newPostId) => {
    navigate(`/posts/${newPostId}`);
    window.location.reload();
  };

  return (
    <div>
      <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
      {authStatus.authStatus ? (
        <div className="flex flex-col justify-center gap-4 w-4/5 mx-auto">
          <CoverImagePopover onImageSelected={handleImageSelected} />
          {coverImage && (
            <div>
              <img
                className="w-full h-80 object-cover rounded-xl mt-2"
                src={coverImage}
                alt="Preview"
              />
            </div>
          )}
          <div>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="rounded-md text-3xl outline-none text-black font-bold placeholder-neutral-800 w-full h-full"
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

          <div className="mt-2 overflow-y-auto">
            <ContentEditor
              value={newPost.content}
              onChange={handleContentChange}
            />
          </div>

          <Button onClick={handleSubmit} className="w-fit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="small" className="text-white" />
                Loading..
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default NewPost;
