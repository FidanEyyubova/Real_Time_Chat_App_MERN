import React, { useContext, useState } from "react";
import assets from "../assets/data";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [logstate, setLogState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [dataSubmitted, setDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const datastateSubmit = (e) => {
    e.preventDefault();

    if (logstate === "Sign Up" && !dataSubmitted) {
      setDataSubmitted(true);
      return;
    }
    login(logstate === "Sign Up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center 
    justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl"
    >
      <div className="flex flex-col gap-5 items-center">
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
        {!dataSubmitted && (
          <>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="p-2 border border-gray-500 rounded-md focus:outline-none 
          "
              placeholder="Email"
              required
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="p-2 border border-gray-500 rounded-md focus:outline-none 
          "
              placeholder="Password"
              required
            />
          </>
        )}

        {logstate === "Sign Up" && dataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none
            "
            placeholder="provide a short bio..."
            required
          ></textarea>
        )}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-cyan-400 to-blue-800 text-white font-medium rounded-md cursor-pointer"
        >
          {logstate === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-white">
          <input type="checkbox" className="accent-blue-400" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="flex flex-col gap-2 text-center">
          {logstate === "Sign Up" ? (
            <p className="text-sm text-white">
              Already have an account?
              <span
                className=" mx-2 font-medium text-blue-500 cursor-pointer"
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
                onClick={() => setLogState("Sign Up")}
                className="mx-2 font-medium text-blue-500 cursor-pointer"
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
