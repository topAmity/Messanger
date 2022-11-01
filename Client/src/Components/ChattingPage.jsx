import { Avatar, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styled from "@emotion/styled";
import SendIcon from "@mui/icons-material/Send";
import InputEmoji from "react-input-emoji";
import React, { createRef, useRef, useEffect, useState } from "react";
import { ChatlogicStyling, isSameSender } from "./ChatstyleLogic";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentMessages, sendMessageApi } from "./Redux/Chatting/action";
import { sendMessage } from "./Redux/Chatting/action";
import { addUnseenmsg } from "./Redux/Notification/action";
import { MessageRepository } from "@amityco/js-sdk";
import { MdOutlineArrowBackIos } from "react-icons/md";
const SERVER_POINT = "https://messenger-clo.herokuapp.com";
var socket, currentChattingWith;

export const ChattingPage = ({ onClickStartChat }) => {
  const { user, token } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.chatting);
  const reduxUserStore = useSelector((store) => store.user);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    var objDiv = document.getElementById("chat-scroll");

    setTimeout(() => {
      objDiv.scrollTo({
        top: objDiv.scrollHeight,
        left: 0,
      });
    }, 150);
  };

  const [chatMessage, setChatMessage] = useState([]);
  var { unseenmsg } = useSelector((store) => store.notification);
  const {
    chatting: {
      isGroupChat,
      chatName,
      user: { pic, name, userId },
      _id,
    },
  } = useSelector((store) => store.chatting);
  const userStore = useSelector((store) => store.user);
  console.log("userStore: ", userStore);
  const scrolldiv = createRef();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  function queryChatMessage() {
    const liveCollection = MessageRepository.queryMessages({ channelId: _id });
    let messages = liveCollection.models;

    liveCollection.on("dataUpdated", (data) => {
      messages = data;

      let mappedMessages = messages.map((item) => {
        return {
          _id: item.userId,
          sender: {
            _id: userId,
            name: "sdsd",
            email: "dfsdsf@mdvmkodsv.com",
            pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
          },
          content: item.data.text,
          chat: {
            _id: item.messageId,
            chatName: "sender",
            isGroupChat: false,
            users: [userId, reduxUserStore.userId.userId],
            createdAt: item.createdAt,
            updatedAt: item.editedAt,
            latestMessage: "633e8d007dbc394e1dd2a711",
          },
          readBy: [],
          createdAt: item.createdAt,
          updatedAt: item.createdAt,
        };
      });

      setChatMessage(mappedMessages);
      scrollToBottom();
    });
  }
  useEffect(() => {
    if (chatMessage.length > 0) {
      setChatMessage([]);
    }

    queryChatMessage();
  }, [_id]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  console.log("width: ", width);
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    console.log("width: ", width);
    setWidth(width);
    setHeight(height);
    // return {
    //   width,
    //   height
    // };
  }
  useEffect(() => {
    // dispatch(searchResult(recentChat));
    getWindowDimensions();
  }, []);
  function goBack() {
    const SELECT_CHAT = "SELECT_CHAT";
    const selectChat = (payload) => ({ type: SELECT_CHAT, payload });
    onClickStartChat && onClickStartChat(true);
    dispatch(
      selectChat({
        _id: "",
      })
    );
  }
  return (
    <ChatWrap width={width}>
      {/* <div className="chattingpage"> */}
      <div className="top-header">
        <div className="user-header">
          <MdOutlineArrowBackIos
            style={{ marginRight: "10px", cursor: "pointer" }}
            onClick={() => goBack()}
            on
            color="black"
          />
          <Avatar src={isGroupChat ? "" : pic} />
          <p className="user-name">{isGroupChat ? chatName : name}</p>
        </div>
        <div>
          <div className="user-fet">
            <SearchIcon />
            {/* <CallIcon />
            <VideoCallIcon /> */}
            <MoreHorizIcon />
          </div>
        </div>
      </div>
      <div ref={messagesEndRef} id="chat-scroll" className="live-chat">
        {console.log("chatMessage: ", chatMessage)}
        {chatMessage.map((el, index) => (
          <div
            key={index}
            className={
              el._id !== userStore["userId"]["userId"]
                ? "rihgtuser-chat"
                : "leftuser-chat"
            }
          >
            <div
              className={
                el._id !== userStore["userId"]["userId"]
                  ? "right-avt"
                  : "left-avt"
              }
            >
              <p className="time chat-time">
                {new Date(el.createdAt).getHours() +
                  ":" +
                  (new Date(el.createdAt).getMinutes() < 10 ? "0" : "") +
                  new Date(el.createdAt).getMinutes()}
              </p>
              <div
                className={ChatlogicStyling(
                  el._id,
                  userStore["userId"]["userId"]
                )}
              >
                <p>{el.content}</p>
              </div>

              {isSameSender(messages, index) ? (
                <Avatar
                  src={el.sender._id != el._id ? el.sender.pic : el.pic}
                />
              ) : (
                <div className="blank-div"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="sender-cont">
        <InputContWithEmog
          id={_id}
          token={token}
          socket={socket}
          onSendChat={scrollToBottom}
        />
      </div>
      {/* </div> */}
    </ChatWrap>
  );
};
const ColorButton = styled(Button)(() => ({
  color: "white",
  fontSize: "16px",
  textTransform: "none",
  padding: "12px",
  marginRight: "5px",

  backgroundColor: "#27b48c",
  // paddingLeft: "10px",
  "&:hover": {
    backgroundColor: "#0f8e6a",
  },
}));
function InputContWithEmog({ id, token, socket, onSendChat }) {
  const [text, setText] = useState("");

  // const dispatch = useDispatch();

  function sendChatMessage() {
    onSendChat && onSendChat();
    const liveObject = MessageRepository.createTextMessage({
      channelId: id,
      text: text,
    });

    liveObject.on("dataUpdate", (message) => {
      console.log("message is created", message);
    });
  }

  function handleOnEnter() {
    sendChatMessage();
  }
  function handleChatClick() {
    // dispatch(
    //   sendMessageApi(
    //     {
    //       content: text,
    //       chatId: id,
    //     },
    //     token,
    //     socket
    //   )
    // );
    sendChatMessage();
    setText("");
  }

  return (
    <>
      <div className="search-cont send-message">
        <InputEmoji
          value={text}
          onChange={setText}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder="Type a message"
        />

        {/* <ColorButton
          style={{ position: "absolute" }}
          onClick={handleChatClick}
          variant="contained"
          endIcon={<SendIcon />}
        ></ColorButton> */}
      </div>

      <ColorButton
        onClick={handleChatClick}
        // variant="contained"
        // endIcon={<SendIcon />}
      >
        <SendIcon />
      </ColorButton>
    </>
  );
}
const ChatWrap = styled.div`
  background-color: white;
  box-shadow: 0 2px 4px rgb(15 34 58 / 12%);
  height: 100vh;
  /* Adapt the colors based on primary prop */
  @media only screen and (max-width: 600px) {
    width: ${(props) => `${props.width}px`};
  */
  }
`;
