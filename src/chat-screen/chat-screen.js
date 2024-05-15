import { useState } from "react";
import ChatBody from "../chat-body/chat-body";
import ChatHistory from "../chat-history/chat-history";
import NotFoundPage from "../404page/not-found";
import { Route, Routes, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function ChatScreen() {
  const [allChats, setAllChats] = useState([]); //Stores all chats of the user along their chat number
  const [chats, setChats] = useState([]); //it stores chats in chat panel : ["Chat 1", "Chat 2",....]
  const navigate = useNavigate();
  const socket = io("http://localhost:3000");

  const handleNewChatClick = () => {
    //adds a new chat body to allChats when user click on New Chat button
    setAllChats((prevChats) => [
      ...prevChats,
      <ChatBody
        chatNumber={allChats.length + 1}
        handleNewChats={handleNewChatClick}
      />,
    ]);

    socket.emit("new-chat-addition", `Chat ${chats.length + 1}`);

    let tempArray = chats;
    tempArray.unshift(`Chat ${chats.length + 1}`);
    setChats(tempArray);
    navigate(`/${chats.length}`);

    return () => {
      socket.off("new-chat-addition", `Chat ${chats.length + 1}`);
    };
  };
  return (
    <div className="main-body relative">
      <ChatHistory handleNewChatClick={handleNewChatClick} chats={chats} />

      <Routes>
        <Route
          path="/"
          element={<ChatBody handleNewChats={handleNewChatClick} />}
        ></Route>

        {allChats.map((chat, index) => (
          <Route key={index} path={`/${index + 1}`} element={chat} />
        ))}
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </div>
  );
}
