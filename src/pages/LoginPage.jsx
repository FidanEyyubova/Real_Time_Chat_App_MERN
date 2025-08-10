import React from "react";
import assets from "../assets/data";

const LoginPage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center 
    justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl"
    >
      <div className="flex gap-2 items-center">
            <img
              src={assets.favicon}
              alt="ChitChat-logo"
              className="w-[min(30vw,250px)]"
            />
            <h1>ChitChat</h1>
          </div>
          <form className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col
          gap-6 rounded-lg shadow-lg">
            <h2></h2>
          </form>
    </div>
  );
};

export default LoginPage;
