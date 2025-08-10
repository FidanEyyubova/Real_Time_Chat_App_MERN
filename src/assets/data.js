import avatar_icon from "./avatar_icon.png"
import gallery_icon from "./gallery_icon.svg"
import help_icon from "./help_icon.png"
import logo_icon from "./logo_icon.svg"
import arrow_icon from "./arrow_icon.png"
import bgImage from "./bgImage.svg"
import code from "./code.svg"
import search_icon from "./search_icon.png"
import send_button from "./send_button.svg"
import menu_icon from "./menu_icon.png"
import woman1 from "./woman1.jpg"
import woman2 from "./woman2.jpg"
import man1 from "./man1.jpg"
import man2 from "./man2.jpg"
import pic1 from "./pic1.png"
import pic2 from "./pic2.png"
import pic3 from "./pic3.png"
import pic4 from "./pic4.png"
import favicon from "./favicon.svg"


const assets = {
  avatar_icon,
  gallery_icon,
  help_icon,
  logo_icon,
  search_icon,
  send_button,
  menu_icon,
  arrow_icon,
  code,
  bgImage,
  favicon,
  woman1
};

export default assets;

export const imagesData = [pic1, pic2, pic3, pic4];

export const userData = [
    {
        "id" : "1",
        "email" : "test1@chitchat.dev",
        "name" : "Aylin Əliyeva",
        "profilePic" : woman1,
        "bio": "Hi Everyone, I am UI/UX designer!"
    },
        {
        "id" : "2",
        "email" : "test2@chitchat.dev",
        "name" : "Nigar Quliyeva",
        "profilePic" : woman2,
        "bio": "Hi Everyone, I am UI/UX designer!"
    },
    {
        "id" : "3",
        "email" : "test3@chitchat.dev",
        "name" : "Elvin Hüseynov",
        "profilePic" : man1,
        "bio": "Hi Everyone, I am UI/UX designer!"
    },
     {
        "id" : "4",
        "email" : "test4@chitchat.dev",
        "name" : "Rauf Əliyev",
        "profilePic" : man2,
        "bio": "Hi Everyone, I am UI/UX designer!"
    },
]

export const messageData = [
    {
        "id" : "1",
        "senderID" : "1",
        "receiverID" : "1",
        "text" : "The sun sets very fast.",
        "seen" : "true",
        "createdAt" : "2025-04-28T10:23:37.301Z"
    },
      {
        "id" : "2",
        "senderID" : "2",
        "receiverID" : "2",
        "text" : "The sun sets very fast.",
        "seen" : "true",
        "createdAt" : "2025-04-28T10:23:38.301Z"
    },
      {
        "id" : "3",
        "senderID" : "3",
        "receiverID" : "3",
        "text" : "The sun sets very fast.",
        "seen" : "true",
        "createdAt" : "2025-04-28T10:23:39.301Z"
    },
      {
        "id" : "4",
        "senderID" : "4",
        "receiverID" : "4",
        "text" : "The sun sets very fast.",
        "seen" : "true",
        "createdAt" : "2025-04-28T10:23:40.301Z"
    }
]