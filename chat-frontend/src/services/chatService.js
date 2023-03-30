import API from "./api";

const ChatService = {
  fetchChats: () => {
    return API.get("/chats")
      .then(({ data }) => {
        console.log(data);
        return data;
      })
      .catch((err) => {
        throw err;
      });
  },
};

export default ChatService;
