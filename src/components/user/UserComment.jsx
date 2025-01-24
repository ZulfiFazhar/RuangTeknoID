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
  Divide,
} from "lucide-react";
import api from "@/api/api";

const MOCK_COMMENTS = [
  {
    id: 1,
    recipient: "Asep Hasanudin",
    text: "wow, react js sangat bagus sekali",
    avatar: "https://github.com/shadcn.png",
    time: "1 jam lalu",
  },
  {
    id: 2,
    recipient: "Nike Ardila",
    text: "Keren sekali",
    avatar: "https://github.com/shadcn.png",
    time: "2 jam lalu",
  },
  {
    id: 3,
    recipient: "Indah Permata Sari",
    text: "Menurut saya, react js itu sangat menyenangkan",
    avatar: "https://github.com/shadcn.png",
    time: "58 menit lalu",
  },
  {
    id: 4,
    recipient: "Purwita Sari",
    text: "Wow wow wow, JavaScript sangat bagus sekali",
    avatar: "https://github.com/shadcn.png",
    time: "4 menit lalu",
  },
];

function User() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await api.get(`user/users/${userId}`);
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("User not found");
    }
  };

  const toggleComments = () => setShowComments(!showComments);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!user) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="mx-auto mt-6 space-y-6">
      <div className="space-y-4">
        {MOCK_COMMENTS.map((comment) => (
          <UserComment key={comment.id} user={user} comment={comment} />
        ))}
      </div>
    </div>
  );
}

function UserComment({ user, comment }) {
  if (!comment) return null;

  return (
    <div className="flex gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src={comment.avatar} alt={`@${user.name}`} />
        <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="font-bold">{user.name}</p>
          <span className="text-gray-500">→</span>
          <p className="font-bold">{comment.recipient}</p>
        </div>
        <p className="text-xs text-neutral-600">{comment.time}</p>
        <p className="mt-1">{comment.text}</p>
      </div>
    </div>
  );
}

export default User;
