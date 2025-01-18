import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import api from "@/api/api";
import UserPost from "@/components/user/UserPost";
import UserComment from "@/components/user/UserComment";

function User() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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

        {/* Conditional Rendering */}
        {currentPage === 1 && <UserPost />}
        {currentPage === 2 && <UserComment />}
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
