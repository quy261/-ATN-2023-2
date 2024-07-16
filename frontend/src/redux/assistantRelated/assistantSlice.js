import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assistantsList: [],
  assistantDetails: [],
  loading: false,
  error: null,
  response: null,
};

const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    getRequest: state => {
      state.loading = true;
    },
    doneSuccess: (state, action) => {
      state.assistantDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getSuccess: (state, action) => {
      state.assistantsList = action.payload;
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
} = assistantSlice.actions;

export const assistantReducer = assistantSlice.reducer;
