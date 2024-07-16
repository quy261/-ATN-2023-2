import axios from "axios";
import {
  authRequest,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  doneSuccessGet,
  doneSuccessUpdate,
  getRequest,
  getError,
  deleteUserSuccess,
  deleteUserError,
} from "./userSlice";

export const loginUser = (fields, role) => async dispatch => {
  dispatch(authRequest());

  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/${role}Login`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (result.data.role) {
      dispatch(authSuccess(result.data));
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const registerUser = (fields, role) => async dispatch => {
  dispatch(authRequest());
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/${role}Reg`,
      fields
    );
    if (result.data.school || result.data.schoolName) {
      dispatch(stuffAdded());
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const logoutUser = () => dispatch => {
  dispatch(authLogout());
};

export const getUserDetails = (id, address) => async dispatch => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const deleteUser = (deleteID, address) => async dispatch => {
  try {
    const result = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/${address}/${deleteID}`
    );
    dispatch(deleteUserSuccess(result.data));
  } catch (error) {
    dispatch(deleteUserError(error));
  }
};

export const getSingleClass = id => async dispatch => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Sclass/${id}`
    );
    if (result.data) {
      dispatch(doneSuccessGet(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updatePassword = (id, fields) => async dispatch => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Admin/${id}`,
      fields
    );
    if (result.data) {
      dispatch(doneSuccessUpdate(result.data, { meta: { arg: "update" } }));
    }
  } catch (error) {
    dispatch(getError(error.response.data));
  }
};

export const updateClass = (id, fields) => async dispatch => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Sclass/${id}`,
      fields
    );
    if (result.data) {
      dispatch(doneSuccessUpdate(result.data, { meta: { arg: "update" } }));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateTeacher = (id, fields) => async dispatch => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Teacher/${id}`,
      fields
    );
    if (result.data) {
      dispatch(doneSuccessUpdate(result.data));
    }
  } catch (error) {
    dispatch(getError({ message: error.message, code: error.code }));
  }
};

export const updateAssistant = (id, fields) => async dispatch => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Assistant/${id}`,
      fields
    );
    if (result.data) {
      dispatch(doneSuccessUpdate(result.data));
    }
  } catch (error) {
    dispatch(getError({ message: error.message, code: error.code }));
  }
};

export const updateUser = (id, fields) => async dispatch => {
  dispatch(getRequest());

  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Student/${id}`,
      fields
    );
    if (result.data) {
      dispatch(doneSuccessUpdate(result.data, { meta: { arg: "update" } }));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateRoom = (id, fields) => async dispatch => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Room/${id}`,
      fields
    );
    if (result.data) {
      dispatch(doneSuccessUpdate(result.data, { meta: { arg: "update" } }));
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        dispatch(getError({ message: "Phòng không tồn tại" }));
      } else if (error.response.status === 405) {
        dispatch(getError({ message: "Tên phòng đã được sử dụng" }));
      } else {
        dispatch(getError(error.response.data));
      }
    } else {
      dispatch(getError({ message: "Network error" }));
    }
  }
};

export const updateSchedule = (id, fields) => async dispatch => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Schedule/${id}`,
      fields
    );
    if (result.data) {
      dispatch(doneSuccessUpdate(result.data, { meta: { arg: "update" } }));
    }
  } catch (error) {
    if (error.response) {
      dispatch(getError(error.response.data));
    } else {
      dispatch(getError({ message: "Network error" }));
    }
  }
};

export const updateMoneyDef = (id, fields) => async dispatch => {
  dispatch(getRequest());
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/MoneyDef/${id}`,
      fields
    );
    if (result.data) {
      dispatch(doneSuccessUpdate(result.data, { meta: { arg: "update" } }));
    }
  } catch (error) {
    if (error.response) {
      dispatch(getError(error.response.data));
    } else {
      dispatch(getError({ message: "Network error" }));
    }
  }
};

export const updateMoney = (id, fields) => async dispatch => {
  dispatch(getRequest());
  try {
    console.log(fields);
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Money/${id}`,
      fields
    );
    if (result.data) {
      dispatch(doneSuccessUpdate(result.data, { meta: { arg: "update" } }));
    }
  } catch (error) {
    if (error.response) {
      dispatch(getError(error.response.data));
    } else {
      dispatch(getError({ message: "Network error" }));
    }
  }
};

export const addStuff = (fields, address) => async dispatch => {
  dispatch(authRequest());
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/${address}Create`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (result.data.message) {
      dispatch(authFailed(result.data.message));
    } else {
      dispatch(stuffAdded(result.data));
    }
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(authFailed(error.response.data.message));
    } else {
      dispatch(authError("Network Error"));
    }
  }
};

export const addMoneyStuff = (fields, address) => async dispatch => {
  dispatch(authRequest());
  try {
    const formData = new FormData();
    for (const key in fields) {
      formData.append(key, fields[key]);
    }
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/${address}Create`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (result.data.message) {
      dispatch(authFailed(result.data.message));
    } else {
      dispatch(stuffAdded(result.data));
    }
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(authFailed(error.response.data.message));
    } else {
      dispatch(authError("Network Error"));
    }
  }
};
