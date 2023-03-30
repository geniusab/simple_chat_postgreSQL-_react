import { createSlice } from "@reduxjs/toolkit";
import { chatAsync } from "./chatThunk";

const initialState = {
  loading: false,
  chats: [],
  error: null,
  currentChat: {},
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat: (state, { payload }) => {
      console.log("setCurrentChat", payload);
      state.currentChat = payload;
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
  },
});

export const { setCurrentChat } = chatSlice.actions;

export const selectChat = (state) => state.chat.chats;
export const selectCurrentChat = (state) => state.chat.currentChat;

export default chatSlice.reducer;
