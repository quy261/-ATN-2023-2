import axios from "axios";
import { getRequest, getSuccess, getFailed, getError } from "./commentSlice";

export const getCommentsByStudentId = id => async dispatch => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Comment/${id}`
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
