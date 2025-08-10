import React from "react";
import { useNavigate } from "react-router-dom";
import assets, { userData } from "../assets/data";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-l-xl overflow-y-scroll text-white
    ${selectedUser ? "max-md:hidden" : ""}
    `}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <img
              src={assets.favicon}
              alt="ChitChat-logo"
              className="max-w-6"
            />
            <h1>ChitChat</h1>
          </div>
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu-bar"
              className="max-h-5 cursor-pointer"
            />
            <div
              className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#212942] border border-gray-600 text-gray-100 
               opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto 
               transition-all duration-200 ease-out origin-top-right"
            >
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm transition-transform duration-200 hover:scale-110"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p className="cursor-pointer text-sm transition-transform duration-200 hover:scale-110">
                Logout
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#212942] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img
            src={assets.search_icon}
            alt="ChitChat-logo"
            className="w-3"
          />
          <input
            type="text"
            alt="Search"
            className="bg-transparent border-none outline-none
            text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search for users..."
          />
        </div>
      </div>

      <div className="flex flex-col">
        {userData.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user);
            }}
            key={index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm
          ${selectedUser?.id === user.id && "bg-[#212942]/50"}
          `}
          >
            <img
              src={user?.profilePic}
              alt="User Profile Picture"
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.name}</p>
              {index < 3 ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>
            {index > 2 && (
              <p
                className="
          absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-[#3f8cb0]"
              >
                {index}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
