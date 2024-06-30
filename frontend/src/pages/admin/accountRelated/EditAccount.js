import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import {
  registerUser,
  updatePassword,
} from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import {
  LightWhiteButton,
  LightOrangeButton,
} from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import Admini from "../../../assets/admin.webp";

const EditAccount = () => {
  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [toggle, setToggle] = useState(false);

  const [loader, setLoader] = useState(false);

  const [message, setMessage] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const [passwordError, setPasswordError] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userState = useSelector(state => state.user);

  const { status, currentUser, currentRole, response, error, tempDetails } =
    userState;

  const submitHandler = event => {
    event.preventDefault();
    if (!oldPassword || !newPassword) {
      setPasswordError(true);
      return;
    }
    const fields = {
      oldPassword,
      newPassword,
      role: currentRole,
    };
    setLoader(true);
    dispatch(updatePassword(currentUser._id, fields));
  };

  useEffect(() => {
    if (status === "updated") {
      setLoader(false);
      dispatch(underControl());
      navigate(-1);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    } else if (error) {
      setMessage(error.message);
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <div style={{ padding: "2rem", height: "calc(100% - 64px)" }}>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </BackButton>
      <div
        style={{
          height: "calc(100% - 64px)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <StyledContainer>
          <StyledBox>
            <Stack
              sx={{
                alignItems: "center",
                fontSize: "2rem",
                color: "#f47400",
                mb: 2,
              }}
            >
              Đổi mật khẩu
            </Stack>
            <Stack
              sx={{
                alignItems: "center",
                mb: 3,
              }}
            >
              <img src={Admini} alt="classroom" style={{ width: "80%" }} />
            </Stack>
            <form onSubmit={submitHandler}>
              <Stack spacing={3}>
                <TextField
                  label="Mật khẩu cũ"
                  type={toggle ? "text" : "password"}
                  variant="outlined"
                  value={oldPassword}
                  onChange={event => setOldPassword(event.target.value)}
                  required
                  fullWidth
                  error={passwordError && !oldPassword}
                  helperText={
                    passwordError && !oldPassword && "Yêu cầu mật khẩu cũ"
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setToggle(!toggle)}>
                          {toggle ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Mật khẩu mới"
                  type={toggle ? "text" : "password"}
                  variant="outlined"
                  value={newPassword}
                  onChange={event => setNewPassword(event.target.value)}
                  required
                  fullWidth
                  error={passwordError && !newPassword}
                  helperText={
                    passwordError && !newPassword && "Yêu cầu mật khẩu mới"
                  }
                  inputProps={{
                    minLength: 6,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setToggle(!toggle)}>
                          {toggle ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <LightOrangeButton
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  variant="contained"
                  type="submit"
                  disabled={loader}
                >
                  {loader ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Đổi mật khẩu"
                  )}
                </LightOrangeButton>
                <LightWhiteButton onClick={() => navigate(-1)}>
                  Quay lại
                </LightWhiteButton>
              </Stack>
            </form>
          </StyledBox>
        </StyledContainer>
        <Popup
          message={message}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      </div>
    </div>
  );
};

export default EditAccount;

const StyledContainer = styled(Box)`
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  max-width: 550px;
  padding: 50px 3rem 50px;
  margin-top: 1rem;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const BackButton = styled(Button)`
  position: "absolute";
  border-radius: 50px !important;
  min-width: unset !important;
  width: 3rem !important;
  height: 3rem !important;
  margin: 0 1rem 1rem 0 !important;
  color: #f47440 !important;

  &:hover {
    background-color: rgba(25, 118, 210, 0.1) !important;
  }
`;
