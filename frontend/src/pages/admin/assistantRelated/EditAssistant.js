import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import styled from "styled-components";

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

import { updateAssistant } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import {
  LightWhiteButton,
  LightOrangeButton,
} from "../../../components/buttonStyles";
import Classroom from "../../../assets/teacher/teacher.webp";
import { getAssistantDetails } from "../../../redux/assistantRelated/assistantHandle";

const EditAssistant = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userState = useSelector(state => state.user);

  const { status, currentUser, response, error } = userState;

  const sclassesList = [
    {
      id: "Sinh viên",
      name: "Sinh viên",
    },
    {
      id: "Cử nhân",
      name: "Cử nhân",
    },
    {
      id: "Kỹ sư",
      name: "Kỹ sư",
    },
  ];

  const [name, setName] = useState("");

  const [dob, setDob] = useState(dayjs());

  const [dobError, setDobError] = useState(false);

  const [phone, setPhone] = useState("");

  const [sclassName, setSclassName] = useState("");

  const adminID = currentUser._id;

  const role = "Assistant";

  useEffect(() => {
    dispatch(getAssistantDetails(id));
  }, [dispatch, id]);

  const { assistantDetails } = useSelector(state => state.assistant);

  const [avatar, setAvatar] = useState(null);

  const [avatarName, setAvatarName] = useState(
    assistantDetails.avatar ? assistantDetails.avatar.split("/").pop() : ""
  );

  const [urlImage, setUrlImage] = useState("");

  useEffect(() => {
    if (assistantDetails && assistantDetails._id === id) {
      setName(assistantDetails.name);
      setSclassName(assistantDetails.sclassName);
      setDob(dayjs(assistantDetails.dob));
      setPhone(assistantDetails.phone);
      setAvatar(assistantDetails.avatar);
      setAvatarName(assistantDetails.avatar.split("\\").pop());
    }
  }, [assistantDetails, id]);

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
    if (file) {
      console.log(file);
      setAvatar(file);
      setAvatarName(file ? file.name : "");
      setUrlImage(file ? URL.createObjectURL(file) : "");
    }
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
    dispatch(updateAssistant(id, formData));
  };

  useEffect(() => {
    if (status === "updated" && assistantDetails) {
      navigate("/Admin/assistant/" + assistantDetails._id);
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
  }, [status, navigate, error, response, dispatch, assistantDetails]);

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
              Chỉnh sửa Trợ giảng
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
                    <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                  </Button>
                  {avatarName && (
                    <>
                    <Typography variant="body2" mt={2}>
                      {avatarName}
                    </Typography>
                    <img src={urlImage} alt="avatar" style={{width: "500px"}}></img>
                    </>
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

export default EditAssistant;

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
