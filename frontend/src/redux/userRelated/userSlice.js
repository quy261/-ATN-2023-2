import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  userDetails: [],
  tempDetails: [],
  loading: false,
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  currentRole: (JSON.parse(localStorage.getItem("user")) || {}).role || null,
  error: null,
  response: null,
  darkMode: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authRequest: state => {
      state.status = "loading";
    },
    underControl: state => {
      state.status = "idle";
      state.response = null;
    },
    stuffAdded: (state, action) => {
      state.status = "added";
      state.response = null;
      state.error = null;
      state.tempDetails = action.payload;
    },
    authSuccess: (state, action) => {
      state.status = "success";
      state.currentUser = action.payload;
      state.currentRole = action.payload.role;
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.response = null;
      state.error = null;
    },
    authFailed: (state, action) => {
      state.status = "failed";
      state.response = action.payload;
    },
    authError: (state, action) => {
      state.status = "error";
      state.error = action.payload;
    },
    authLogout: state => {
      localStorage.removeItem("user");
      state.currentUser = null;
      state.status = "idle";
      state.error = null;
      state.currentRole = null;
    },

    doneSuccessGet: (state, action) => {
      state.userDetails = action.payload;
      state.tempDetails = action.payload;
      state.status = "idle";
      state.loading = false;
      state.error = null;
      state.response = null;
    },

    doneSuccessUpdate: (state, action) => {
      state.userDetails = action.payload;
      state.tempDetails = action.payload;
      state.status = "updated";
      state.loading = false;
      state.error = null;
      state.response = null;
    },

    doneSuccess: (state, action) => {
      state.userDetails = action.payload;
      state.status = "added";
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getDeleteSuccess: state => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },

    getRequest: state => {
      state.loading = true;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = {
        message: action.payload.message,
        code: action.payload.code,
      };
    },
    toggleDarkMode: state => {
      state.darkMode = !state.darkMode;
    },
    deleteUserSuccess: (state, action) => {
      state.userDetails = state.userDetails.filter(
        user => user.id !== action.payload.id
      );
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    deleteUserError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  authRequest,
  underControl,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  doneSuccessUpdate,
  doneSuccessGet,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
  toggleDarkMode,
  deleteUserSuccess,
  deleteUserError,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
