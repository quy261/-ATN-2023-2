import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    schedulesList: [],
    scheduleStudents: [],
    scheduleDetails: [],
    subjectsList: [],
    subjectDetails: [],
    loading: false,
    subloading: false,
    error: null,
    response: null,
    getresponse: null,
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    getRequest: state => {
      state.loading = true;
    },
    getSubDetailsRequest: state => {
      state.subloading = true;
    },
    getSuccess: (state, action) => {
      state.schedulesList = action.payload;
      state.loading = false;
      state.error = null;
      state.getresponse = null;
    },
    getDetailsSuccess: (state, action) => {
      state.scheduleDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.getresponse = null;
    },
    getStudentsSuccess: (state, action) => {
      state.scheduleStudents = action.payload;
      state.loading = false;
      state.error = null;
      state.getresponse = null;
    },
    getSubjectsSuccess: (state, action) => {
      state.subjectsList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.subjectsList = [];
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getFailedTwo: (state, action) => {
      state.schedulesList = [];
      state.scheduleDetails = [];
      state.getresponse = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    detailsSuccess: (state, action) => {
      state.scheduleDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    getSubDetailsSuccess: (state, action) => {
      state.subjectDetails = action.payload;
      state.subloading = false;
      state.error = null;
    },
    resetSubjects: state => {
      state.subjectsList = [];
      state.schedulesList = [];
    },
  },
});

export const {
    getRequest,
    getSuccess,
    getDetailsSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    getSubjectsSuccess,
    detailsSuccess,
    getFailedTwo,
    resetSubjects,
    getSubDetailsSuccess,
    getSubDetailsRequest
} = scheduleSlice.actions;

export const scheduleReducer = scheduleSlice.reducer;