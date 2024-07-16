import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  getSchedulesByAssistant,
  getSchedulesByStudent,
  getSchedulesByTeacher,
} from "../../../redux/scheduleRelated/scheduleHandle";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import { getAllAssistants } from "../../../redux/assistantRelated/assistantHandle";
import { getAllMoneyDefs } from "../../../redux/moneyDefRelated/moneyDefHandle";

const AddMoneyWage = () => {
  const location = useLocation();

  const { item1, item2, assistantID, teacherID } = location.state || {};

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userState = useSelector(state => state.user);

  const { status, currentUser, response, error } = userState;

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllTeachers(adminID));
    dispatch(getAllAssistants(adminID));
    dispatch(getAllMoneyDefs(adminID));
  }, [adminID, dispatch]);

  const { moneyDefsList } = useSelector(state => state.moneyDef);

  const [tuitionDef, setTuitionDef] = useState("");

  useEffect(() => {
    if (moneyDefsList.length > 0) {
      const tuitionDef = teacherID
        ? moneyDefsList.find(def => def.type === "Giáo viên")
        : moneyDefsList.find(def => def.type === "Trợ giảng");
      if (tuitionDef) {
        const parsedAmount = parseFloat(tuitionDef.amount);
        if (!isNaN(parsedAmount)) {
          setTuitionDef(parsedAmount);
        }
      }
    }
  }, [moneyDefsList]);

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  const [loader, setLoader] = useState(false);

  const fields = {
    name: teacherID ? teacherID : assistantID,
    month: item2,
    amount: (item1 * tuitionDef).toString(),
    type: "wage",
    adminID,
    status: "Đã thanh toán"
  };

  const address = "Money";

  const submitHandler = event => {
    event.preventDefault();
    setLoader(true);
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

  const { teachersList } = useSelector(state => state.teacher);

  const { assistantsList } = useSelector(state => state.assistant);

  const [combinedList, setCombinedList] = useState([]);

  useEffect(() => {
    if (teachersList && assistantsList) {
      const combined = [...teachersList, ...assistantsList];
      setCombinedList(combined);
    }
  }, [teachersList, assistantsList]);

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
              Thêm mới Lương
            </Stack>
            <form onSubmit={submitHandler}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="sclass-select-label">
                      Tên giáo viên/trợ giảng
                    </InputLabel>
                    <Select
                      labelId="sclass-select-label"
                      id="sclass-select"
                      value={teacherID ? teacherID : assistantID}
                      label="Tên giáo viên/trợ giảng"
                      disabled
                    >
                      {combinedList.map(teacher => (
                        <MenuItem key={teacher._id} value={teacher._id}>
                          {teacher.name}
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
                      value={item2}
                      label="Tháng"
                      disabled
                    >
                      <MenuItem key={item2} value={item2}>
                        {item2}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Số tiền"
                    variant="outlined"
                    value={item1 * tuitionDef}
                    required
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    disabled
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

export default AddMoneyWage;

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
