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
import Button from "@material-ui/core/Button";
import MicIcon from "@material-ui/icons/Mic";
import SendIcon from "@material-ui/icons/Send";
import Grid from "@material-ui/core/Grid";

const style = {
  inputField: {
    width: "100%",
    padding: "12px 20px",
    margin: "0px",
    display: "inline-block",
    border: "1px solid #ccc",
    borderRadius: "2px",
    boxSizing: "border-box",
    fontFamily: "Monospace",
  },
  icons: {
    textAlign: "center",
    color: "#5e5c5c",
    marginTop: "5px",
    cursor: "pointer",
  },
};
function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();

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
            const res = await GetChatbotResponse(input, "Yes");
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
    function loadWelcomeMessage() {
      setMessages([
        <BotMessage
          key="0"
          fetchMessage={async () => await GetChatbotResponse("hi")}
        />,
      ]);
      speak({
        text: "You can share your negative thoughts here, I'll try my best to lift up your mood!",
      });
    }
    loadWelcomeMessage();
  }, []);

  return (
    <div className="chatbot" style={{ margin: "auto", width: "50%" }}>
      <Header />
      <Messages messages={messages} />
      {/* Input starts */}
      <Grid container>
        <Grid item sm={10}>
          <form onSubmit={submitText}>
            <input
              onChange={(e) => setText(e.target.value)}
              value={text || transcript}
              style={style.inputField}
              placeholder="Share your thoughts here..."
            />
          </form>
        </Grid>
        <Grid item sm={1}>
          <MicIcon
            onClick={SpeechRecognition.startListening}
            style={style.icons}
          />
        </Grid>
        <Grid item sm={1}>
          <SendIcon onClick={submitText} style={style.icons} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
