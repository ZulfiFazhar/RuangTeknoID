import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  ArrowBigUp,
  ArrowBigDown,
  Bookmark,
  MessageCircleMore,
} from "lucide-react";
import api from "@/api/api";

function User() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showComments, setShowComments] = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get(`user/users/${userId}`);
        setUser(res.data.data);
      } catch (error) {
        console.error(error);
        alert("User not found");
      }
    };
    getUser();
  }, [userId]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const toggleComments = () => setShowComments(!showComments);

  const content =
    "JavaScript adalah salah satu bahasa pemrograman paling populer untuk membuat website interaktif. Dengan JavaScript, kita dapat membuat berbagai interaksi menarik yang membuat pengalaman pengguna lebih baik.";

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">{user.name}</h1>

        {/* Navigation */}
        <div className="flex gap-4 mb-6">
          <Button
            variant="link"
            className={`p-0 ${currentPage === 1 ? "underline font-bold" : ""}`}
            onClick={() => handlePageChange(1)}
          >
            Artikel
          </Button>
          <Button
            variant="link"
            className={`p-0 ${currentPage === 2 ? "underline font-bold" : ""}`}
            onClick={() => handlePageChange(2)}
          >
            Komentar
          </Button>
        </div>

        {/* Article Section */}
        <img
          className="w-full h-40 object-cover rounded-xl mb-4"
          src="https://images.unsplash.com/photo-1724166573009-4634b974ebb2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="JavaScript interaction illustration"
        />
        <h2 className="text-xl font-bold mb-2">
          Cara Membuat Interaksi Sederhana di Website dengan JavaScript
        </h2>
        <p className="text-neutral-600 mb-4">{truncateText(content, 150)}</p>

        <div className="flex items-center gap-4 mb-6">
          <p className="text-sm text-neutral-600">
            {new Date().toLocaleDateString()}
          </p>
          <div className="flex items-center gap-2">
            {/* Voting */}
            <div className="border rounded-lg flex text-neutral-600">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button className="p-2 rounded-l-lg flex gap-1 hover:bg-emerald-100 hover:text-emerald-600">
                      <ArrowBigUp /> <span className="pr-1 font-bold">1</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Upvote</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button className="p-2 rounded-r-lg hover:bg-rose-100 hover:text-rose-600">
                      <ArrowBigDown />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Downvote</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 text-neutral-600 ml-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    className={`flex gap-1 items-center hover:text-amber-600 hover:bg-amber-100 p-2 rounded-lg ${
                      showComments ? "text-amber-600 bg-amber-100" : ""
                    }`}
                    onClick={toggleComments}
                  >
                    <MessageCircleMore size={20} />{" "}
                    <span className="font-bold">4</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Comment</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button className="hover:text-fuchsia-600 hover:bg-fuchsia-100 p-2 rounded-lg">
                    <Bookmark size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Bookmark</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 border-l-2 pl-6">
        <div className="mb-6 flex flex-col items-start">
          <Avatar className="w-24 h-24 mb-2">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-bold">{user.name}</h2>

          {/* Hashtags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
              #JavaScript
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
              #WebDevelopment
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
              #ReactJS
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
              #Programming
            </span>
          </div>

          {/* Social Media */}
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Social Media</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
