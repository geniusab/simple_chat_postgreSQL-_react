import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import userReducer from "../features/user/userSlice";
import chatReducer from "../features/chat/chatSlice";

const authMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith("auth/")) {
    const authState = store.getState().auth;
    localStorage.setItem("auth", JSON.stringify(authState));
  }
  return result;
};

export function loadState() {
  try {
    const serializedState = localStorage.getItem("auth");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: userReducer,
    chat: chatReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});
