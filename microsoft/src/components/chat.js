import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "../contexts/user.context";
import 'react-chatbox-component/dist/style.css';
import { ChatBox } from 'react-chatbox-component';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup"
import { io } from "socket.io-client"
import Button from "react-bootstrap/Button";

export default function Chat(props) {
    const messages = [
        {
          "text": "Click on a contact to chat with them!",
          "id": "1",
          "sender": {
            "name": "ConnectUKR",
            "uid": "user1",
            "avatar": "https://rainbowfilter.io/images/filters/ukraine/banner.png?v=2",
          },
        },
      ];
      
    const user = useContext(UserContext);
    const loggedInUser = {
      "uid": user.username
    };
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messageList, setMessageList] = useState(messages);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();

    useEffect(() => {
      socket.current = io("ws://localhost:4000");
      console.log("CONNECTED" + socket.id)
      socket.current.emit("addUser", user.username)
      socket.current.on("getMessage", (data) => {
        console.log(data)
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now()
        })
      })
    }, []);

    useEffect(() => {
      console.log(arrivalMessage)
      arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
      setMessageList((prev) => [...prev, {
        "text": arrivalMessage.text,
        "id": "test",
        "sender": {
          "name": arrivalMessage.sender,
          "uid": arrivalMessage.sender,
          "avatar": "https://rainbowfilter.io/images/filters/ukraine/banner.png?v=2"
        }
      }])
    }, [arrivalMessage, currentChat])

    useEffect(() => {
      if (user.username === "") {
        return
      }
      socket.current.emit("addUser", user.username)
      socket.current.on("getUsers", (users) => {
        console.log(users)
      })
    }, [user])

    const sendMessage = async (msg) => {
      if (user.username === "" || currentChat == null) {
        return
      }
      const newMsg = {
        "sender": user.username,
        "text": msg,
        "chatId": currentChat
      };
      console.log(currentChat)
      const receiverId = currentChat.members.find((member) => member !== user.username)
      console.log(receiverId)
      socket.current.emit("sendMessage", {
        senderId: user.username,
        receiverId,
        text: msg
      })

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
      }
      getChats()
    }, [user.username])

    useEffect(() => {
      const getMessages = async () => {
        try {
          const res = await axios.get("/api/message/" + currentChat._id)
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
                      ? <ListGroup.Item action onClick={() => { setCurrentChat(chat) }}>{chat.members[0]}</ListGroup.Item>
                      : <ListGroup.Item action onClick={() => { setCurrentChat(chat) }}>{chat.members[1]}</ListGroup.Item>
                    )
                  })}
                </ListGroup>
              </Col>
              <Col>
                <ChatBox 
                  messages={messageList} 
                  user={loggedInUser}
                  onSubmit={(input) => sendMessage(input)}
                />
              </Col>
            </Row>
          </Container>
        </div>
    )
}