import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import bgpic from "../assets/background-textures.webp";
import { LightRedButton, LightWhiteButton } from "../components/buttonStyles";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";

const defaultTheme = createTheme();

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(
    state => state.user
  );

  const [toggle, setToggle] = useState(false);

  const [guestLoader, setGuestLoader] = useState(false);

  const [loader, setLoader] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  const [usernameError, setUsernameError] = useState(false);

  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    const email = event.target.username.value;
    const password = event.target.password.value;
    if (!email || !password) {
      if (!email) setUsernameError(true);
      if (!password) setPasswordError(true);
      return;
    }
    const fields = { email, password };
    setLoader(true);
    dispatch(loginUser(fields, role));
  };

  const handleInputChange = event => {
    const { name } = event.target;
    if (name === "email") setUsernameError(false);
    if (name === "password") setPasswordError(false);
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin" || currentRole === "Accountant") {
        navigate("/Admin/dashboard");
      } else if (currentRole === "Student") {
        navigate("/Student/dashboard");
      } else if (currentRole === "Teacher" || currentRole === "Assistant") {
        navigate("/Teacher/dashboard");
      }
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  return (
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
              Đăng nhập quyền{" "}
              {role == "Teacher"
                ? "Giáo viên/Trợ giảng"
                : role == "Student"
                ? "Học sinh"
                : "Quản trị viên"}
            </Typography>
            <Typography
              variant="h7"
              style={{ fontFamily: "sans-serif !important" }}
            >
              Chào mừng quay trở lại, hãy nhập thông tin đăng nhập của bạn
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email"
                name="username"
                error={usernameError}
                helperText={usernameError && "Yêu cầu tên đăng nhập"}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type={toggle ? "text" : "password"}
                id="password"
                error={passwordError}
                helperText={passwordError && "Yêu cầu mật khẩu"}
                onChange={handleInputChange}
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
              <Grid
                container
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      labelStyle={{ color: "#ca224f" }}
                      iconStyle={{ fill: "#ca224f" }}
                    />
                  }
                  label="Nhớ mật khẩu"
                />
                <StyledLink href="#">Quên mật khẩu?</StyledLink>
              </Grid>
              <LightRedButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Đăng nhập"
                )}
              </LightRedButton>
              <LightWhiteButton
              onClick = {() => navigate(-1)}
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              >
              {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Chọn lại quyền đăng nhập"
                )} 
              </LightWhiteButton>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${bgpic})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={guestLoader}
      >
        <CircularProgress color="primary" />
        Please Wait ...
      </Backdrop>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default LoginPage;

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #ca224f;

  &:hover {
    color: #9b184c;
  }
`;
