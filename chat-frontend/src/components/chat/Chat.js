import React, { useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import useSocket from './hooks/socketConnect'
// import Navbar from './components/Navbar/Navbar'
// import { fetchChats } from '../../store/actions/chat'
// import FriendList from './components/FriendList/FriendList'
import Messenger from "./components/Messenger/Messenger";
import Navbar from "./../navbar/Navbar";
import { chatAsync } from "./../../features/chat/chatThunk";
import FriendList from "./components/FriendList/FriendList";
import "./Chat.scss";

const Chat = () => {
  const dispatch = useDispatch();
  const chat = useSelector((state) => state.chat);
  //   const user = useSelector((state) => state.authReducer.user);

  // useSocket(user, dispatch)

  useLayoutEffect(() => {
    // dispatch(fetchChats()).then(res => console.log(res)).catch(err => console.log(err))
    dispatch(chatAsync())
      .then((res) => console.log(res))
      .catch((err) => console.log({ err }));
  }, [dispatch]);

  return (
    <div id="chat-container">
      <Navbar />

      <div id="chat-wrap">
        <FriendList />
        <Messenger />
      </div>
    </div>
  );
};

export default Chat;
