import React, { useState, useEffect } from "react";

import BotMessage from "./components/BotMessage";
import UserMessage from "./components/UserMessage";
import Messages from "./components/Message";
import Input from "./components/Input";

import API from "./ChatbotAPI";

import "./styles.css";
import Button from "@material-ui/core/Button";
import Header from "./components/Header";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const openDialog = async (e) => {
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
          fetchMessage={async () => await API.GetChatbotResponse(text, "no")}
        />
      );
      setMessages(newMessages);
      setText("");
    }
  };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // const handleAgree = () => {
  //   send(text);
  //   setOpen(false);
  //   setText("");
  // };

  // const handleDisagree = () => {
  //   const newMessages = messages.concat(
  //     <UserMessage key={messages.length + 1} text={text} />,
  //     <BotMessage
  //       key={messages.length + 2}
  //       fetchMessage={async () => await API.GetChatbotResponse(text, "no")}
  //     />
  //   );
  //   setMessages(newMessages);
  //   setOpen(false);
  //   setText("");
  // };

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

  // const send = async (text) => {
  //   const newMessages = messages.concat(
  //     <UserMessage key={messages.length + 1} text={text} />,
  //     <BotMessage
  //       key={messages.length + 2}
  //       fetchMessage={async () => await API.GetChatbotResponse(text, "yes")}
  //     />
  //   );
  //   setMessages(newMessages);
  // };

  return (
    <div className="chatbot" style={{ margin: "auto", width: "50%" }}>
      <Header />
      <Messages messages={messages} />
      {/* Input starts */}
      <div className="input">
        <form className="form" onSubmit={openDialog}>
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
      {/* Dialog starts */}
      {/* <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to reframe this into positive?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDisagree} color="primary">
            No
          </Button>
          <Button onClick={handleAgree} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
}

export default App;
