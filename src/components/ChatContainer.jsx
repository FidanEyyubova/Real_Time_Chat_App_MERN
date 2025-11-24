import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import assets from "../assets/data";
import { messageTime } from "../lib/utils";


// Socket connection
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


  // Initialize socket
  useEffect(() => {
    if (authUser) {
      socket = io("http://localhost:5000", { query: { userId: authUser._id } });
    }
  }, [authUser]);

  // Receive real-time messages
  useEffect(() => {
    if (!socket) return;
    socket.on("receiveMessage", (message) => {
      if (selectedUser && message.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedUser, setMessages]);

  // Get messages when selecting user
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  // Scroll to end
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageData = {
      text: input.trim(),
      senderId: authUser._id,
      receiverID: selectedUser._id,
      createdAt: new Date(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, messageData]);

    // Send to backend via Socket.IO
    socket.emit("sendMessage", messageData);

    // Save to DB
    await sendMessages({ text: input.trim() });

    setInput("");
  };

  // Send image
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
      {/* Header */}
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

      {/* Chat messages */}
     <div className="flex flex-col gap-2 h-[calc(100%-120px)] overflow-y-scroll p-5 pb-6">
  {authUser && messages.map((message, idx) => {
    const isSender = message.senderId === authUser._id;

    return (
      <div
        key={idx}
        style={{
          display: "flex",
          justifyContent: isSender ? "flex-end" : "flex-start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: isSender ? "flex-end" : "flex-start" }}>
          {/* Message bubble */}
          <div
            style={{
              position: "relative",
              padding: "8px",
              borderRadius: "12px",
              backgroundColor: isSender ? "#6d0a41" : "#332142",
              color: "white",
              marginLeft: isSender ? "8px" : "0px",
              marginRight: isSender ? "0px" : "8px",
              maxWidth: "230px",
              wordBreak: "break-word",
            }}
          >
            {message.text || (
              <img
                src={message.image}
                alt=""
                style={{
                  borderRadius: "12px",
                  border: "1px solid #333",
                }}
              />
            )}

            {/* Quyruq */}
            <span
              style={{
                content: '""',
                position: "absolute",
                width: 0,
                height: 0,
                borderStyle: "solid",
                borderWidth: isSender ? "6px 0 6px 6px" : "6px 6px 6px 0",
                borderColor: isSender ? `transparent transparent transparent #6d0a41` : `transparent #332142 transparent transparent`,
                top: "8px",
                right: isSender ? "-6px" : "auto",
                left: isSender ? "auto" : "-6px",
              }}
            ></span>
          </div>

          {/* Time under the bubble */}
          <p style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>
            {messageTime(message.createdAt)}
          </p>
        </div>
      </div>
    );
  })}

  <div ref={scrollEnd}></div>
</div>


      {/* Input area */}
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
