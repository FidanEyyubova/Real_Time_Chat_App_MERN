import { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/data";

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("Aylin Əliyeva");
  const [bio, setBio] = useState("Hi Everyone, I am UI/UX designer!");

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div
        className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600
      flex items-center justify-between max-sm:flex-col-reverse rounded-lg
      "
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-7 p-10 flex-1">
          <h3 className="text-lg">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              alt=""
              className={`w-12 h-12 ${selectedImg && "rounded-full"}`}
            />
            upload profile image
          </label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none
            "
            placeholder="Write profile bio"
            required
          ></textarea>
          <button
            type="submit"
            className="py-3 bg-gradient-to-r from-cyan-400 to-blue-800 text-white font-medium rounded-md cursor-pointer"
          >
            Save
          </button>
        </form>
        <img
          src={assets.logo_icon}
          alt=""
          className="max-w-44 aspect-square mx-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
