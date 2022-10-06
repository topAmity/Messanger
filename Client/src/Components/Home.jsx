import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { ChattingPage } from "./ChattingPage";
import { MyChat } from "./MyChat";
import SideNavbar from "./SideNavbar";
import { PostRepository, UserRepository } from "@amityco/js-sdk";
import React, { useEffect, useState } from "react";

export const HomeComp = () => {
  const { user, loading, error } = useSelector((store) => store.user);
  const amityUser = useSelector((store) => store.user);
  const { chatting } = useSelector((store) => store.chatting);
  console.log("chatting: ", chatting);

  // if (!user._id) {
  //   return <Navigate to="/register" />;
  // }

  return (
    <div className="home-cont">
      <SideNavbar />
      <MyChat />
      {console.log("====user====", amityUser)}
      {chatting._id ? (
        <ChattingPage />
      ) : (
        <MessageStarter pic={user.pic} name={amityUser.userId.displayName} />
      )}
    </div>
  );
};

const MessageStarter = ({ pic, name }) => {
  console.log("pic: ", pic);
  console.log("name: ", name);
  return (
    <div className="chattingpage start-msg">
      <div>
        <Avatar src={pic} sx={{ width: 70, height: 70 }} />
        <h3>Welcome, {name}</h3>
        <p>Please select a chat to start messaging.</p>
      </div>
    </div>
  );
};
