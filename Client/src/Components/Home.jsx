import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { ChattingPage } from "./ChattingPage";
import { MyChat } from "./MyChat";
import SideNavbar from "./SideNavbar";

import {
  UserRepository,
  PostSortingMethod,
  PostRepository,
} from "@amityco/js-sdk";
import React, { useEffect, useState } from "react";
import "./Home.css";
import { SlOptionsVertical } from "react-icons/sl";
import AddChatIcon from "./AddChat.png";
export const HomeComp = () => {
  const { user, loading, error } = useSelector((store) => store.user);
  const amityUser = useSelector((store) => store.user);
  const { chatting } = useSelector((store) => store.chatting);
  console.log("chatting: ", chatting);
  const navigate = useNavigate();
  const [isOpenChat, setIsOpenChat] = useState(false);
  console.log("isOpenChat: ", isOpenChat);
  useEffect(() => {
    if (amityUser?.userId.userId.length == 0) {
      navigate("/register");
    }
  }, [amityUser]);

  function onClickAddChat(value) {
    setIsOpenChat(value);
  }
  return (
    <div className="home-cont">
      <SideNavbar />
      <div className={isOpenChat ? "" : "display-none"}>
        <MyChat onClickStartChat={onClickAddChat} />
      </div>

      <div className={!isOpenChat ? "" : "display-none"}>
        {chatting._id ? (
          <ChattingPage />
        ) : (
          // <MessageStarter
          //   pic={user.pic}
          //   name={amityUser.userId && amityUser.userId.displayName}
          //   onClickAddChat={onClickAddChat}
          // />
          <MyChat onClickStartChat={onClickAddChat} />
        )}
      </div>
    </div>
  );
};

const MessageStarter = ({ pic, name, onClickAddChat }) => {
  function handleOnClick() {
    onClickAddChat && onClickAddChat(true);
  }
  return (
    <div className="chat-page-wrap">
      <img
        onClick={() => handleOnClick()}
        className="chat-icon"
        src={AddChatIcon}
        width={35}
        height={35}
      />
      <div className="chattingpage start-msg">
        <div>
          <Avatar src={pic} sx={{ width: 70, height: 70 }} />
          <h3>Welcome, {name}</h3>
          <p>Please select a chat to start messaging.</p>
        </div>
      </div>
    </div>
  );
};
