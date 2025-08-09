import React, { useEffect, useRef } from "react";
import { messageData } from "../../public/data/data.js";
import { messageTime } from "../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return selectedUser ? (
    <div className="h-fulloverflow-scroll relative backdrop-blur-lg">
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={"/src/assets/images/women1.jpg"}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          Aylin Əliyeva
          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={"/src/assets/images/arrow_icon.png"}
          alt={""}
          className="md:hidden max-w-7"
        />
        <img
          src={"/src/assets/images/help_icon.png"}
          alt=""
          className="max-md:hidden max-w-5"
        />
      </div>
      {/* !Chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messageData.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              message.senderID !== "1" && "flex-row-reverse"
            }`}
          >
            {message.image ? (
              <img
                src={message.image}
                alt=""
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  message.senderID === "1"
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  message.senderID === "1"
                    ? "/src/assets/images/avatar_icon.png"
                    : "/src/assets/images/women1.jpg"
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">{messageTime(message.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img
              src={"src/assets/svg/gallery_icon.svg"}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          src={"/src/assets/svg/send_button.svg"}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={"/src/assets/svg/logo_icon.svg"} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere!</p>
    </div>
  );
};

export default ChatContainer;
