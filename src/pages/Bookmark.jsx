/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/components/auth/auth-context";
import LoginFirst from "@/components/auth/login-first";
import { Link, useNavigate } from "react-router-dom";
import Feed from "@/pages/Posts/Feed";
import Discussions from "@/pages/Discussions/FeedDiscussions";
import { Button } from "@/components/ui/button";

function Bookmark() {
  const { authStatus } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // redirect to home
    navigate("/");
  };

  const handlePageChange = (page) => {
    if (currentPage !== page) setCurrentPage(page);
  };

  return (
    <div>
      <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
      <div className="w-4/5 m-auto grid gap-2">
        <h1 className="text-2xl font-bold">Penanda</h1>
        <div className="flex mb-2 gap-2 bg-gray-100 w-fit p-2 rounded-lg">
          <Button
            variant="outline"
            className={`p-4 rounded-lg hover:bg-white ${
              currentPage === 1 ? "" : "border-none bg-transparent shadow-none"
            }`}
            onClick={() => handlePageChange(1)}
          >
            Artikel
          </Button>
          <Button
            variant="outline"
            className={`p-4 rounded-lg hover:bg-white ${
              currentPage === 2 ? "" : "border-none bg-transparent shadow-none"
            }`}
            onClick={() => handlePageChange(2)}
          >
            Diskusi
          </Button>
        </div>
        <div>
          {currentPage === 1 && <Feed type="bookmark" />}
          {currentPage === 2 && <Discussions type="bookmark" />}
        </div>
        {/* <Feed type="bookmark" /> */}
      </div>
    </div>
  );
}

export default Bookmark;
