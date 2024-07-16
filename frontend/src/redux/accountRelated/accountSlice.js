import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminsList: [],
  adminDetails: [],
  loading: false,
  error: null,
  response: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    getRequest: state => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.adminsList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.adminsList = [];
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    detailsSuccess: (state, action) => {
      state.adminDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    resetSubjects: state => {
      state.adminsList = [];
      state.adminDetails = [];
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  detailsSuccess,
  resetSubjects,
} = adminSlice.actions;

export const adminReducer = adminSlice.reducer;
