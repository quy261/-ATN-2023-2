import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";

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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  LightWhiteButton,
  LightOrangeButton,
} from "../../../components/buttonStyles";

import { addStuff } from "../../../redux/userRelated/userHandle";

import styled from "styled-components";
import { getAllStudents } from "../../../redux/studentRelated/studentHandle";
import {
  getSchedulesByStudent,
} from "../../../redux/scheduleRelated/scheduleHandle";
import { getAllMoneyDefs } from "../../../redux/moneyDefRelated/moneyDefHandle";

const AddMoneyTuition = () => {
  const location = useLocation();

  const { item1, item2, studentID } = location.state || {};

  // console.log(item1);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userState = useSelector(state => state.user);

  const { status, currentUser, response, error } = userState;

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
  }, [adminID, dispatch]);

  useEffect(() => {
    dispatch(getAllMoneyDefs(adminID));
    if (studentID) {
      dispatch(getSchedulesByStudent(studentID));
    }
  }, [studentID, dispatch]);

  const { moneyDefsList } = useSelector(state => state.moneyDef);

  const [tuitionDef, setTuitionDef] = useState("");

  useEffect(() => {
    if (moneyDefsList.length > 0) {
      const tuitionDef = moneyDefsList.find(def => def.type === "Học sinh");
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
    name: studentID,
    month: item2,
    amount: (item1 * tuitionDef).toString(),
    type: "tuition",
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
                mb: 4,
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
                      value={studentID}
                      label="Tên học sinh"
                      disabled
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
                  "THÊM"
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
