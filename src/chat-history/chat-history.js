import "./chat-history.css";
import PlusSVG from "../svg-icons/plus-icon";
import { NavLink } from "react-router-dom";

export default function ChatHistory({ handleNewChatClick, chats }) {
  return (
    <div className="chat-history">
      <button
        className="new-chat-btn flex flex-start gap-2"
        onClick={() => {
          handleNewChatClick();
        }}
      >
        <PlusSVG />
        <p>New Chat</p>
      </button>
      <div className="flex flex-col mt-4">
        {chats.map((chat, index) => {
          return (
            <NavLink className="chat-links" to={`/${chats.length - index}`}>
              {chat}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
