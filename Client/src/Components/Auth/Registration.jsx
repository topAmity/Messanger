import "./auth.css";
import avatar from "./profileimg.png";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Link, Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { authRegister, uploadPic } from "../Redux/Auth/action";
import { useNavigate } from "react-router-dom";
import AmityClient, { ConnectionStatus, ApiEndpoint } from "@amityco/js-sdk";
import axios from "axios";

export const RegisterComp = () => {
  const { user, loading, error } = useSelector((store) => store.user);
  const [regData, setRegData] = useState({
    pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    isAdmin: false,
    name: "",
    email: "",
    password: "",
  });
  const [amityUser, setAmityUser] = useState({
    displayName: "",
    userId: "",
  });

  const [onConnected, setOnConnected] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiKey = "b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f";
  function login() {
    const client = new AmityClient({
      apiKey: apiKey,
      apiEndpoint: ApiEndpoint.SG,
    }); // modify your server region here e.g ApiEndpoint.EU
    client.registerSession({
      userId: amityUser.userId,
      displayName: amityUser.displayName,
    }); // Add your own userId and displayName
    client.on("connectionStatusChanged", ({ newValue }) => {
      console.log("newValue: ", newValue);
      if (newValue === ConnectionStatus.Connected) {
        console.log("connected to asc");
        setOnConnected(true);
      } else {
        console.log(" not connected to asc");
      }
    });
    console.log("client: ", client);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    // setRegData({ ...regData, [name]: value });
    setAmityUser({ ...amityUser, [name]: value });
  };
  const handleInputFile = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(uploadPic(reader.result));
      // setPic(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleSubmit = () => {
    // const url = "";
    login();
    registerUser();
    // if (onConnected) {
    //   return <Navigate to={"/"} />;
    // }
  };
  function registerUser() {
    axios
      .post("/user", {
        userId: "Fred",
        displayName: "Flintstone",
        email: "",
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    if (onConnected) {
      navigate("/");
    }
  }, [onConnected]);

  //   if (user.pic) regData["pic"] = user.pic;
  // dispatch(authRegister(url, regData));
  // };
  // if (user._id) {
  //   return <Navigate to={"/"} />;
  // }
  return (
    <div className="auth-cont">
      <div>
        <h2 className="auth-heading">Create an account</h2>
        <div>
          <div className="profile-pic">
            <input onChange={handleInputFile} type="file" name="" id="file" />
            <label htmlFor="file" id="uploadBtn">
              <img id="photo" src={user.pic ? user.pic : avatar} />
            </label>
          </div>
          <p className="profile-text">Choose Profile</p>
        </div>
        <div className="details-cont">
          <p>Display name</p>
          <input onChange={handleChange} name="name" className="inputcom" />

          <p>User ID</p>
          <input onChange={handleChange} name="userId" className="inputcom" />
          <p>Email</p>
          <input onChange={handleChange} name="email" className="inputcom" />
          {/* <p>Password</p>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            className="inputcom"
          />

          <p>Confirm Password</p>
          <input type="password" className="inputcom" /> */}

          {loading ? (
            <ColorButton disabled>
              <CircularProgress style={{ color: "white" }} />
            </ColorButton>
          ) : (
            <ColorButton onClick={handleSubmit}>Continue</ColorButton>
          )}

          {/* <Link className="auth-link" to={"/login"}>
            Already have an account
          </Link> */}
          <p className="contract">
            {/* By registering you agree to Messenger's{" "}
            <span>Terms of Service</span> and <span>Privacy Policy</span>. */}
          </p>
        </div>
      </div>
    </div>
  );
};
const ColorButton = styled(Button)(() => ({
  color: "white",
  fontSize: "20px",
  textTransform: "none",
  backgroundColor: "#5865f2",
  "&:hover": {
    backgroundColor: "#3a45c3",
  },
}));
