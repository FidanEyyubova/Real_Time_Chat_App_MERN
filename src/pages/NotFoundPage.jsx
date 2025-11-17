// NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import 'animate.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center  backdrop-blur-2xl">
      <div className="relative max-w-xl w-full text-center rounded-2xl text-white  p-8 ">
        <div className="text-9xl font-extrabold tracking-tight animate__animated animate__flash animate__infinite animate__slower">404</div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold">Page Not Found</h1>
        <p className="mt-3 text-sm sm:text-base text-white/70">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6 flex justify-center gap-3">

          <button
            onClick={() => navigate("/")}
            className="transition-transform duration-200 hover:scale-105 px-4 py-2 rounded-lg cursor-pointer text-white font-medium shadow "
           style={{
    background: "linear-gradient(90deg, rgba(121, 9, 24, 1) 0%, rgba(88, 14, 138, 1) 100%)"
  }}
          >
            Go home
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
