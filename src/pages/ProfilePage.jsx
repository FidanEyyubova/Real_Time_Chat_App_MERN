import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/data";
import { AuthContext } from "../../context/AuthContext";
import 'animate.css';
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateProfile, deleteUser } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName);
      setBio(authUser.bio);
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };

 const handleDeleteAccount = async () => {
  const toastId = toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <span>Are you sure you want to delete your account? This action cannot be undone!</span>
        <div className="flex gap-2 justify-end mt-2">
          <button
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteUser();
                navigate("/"); // redirect after deletion
              } catch (err) {
                toast.error(err.message || "Something went wrong!");
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ),
    { duration: Infinity } // keep it open until user clicks
  );
};

  return (
    <div className="min-h-screen backdrop-blur-2xl bg-cover bg-no-repeat flex items-center justify-center animate__animated animate__fadeIn">
      <div
        className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600
        flex items-center justify-between max-sm:flex-col-reverse rounded-lg"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-7 p-10 flex-1"
        >
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
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt=""
              className={`w-12 h-12 ${selectedImg && "rounded-full"}`}
            />
            Upload profile image
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
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Write profile bio"
            required
          ></textarea>

<div className="flex justify-between gap-10">
          <button
            type="submit"
            className="w-full py-3 text-white font-medium rounded-md cursor-pointer transition-transform duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(90deg, rgba(121, 9, 24, 1) 0%, rgba(88, 14, 138, 1) 100%)"
            }}
          >
            Save
          </button>

          {/* Delete account */}
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="w-full py-2 text-white font-medium rounded-md bg-red-600 transition-transform duration-200 hover:scale-105 cursor-pointer"
          >
            Delete Account
          </button>

</div>
        </form>

        <img
          src={
            selectedImg
              ? URL.createObjectURL(selectedImg)
              : authUser?.profilePic
          }
          alt=""
          className={`max-w-44 aspect-square mx-10 max-sm:mt-10 ${selectedImg && "rounded-full"}`}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
