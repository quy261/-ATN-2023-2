import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import dayjs from "dayjs";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";

import {
  updateTeacher,
} from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import {
  LightWhiteButton,
  LightOrangeButton,
} from "../../../components/buttonStyles";
import Classroom from "../../../assets/teacher/teacher.webp";
import { getTeacherDetails } from "../../../redux/teacherRelated/teacherHandle";

const EditTeacher = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userState = useSelector(state => state.user);

  const { status, currentUser, response, error } = userState;

  const sclassesList = [
    {
      id: "Cử nhân",
      name: "Cử nhân",
    },
    {
      id: "Kỹ sư",
      name: "Kỹ sư",
    },
    {
      id: "Thạc sĩ",
      name: "Thạc sĩ",
    },
    {
      id: "Tiến sĩ",
      name: "Tiến sĩ",
    },
  ];

  const [name, setName] = useState("");

  const [dob, setDob] = useState(dayjs());

  const [dobError, setDobError] = useState(false);

  const [phone, setPhone] = useState("");

  const [sclassName, setSclassName] = useState("");

  const adminID = currentUser._id;

  const role = "Teacher";

  useEffect(() => {
    dispatch(getTeacherDetails(id));
  }, [dispatch, id]);

  const { teacherDetails } = useSelector(state => state.teacher);

  const [avatar, setAvatar] = useState(null);

  const [avatarName, setAvatarName] = useState(
    teacherDetails.avatar ? teacherDetails.avatar.split("/").pop() : ""
  );

  useEffect(() => {
    if (teacherDetails && teacherDetails._id === id) {
      setName(teacherDetails.name);
      setSclassName(teacherDetails.sclassName);
      setDob(dayjs(teacherDetails.dob));
      setPhone(teacherDetails.phone);
      setAvatar(teacherDetails.avatar);
      setAvatarName(teacherDetails.avatar.split("\\").pop());
    }
  }, [teacherDetails, id]);

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  const [loader, setLoader] = useState(false);

  const [phoneError, setPhoneError] = useState(false);

  const handlePhoneChange = event => {
    const phoneValue = event.target.value;
    setPhone(phoneValue);
    const phonePattern = /^0\d{9,}$/;
    setPhoneError(!phonePattern.test(phoneValue));
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    setAvatar(file);
    console.log(file);
    setAvatarName(file ? file.name : "");
  };

  const submitHandler = event => {
    event.preventDefault();
    if (!dob.isValid()) {
      setDobError(true);
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sclassName", sclassName);
    formData.append("dob", dob.isValid() ? dob.toISOString() : null);
    formData.append("phone", phone);
    formData.append("role", role);
    formData.append("adminID", adminID);
    formData.append("avatar", avatar ? avatar : null);
    setLoader(true);
    dispatch(updateTeacher(id, formData));
  };

  useEffect(() => {
    if (status === "updated" && teacherDetails) {
      navigate("/Admin/teacher/" + teacherDetails._id);
      dispatch(underControl());
      setLoader(false);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch, teacherDetails]);

  return (
    <div style={{ padding: "2rem", height: "calc(100% - 64px)" }}>
      <BackButton onClick={() => navigate(-1)} style={{ position: "absolute" }}>
        <ArrowBackIcon />
      </BackButton>
      <div
        style={{
          height: "100%",
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
              Chỉnh sửa Giáo viên
            </Stack>
            <Stack
              sx={{
                alignItems: "center",
                mb: 3,
              }}
            >
              <img src={Classroom} alt="classroom" style={{ width: "80%" }} />
            </Stack>
            <form onSubmit={submitHandler}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Họ tên"
                    variant="outlined"
                    value={name}
                    onChange={event => {
                      setName(event.target.value);
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="sclass-select-label">Học vị</InputLabel>
                    <Select
                      labelId="sclass-select-label"
                      id="sclass-select"
                      value={sclassName}
                      onChange={event => setSclassName(event.target.value)}
                      label="Lớp"
                    >
                      {sclassesList.map(sclass => (
                        <MenuItem key={sclass.id} value={sclass.id}>
                          {sclass.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimeField
                      autoFocus={false}
                      label="Ngày sinh"
                      value={dob}
                      onChange={newValue => {
                        setDob(newValue);
                        setDobError(!newValue.isValid());
                      }}
                      format="DD/MM/YYYY"
                      fullWidth
                      required
                      error={dobError}
                      helperText={dobError ? "Ngày sinh không hợp lệ" : ""}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="SĐT"
                    variant="outlined"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    error={phoneError}
                    helperText={phoneError ? "SĐT không hợp lệ" : ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>Ảnh</InputLabel>
                  <Button variant="contained" component="label" fullWidth>
                    Chọn ảnh
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                  {avatarName && (
                    <Typography variant="body2" mt={2}>
                      {avatarName}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <LightOrangeButton
                fullWidth
                size="large"
                sx={{ mt: 3, mb: 3 }}
                variant="contained"
                type="submit"
                disabled={loader}
                mb="1.5rem"
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "CHỈNH SỬA"
                )}
              </LightOrangeButton>
              <LightWhiteButton fullWidth onClick={() => navigate(-1)}>
                Quay lại
              </LightWhiteButton>
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

export default EditTeacher;

const StyledContainer = styled(Box)`
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  max-width: 700px;
  padding: 2rem 3rem;
  margin-top: 1rem;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const BackButton = styled(Button)`
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
