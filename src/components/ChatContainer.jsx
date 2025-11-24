import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { messageTime } from "../lib/utils";
import assets from "../assets/data";

let socket;

const ChatContainer = () => {
  const {
    messages,
    setMessages,
    setSelectedUser,
    selectedUser,
    sendMessages,
    getMessages,
  } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const scrollEnd = useRef();

  useEffect(() => {
    if (authUser) {
      socket = io("http://localhost:5000", { query: { userId: authUser._id } });
    }
  }, [authUser]);

  useEffect(() => {
    if (!socket) return;
    socket.on("receiveMessage", (message) => {
      if (selectedUser && message.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedUser, setMessages]);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageData = {
      text: input.trim(),
      senderId: authUser._id,
      receiverID: selectedUser._id,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, messageData]);
    socket.emit("sendMessage", messageData);
    await sendMessages({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/"))
      return toast.error("Select an image file");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const messageData = {
        image: reader.result,
        senderId: authUser._id,
        receiverID: selectedUser._id,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, messageData]);
      socket.emit("sendMessage", messageData);
      await sendMessages({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} alt="" className="max-w-16" />
        <p className="text-lg font-medium text-white">
          Chat anytime, anywhere!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7"
        />
      </div>

      <div className="flex flex-col gap-2 h-[calc(100%-120px)] overflow-y-scroll p-5 pb-6">
        {authUser &&
          messages.map((message, idx) => {
            const isSender = message.senderId === authUser._id;

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: isSender ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isSender ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    className={`relative p-2 rounded-xl text-white break-words max-w-[230px] 
    ${isSender ? "bg-[#6d0a41] ml-2 mr-0" : "bg-[#332142] ml-0 mr-2"}
  `}
                  >
                    {message.text || (
                      <img
                        src={message.image}
                        alt=""
                        className="rounded-xl border border-[#333]"
                      />
                    )}

                    <span
                      className={`
      absolute w-0 h-0 top-2
      ${
        isSender
          ? "right-[-6px] border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-l-[#6d0a41]"
          : "left-[-6px] border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-[#332142]"
      }
    `}
                    ></span>
                  </div>

                  <p
                    style={{
                      color: "#999",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {messageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}

        <div ref={scrollEnd}></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer transition-transform duration-200 hover:scale-110"
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
