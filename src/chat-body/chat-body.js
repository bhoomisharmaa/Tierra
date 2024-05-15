import { useEffect, useRef, useState } from "react";
import "./chat-body.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MicrophoneSVG from "../svg-icons/microphone";
import SendSvg from "../svg-icons/send-button";
import UserSVG from "../svg-icons/userIcon";
import T_SVG from "../svg-icons/T-logo";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

export default function ChatBody({ chatNumber, handleNewChats }) {
  const [chatArray, setChatArray] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const location = useLocation();

  if (chatArray.length < chatNumber) {
    setChatArray((prevArray) => [...prevArray, []]);
  }

  const suggestionQuestion = [
    {
      message1: "Help me pick",
      message2: "right skincare ingredients",
    },
    {
      message1: "How can I",
      message2: "crochet a keychain",
    },
    {
      message1: "Tell me about",
      message2: "memes trending rn",
    },
    {
      message1: "Recommend me a",
      message2: "nice TV show or movie",
    },
  ];

  const socket = io("http://localhost:8080");
  const handleSendingMessage = (message) => {
    if (message) {
      socket.emit("send-message", { message: message }, chatNumber);

      if (location.pathname === "/") {
        handleNewChats();
      }

      setChatArray((prevChatArray) => {
        return prevChatArray.map((chat, index) => {
          if (index === chatNumber - 1) {
            return [...chat, { message: message }];
          }
          return chat;
        });
      });
      return () => {
        socket.off("send-message", { message }, chatNumber);
      };
    }
  };

  useEffect(() => {
    const handleReceiveReply = (reply, chatNum) => {
      setChatArray((prevChatArray) => {
        return prevChatArray.map((chat, index) => {
          console.log(chat.reply + " " + index + " " + chatNumber);
          if (index === chatNum - 1) {
            return [...chat, reply];
          }
          return chat;
        });
      });
    };

    socket.on("receive-reply", handleReceiveReply);

    return () => {
      socket.off("receive-reply", handleReceiveReply);
    };
  }, []);

  return (
    <div className="chat-body">
      {/* checks if there are any chats */}
      {chatArray[chatNumber - 1] ? (
        // checks if there are any message inside chat
        chatArray[chatNumber - 1].length ? (
          <DisplayAllChats chatArray={chatArray[chatNumber - 1]} />
        ) : (
          // displays no chat screen if there are no messages in chat
          <NoChatScreen
            suggestionQuestion={suggestionQuestion}
            setInputValue={setInputValue}
            handleNewChats={""}
          />
        )
      ) : (
        // displays no chat screen if there are no chats
        <NoChatScreen
          suggestionQuestion={suggestionQuestion}
          setInputValue={setInputValue}
          handleNewChats={handleNewChats}
        />
      )}
      <InputForm
        handleSendingMessage={handleSendingMessage}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </div>
  );
}

function DisplayAllChats({ chatArray }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const chatElements = chatArray.map((chat, index) =>
      chat.message ? (
        index > 0 && chatArray[index - 1].message ? (
          <div className="flex gap-3">
            <UserSVG style={{ fill: "#0000" }} />
            <p key={index} className="">
              {chat.message}
            </p>
          </div>
        ) : (
          <div className="flex gap-3 mt-[3%]">
            <UserSVG
              style={{
                fill: "#f8f8fc",
                padding: "3px",
                backgroundColor: "gray",
                borderRadius: "100%",
              }}
            />
            <div className="flex flex-col">
              <p className="font-semibold transform">YOU</p>
              <p key={index} className="">
                {chat.message}
              </p>
            </div>
          </div>
        )
      ) : (
        <div key={index} className="reply">
          <div className="flex gap-3">
            <T_SVG />
            <div className="flex flex-col">
              <p className="font-semibold transform">TIERRA</p>
              <p key={index} className="">
                {chat.reply}
              </p>
            </div>
          </div>
        </div>
      )
    );
    setChats(chatElements);
  }, [chatArray]);

  return <div className="all-chats">{chats}</div>;
}

function NoChatScreen({ suggestionQuestion, setInputValue, handleNewChats }) {
  let suggestion = [];
  for (let i = 0; i <= 3; i++) {
    suggestion.push(
      <button
        className="suggestion-button"
        onClick={() => {
          setInputValue(
            suggestionQuestion[i].message1 +
              " " +
              suggestionQuestion[i].message2
          );
          if (handleNewChats) {
            handleNewChats();
          }
        }}
      >
        <p className="font-semibold">{suggestionQuestion[i].message1}</p>
        <p className="text-gray-500">{suggestionQuestion[i].message2}</p>
      </button>
    );
  }
  return (
    <div className="no-chat relative">
      <p className="text-2xl font-semibold">
        Yo! What's the mission for today?
      </p>
      <div className="absolute bottom-0 w-full grid grid-rows-2 grid-cols-2 gap-3 my-6 mr-1 ml-2 ">
        {suggestion}
      </div>
    </div>
  );
}

const InputForm = ({ handleSendingMessage, inputValue, setInputValue }) => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [transcriptIndexValue, setTranscriptIndexValue] = useState(0);
  const microphoneRef = useRef(null);

  useEffect(() => {
    if (!!transcript) {
      handleSpeechInput();
    }
  }, [transcript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser does not support Speech Recognition.
      </div>
    );
  }

  const handleSpeechInput = () => {
    if (transcript.includes(" ")) {
      let transcriptValue = transcript.slice(transcriptIndexValue);
      transcriptValue = transcriptValue.trimStart();
      setInputValue(inputValue + " " + transcriptValue);
      setTranscriptIndexValue(
        transcriptIndexValue + transcriptValue.length + 1
      );
    } else {
      setInputValue(inputValue + " " + transcript);
      setTranscriptIndexValue(transcript.length);
    }
  };

  const handleMicrophoneBtnClick = () => {
    const earlierIsListening = isListening;
    setIsListening(!isListening);

    if (!earlierIsListening) {
      microphoneRef.current.classList.add("listening");
      SpeechRecognition.startListening({
        continuous: true,
      });
    } else {
      microphoneRef.current.classList.remove("listening");
      SpeechRecognition.stopListening();
      resetTranscript();
      setTranscriptIndexValue(0);
    }
  };

  return (
    <div className="input-body">
      <form
        className="message-form"
        onSubmit={(event) => {
          handleSendingMessage(inputValue);
          event.preventDefault();
          setInputValue("");
          resetTranscript();
        }}
      >
        <div className="input-container">
          <input
            value={inputValue}
            className="message-input"
            type="text"
            placeholder="Send a New Message"
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
          />
          <button className="send-button" type="submit">
            <SendSvg />
          </button>
        </div>
      </form>
      <button
        className="microphone-button"
        ref={microphoneRef}
        onClick={handleMicrophoneBtnClick}
        style={{
          backgroundImage: isListening
            ? "linear-gradient(#3c21b7, #8b63da, #cb98ed)"
            : "none",
        }}
      >
        <MicrophoneSVG />
      </button>
    </div>
  );
};
