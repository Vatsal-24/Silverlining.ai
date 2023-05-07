import React, { useState, useEffect } from "react";
import BotMessage from "./components/BotMessage";
import UserMessage from "./components/UserMessage";
import Messages from "./components/Message";
import "./styles.css";
import Header from "./components/Header";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isButtonClicked, setIsButtonCLicked] = React.useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const GetChatbotResponse = async (message, flag) => {
    if (
      message === "hi" ||
      message === "Hi" ||
      message === "Hey" ||
      message === "hey" ||
      message === "Hello" ||
      message === "hello"
    ) {
      speak({ text: "Welcome to SilverLining.ai !" });
      return "Welcome to SilverLining.ai !";
    } else {
      let ans = "Please try again later";
      await fetch(`http://127.0.0.1:5000/getAnswer/${message}/${flag}`)
        .then((response) => response.json())
        .then((data) => {
          ans = data[1];
          console.log(ans);
        });
      speak({ text: ans });
      return ans;
    }
  };

  const submitText = async (e) => {
    let input = "";
    let output = "";
    transcript === "" ? (input = text) : (input = transcript);

    e.preventDefault();
    if (
      input === "hi" ||
      input === "Hi" ||
      input === "Hey" ||
      input === "hey" ||
      input === "Hello" ||
      input === "hello"
    ) {
      const newMessages = messages.concat(
        <UserMessage key={messages.length + 1} text={input} />,
        <BotMessage
          key={messages.length + 2}
          fetchMessage={() => {
            speak({ text: "Welcome to SilverLining.ai !" });
            return "Welcome to SilverLining.ai !";
          }}
        />
      );
      setMessages(newMessages);
      setText("");
      resetTranscript();
    } else {
      const newMessages = messages.concat(
        <UserMessage key={messages.length + 1} text={input} />,
        <BotMessage
          key={messages.length + 2}
          fetchMessage={async () => {
            const res = await GetChatbotResponse(input, "yes");
            output = res;
            return res;
          }}
        />
      );
      setMessages(newMessages);
    }
    setText("");
    resetTranscript();
  };

  useEffect(() => {
    async function loadWelcomeMessage() {
      setMessages([
        <BotMessage
          key="0"
          fetchMessage={async () => await GetChatbotResponse("hi")}
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
            value={text || transcript}
            placeholder="Enter your message here"
            autoFocus
          />

          <button type={"submit"}>
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
        <button onClick={SpeechRecognition.startListening}>Start</button>
      </div>
    </div>
  );
}

export default App;
