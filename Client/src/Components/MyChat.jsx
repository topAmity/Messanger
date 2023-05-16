import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useRef, useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Avatar, Badge, Button, Input, Modal } from "@mui/material";
import { useDispatch } from "react-redux";
import { makeSearchApi } from "./Redux/Searching/action";
import { useSelector } from "react-redux";
import { accessChat, makeRecentChatApi } from "./Redux/RecentChat/action";
import { selectChat } from "./Redux/Chatting/action";
import { removeSeenMsg } from "./Redux/Notification/action";
import {
  ChannelRepository,
  ChannelType,
  ChannelFilter,
  ChannelSortingMethod,
  MemberFilter,
} from "@amityco/js-sdk";
import axios from "axios";
import styled from "@emotion/styled";
import { UserRepository, MessageRepository } from "@amityco/js-sdk";

export const MyChat = ({ onClickStartChat }) => {
  const [search, setSearch] = useState(false);
  const [recentChat, setRecentChat] = useState([]);
  const [recentFilterChat, setRecentFilterChat] = useState([]);
  console.log("recentFilterChat: ", recentFilterChat);
  const [searchFilterChat, setSearchFilterChat] = useState([]);
  const [inputValue, setInputValue] = useState("");
  console.log("inputValue: ", inputValue);
  // console.log("searchFilterChat: ", searchFilterChat);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState([]);
  const [selectedGroupName, setSelectedGroupName] = useState([]);
  console.log('selectedGroupName: ', selectedGroupName);
  console.log("selectedChannel: ", selectedChannel);
  console.log("selectedUser: ", selectedUser);
  // console.log("recentFilterChat: ", recentFilterChat);
  // console.log("recentChat: ", recentChat);
  const [channelList, setChannelList] = useState([]);
  console.log('channelList: ', channelList);
  const [role, setRole] = useState("");
  const [permittedRole, setPermittedRole] = useState([]);
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  // console.log("role: ", role);
  const { search_result, loading, error } = useSelector(
    (store) => store.search
  );
  console.log("search_result: ", search_result);
  const { recent_chat, loading: chat_loading } = useSelector(
    (store) => store.recentChat
  );
  const SEARCH_RESULT = "SEARCH_RESULT";
  const searchResult = (payload) => ({ type: SEARCH_RESULT, payload });

  const { user, token } = useSelector((store) => store.user);
  const { userId } = useSelector((store) => store.user);
  // console.log("userId: ", userId);
  const { chatting } = useSelector((store) => store.chatting);
  const { notification, unseenmsg } = useSelector(
    (store) => store.notification
  );
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  // useEffect(() => {
  //   if (token) dispatch(makeRecentChatApi(token));
  // }, [user]);
  const ref = useRef();

  const handleQuery = (e) => {
    let id;
    return function (e) {
      if (!e.target.value) {
        setSearch(false);
        return;
      }
      if (ref.current) clearTimeout(ref.current);
      setSearch(true);
      setKeyword(e.target.value);
    };
  };
  function onClickSearch() {
    console.log("onClickSearch: ");
    // queryAllUser(keyword);

    dispatch(makeSearchApi(keyword));
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onClickSearch();
    }
  };
  useEffect(() => {
    queryRecentChat();
  }, []);
  useEffect(() => {
    if (recentChat.length > 0) {
      createPermissionUser();
    }
  }, [recentChat]);

  const addUser = (userId) => {
    console.log("userId===>: ", userId);
    const isContain = selectedUser.includes(userId);

    if (userId && !isContain) {
      console.log("isContain: ", isContain);
      let userList = selectedUser;

      userList.push(userId);

      setSelectedUser(userList);
    }
  };
  const addChannel = (channelId) => {
    console.log("channelId=>: ", channelId);
    const isContain = selectedChannel.includes(channelId);
    if (channelId) {
      const newList = selectedChannel;
      newList.push(channelId);
      setSelectedChannel(newList);
    }
  };
  async function createPermissionUser() {
    const userIdArr = recentChat.map((item) => item._id);
    const userWithRole = await getUserRole(userIdArr);

    // console.log("userWithRole: ", userWithRole);

    // const permittedUser = userWithRole.filter((item) =>
    //   permittedRole.includes(item.roles[0])
    // );
    // console.log("permittedUser: ", permittedUser);
    setRecentFilterChat(userWithRole);
  }
  function queryRecentChat() {
    let channels;

    const liveCollection = ChannelRepository.queryChannels({
      types: [ChannelType.Community],
      filter: ChannelFilter.Member,
      isDeleted: false,
      sortBy: ChannelSortingMethod.LastCreated,
    });

    liveCollection.on("dataUpdated", (models) => {
      console.log("models chat: ", models);
      channels = models;

      setChannelList(models);
    });
  }
  function filterRecentChat() {
    const account = userId.userId;
    let resultArr = [];
    let senderName = "";
    channelList.forEach((model) => {
      let members;
      const liveCollection = ChannelRepository.queryMembers({
        channelId: model.channelId,

        memberships: [MemberFilter.Member],
      });

      members = liveCollection.models;

      let sender = members && members.filter((item) => item.userId !== account);
      // console.log("sender: ", sender);

      if (sender.length == 1) {
        senderName = sender[0].userId;
      } else if (sender.length > 1) {
        let userIdArr = sender.map((item) => item.userId);
        let chatName = userIdArr.join(",");
        senderName = chatName;
      } else {
        senderName = "Empty Chat";
      }
      resultArr.push({
        _id: senderName,
        name: senderName,
        roles: sender[0]?.roles[0],
      });
      setRecentChat(resultArr);
    });
  }
  useEffect(() => {
    filterRecentChat();
  }, [channelList]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [open, setOpen] = useState(false);
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;

    setWidth(width);
    setHeight(height);
    // return {
    //   width,
    //   height
    // };
  }
  function getUser() {
    const liveObject = UserRepository.getUser(userId.userId);
    liveObject.on("dataUpdated", (user) => {
      console.log("user: ", user);
      console.log("user: ", user?.roles[0]);
      setRole(user?.roles[0]);
      getRolePermission(user?.roles[0]);
      // user is successfully fetched
    });
  }
  function getRolePermission(role) {
    console.log("role: ", role);
    axios
      .post("https://power-school-demo.herokuapp.com/v1/roles", {
        role: role,
      })
      .then(function (response) {
        setPermittedRole(response.data);
        console.log("role========", response.data);
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  async function getUserRole(role) {
    let result = [];
    const filteredArr = role.filter((item) => item !== "Empty Chat");
    // console.log("filteredArr: ", filteredArr);
    var config = {
      method: "get",
      url: "https://api.sg.amity.co/api/v3/users/list",
      headers: {
        Authorization: `Bearer ${userId.token}`,
      },
      params: { userIds: filteredArr },
      paramsSerializer: (params) => {
        return params
          .map((keyValuePair) => new URLSearchParams(keyValuePair))
          .join("&");
      },
    };

    // console.log("config: ", config);
    await axios(config)
      .then(function (response) {
        console.log("response=========>", response.data.users);
        result = response.data.users;
      })
      .catch(function (error) {
        console.log(error);
      });

    return result;
  }
  useEffect(() => {
    // dispatch(searchResult(recentChat));
    // getUserRole();
    getUser();
    getWindowDimensions();
  }, []);
  useEffect(() => {
    searchWithPermission();
  }, [search_result]);
  async function searchWithPermission() {
    const userIdArrSearch = search_result.map((item) => item._id);
    const userWithRole = await getUserRole(userIdArrSearch);

    console.log("userWithRole: ", userWithRole);

    const permittedUser = userWithRole.filter((item) =>
      permittedRole.includes(item.roles[0])
    );
    console.log("userIdArrSearch: ", userIdArrSearch);
    setSearchFilterChat(search_result);
  }

  async function sendChatMessage(channelId, text) {
    console.log("send=======");
    setTimeout(async () => {
      await MessageRepository.createTextMessage({
        channelId: channelId,
        text: text,
      });
    }, 300);
  


    // liveObject.on("dataUpdate", (message) => {
    //   console.log("message is created", message);
    // });
  }
  const addGroupChat = (chatName, channelId) => {

     const channelIdList = selectedChannel
     channelIdList.push(channelId)
     const channelNameList = [...selectedGroupName]
     channelNameList.push(chatName)
     setSelectedChannel(channelIdList)
     setSelectedGroupName(channelNameList)
     console.log('selectedChannel555: ', selectedChannel);
     console.log('selectedGroupName: ', selectedGroupName);
    // addChannel(channelId);
  };
  const broadCastMessage = async () => {
    console.log("broadCastMessage: ", selectedChannel);
    console.log("broadCastMessageValue: ", inputValue);
    selectedChannel.forEach(
      async (channelId) => await sendChatMessage(channelId, inputValue)
    );
    if (inputValue && selectedChannel.length > 0) {
      setTimeout(() => {
        handleOpen();
        setInputValue("");
        setSelectedChannel([]);
        setSelectedGroupName([]);
        setSelectedUser([])
      }, 500);
    }
    // try {
    //   const results = await Promise.all(promises);
    //   console.log(results); // Process the results as needed
    // } catch (error) {
    //   console.error('An error occurred:', error);
    // }
  };
  const clearAll=()=>{
    setInputValue("");
    setSelectedChannel([]);
    setSelectedGroupName([]);
    setSelectedUser([])
  }
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // console.log("search_result: ", search_result);
  return (
    <div>
      <ChatWrap width={width} height={height}>
        {/* <div className="mychat-cont"> */}
        <div>
          <div className="notification">
            <h2>Broadcast page </h2>
            {/* <p>role: {role}</p> */}

            {/* <NotificationsIcon /> */}
            {/* <Badge badgeContent={notification} color="error">
            <Notificationcomp />
          </Badge> */}
            {/* <AddIcon /> */}
          </div>
          <div className="search-cont">
            <SearchIcon onClick={onClickSearch} />
            <input
              onChange={handleQuery()}
              type="text"
              placeholder="Search users"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <div className="recent-chat">
          <h3 className="select-user-text">
          {search
            ? `Search User ${searchFilterChat.length} results`
            : " GroupChat List"}
            </h3>
          <div className="recent-user">
            {/* {search_result.map((el) => (
              <div onClick={() => addUser(el.userId)}>
                <SearchUserComp
                  setChannels={addChannel}
                  key={el._id}
                  {...el}
                  token={token}
                  recent_chat={recent_chat}
                  setSearch={setSearch}
                />
              </div>
            ))} */}
            {search
              ? search_result.map((el) => (
                  <div onClick={() => addUser(el.userId)}>
                    <SearchUserComp
                      setChannels={addChannel}
                      key={el._id}
                      {...el}
                      token={token}
                      recent_chat={recent_chat}
                      setSearch={setSearch}
                    />
                  </div>
                ))
              : channelList.map((el, index) => (
                  <div onClick={()=>addGroupChat(el.displayName,el.channelId)}>
                    <SearchUserComp
                      // onClickStartChat={addChannel}
                      key={el._id}
                      {...el}
                      token={token}
                      recent_chat={recent_chat}
                      setSearch={setSearch}
                    />
                  </div>
                ))}
          </div>
        </div>
        <h4 className="select-user-text">Selected user</h4>
        <div className="userGrid">
          {selectedUser.map((item) => (
            <div className="select-user-bubble">{item}</div>
          ))}
        </div>
        <h4 className="select-user-text">Selected Group Chat</h4>
        <div className="userGrid">
          {selectedGroupName.map((item) => (
            <div className="select-user-bubble">{item}</div>
          ))}
        </div>
        <div>
          <h4 className="select-user-text">Broadcast Message</h4>

          <div className="select-user-text">
            <Input
              value={inputValue}
              onChange={handleChange}
              placeholder="Enter something..."
            />
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => broadCastMessage()}
              variant="contained"
            >
              Broadcast
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => clearAll()}
           
            >
              Clear
            </Button>
          </div>
        </div>

        {/* <Modal
  // aria-labelledby="modal-modal-title"
  // aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
      Text in a modal
    </Typography>
  </Box>
</Modal> */}
        {/* </div> */}
      </ChatWrap>
      <Modal open={open} onClose={handleClose}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            padding: 30,
            background: "#ffffff",
            borderRadius: "20px",
          }}
        >
          <Typography variant="h6" component="h2" align="center">
            Broadcast Success!
          </Typography>

          <Button onClick={handleClose} fullWidth>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default function Notificationcomp() {
  const { unseenmsg } = useSelector((store) => store.notification);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (unseenmsg.length !== 0) dispatch(removeSeenMsg([]));
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      {/* <NotificationsIcon
        color="black"
        aria-describedby={id}
        onClick={handleClick}
      /> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {!unseenmsg.length ? (
          <Typography sx={{ p: 2, width: 170 }}>No new messages.</Typography>
        ) : (
          unseenmsg.map((el, index) => (
            <Typography key={index} sx={{ p: 2, width: 170 }}>
              {el.sender.name + " " + el.content.substring(0, 15) + "..."}
            </Typography>
          ))
        )}
      </Popover>
    </div>
  );
}
const ChatUserComp = ({
  isGroupChat,
  chatName,
  users,
  latestMessage,
  id,
  _id,
  index,
  chattingwith,
}) => {
  const dispatch = useDispatch();
  const handleSelectChat = () => {
    dispatch(
      selectChat({
        isGroupChat,
        index,
        user: users.find((el) => el._id != id),
        _id,
        chatName,
      })
    );
  };
  return (
    <div
      onClick={handleSelectChat}
      // className={chattingwith == _id ? "user selectUser" : "user"}
    >
      <div className="history-cont">
        {isGroupChat ? (
          <div>{<Avatar>G</Avatar>}</div>
        ) : (
          <div>{<Avatar src={users.find((el) => el._id != id)?.pic} />}</div>
        )}
        <div>
          {isGroupChat ? (
            <p className="name">{chatName}</p>
          ) : (
            <p className="name">{users.find((el) => el._id != id)?.name}</p>
          )}
          <p className="chat">
            {latestMessage
              ? latestMessage.content.length > 8
                ? latestMessage.content.substring(0, 30) + " . . ."
                : latestMessage.content
              : ""}
          </p>
        </div>
      </div>
      <div>
        {latestMessage ? (
          <p className="time">
            {new Date(latestMessage?.updatedAt).getHours() +
              ":" +
              new Date(latestMessage?.updatedAt).getMinutes()}
          </p>
        ) : (
          ""
        )}
        {/* <p className="unseen-chat">5</p> */}
      </div>
    </div>
  );
};

export const SearchUserComp = ({
  _id,
  email,
  displayName,
  pic,
  token,
  recent_chat,
  setSearch,
  onClickStartChat,
  avatarFileId,
  userId,
  setChannels,
}) => {
  const dispatch = useDispatch();
  const storeUserData = useSelector((store) => store.user);
  const SELECT_CHAT = "SELECT_CHAT";
  const selectChat = (payload) => ({ type: SELECT_CHAT, payload });
  const [channelId, setChannelId] = useState("");
  function createChannel(channelId, user1, user2) {
    axios
      .post("https://power-school-demo.herokuapp.com/v1/channels", {
        channelId: channelId,
        user1: user1,
        user2: user2,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const handleSubmitForAcceChat = () => {
    // dispatch(accessChat(_id, token, recent_chat));

    const ownUserId = storeUserData.userId.userId;
    // setSearch(false);
if(userId){
  const liveChannel = ChannelRepository.createChannel({
    type: ChannelType.Conversation,
    userIds: [ownUserId, userId],
    displayName: `${ownUserId},${userId}`,
  });
  liveChannel.once("dataUpdated", (data) => {
    console.log("channel created", data);
    dispatch(
      selectChat({
        isGroupChat: false,
        index: 0,
        user: {
          pic: pic,
          name: displayName,
          userId: _id,
        },
        _id: data.channelId,
        chatName: "Mock",
      })
    );
    setChannelId(data.channelId);
    createChannel(data.channelId, ownUserId, userId);
  });
}

  };
  useEffect(() => {
    if (channelId) {
      setChannels && setChannels(channelId);
    }
  }, [channelId]);

  return (
    <div onClick={handleSubmitForAcceChat} className="user">
      <div className="history-cont">
        <div>
          {
            <Avatar
              src={` https://api.amity.co/api/v3/files/${avatarFileId}/download`}
            />
          }
        </div>
        <div>
          <p className="name">{displayName}</p>
          {/* <p className="chat">Email: {email}</p> */}
        </div>
      </div>
    </div>
  );
};
const ChatWrap = styled.div`
  color: #ffffff;
  overflow-x: hidden;
  height: 100%;
  background-color: #ffffff;
  /* Adapt the colors based on primary prop */
  @media only screen and (max-width: 600px) {
    width: ${(props) => `${props.width}px`};
  */
  }
`;
