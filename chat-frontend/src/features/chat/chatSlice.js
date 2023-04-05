import { createSlice } from "@reduxjs/toolkit";
import { chatAsync, paginateMessagesAsync } from "./chatThunk";

const initialState = {
  loading: false,
  chats: [],
  currentChat: {},
  error: null,
  newMessage: { chatId: null, seen: null },
  scrollBottom: 0,
  senderTyping: {
    typing: false,
  },
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat: (state, { payload }) => {
      state.currentChat = payload;
      state.scrollBottom = state.scrollBottom + 1;

      // state.newMessage = { chatId: null, seen: null }
    },
    setFriendsOnline: (state, { payload }) => {
      state.chats = state.chats.map((chat) => {
        return {
          ...chat,
          Users: chat.Users.map((user) => {
            if (payload.includes(user.id)) {
              return {
                ...user,
                status: "online",
              };
            }
            return user;
          }),
        };
      });
    },
    setFriendOffline: (state, { payload }) => {
      let currentChatCopy = { ...state.currentChat };

      const chatsCopy = state.chats.map((chat) => {
        const Users = chat.Users.map((user) => {
          if (user.id === parseInt(payload.id)) {
            return {
              ...user,
              status: "offline",
            };
          }
          return user;
        });

        if (chat.id === currentChatCopy.id) {
          currentChatCopy = {
            ...currentChatCopy,
            Users,
          };
        }

        return {
          ...chat,
          Users,
        };
      });

      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
      };
    },
    setFriendOnline: (state, { payload }) => {
      let currentChatCopy = { ...state.currentChat };

      const chatsCopy = state.chats.map((chat) => {
        const Users = chat.Users.map((user) => {
          if (user.id === parseInt(payload.id)) {
            return {
              ...user,
              status: "online",
            };
          }
          return user;
        });

        if (chat.id === currentChatCopy.id) {
          currentChatCopy = {
            ...currentChatCopy,
            Users,
          };
        }

        return {
          ...chat,
          Users,
        };
      });

      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
      };
    },
    setSocket: (state, { payload }) => {
      // console.log("setSocket", JSON.stringify(payload));
    },
    receivedMessage: (state, { payload }) => {
      const { message, userId } = payload;
      console.log("receivedMessage", { userId, message });
      let currentChatCopy = { ...state.currentChat };
      let newMessage = { ...state.newMessage };
      let scrollBottom = state.scrollBottom;

      const chatsCopy = state.chats.map((chat) => {
        if (message.chatId === chat.id) {
          if (message.User.id === userId) {
            scrollBottom++;
          } else {
            newMessage = {
              chatId: chat.id,
              seen: false,
            };
          }

          if (message.chatId === currentChatCopy.id) {
            currentChatCopy = {
              ...currentChatCopy,
              Messages: [...currentChatCopy.Messages, ...[message]],
            };
          }

          return {
            ...chat,
            Messages: [...chat.Messages, ...[message]],
          };
        }

        return chat;
      });

      if (scrollBottom === state.scrollBottom) {
        return {
          ...state,
          chats: chatsCopy,
          currentChat: currentChatCopy,
          newMessage,
          senderTyping: { typing: false },
        };
      }

      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
        newMessage,
        scrollBottom,
        senderTyping: { typing: false },
      };
    },
    senderTyping: (state, { payload }) => {
      state.senderTyping = payload;
    },
    incrementScroll: (state, { payload }) => {
      state.scrollBottom += 1;
      state.newMessage = { chatId: null, seen: true };
    },
  },

  extraReducers: {
    [chatAsync.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [chatAsync.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.chats = payload;
    },
    [chatAsync.rejected]: (state, { payload }) => {
      state.loading = false;
      state.chats = [];
    },

    [paginateMessagesAsync.fulfilled]: (state, { payload }) => {
      const { messages, pagination } = payload.data;
      const chatId = messages[0]?.chatId;

      state.chats = state.chats.map((chat, index) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            Messages: [...chat.Messages, ...messages],
            Pagination: pagination,
          };
        }
        return chat;
      });
      if (Object.keys(state.currentChat).length) {
        state.currentChat = {
          ...state.currentChat,
          Messages: [...messages, ...state.currentChat.Messages],
          Pagination: pagination,
        };
      }
    },
  },
});

export const {
  setCurrentChat,
  setFriendsOnline,
  setFriendOnline,
  setFriendOffline,
  setSocket,
  receivedMessage,
  senderTyping,
  incrementScroll,
} = chatSlice.actions;

export const selectChat = (state) => state.chat.chats;
export const selectCurrentChat = (state) => state.chat.currentChat;

export default chatSlice.reducer;
