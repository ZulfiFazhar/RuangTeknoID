/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import Feed from "@/pages/Posts/Feed";
import Test from "@/pages/Posts/test";
import LoadingPage from "@/components/ui/loading-page";
import UserProfile from "@/pages/Users/UserProfile";

function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    if (currentPage !== page) setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex gap-4 w-4/5 m-auto">
        <Button
          variant="link"
          className={`p-0 ${currentPage === 1 ? "underline font-bold" : ""}`}
          onClick={() => handlePageChange(1)}
        >
          For You
        </Button>
        <Button
          variant="link"
          className={`p-0 ${currentPage === 2 ? "underline font-bold" : ""}`}
          onClick={() => handlePageChange(2)}
        >
          For You
        </Button>
        <Button
          variant="link"
          className={`p-0 ${currentPage === 3 ? "underline font-bold" : ""}`}
          onClick={() => handlePageChange(3)}
        >
          For You
        </Button>
        <Button
          variant="link"
          className={`p-0 ${currentPage === 4 ? "underline font-bold" : ""}`}
          onClick={() => handlePageChange(4)}
        >
          For You
        </Button>
      </div>

      <div className="w-4/5 m-auto mt-4">
        {currentPage === 1 && <Feed />}
        {currentPage === 2 && <Test />}
        {currentPage === 3 && <LoadingPage />}
        {currentPage === 4 && <UserProfile />}
      </div>
    </div>
  );
}

export default Home;
