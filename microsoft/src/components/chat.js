import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/user.context";
import 'react-chatbox-component/dist/style.css';
import { ChatBox } from 'react-chatbox-component';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup"

export default function Chat(props) {
    const messages = [
        {
          "text": "Click on a contact to chat with them!",
          "id": "1",
          "sender": {
            "name": "Ironman",
            "uid": "user1",
            "avatar": "https://data.cometchat.com/assets/images/avatars/ironman.png",
          },
        },
      ];
      
    const user = useContext(UserContext);
    console.log(user)
    const loggedInUser = {
      "uid": user.username
    };
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messageList, setMessageList] = useState(messages);
    //console.log(currentRecipient)

    const sendMessage = async (msg) => {
      const newMsg = {
        "sender": user.username,
        "text": msg,
        "chatId": currentChat
      };
      try {
        const res = await axios.post("/api/message", newMsg)
        console.log(res)
        setMessageList([...messageList, {
          "text": res.data.text,
          "id": res.data._id,
          "sender": {
            "name": res.data.sender,
            "uid": res.data.sender,
            "avatar": "https://rainbowfilter.io/images/filters/ukraine/banner.png?v=2"
          }
        }])
      } catch (err) {
        console.log(err)
      }
    }

    useEffect(() => {
      const getChats = async () => {
        try {
          const res = await axios.get("/api/chat/" + user.username)
          setChats(res.data)
          console.log(res);
        } catch (err) {
          console.log(err);
        }
        //const res = await axios.get("/conversations/" + user.username)
      }
      getChats()
    }, [user.username])

    useEffect(() => {
      const getMessages = async () => {
        try {
          const res = await axios.get("/api/message/" + currentChat)
          setMessageList(res.data.map((message) => {
            return (
              { 
                "text": message.text,
                "id": message._id,
                "sender": {
                  "name": message.sender,
                  "uid": message.sender,
                  "avatar": "https://rainbowfilter.io/images/filters/ukraine/banner.png?v=2"
                }
              }
            )
          }))
          console.log(res);
        } catch (err) {
          console.log(err);
        }
        //const res = await axios.get("/conversations/" + user.username)
      }
      getMessages()
    }, [currentChat])

    return (
        <div>
          <Container>
            <Row>
              <Col>
                <ListGroup>
                  {chats.map((chat) => {
                    return (
                      chat.members[0] !== user.username 
                      ? <ListGroup.Item action onClick={() => { setCurrentChat(chat._id) }}>{chat.members[0]}</ListGroup.Item>
                      : <ListGroup.Item action onClick={() => { setCurrentChat(chat._id) }}>{chat.members[1]}</ListGroup.Item>
                    )
                  })}
                </ListGroup>
              </Col>
              <Col>
                <ChatBox 
                  messages={messageList} 
                  user={loggedInUser}
                  onSubmit={(input) => sendMessage(input)}
                  /*onChange={() => {
                    console.log("test")
                  }}*/    
                />
              </Col>
            </Row>
          </Container>
        </div>
    )
}