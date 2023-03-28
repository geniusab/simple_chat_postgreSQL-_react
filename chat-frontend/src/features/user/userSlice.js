import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthLogin, AuthRegister, AuthUpdateProfile } from "./userAPI";

const initialState = {
  loading: false,
  userInfo: JSON.parse(localStorage.getItem("auth"))?.userInfo || {}, // for user object
  userToken: JSON.parse(localStorage.getItem("auth"))?.userToken || null, // for storing the
  error: null,
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthLogin({ email, password });
      // The value we return becomes the `fulfilled` action payload

      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const registerAsync = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    const response = await AuthRegister(data);
    // The value we return becomes the `fulfilled` action payload

    return response;
  }
);

export const updateAsync = createAsyncThunk(
  "auth/update",
  async (data, { rejectWithValue }) => {
    const response = await AuthUpdateProfile(data);
    // The value we return becomes the `fulfilled` action payload

    return response;
  }
);

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, ...user } = action.payload;
      state.userInfo = user;
      state.userToken = token;
    },
    logout: (state) => {
      state.userInfo = {};
      state.userToken = null;
    },
  },
  extraReducers: {
    [loginAsync.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [loginAsync.fulfilled]: (state, { payload }) => {
      console.log(payload);
      const { token, ...user } = payload;

      state.loading = false;

      state.userInfo = user;
      state.userToken = token;
    },
    [loginAsync.rejected]: (state, { payload }) => {
      state.loading = false;
      state.userInfo = {};
      state.userToken = null;
    },
    [registerAsync.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [registerAsync.fulfilled]: (state) => {
      state.loading = false;
    },

    [updateAsync.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateAsync.fulfilled]: (state, { payload }) => {
      state.loading = false;
      const { token, ...user } = payload;
      state.userInfo = user;
    },
  },

  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(incrementAsync.pending, (state) => {
  //         state.status = "loading";
  //       })
  //       .addCase(incrementAsync.fulfilled, (state, action) => {
  //         state.status = "idle";
  //         state.value += action.payload;
  //       });
  //   },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.auth;

export default userSlice.reducer;
