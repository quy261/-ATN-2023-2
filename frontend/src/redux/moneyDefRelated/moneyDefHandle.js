import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  doneSuccess,
} from "./moneyDefSlice";

export const getAllMoneyDefs = id => async dispatch => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/MoneyDefs`
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getMoneyDefDetails = id => async dispatch => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/MoneyDefDetails/${id}`
    );
    if (result.data) {
      console.log(result.data);
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
