import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomsList: [],
  roomDetails: [],
  loading: false,
  error: null,
  response: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    getRequest: state => {
      state.loading = true;
    },
    doneSuccess: (state, action) => {
      state.roomDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getSuccess: (state, action) => {
      state.roomsList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    postDone: state => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  doneSuccess,
  postDone,
} = roomSlice.actions;

export const roomReducer = roomSlice.reducer;
