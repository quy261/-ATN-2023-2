import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  doneSuccess,
} from "./moneySlice";

export const getAllMoneys = id => async dispatch => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Moneys`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getMoneyDetails = id => async dispatch => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Money/${id}`
    );
    if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
