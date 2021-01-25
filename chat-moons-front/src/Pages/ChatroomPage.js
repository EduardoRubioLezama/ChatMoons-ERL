import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";


const ChatroomPage = ({ match, socket }) => {
  
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");
  const [room, setRoom] = React.useState("");


  const getChatroom = (idRoom) => {
    
    axios
      .get("http://localhost:8000/chatroom/"+idRoom, {
        params: {
          id: idRoom
        }, 
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        }
      })
      .then((response) => {
        setRoom(response.data);
      })
      .catch((err) => {
        setTimeout(getChatroom, 3000);
      });
  };

  React.useEffect(() => {
    getChatroom(chatroomId);
    
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    //eslint-disable-next-line
  }, [messages]);

  React.useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">{userId === room.participantA ? String(room.name).split("-")[1] : String(room.name).split("-")[0]}</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div className={
              userId === message.userId ? "divRight" : "divLeft"
              }>
            <div key={i} className={
              userId === message.userId ? "ownMessage" : "otherMessage"
              }
            >
              {message.message}
            </div>
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Say something!"
              ref={messageRef}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatroomPage);
