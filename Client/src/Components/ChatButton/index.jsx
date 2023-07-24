import React, { useState, useEffect, StrictMode } from "react";
import { useDispatch, useSelector } from "react-redux";
import AmityClient, { ConnectionStatus, ApiEndpoint } from "@amityco/js-sdk";
import { HomeComp } from "../Home";
import axios from "axios";

export const FloatingChatBtn = ({
  apiKey,
  authToken,
  userId,
  displayName,
  email,
}) => {
  const { user, loading, error } = useSelector((store) => store.user);
  const authUser = (payload) => ({ type: "AUTH_ID", payload });
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [amityUser, setAmityUser] = useState({
    displayName: "",
    userId: "",
    email: "",
  });
  console.log("userId====", amityUser);
  useEffect(() => {
    if (apiKey && userId && displayName)
      return () => {
        setAmityUser({
          displayName: displayName,
          userId: userId,
          email: email,
        });
        dispatch(
          authUser({
            displayName: displayName,
            userId: userId,
            email: email,
          })
        );
        login();
      };
  }, []);

  const login = () => {
    console.log("LOGIN");
    const client = new AmityClient({
      apiKey: apiKey,
      apiEndpoint: ApiEndpoint.SG,
    });
    // modify your server region here e.g ApiEndpoint.EU
    if (userId.length > 0) {
      client.registerSession({
        userId: userId,
        displayName: displayName,
      }); // Add your own userId and displayName
      client.on("connectionStatusChanged", ({ newValue }) => {
        if (newValue === ConnectionStatus.Connected) {
          console.log("connected to asc " + displayName);
          registerUser(userId, displayName, email);
        } else {
          console.log(" not connected to asc");
        }
      });
      console.log("client: ", client);
    }
  };
  const registerUser = (userId, displayName, email) => {
    axios
      .post("https://power-school-demo.herokuapp.com/v1/users", {
        userId: userId,
        displayName: displayName,
        email: email,
      })
      .then(function (response) {
        console.log("response: ", response);

        setIsReady(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      {isOpen & isReady && (
        <div className="floating-chatframe">
          <HomeComp />
        </div>
      )}
      {isReady && (
        <button
          className="floating-chatbtn"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <img
            className="floating-chat-icon"
            src="https://upload.convolab.ai/convolab/images/convolab-chaticon-2.svg"
          />
        </button>
      )}
    </div>
  );
};
