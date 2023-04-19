import React, { useState, useEffect } from "react";
import BotMessage from "./components/BotMessage";
import UserMessage from "./components/UserMessage";
import Messages from "./components/Message";
import API from "./ChatbotAPI";
import "./styles.css";
import Header from "./components/Header";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isButtonClicked, setIsButtonCLicked] = React.useState(false);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const submitText = async (e) => {
    console.log("hello");
    e.preventDefault();
    if (
      text === "hi" ||
      text === "Hi" ||
      text === "Hey" ||
      text === "hey" ||
      text === "Hello" ||
      text === "hello"
    ) {
      const newMessages = messages.concat(
        <UserMessage key={messages.length + 1} text={text} />,
        <BotMessage
          key={messages.length + 2}
          fetchMessage={() => {
            return "Welcome to SilverLining.ai !";
          }}
        />
      );
      setMessages(newMessages);
      setText("");
    } else {
      const newMessages = messages.concat(
        <UserMessage key={messages.length + 1} text={text} />,
        <BotMessage
          key={messages.length + 2}
          fetchMessage={async () => await API.GetChatbotResponse(text, "yes")}
        />
      );
      setMessages(newMessages);
    }
    setText("");
  };

  useEffect(() => {
    async function loadWelcomeMessage() {
      setMessages([
        <BotMessage
          key="0"
          fetchMessage={async () => await API.GetChatbotResponse("hi")}
        />,
      ]);
    }
    loadWelcomeMessage();
  }, []);

  return (
    <div className="chatbot" style={{ margin: "auto", width: "50%" }}>
      <Header />
      <Messages messages={messages} />
      {/* Input starts */}
      <div className="input">
        <form className="form" onSubmit={submitText}>
          <input
            id="myInput"
            type="text"
            onChange={handleInputChange}
            value={text}
            placeholder="Enter your message here"
            autoFocus
          />
          <button id="myBtn" type={"submit"}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 500 500"
            >
              <g>
                <g>
                  <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75" />
                </g>
              </g>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
