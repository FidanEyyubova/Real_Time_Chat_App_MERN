import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  //Get user section
  const getUsers = async () => {
    try {
      const { data } = await axios.get("api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Get messages section
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
        setUnseenMessages((prev) => ({
          ...prev,
          [userId]: 0,
        }));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Send message section
  const sendMessages = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message || "Message sending failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //New message section
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    //Unseenmessages section
    const handleUnseenMessage = ({ senderId }) => {
      if (!selectedUser || selectedUser._id !== senderId) {
        setUnseenMessages((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("unseenMessage", handleUnseenMessage);

    //Cleanup
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("unseenMessage", handleUnseenMessage);
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    sendMessages,
    getUsers,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getMessages,
    setMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
