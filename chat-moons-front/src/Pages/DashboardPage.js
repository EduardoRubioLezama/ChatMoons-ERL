import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardPage = (props) => {
  const [userId, setUserId] = React.useState("");
  const [chatrooms, setChatrooms] = React.useState([]);

  React.useEffect( () => {

    const token = localStorage.getItem("CC_Token");
    
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id);
      }
    //eslint-disable-next-line
  }, []);


  const getChatrooms = () => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        }
      })
      .then( (response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  React.useEffect( () => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);



  let userChatrooms = [];

  chatrooms.map( (chatroom) => (
    ((userId === chatroom.participantA) || (userId === chatroom.participantB)) ? userChatrooms.push(chatroom) : false  
  ));
  

  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
      </div>
      <div className="chatrooms">
        {userChatrooms.map( (chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{userId === chatroom.participantA ? chatroom.name.split("-")[1] : chatroom.name.split("-")[0]}</div>
            {console.log("ID",chatroom.id)}
            <Link to={"/chatroom/" + chatroom._id}>
              <div className="join">Chat</div>
            </Link>
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
