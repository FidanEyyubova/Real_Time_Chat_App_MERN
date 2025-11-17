import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/data";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import 'aos/dist/aos.css';
import Aos from "aos";

const LoginPage = () => {
  const [logstate, setLogState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [dataSubmitted, setDataSubmitted] = useState(false);

  const [agree, setAgree] = useState(false);

  const { login } = useContext(AuthContext);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const datastateSubmit = (e) => {
    e.preventDefault();

    // First phase validation (Fullname + Email + Password + Terms)
    if (!dataSubmitted) {
      if (logstate === "Sign Up" && fullName.trim().length < 3) {
        return toast.error("Full name must be at least 3 characters.");
      }

      if (!emailRegex.test(email)) {
        return toast.error("Please enter a valid email address.");
      }

      if (password.length < 6) {
        return toast.error("Password must be at least 6 characters.");
      }

      if (!agree) {
        return toast.error("You must agree to the terms.");
      }
    }

    // Signup → step 2 (bio form)
    if (logstate === "Sign Up" && !dataSubmitted) {
      setDataSubmitted(true);
      return;
    }

    // Bio validation
    if (logstate === "Sign Up" && dataSubmitted) {
      if (bio.trim().length < 10) {
        return toast.error("Bio must be at least 10 characters.");
      }
    }

    // ALL GOOD → send data
    login(logstate === "Sign Up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

 useEffect(() => {
  Aos.init({
    duration: 1500,     // animasiyanın müddəti
    once: true,        // scroll edəndə yalnız 1 dəfə işləsin
  });
}, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center 
    justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl"
    >
      <div className="flex flex-col gap-5 items-center"  data-aos="fade-right">
        <img
          src={assets.favicon}
          alt="ChitChat-logo"
          className="w-[min(30vw,120px)]"

        />
        <h1 className="text-4xl text-white">ChitChat</h1>
      </div>

      <form
        onSubmit={datastateSubmit}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col
          gap-6 rounded-lg shadow-lg"
          data-aos="fade-left"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {logstate}

          {dataSubmitted && (
            <img
              onClick={() => setDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {/* FULL NAME */}
        {logstate === "Sign Up" && !dataSubmitted && (
          <input
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full name"
            required
          />
        )}

        {/* EMAIL + PASSWORD */}
        {!dataSubmitted && (
          <>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
              placeholder="Email"
              required
            />

            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
              placeholder="Password"
              required
            />
          </>
        )}

        {/* BIO */}
        {logstate === "Sign Up" && dataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Provide a short bio..."
            required
          ></textarea>
        )}

       <button
  type="submit"
  className="py-3 text-white font-medium rounded-md cursor-pointer w-full transition-transform duration-200 hover:scale-105"
  style={{
    background: "linear-gradient(90deg, rgba(121, 9, 24, 1) 0%, rgba(88, 14, 138, 1) 100%)"
  }}
>
  {logstate === 'Sign Up' ? 'Create Account' : 'Login Now'}
</button>




        {/* TERMS */}
        {!dataSubmitted && (
          <div className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              className="accent-[#b81546] cursor-pointer"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <p>Agree to the terms of use & privacy policy.</p>
          </div>
        )}

        {/* SWITCH LOGIN / SIGNUP */}
        <div className="flex flex-col gap-2 text-center">
          {logstate === "Sign Up" ? (
            <p className="text-sm text-white">
              Already have an account?
              <span
                className=" mx-2 font-medium text-[#faa8c1] cursor-pointer"
                onClick={() => {
                  setLogState("Login");
                  setDataSubmitted(false);
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-white">
              Create an account{" "}
              <span
                onClick={() => {
                  setLogState("Sign Up");
                  setDataSubmitted(false);
                }}
                className="mx-2 font-medium text-[#faa8c1] cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
