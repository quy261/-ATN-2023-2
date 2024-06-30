import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  LightWhiteButton,
  LightOrangeButton,
} from "../../../components/buttonStyles";

import Classroom from "../../../assets/classroom.webp";
import { addStuff } from "../../../redux/userRelated/userHandle";

import styled from "styled-components";
import { getAllStudents } from "../../../redux/studentRelated/studentHandle";
import {
  getAllSchedules,
  getSchedulesByStudent,
} from "../../../redux/scheduleRelated/scheduleHandle";

const AddMoneyTuition = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userState = useSelector(state => state.user);

  const { status, currentUser, response, error } = userState;

  const adminID = currentUser._id;

  const [tuition, setTuition] = useState([]);

  useEffect(() => {
    dispatch(getAllStudents(adminID));
  }, [adminID, dispatch]);

  const { schedulesList } = useSelector(state => state.schedule);

  const [name, setName] = useState("");

  useEffect(() => {
    if (name) {
      dispatch(getSchedulesByStudent(name));
    }
  }, [name, dispatch]);

  useEffect(() => {
    if (schedulesList) {
      const monthScheduleCount = {};
      schedulesList.forEach(schedule => {
        const startTime = new Date(schedule.startTime);
        const monthYear = `${
          startTime.getMonth() + 1
        }/${startTime.getFullYear()}`;
        if (monthScheduleCount[monthYear]) {
          monthScheduleCount[monthYear]++;
        } else {
          monthScheduleCount[monthYear] = 1;
        }
      });
      const monthScheduleArray = Object.entries(monthScheduleCount).map(
        ([month, count]) => ({ month, count })
      );
      setTuition(monthScheduleArray);
    }
  }, [schedulesList]);

  const [month, setMonth] = useState("");

  const [amount, setAmount] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  const [loader, setLoader] = useState(false);

  const fields = {
    name,
    month,
    amount,
    type: "tuition",
    adminID,
  };

  const address = "Money";

  const submitHandler = event => {
    event.preventDefault();
    setLoader(true);
    console.log(fields);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
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
  }, [status, navigate, error, response, dispatch]);

  const { studentsList } = useSelector(state => state.student);

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
              Thêm mới Học phí
            </Stack>
            <form onSubmit={submitHandler}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="sclass-select-label">
                      Tên học sinh
                    </InputLabel>
                    <Select
                      labelId="sclass-select-label"
                      id="sclass-select"
                      value={name}
                      onChange={event => setName(event.target.value)}
                      label="Tên học sinh"
                    >
                      {studentsList.map(student => (
                        <MenuItem key={student._id} value={student._id}>
                          {student.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="sclass-select-label">Tháng</InputLabel>
                    <Select
                      labelId="sclass-select-label"
                      id="sclass-select"
                      value={month}
                      onChange={event => setMonth(event.target.value)}
                      label="Tháng"
                    >
                      {tuition.map(loc => (
                        <MenuItem key={loc.month} value={loc.month}>
                          {loc.month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Số tiền"
                    variant="outlined"
                    value={amount}
                    onChange={event => {
                      setAmount(event.target.value);
                    }}
                    required
                  />
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
                  "TẠO"
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

export default AddMoneyTuition;

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
  min-width: 500px;
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
