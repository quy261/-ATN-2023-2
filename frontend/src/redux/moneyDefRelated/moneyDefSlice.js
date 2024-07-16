import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  moneyDefsList: [],
  moneyDefDetails: [],
  loading: false,
  error: null,
  response: null,
};

const moneyDefSlice = createSlice({
  name: "moneyDef",
  initialState,
  reducers: {
    getRequest: state => {
      state.loading = true;
    },
    doneSuccess: (state, action) => {
      state.moneyDefDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getSuccess: (state, action) => {
      state.moneyDefsList = action.payload;
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
} = moneyDefSlice.actions;

export const moneyDefReducer = moneyDefSlice.reducer;
