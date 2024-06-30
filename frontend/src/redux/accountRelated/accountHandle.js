import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  detailsSuccess,
  resetSubjects,
} from "./accountSlice";

export const getAllAdmins = id => async dispatch => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Admins`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getAdminDetails = id => async dispatch => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Admin/${id}`
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(detailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
