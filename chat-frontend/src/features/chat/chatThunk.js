import { createAsyncThunk } from "@reduxjs/toolkit";
import ChatService from "./../../services/chatService";

export const chatAsync = createAsyncThunk("chat", async () => {
  try {
    const response = await ChatService.fetchChats();
    // The value we return becomes the `fulfilled` action payload

    return response;
  } catch (error) {
    console.log(error);
    return error.message;
  }
});

export const paginateMessagesAsync = createAsyncThunk(
  "chatPaginate",
  async ({ id, page }) => {
    try {
      console.log("chat", id, page);
      const response = await ChatService.paginateMessages(id, page);
      // The value we return becomes the `fulfilled` action payload

      return response;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
);
