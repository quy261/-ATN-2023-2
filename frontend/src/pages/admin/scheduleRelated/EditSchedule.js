import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Modal,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import {
  getAllSchedules,
  getScheduleDetails,
} from "../../../redux/scheduleRelated/scheduleHandle";
import { getAllRooms } from "../../../redux/roomRelated/roomHandle";
import { LightOrangeButton } from "../../../components/buttonStyles";
import { BlueButton, OrangeButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import Popup from "../../../components/Popup";
import NoData from "../../../assets/no-data.webp";
import Schedule from "../../../assets/schedule.webp";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import { getAllAssistants } from "../../../redux/assistantRelated/assistantHandle";
import { addStuff, deleteUser, updateSchedule } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";

const EditSchedule = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  dayjs.extend(isSameOrAfter);

  const userState = useSelector(state => state.user);

  const { status, currentUser, response, error } = userState;

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getScheduleDetails(id));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllSchedules(adminID, "schedule"));
    dispatch(getAllRooms(adminID));
    dispatch(getAllTeachers(adminID));
    dispatch(getAllAssistants(adminID));
  }, [adminID, dispatch]);

  const { schedulesList, scheduleDetails, loading, getresponse } = useSelector(
    state => state.schedule
  );

  const { sclassesList } = useSelector(state => state.sclass);

  const { roomsList } = useSelector(state => state.room);

  const { teachersList } = useSelector(state => state.teacher);

  const { assistantsList } = useSelector(state => state.assistant);

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  dayjs.extend(utc);

  dayjs.extend(timezone);

  const [loader, setLoader] = useState(false);

  const [sclass, setSclass] = useState("");

  const [room, setRoom] = useState("");

  const [teacher, setTeacher] = useState("");

  const [assistant, setAssistant] = useState("");

  const [startTime, setStartTime] = useState(dayjs());

  const [endTime, setEndTime] = useState(dayjs());

  const [numValue, setNumValue] = useState(2);

  const handleNumChange = event => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue) && newValue <= 4 && newValue >= 0) {
      setNumValue(newValue);
    }
  };

  const handleNumKeyDown = event => {
    event.preventDefault();
  };

  const fields = {
    sclass,
    room,
    teacher,
    assistant,
    startTime: startTime.toISOString(),
    endTime: startTime.add(numValue, "hour").toISOString(),
    adminID,
  };

  const address = "Schedule";

  useEffect(() => {
    if (scheduleDetails && scheduleDetails._id === id) {
      setSclass(scheduleDetails.sclass);
      setRoom(scheduleDetails.room);
      setTeacher(scheduleDetails.teacher);
      setAssistant(scheduleDetails.assistant);
      setStartTime(dayjs(scheduleDetails.startTime));
      setEndTime(dayjs(scheduleDetails.endTime));
      const start = dayjs(scheduleDetails.startTime);
      const end = dayjs(scheduleDetails.endTime);
      const duration = end.diff(start, "hour", true);
      setNumValue(duration);
    }
  }, [scheduleDetails, id]);

  const submitHandler = event => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateSchedule(id, fields));
  };

  useEffect(() => {
    if (status === "updated") {
      navigate("/Admin/schedule/" + id);
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
    } else if (error) {
      setMessage(error.message);
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex" }}>
              <BackButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </BackButton>
            </div>
            <div
              style={{
                padding: "2rem 4rem",
                backgroundColor: "white",
                borderRadius: "15px",
              }}
            >
              <Stack
                sx={{
                  alignItems: "center",
                  fontSize: "2rem",
                  color: "#f47400",
                  mb: 2,
                }}
              >
                Chỉnh sửa Lịch học
              </Stack>
              <form onSubmit={submitHandler}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="sclass-select-label">Lớp</InputLabel>
                      <Select
                        labelId="sclass-select-label"
                        id="sclass-select"
                        value={sclass}
                        onChange={event => setSclass(event.target.value)}
                        label="Lớp"
                      >
                        {sclassesList.map(sclass => (
                          <MenuItem key={sclass._id} value={sclass._id}>
                            {sclass.sclassName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="room-select-label">Địa điểm</InputLabel>
                      <Select
                        labelId="room-select-label"
                        id="room-select"
                        value={room}
                        onChange={event => setRoom(event.target.value)}
                        label="Địa điểm"
                      >
                        {roomsList.map(room => (
                          <MenuItem key={room._id} value={room._id}>
                            {room.name} - {room.location}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="teacher-select-label">
                        Giáo viên
                      </InputLabel>
                      <Select
                        labelId="teacher-select-label"
                        id="teacher-select"
                        value={teacher}
                        onChange={event => setTeacher(event.target.value)}
                        label="Giáo viên"
                      >
                        {teachersList.map(teacher => (
                          <MenuItem key={teacher._id} value={teacher._id}>
                            {teacher.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="assistant-select-label">
                        Trợ giảng
                      </InputLabel>
                      <Select
                        labelId="assistant-select-label"
                        id="assistant-select"
                        value={assistant}
                        onChange={event => setAssistant(event.target.value)}
                        label="Trợ giảng"
                      >
                        {assistantsList.map(assistant => (
                          <MenuItem key={assistant._id} value={assistant._id}>
                            {assistant.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        required
                        label="Giờ vào lớp"
                        value={startTime}
                        onChange={newValue => setStartTime(newValue)}
                        sx={{
                          width: "100%",
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      type="number"
                      value={numValue}
                      onChange={handleNumChange}
                      onKeyDown={handleNumKeyDown}
                      inputProps={{
                        step: 0.5,
                        min: 1,
                        max: 4,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      label="Thời gian học (h)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent={"center"}>
                      <Grid item xs={3}>
                        <LightOrangeButton
                          fullWidth
                          size="large"
                          type="submit"
                          disabled={loader}
                        >
                          {loader ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "CHỈNH SỬA"
                          )}
                        </LightOrangeButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </div>
          </div>
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default EditSchedule;

const TitleBox = styled.div`
  font-size: 1.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 16px;
  background-color: #f47400;
  color: white;
  width: fit-content;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
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
