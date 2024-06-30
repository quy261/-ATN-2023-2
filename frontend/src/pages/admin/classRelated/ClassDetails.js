import { React, useEffect, useState } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import EditNoteIcon from "@mui/icons-material/EditNote";

import {
  LightWhiteButton,
  LightOrangeButton,
} from "../../../components/buttonStyles";
import {
  getClassDetails,
  getClassStudents,
  getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import { getSchedulesByClass } from "../../../redux/scheduleRelated/scheduleHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, OrangeButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import Popup from "../../../components/Popup";
import NoData from "../../../assets/no-data.webp";
import { getAllRooms } from "../../../redux/roomRelated/roomHandle";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import { getAllAssistants } from "../../../redux/assistantRelated/assistantHandle";

const ClassDetails = () => {
  const params = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  dayjs.extend(isSameOrAfter);

  const { sclassStudents, sclassDetails, loading, error, getresponse } =
    useSelector(state => state.sclass);

  const classID = params.id;

  const { currentUser, currentRole } = useSelector(state => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getClassDetails(classID, "Sclass"));
    dispatch(getClassStudents(classID));
    dispatch(getSchedulesByClass(classID));
    dispatch(getAllRooms(adminID));
    dispatch(getAllTeachers(adminID));
    dispatch(getAllAssistants(adminID));
  }, [dispatch, classID]);

  const { schedulesList } = useSelector(state => state.schedule);

  const { roomsList } = useSelector(state => state.room);

  const { teachersList } = useSelector(state => state.teacher);

  const { assistantsList } = useSelector(state => state.assistant);

  const getRoomNameById = id => {
    const room = roomsList.find(room => room._id === id);
    return room ? `${room.name} - ${room.location}` : "Unknown";
  };

  const getTeacherNameById = id => {
    const teacher = teachersList.find(teacher => teacher._id === id);
    return teacher ? `${teacher.name}` : "Unknown";
  };

  const getAssistantNameById = id => {
    const room = assistantsList.find(room => room._id === id);
    return room ? `${room.name}` : "Unknown";
  };

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getClassStudents(classID));
    });
  };

  const studentColumns = [
    { id: "stt", label: "STT", minWidth: 50 },
    { id: "name", label: "HỌ TÊN", minWidth: 170 },
    { id: "dob", label: "NGÀY SINH", minWidth: 100 },
  ];

  const getLastName = fullName => {
    const nameParts = fullName.split(" ");
    return nameParts[nameParts.length - 1];
  };

  const sortedSclassStudents = [...sclassStudents].sort((a, b) => {
    const lastNameA = getLastName(a.name).toLowerCase();
    const lastNameB = getLastName(b.name).toLowerCase();
    return lastNameA.localeCompare(lastNameB);
  });

  const studentRows = sortedSclassStudents.map((student, index) => {
    return {
      stt: index + 1,
      name: student.name,
      dob: dayjs(student.dob).format("DD/MM/YYYY"),
      id: student._id,
    };
  });

  const [showModal, setShowModal] = useState(false);

  const [deleteID, setDeleteID] = useState(null);

  const [address, setAddress] = useState("");

  const handleDeleteClick = (id, addr) => {
    setDeleteID(id);
    setAddress(addr);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    deleteHandler(deleteID, address);
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
        {currentRole == "Admin" || currentRole == "Accountant" ? (
          <OrangeButton
            variant="contained"
            onClick={() => navigate("/Admin/student/" + row.id)}
          >
            <EditNoteIcon mr={1} />
            CHI TIẾT
          </OrangeButton>
        ) : currentRole != "Student" ? (
          <OrangeButton
            variant="contained"
            onClick={() => navigate("/Admin/classaddcomment/" + row.id)}
          >
            <EditNoteIcon mr={1} />
            NHẬN XÉT
          </OrangeButton>
        ) : null}

        {currentRole == "Admin" ? (
          <BlueButton
            variant="contained"
            onClick={() => handleDeleteClick(row.id, "Student")}
          >
            <DeleteIcon mr={1} />
            XÓA
          </BlueButton>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const ClassStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <Grid container>
            <Grid
              xs={12}
              container
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Grid item xs={12} md={6} lg={3}>
                <img src={NoData} alt="no-data" style={{ width: "100%" }} />
              </Grid>
            </Grid>
            <Grid
              xs={12}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              fontSize={"2rem"}
              marginBottom={"1.5rem"}
            >
              Lớp chưa có học sinh
            </Grid>
            <Grid
              xs={12}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {currentRole == "Admin" ? (
                <LightOrangeButton
                  variant="contained"
                  onClick={() => navigate("/Admin/class/studentadd/" + classID)}
                >
                  <AddIcon style={{ marginRight: "0.5rem" }} />
                  Thêm Học Sinh
                </LightOrangeButton>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        ) : (
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
                Danh sách học sinh
              </Typography>
              {currentRole == "Admin" ? (
                <div>
                  <LightWhiteButton
                    variant="contained"
                    onClick={() => navigate("/Admin/classedit/" + classID)}
                    style={{
                      marginBottom: "1rem",
                      marginRight: "1rem",
                    }}
                  >
                    <EditNoteIcon style={{ marginRight: "0.5rem" }} />
                    Chỉnh Sửa Lớp
                  </LightWhiteButton>
                  <LightOrangeButton
                    variant="contained"
                    onClick={() =>
                      navigate("/Admin/class/studentadd/" + classID)
                    }
                    style={{
                      marginBottom: "1rem",
                    }}
                  >
                    <AddIcon style={{ marginRight: "0.5rem" }} />
                    Thêm Học Sinh
                  </LightOrangeButton>
                </div>
              ) : null}
            </div>
            <TableTemplate
              buttonHaver={StudentsButtonHaver}
              columns={studentColumns}
              rows={studentRows}
            />
          </>
        )}
      </>
    );
  };

  const ClassDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <>
        <Typography
          variant="h5"
          gutterBottom
          style={{ color: "#f47400", fontWeight: "600", marginBottom: "1rem" }}
        >
          Tên lớp:{" "}
          <span style={{ color: "black", fontWeight: "400" }}>
            {sclassDetails && sclassDetails.sclassName}
          </span>
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          style={{ color: "#f47400", fontWeight: "600", marginBottom: "1rem" }}
        >
          Số lượng học sinh:{" "}
          <span style={{ color: "black", fontWeight: "400" }}>
            {numberOfStudents}
          </span>
        </Typography>
      </>
    );
  };

  useEffect(() => {
    if (schedulesList) {
      const transformedData = schedulesList.map(item => ({
        startDate: dayjs(item.startTime).format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dayjs(item.endTime).format("YYYY-MM-DDTHH:mm:ss"),
        teacher: item.teacher,
        assistant: item.assistant,
        location: item.room,
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
                {sclassDetails.sclassName}
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

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex" }}>
              <BackButton onClick={() => navigate("/Admin/classes")}>
                <ArrowBackIcon />
              </BackButton>
              <TitleBox>
                Chi tiết lớp học {sclassDetails && sclassDetails.sclassName}
              </TitleBox>
            </div>
            <Grid container spacing={0}>
              <Grid item md={12} xl={getresponse ? 12 : 6}>
                <ClassDetailsSection />
                <ClassStudentsSection />
              </Grid>
              {!getresponse && (
                <Grid item xs={12} xl={6} paddingLeft={{ xl: "2rem" }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ color: "#f47400", fontWeight: "600" }}
                  >
                    Lịch học
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
                            Lịch học trong ngày:
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
                              Không có lịch học cho ngày này.
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
                            Lịch học tiếp theo:
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
                              Chưa có lịch học tiếp theo.
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
            {/* <ClassSubjectsSection /> */}
            {/* <ClassTeachersSection /> */}
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

export default ClassDetails;

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
