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
  const { chatting } = useSelector((store) => store.chatting);

  useEffect(() => {
    queryPostData();
    queryAllUser();
  }, []);

  // if (!user._id) {
  //   return <Navigate to="/register" />;
  // }
  function queryPostData() {
    console.log("=====start query=====");
    const liveFeed = PostRepository.queryMyPosts();

    liveFeed.once("dataUpdated", (posts) => {
      console.log(posts.map((post) => post));
    });
    console.log("liveFeed: ", liveFeed);
    const liveFeed2 = PostRepository.queryUserPosts({
      userId: "top",
    });

    liveFeed2.once("dataUpdated", (posts) => {
      console.log(posts);
    });
  }

  function queryAllUser() {
    const liveUserCollection = UserRepository.queryUsers({
      keyword: "top",
      // filter?: 'all' | 'flagged',
      // sortBy?: 'lastCreated' | 'firstCreated' | 'displayName'
    });

    // filter if flagCount is > 0
    // lastCreated: sort: createdAt desc
    // firstCreated: sort: createdAt asc
    // displayName: sort: alphanumerical asc

    liveUserCollection.on("dataUpdated", (models) => {
      console.log("models: ", models);
      //  models.map((model) => console.log(model.userId));
    });
  }
  return (
    <div className="home-cont">
      <SideNavbar />
      <MyChat />
      {chatting._id ? <ChattingPage /> : <MessageStarter {...user} />}
    </div>
  );
};

const MessageStarter = ({ pic, name }) => {
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
