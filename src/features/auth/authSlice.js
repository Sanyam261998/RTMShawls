import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Point this to your running proxy server
const PROXY_LOGIN_URL = "/api/login";

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.post(PROXY_LOGIN_URL, {
        username,
        password,
      });

      const data = response.data;

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || err.message
      );
    }
  }
);

// Redux slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
