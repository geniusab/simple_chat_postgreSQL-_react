import axios from "axios";
import { store } from "../app/store";

import { logout } from "../features/user/userSlice";

let API = axios.create({
  baseURL: "http://127.0.0.1:3001",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem("auth"))?.userToken || ""
    }`,
  },
});

API.interceptors = API.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.status !== 401) {
      throw err;
    }

    if (typeof err.response.data.error.name !== undefined) {
      if (err.response.data.error.name === "TokenExpiredError") {
        store.dispatch(logout());
      }
    }
  }
);

export default API;
