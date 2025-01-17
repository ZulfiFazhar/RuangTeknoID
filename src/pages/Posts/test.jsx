import React from "react";
import { useNavigate } from "react-router-dom";

const HomeRedirect = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/discussions");
  };

  return (
    <div className="bg-green-300 w-full">
      <div className="w-4/5 grid grid-cols-3 gap-2 bg-rose-200 justify-center m-auto">
        <div className="bg-black">asd</div>
        <div className="bg-black">asd</div>
        <div className="bg-black">asd</div>
        <div className="bg-black">asd</div>
      </div>
    </div>
  );
};

export default HomeRedirect;
