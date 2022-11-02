import "./auth.css";
import avatar from "./amity-no-bg.png";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AmityClient, {
  ConnectionStatus,
  ApiEndpoint,
  AmityUserTokenManager,
  ApiRegion,
} from "@amityco/js-sdk";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ReactLoading from "react-loading";

export const RegisterComp = () => {
  const [searchParams] = useSearchParams();
  const [apiKey] = useState(searchParams.get("apiKey"));
  const [userId] = useState(searchParams.get("userId"));
  const [displayName] = useState(searchParams.get("displayName"));
  const [email] = useState(searchParams.get("email"));
  const [phoneNumber] = useState(searchParams.get("phoneNumber"));
  // console.log("apiKey", searchParams.get("apiKey"));
  // console.log("userId", searchParams.get("userId"));
  // console.log("displayName", searchParams.get("displayName"));
  const { user, loading, error } = useSelector((store) => store.user);
  // const [regData, setRegData] = useState({
  //   pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  //   isAdmin: false,
  //   name: "",
  //   email: "",
  //   password: "",
  // });
  const [amityUser, setAmityUser] = useState({
    displayName: "",
    userId: "",
    email: "",
  });

  const [onConnected, setOnConnected] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (apiKey) {
      console.log("apiKey: ", "pass");
      autoLogin();
    }
  }, []);

  async function autoLogin() {
    const client = new AmityClient({
      apiKey: apiKey,
      apiEndpoint: ApiEndpoint.SG,
    });
    const { accessToken, err } = await AmityUserTokenManager.createAuthToken(
      apiKey,
      ApiRegion.SG,
      {
        userId: userId,
        displayName: displayName,
      }
    );

    if (userId.length > 0) {
      client.registerSession({
        userId: userId,
        displayName: displayName,
      }); // Add your own userId and displayName
      client.on("connectionStatusChanged", ({ newValue }) => {
        if (newValue === ConnectionStatus.Connected) {
          console.log("connected to asc " + amityUser.displayName);
          registerUser(userId, displayName, email, phoneNumber);
          setAmityUser({
            userId: userId,
            displayName: displayName || undefined,
            email: email || undefined,
            token: accessToken,
          });
          setOnConnected(true);
          // navigate("/");
        } else {
          console.log(" not connected to asc");
        }
      });
      console.log("client: ", client);
    }
  }
  function login() {
    const client = new AmityClient({
      apiKey: "b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f",
      apiEndpoint: ApiEndpoint.SG,
    });
    // modify your server region here e.g ApiEndpoint.EU
    if (amityUser.userId.length > 0) {
      client.registerSession({
        userId: amityUser.userId,
        displayName: amityUser.displayName,
      }); // Add your own userId and displayName
      client.on("connectionStatusChanged", ({ newValue }) => {
        console.log("newValue: ", newValue);
        if (newValue === ConnectionStatus.Connected) {
          console.log("connected to asc " + amityUser.displayName);
          registerUser(
            amityUser.userId,
            amityUser.displayName,
            amityUser.email
          );
          setOnConnected(true);
        } else {
          console.log(" not connected to asc");
        }
      });
      console.log("client: ", client);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    // setRegData({ ...regData, [name]: value });
    setAmityUser({ ...amityUser, [name]: value });
  };

  const handleSubmit = () => {
    login();
  };
  function registerUser(userId, displayName, email, phoneNumber) {
    axios
      .post("https://power-school-demo.herokuapp.com/v1/users", {
        userId: userId,
        displayName: displayName,
        email: email,
        phoneNumber: phoneNumber,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const authUser = (payload) => ({ type: "AUTH_ID", payload });
  useEffect(() => {
    if (onConnected) {
      navigate("/");
      dispatch(authUser(amityUser));
    }
  }, [onConnected]);

  return (
    <div>
      {apiKey ? (
        <div className="loading-wrap">
          <div className="loading-photo">
            <img id="photo" src={avatar} />
            <ReactLoading
              className="loading-icon"
              type={"bars"}
              color={"#27b48c"}
            />
          </div>
        </div>
      ) : (
        <div className="auth-cont">
          <div>
            <h2 className="auth-heading">Create an account</h2>
            <div>
              <div className="profile-pic">
                {/* <input onChange={handleInputFile} type="file" name="" id="file" /> */}
                {/* <label htmlFor="file" id="uploadBtn"> */}
                {/* <img id="photo" src={user.pic ? user.pic : avatar} /> */}
                <img id="photo" src={avatar} />
                {/* </label> */}
              </div>
              {/* <p className="profile-text">Choose Profile</p> */}
            </div>
            <div className="details-cont">
              <p>Display name</p>
              <input
                onChange={handleChange}
                name="displayName"
                className="inputcom"
              />

              <p>User ID</p>
              <input
                onChange={handleChange}
                name="userId"
                className="inputcom"
              />
              <p>Email</p>
              <input
                onChange={handleChange}
                name="email"
                className="inputcom"
              />
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
      )}
    </div>
  );
};
const ColorButton = styled(Button)(() => ({
  color: "white",
  fontSize: "20px",
  textTransform: "none",
  backgroundColor: "#06be8b",
  "&:hover": {
    backgroundColor: "#039f73",
  },
  borderRadius: "15px",
}));
