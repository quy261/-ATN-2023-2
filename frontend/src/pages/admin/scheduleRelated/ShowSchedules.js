import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import {
  getAllSchedules,
  getSchedulesByAssistant,
  getSchedulesByStudent,
  getSchedulesByTeacher,
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
import { addStuff, deleteUser } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";

const ShowSchedules = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  dayjs.extend(isSameOrAfter);

  const userState = useSelector(state => state.user);

  const { status, currentUser, currentRole, response, error } = userState;

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
    {
      currentRole == "Admin" || currentRole == "Accountant"
        ? dispatch(getAllSchedules(adminID, "schedule"))
        : currentRole == "Student"
        ? dispatch(getSchedulesByStudent(currentUser._id))
        : currentRole == "Teacher"
        ? dispatch(getSchedulesByTeacher(currentUser._id))
        : dispatch(getSchedulesByAssistant(currentUser._id));
    }
    dispatch(getAllRooms(adminID));
    dispatch(getAllTeachers(adminID));
    dispatch(getAllAssistants(adminID));
  }, [adminID, dispatch]);

  const { schedulesList, loading, getresponse } = useSelector(
    state => state.schedule
  );

  const { sclassesList } = useSelector(state => state.sclass);

  const { roomsList } = useSelector(state => state.room);

  const { teachersList } = useSelector(state => state.teacher);

  const { assistantsList } = useSelector(state => state.assistant);

  const getClassNameById = id => {
    const sclass = sclassesList.find(sclass => sclass._id === id);
    return sclass ? sclass.sclassName : "Unknown";
  };

  const getRoomNameById = id => {
    const room = roomsList.find(room => room._id === id);
    return room ? `${room.name} - ${room.location}` : "Unknown";
  };

  const getTeacherNameById = id => {
    const teacher = teachersList.find(teacher => teacher._id === id);
    return teacher ? teacher.name : "Unknown";
  };

  const getAssistantNameById = id => {
    const assistant = assistantsList.find(assistant => assistant._id === id);
    return assistant ? assistant.name : "Unknown";
  };

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);

    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllSchedules(adminID, "schedule"));
    });
  };

  const scheduleColumns = [
    { id: "stt", label: "STT", minWidth: 20 },
    { id: "sclass", label: "LỚP", minWidth: 100 },
    { id: "room", label: "ĐỊA ĐIỂM", minWidth: 150 },
    { id: "teacher", label: "GIÁO VIÊN", minWidth: 170 },
    { id: "assistant", label: "TRỢ GIẢNG", minWidth: 170 },
    { id: "time", label: "THỜI GIAN", minWidth: 170 },
  ];

  dayjs.extend(utc);

  dayjs.extend(timezone);

  const formatTimes = (startTime, endTime) => {
    const start = dayjs(startTime).tz("Asia/Bangkok");
    const end = dayjs(endTime).tz("Asia/Bangkok");
    const startTimeFormatted = start.format("HH:mm");
    const endTimeFormatted = end.format("HH:mm");
    const dateFormatted = start.format("DD/MM/YYYY");
    return `${startTimeFormatted} - ${endTimeFormatted} ${dateFormatted}`;
  };

  const currentTime = dayjs();

  const sortedSchedules = [...schedulesList].sort((a, b) => {
    const aStart = dayjs(a.startTime);
    const aEnd = dayjs(a.endTime);
    const bStart = dayjs(b.startTime);
    const bEnd = dayjs(b.endTime);

    const isAPast = aEnd.isBefore(currentTime);
    const isBPast = bEnd.isBefore(currentTime);
    const isACurrent =
      aStart.isBefore(currentTime) && aEnd.isAfter(currentTime);
    const isBCurrent =
      bStart.isBefore(currentTime) && bEnd.isAfter(currentTime);

    if (isAPast && isBPast) {
      return aStart.diff(bStart);
    } else if (isAPast) {
      return 1;
    } else if (isBPast) {
      return -1;
    } else if (isACurrent && !isBCurrent) {
      return -1;
    } else if (!isACurrent && isBCurrent) {
      return 1;
    } else {
      return aStart.diff(bStart);
    }
  });

  const scheduleRows = sortedSchedules.map((schedule, index) => {
    return {
      stt: index + 1,
      sclass: getClassNameById(schedule.sclass),
      room: getRoomNameById(schedule.room),
      teacher: getTeacherNameById(schedule.teacher),
      assistant: getAssistantNameById(schedule.assistant),
      time: formatTimes(schedule.startTime, schedule.endTime),
      isPast: dayjs(schedule.endTime).isBefore(currentTime),
      id: schedule._id,
    };
  });

  const [showModal, setShowModal] = useState(false);

  const [deleteID, setDeleteID] = useState(null);

  const [addresss, setAddresss] = useState("");

  const handleDeleteClick = (id, addr) => {
    setDeleteID(id);
    setAddresss(addr);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    deleteHandler(deleteID, addresss);
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const StudentsButtonHaver = ({ row }) => {
    return (
      <div
        style={{
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <OrangeButton
          variant="contained"
          onClick={() => navigate("/Admin/schedule/" + row.id)}
        >
          <EditNoteIcon mr={1} />
        </OrangeButton>
        {currentRole == "Admin" ? (
          <BlueButton
            variant="contained"
            onClick={() => handleDeleteClick(row.id, "Schedule")}
          >
            <DeleteIcon mr={1} />
          </BlueButton>
        ) : null}
      </div>
    );
  };

  const ScheduleList = () => {
    return (
      <>
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              gutterBottom
              style={{
                color: "#f47400",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              {currentRole == "Admin" || currentRole == "Accountant"
                ? "Danh sách lịch học"
                : null}
            </Typography>
          </div>
          <TableTemplate
            buttonHaver={StudentsButtonHaver}
            columns={scheduleColumns}
            rows={scheduleRows}
            rowStyle={row => ({
              opacity: row.isPast ? "0.5" : "1",
            })}
          />
        </>
      </>
    );
  };

  useEffect(() => {
    if (schedulesList) {
      const transformedData = schedulesList.map(item => ({
        startDate: dayjs(item.startTime).format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dayjs(item.endTime).format("YYYY-MM-DDTHH:mm:ss"),
        assistant: item.assistant,
        location: item.room,
        sclass: item.sclass,
        teacher: item.teacher,
      }));
      setSampleScheduleData(transformedData);
      const daysToHighlight = transformedData.map(schedule =>
        dayjs(schedule.startDate).startOf("day")
      );
      setHighlightedDays(daysToHighlight);
      setIsLoading(false);
    }
  }, [schedulesList]);

  const initialValue = dayjs();

  const [selectedDate, setSelectedDate] = useState(initialValue);

  const handleChange = newDate => {
    setSelectedDate(newDate);
    handleDateChange(newDate);
  };

  const [isLoading, setIsLoading] = useState(true);

  const [highlightedDays, setHighlightedDays] = useState([]);

  const [selectedSchedule, setSelectedSchedule] = useState([]);

  const handleDateChange = newDate => {
    setSelectedDate(newDate);

    const { selectedSchedule, nextSchedule } = findSchedules(
      newDate,
      sampleScheduleData
    );
    setSelectedSchedule(selectedSchedule);
  };

  const [sampleScheduleData, setSampleScheduleData] = useState([]);

  const findSchedules = (selectedDate, scheduleData) => {
    const selectedSchedule = scheduleData.filter(schedule =>
      dayjs(schedule.startDate).isSame(selectedDate, "day")
    );

    const futureSchedules = scheduleData.filter(schedule =>
      dayjs(schedule.startDate).isAfter(selectedDate)
    );

    const nextSchedule = futureSchedules
      .filter(
        future =>
          !selectedSchedule.some(
            selected => selected.startDate === future.startDate
          )
      )
      .sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate)))
      .slice(0, 3);

    return { selectedSchedule, nextSchedule };
  };

  /**
   * @param {import("@mui/x-date-pickers/PickersDay").PickersDayProps<dayjs.Dayjs> & { highlightedDays?: dayjs.Dayjs[] }} props
   */
  const ServerDay = props => {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !outsideCurrentMonth &&
      highlightedDays.some(highlightedDay => highlightedDay.isSame(day, "day"));

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={isSelected ? <MenuBookIcon /> : undefined}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const days = sampleScheduleData.map(item => dayjs(item.startDate));
        setHighlightedDays(days);

        const { selectedSchedule, nextSchedule } = findSchedules(
          selectedDate,
          sampleScheduleData
        );
        setSelectedSchedule(selectedSchedule);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sampleScheduleData, selectedDate]);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const ScheduleModal = ({ open, handleClose, schedule }) => {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            textAlign="center"
            variant="h5"
            component="h2"
            style={{ color: "#f47400", fontWeight: "600" }}
          >
            THÔNG TIN CHI TIẾT
          </Typography>
          <Grid container>
            <Grid xs={6}>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#f47400", fontWeight: "600" }}
              >
                Thời gian
              </Typography>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#f47400", fontWeight: "600" }}
              >
                Địa điểm
              </Typography>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#f47400", fontWeight: "600" }}
              >
                Lớp học
              </Typography>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#f47400", fontWeight: "600" }}
              >
                Giáo viên
              </Typography>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#f47400", fontWeight: "600" }}
              >
                Trợ giảng
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#555555", fontWeight: "400" }}
              >
                {dayjs(schedule.startDate).format("HH:mm")} -{" "}
                {dayjs(schedule.endDate).format("HH:mm")}{" "}
                {dayjs(schedule.startDate).format("DD/MM/YYYY")}
              </Typography>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#555555", fontWeight: "400" }}
              >
                {getRoomNameById(schedule.location)}
              </Typography>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#555555", fontWeight: "400" }}
              >
                {getClassNameById(schedule.sclass)}
              </Typography>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#555555", fontWeight: "400" }}
              >
                {getTeacherNameById(schedule.teacher)}
              </Typography>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#555555", fontWeight: "400" }}
              >
                {getAssistantNameById(schedule.assistant)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    );
  };

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedScheduleDetail, setSelectedScheduleDetail] = useState(null);

  const handleClick = item => {
    setSelectedScheduleDetail(item);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedScheduleDetail(null);
  };

  const [loader, setLoader] = useState(false);

  const [sclass, setSclass] = useState("");

  const [room, setRoom] = useState("");

  const [teacher, setTeacher] = useState("");

  const [assistant, setAssistant] = useState("");

  const [startTime, setStartTime] = useState(dayjs());

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

  const submitHandler = event => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      window.location.reload();
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

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex" }}>
              {currentRole == "Teacher" || currentRole == "Assistant" ? (
                <TitleBox>Danh sách lịch dạy</TitleBox>
              ) : currentRole == "Student" ? (
                <TitleBox>Danh sách lịch học</TitleBox>
              ) : (
                <TitleBox>Quản lý lịch học</TitleBox>
              )}
            </div>
            <Grid container spacing={0}>
              <Grid item md={12} xl={getresponse ? 12 : 8}>
                {currentRole == "Admin" ? (
                  <Grid container>
                    <Grid item xs={3} padding="2rem" paddingLeft="0">
                      <img
                        src={Schedule}
                        alt="classroom"
                        style={{ width: "100%", borderRadius: "15px" }}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Stack
                        sx={{
                          alignItems: "center",
                          fontSize: "2rem",
                          color: "#f47400",
                          mb: 2,
                        }}
                      >
                        Thêm mới Lịch học
                      </Stack>
                      <form onSubmit={submitHandler}>
                        <Grid container spacing={3}>
                          <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined" required>
                              <InputLabel id="sclass-select-label">
                                Lớp
                              </InputLabel>
                              <Select
                                labelId="sclass-select-label"
                                id="sclass-select"
                                value={sclass}
                                onChange={event =>
                                  setSclass(event.target.value)
                                }
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
                              <InputLabel id="room-select-label">
                                Địa điểm
                              </InputLabel>
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
                                onChange={event =>
                                  setTeacher(event.target.value)
                                }
                                label="Giáo viên"
                              >
                                {teachersList.map(teacher => (
                                  <MenuItem
                                    key={teacher._id}
                                    value={teacher._id}
                                  >
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
                                onChange={event =>
                                  setAssistant(event.target.value)
                                }
                                label="Trợ giảng"
                              >
                                {assistantsList.map(assistant => (
                                  <MenuItem
                                    key={assistant._id}
                                    value={assistant._id}
                                  >
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
                              <Grid item xs={6}>
                                <LightOrangeButton
                                  fullWidth
                                  size="large"
                                  type="submit"
                                  disabled={loader}
                                >
                                  {loader ? (
                                    <CircularProgress
                                      size={24}
                                      color="inherit"
                                    />
                                  ) : (
                                    "TẠO"
                                  )}
                                </LightOrangeButton>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </form>
                    </Grid>
                  </Grid>
                ) : null}
                <ScheduleList />
              </Grid>
              {!getresponse && (
                <Grid item xs={12} xl={4} paddingLeft={{ xl: "2rem" }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ color: "#f47400", fontWeight: "600" }}
                  >
                    {currentRole == "Teacher" || currentRole == "Assistant"
                      ? "Lịch dạy"
                      : "Lịch học"}
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      displayWeekNumber
                      value={selectedDate}
                      loading={isLoading}
                      renderLoading={() => <DayCalendarSkeleton />}
                      onChange={handleChange}
                      slots={{
                        day: props => (
                          <ServerDay
                            {...props}
                            highlightedDays={highlightedDays}
                          />
                        ),
                      }}
                      sx={{
                        width: "100%",
                        overflow: "unset !important",
                        "& .MuiDayCalendar-header": {
                          height: "5rem",
                          fontSize: "1rem",
                        },
                        "& .MuiTypography-root": {
                          width: "12.5%",
                          margin: "0",
                          fontSize: "1.5rem",
                        },
                        "& .MuiButtonBase-root": {
                          fontSize: "1.5rem",
                        },
                        "& .MuiButtonBase-root.Mui-selected": {
                          backgroundColor: "#f47400 !important",
                        },

                        "& .MuiBadge-root": {
                          width: "12.5%",
                          justifyContent: "center",
                        },
                        "& .MuiPickersSlideTransition-root": {
                          overflowX: "unset",
                        },
                        "& .MuiDayCalendar-weekContainer": {
                          height: "5rem",
                        },
                      }}
                    />
                  </LocalizationProvider>
                  <Grid container style={{ marginTop: "15rem" }}>
                    <Grid item xs={12}>
                      <Grid container>
                        <Typography
                          variant="h5"
                          gutterBottom
                          style={{
                            color: "#f47400",
                            fontWeight: "600",
                            fontSize: "1.5rem",
                            marginRight: "1rem",
                          }}
                        >
                          Đang chọn ngày:
                        </Typography>
                        <Typography
                          variant="h5"
                          gutterBottom
                          style={{
                            fontWeight: "400",
                            fontSize: "1.5rem",
                          }}
                        >
                          {selectedDate.format("DD/MM/YYYY")}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography
                            variant="h5"
                            gutterBottom
                            style={{
                              color: "#f47400",
                              fontWeight: "600",
                            }}
                          >
                            {currentRole == "Teacher" ||
                            currentRole == "Assistant"
                              ? "Lịch dạy trong ngày:"
                              : "Lịch học trong ngày:"}
                          </Typography>
                          {selectedSchedule.length > 0 ? (
                            <>
                              <Grid container spacing={1}>
                                {selectedSchedule.map((item, index) => (
                                  <Grid item xs={6} key={index}>
                                    <ScheduleItem
                                      onClick={() => handleClick(item)}
                                    >
                                      <p>
                                        {" "}
                                        {dayjs(item.startDate).format(
                                          "HH:mm"
                                        )}{" "}
                                        - {dayjs(item.endDate).format("HH:mm")}{" "}
                                        {dayjs(item.startDate).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </p>
                                      <p>{getRoomNameById(item.location)}</p>
                                    </ScheduleItem>
                                  </Grid>
                                ))}
                              </Grid>
                            </>
                          ) : (
                            <Grid xs={12}>
                              <Typography
                                variant="h5"
                                gutterBottom
                                style={{
                                  color: "#555555",
                                  fontWeight: "400",
                                }}
                              >
                                Không có lịch học cho ngày này.
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
            {selectedScheduleDetail && (
              <ScheduleModal
                open={modalOpen}
                handleClose={handleClose}
                schedule={selectedScheduleDetail}
              />
            )}
          </div>
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
      {showModal && (
        <Modal
          open={showModal}
          onClose={handleCancelDelete}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Xác nhận xóa
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              Bạn có chắc chắn muốn xóa?
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmDelete}
                  >
                    Xác nhận
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCancelDelete}
                  >
                    Hủy
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ShowSchedules;

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

const ScheduleItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  background-color: #252590;
  color: white;
  padding: 1rem;
  border-radius: 15px;
  width: fit-content;
  margin-bottom: 0.35em;
  cursor: pointer;

  &:hover {
    background-color: #030385;
  }
`;
