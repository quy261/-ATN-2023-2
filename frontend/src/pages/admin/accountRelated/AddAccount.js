import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { registerUser } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import {
  LightWhiteButton,
  LightOrangeButton,
} from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import Admini from "../../../assets/admin.webp";

const AddAccount = () => {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [toggle, setToggle] = useState(false);

  const userState = useSelector(state => state.user);

  const { status, response, error, tempDetails } = userState;

  const [loader, setLoader] = useState(false);

  const [message, setMessage] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const [nameError, setNameError] = useState(false);

  const [emailError, setEmailError] = useState(false);

  const [passwordError, setPasswordError] = useState(false);

  const rolesList = [
    {
      id: "Admin",
      name: "Quản trị viên",
    },
    {
      id: "Accountant",
      name: "Nhân viên kế toán",
    },
  ];

  const submitHandler = event => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    if (!email || !password) {
      if (!name) setNameError(true);
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      return;
    }

    const fields = {
      name,
      email,
      password,
      role,
      schoolName: "HCE",
    };
    setLoader(true);
    dispatch(registerUser(fields, "Admin"));
  };

  useEffect(() => {
    if (status === "added") {
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
    }
  }, [status, navigate, error, response, dispatch, tempDetails]);

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
              Thêm mới Quản trị viên
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
                  label="Họ tên"
                  variant="outlined"
                  id="name"
                  value={name}
                  onChange={event => {
                    setName(event.target.value);
                  }}
                  required
                  fullWidth
                  error={nameError}
                  helperText={nameError && "Yêu cầu tên đăng nhập"}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  id="email"
                  value={email}
                  onChange={event => {
                    setEmail(event.target.value);
                  }}
                  required
                  fullWidth
                  error={emailError}
                  helperText={emailError && "Yêu cầu tên đăng nhập"}
                />
                <TextField
                  label="Mật khẩu"
                  type={toggle ? "text" : "password"}
                  variant="outlined"
                  id="password"
                  value={password}
                  onChange={event => {
                    setPassword(event.target.value);
                  }}
                  required
                  fullWidth
                  error={passwordError}
                  helperText={passwordError && "Yêu cầu mật khẩu"}
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
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel id="sclass-select-label">Quyền</InputLabel>
                  <Select
                    labelId="sclass-select-label"
                    id="sclass-select"
                    value={role}
                    onChange={event => setRole(event.target.value)}
                    label="Lớp"
                  >
                    {rolesList.map(sclass => (
                      <MenuItem key={sclass.id} value={sclass.id}>
                        {sclass.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                    "TẠO"
                  )}
                </LightOrangeButton>
                <LightWhiteButton onClick={() => navigate(-1)}>
                  Quay lại
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

export default AddAccount;

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
