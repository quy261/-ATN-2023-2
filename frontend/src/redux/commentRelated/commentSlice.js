import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    commentsList: [],
    loading: false,
    subloading: false,
    error: null,
    response: null,
    getresponse: null,
};

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.commentsList = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        getFailed: (state, action) => {
            state.commentsList = [];
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
} = commentSlice.actions;

export const commentReducer = commentSlice.reducer;