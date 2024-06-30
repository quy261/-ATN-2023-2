import { React, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Button,
  Modal,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import EditNoteIcon from "@mui/icons-material/EditNote";

import { getTeacherDetails } from "../../../redux/teacherRelated/teacherHandle";
import Popup from "../../../components/Popup";
import Ava from "../../../assets/teacher/giao-vien-02.png";
import { LightWhiteButton } from "../../../components/buttonStyles";
import { getAllRooms } from "../../../redux/roomRelated/roomHandle";
import { getAllAssistants } from "../../../redux/assistantRelated/assistantHandle";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { getSchedulesByTeacher } from "../../../redux/scheduleRelated/scheduleHandle";
import { getAllMoneys } from "../../../redux/moneyRelated/moneyHandle";

const TeacherDetails = () => {
  const params = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  dayjs.extend(isSameOrAfter);

  const { teacherDetails, loading, error, response } = useSelector(
    state => state.teacher
  );

  const { currentUser, currentRole } = useSelector(state => state.user);

  const adminID = currentUser._id;

  const teacherID = params.id;

  useEffect(() => {
    dispatch(getSchedulesByTeacher(teacherID));
    dispatch(getTeacherDetails(teacherID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllRooms(adminID));
    dispatch(getAllAssistants(adminID));
    dispatch(getAllMoneys(adminID));
  }, [dispatch, adminID, teacherID]);

  const { schedulesList } = useSelector(state => state.schedule);

  const { sclassesList } = useSelector(state => state.sclass);

  const { roomsList } = useSelector(state => state.room);

  const { assistantsList } = useSelector(state => state.assistant);

  const { moneysList } = useSelector(state => state.money);

  const getSclassNameById = id => {
    const sclass = sclassesList.find(sclass => sclass._id === id);
    return sclass ? `${sclass.sclassName}` : "Unknown";
  };

  const getRoomNameById = id => {
    const room = roomsList.find(room => room._id === id);
    return room ? `${room.name} - ${room.location}` : "Unknown";
  };

  const getAssistantNameById = id => {
    const assistant = assistantsList.find(assistant => assistant._id === id);
    return assistant ? `${assistant.name}` : "Unknown";
  };

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  const TeacherDetailsSection = () => {
    return (
      <>
        <MyGrid container>
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            {teacherDetails.avatar && (
              <img
                alt="avt"
                src={
                  teacherDetails.avatar == "null"
                    ? "../../avatar/user.png"
                    : `../../avatar/${teacherDetails.avatar.split("\\").pop()}`
                }
                style={{ width: "50%" }}
              />
            )}
            {/* <img src={Ava} alt="avt" style={{ width: "50%" }} /> */}
            {teacherDetails && (
              <p style={{ fontSize: "1.25rem", fontStyle: "italic" }}>
                {teacherDetails.sclassName + " " + teacherDetails.name}
              </p>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            display={"flex"}
            justifyContent={"space-between"}
            flexDirection={"column"}
          >
            <div>
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  color: "#f47400",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Tên giáo viên:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {teacherDetails && teacherDetails.name}
                </span>
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  color: "#f47400",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Học vị:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {teacherDetails && teacherDetails.sclassName}
                </span>
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  color: "#f47400",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Ngày sinh:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {teacherDetails &&
                    dayjs(teacherDetails.dob).format("DD/MM/YYYY")}
                </span>
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  color: "#f47400",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                SĐT:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {teacherDetails && teacherDetails.phone}
                </span>
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  color: "#f47400",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Email:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {teacherDetails && teacherDetails.email}
                </span>
              </Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              {currentRole == "Admin" ? (
                <LightWhiteButton
                  variant="contained"
                  onClick={() => navigate("/Admin/teacheredit/" + teacherID)}
                >
                  <EditNoteIcon style={{ marginRight: "0.5rem" }} />
                  Sửa thông tin
                </LightWhiteButton>
              ) : null}
            </div>
          </Grid>
        </MyGrid>
      </>
    );
  };

  const [wage, setWage] = useState({});

  useEffect(() => {
    if (schedulesList && moneysList) {
      const transformedData = schedulesList.map(item => ({
        startDate: dayjs(item.startTime).format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dayjs(item.endTime).format("YYYY-MM-DDTHH:mm:ss"),
        assistant: item.assistant,
        location: item.room,
        sclass: item.sclass,
      }));
      setSampleScheduleData(transformedData);
      const daysToHighlight = transformedData.map(schedule =>
        dayjs(schedule.startDate).startOf("day")
      );
      setHighlightedDays(daysToHighlight);
      setIsLoading(false);

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

      const newWage = {};

      Object.keys(monthScheduleCount).forEach(monthYear => {
        if (!newWage[monthYear]) {
          newWage[monthYear] = {
            count: monthScheduleCount[monthYear],
            paid: false,
          };
        }
      });

      moneysList.forEach(money => {
        const monthYear = money.month;
        if (newWage[monthYear] && money.name === teacherID) {
          newWage[monthYear].paid = true;
        }
      });

      setWage(newWage);
    }
  }, [schedulesList]);

  const initialValue = dayjs();

  const [isLoading, setIsLoading] = useState(true);

  const [highlightedDays, setHighlightedDays] = useState([]);

  const [selectedDate, setSelectedDate] = useState(initialValue);

  const [selectedSchedule, setSelectedSchedule] = useState([]);

  const [nextSchedule, setNextSchedule] = useState([]);

  const handleDateChange = newDate => {
    setSelectedDate(newDate);

    const { selectedSchedule, nextSchedule } = findSchedules(
      newDate,
      sampleScheduleData
    );
    setSelectedSchedule(selectedSchedule);
    setNextSchedule(nextSchedule);
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
        setNextSchedule(nextSchedule);
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
                {getSclassNameById(schedule.sclass)}
              </Typography>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#555555", fontWeight: "400" }}
              >
                {teacherDetails.name}
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
    console.log(item);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedScheduleDetail(null);
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex" }}>
              <BackButton onClick={() => navigate("/Admin/teachers")}>
                <ArrowBackIcon />
              </BackButton>
              <TitleBox>Chi tiết giáo viên</TitleBox>
            </div>
            <Grid container spacing={0}>
              <Grid item md={12} xl={response ? 12 : 6}>
                <TeacherDetailsSection />
                {currentRole == "Admin" || currentRole == "Accountant" ? (
                  <>
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{
                        color: "#f47400",
                        fontWeight: "600",
                        marginTop: "1rem",
                      }}
                    >
                      Lương
                    </Typography>
                    <Grid container>
                      {Object.keys(wage).map(monthYear => (
                        <Grid item xs={12} key={monthYear}>
                          <WageItem style={{ width: "100%" }}>
                            <p>
                              Tháng {monthYear}: {wage[monthYear].count} buổi
                            </p>
                            <p>
                              Lương: {wage[monthYear].count * 1000000}đ
                              {wage[monthYear].paid
                                ? " (Đã trả)"
                                : " (Chưa trả)"}
                            </p>
                          </WageItem>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                ) : null}
              </Grid>
              {!response && (
                <Grid item xs={12} xl={6} paddingLeft={{ xl: "2rem" }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ color: "#f47400", fontWeight: "600" }}
                  >
                    Lịch giảng dạy
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      displayWeekNumber
                      defaultValue={initialValue}
                      loading={isLoading}
                      renderLoading={() => <DayCalendarSkeleton />}
                      onChange={handleDateChange}
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
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography
                            variant="h5"
                            gutterBottom
                            style={{
                              color: "#f47400",
                              fontWeight: "600",
                            }}
                          >
                            Lịch dạy trong ngày:
                          </Typography>
                          {selectedSchedule.length > 0 ? (
                            <>
                              {selectedSchedule.map((item, index) => (
                                <Grid item xs={12} key={index}>
                                  <ScheduleItem
                                    onClick={() => handleClick(item)}
                                  >
                                    <p>
                                      {" "}
                                      {dayjs(item.startDate).format(
                                        "HH:mm"
                                      )} - {dayjs(item.endDate).format("HH:mm")}{" "}
                                      {dayjs(item.startDate).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </p>
                                    <p>{getRoomNameById(item.location)}</p>
                                  </ScheduleItem>
                                </Grid>
                              ))}
                            </>
                          ) : (
                            <Typography
                              variant="h5"
                              gutterBottom
                              style={{
                                color: "#555555",
                                fontWeight: "400",
                              }}
                            >
                              Không có lịch dạy cho ngày này.
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="h5"
                            gutterBottom
                            style={{
                              color: "#f47400",
                              fontWeight: "600",
                            }}
                          >
                            Lịch dạy tiếp theo:
                          </Typography>
                          {nextSchedule.length > 0 ? (
                            <>
                              {nextSchedule.map((item, index) => (
                                <Grid item xs={12} key={index}>
                                  <SubScheduleItem
                                    onClick={() => handleClick(item)}
                                  >
                                    <p>
                                      {" "}
                                      {dayjs(item.startDate).format(
                                        "HH:mm"
                                      )} - {dayjs(item.endDate).format("HH:mm")}{" "}
                                      {dayjs(item.startDate).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </p>
                                    <p>{getRoomNameById(item.location)}</p>
                                  </SubScheduleItem>
                                </Grid>
                              ))}
                            </>
                          ) : (
                            <Typography
                              variant="h5"
                              gutterBottom
                              style={{
                                color: "#555555",
                                fontWeight: "400",
                              }}
                            >
                              Chưa có lịch dạy tiếp theo.
                            </Typography>
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
    </>
  );
};

export default TeacherDetails;

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

const SubScheduleItem = styled(ScheduleItem)`
  background-color: #5b5bff;

  &:hover {
    background-color: #3e3ec8;
  }
`;

const MyGrid = styled(Grid)`
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
`;

const WageItem = styled(ScheduleItem)`
  font-size: 1.5rem;
`;
