import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isToday from "dayjs/plugin/isToday";

import { Modal, Box, Typography, Grid, Paper } from "@mui/material";

import Students from "../../assets/img1.png";
import Rooms from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import Assistants from "../../assets/img5.png";
import Admins from "../../assets/img6.webp";
import Classes from "../../assets/img7.png";

import { getAllSclasses } from "../../redux/sclassRelated/sclassHandle";
import { getAllStudents } from "../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../redux/teacherRelated/teacherHandle";
import { getAllAssistants } from "../../redux/assistantRelated/assistantHandle";
import { getAllRooms } from "../../redux/roomRelated/roomHandle";
import { getAllAdmins } from "../../redux/accountRelated/accountHandle";
import { getAllSchedules } from "../../redux/scheduleRelated/scheduleHandle";
import { getAllMoneys } from "../../redux/moneyRelated/moneyHandle";

const AdminHomePage = () => {
  dayjs.extend(localizedFormat);

  dayjs.extend(utc);

  dayjs.extend(timezone);

  dayjs.extend(isToday);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { studentsList } = useSelector(state => state.student);

  const { sclassesList } = useSelector(state => state.sclass);

  const { teachersList } = useSelector(state => state.teacher);

  const { assistantsList } = useSelector(state => state.assistant);

  const { moneysList } = useSelector(state => state.money);

  const { roomsList } = useSelector(state => state.room);

  const { adminsList } = useSelector(state => state.admin);

  const { schedulesList } = useSelector(state => state.schedule);

  const { currentUser, currentRole } = useSelector(state => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
    dispatch(getAllRooms(adminID));
    dispatch(getAllAssistants(adminID));
    dispatch(getAllAdmins(adminID));
    dispatch(getAllSchedules(adminID, "schedule"));
    dispatch(getAllMoneys(adminID));
  }, [adminID, dispatch]);

  const [tuition, setTuition] = useState(0);

  const [wage, setWage] = useState(0);

  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const tuitionTotal = moneysList
      .filter(item => item.type === "tuition" && !item.image)
      .reduce((total, item) => total + parseInt(item.amount), 0);
    setTuition(tuitionTotal);
    const wageTotal = moneysList
      .filter(item => item.type === "wage")
      .reduce((total, item) => total + parseInt(item.amount), 0);
    setWage(wageTotal);
    const revenueTotal = tuitionTotal - wageTotal;
    setRevenue(revenueTotal);
  }, [moneysList]);

  const numberOfStudents = studentsList && studentsList.length;

  const numberOfClasses = sclassesList && sclassesList.length;

  const numberOfTeachers = teachersList && teachersList.length;

  const numberOfAssistants = assistantsList && assistantsList.length;

  const numberOfRooms = roomsList && roomsList.length;

  const numberOfAdmins = adminsList && adminsList.length;

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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#555555", fontWeight: "400" }}
              >
                {dayjs(schedule.startTime).format("HH:mm")} -{" "}
                {dayjs(schedule.endTime).format("HH:mm")}{" "}
                {dayjs(schedule.startTime).format("DD/MM/YYYY")}
              </Typography>
              <Typography
                variant="h6"
                marginTop="1rem"
                style={{ color: "#555555", fontWeight: "400" }}
              >
                {getRoomNameById(schedule.room)}
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

  const handleStudentClick = id => {
    navigate(`/Admin/student/${id}`);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedScheduleDetail(null);
  };

  const selectedSchedule = schedulesList.filter(item =>
    dayjs(item.startTime).isToday()
  );

  const getUnexcusedAbsences = schedulesList => {
    const absencesMap = {};
    // lọc ra các lịch học trong tháng
    let schedulesListMonth = schedulesList.filter(schedule => {
      const now = new Date();
      const timeSchedule = dayjs(schedule.startTime);
      return timeSchedule.month() === now.getMonth() && timeSchedule.year () === now.getFullYear();
    });

    // lọc ra các buổi học có học sinh vắng mặt không phép
    schedulesListMonth.forEach(schedule => {
      schedule.absences.forEach(absence => {
        if (absence.asked === "false") {
          if (!absencesMap[absence.id]) {
            absencesMap[absence.id] = 0;
          }
          absencesMap[absence.id]++;
        }
      });
    });
    return absencesMap;
  };

  const filterStudents = absencesMap => {
    return Object.keys(absencesMap).filter(
      studentId => absencesMap[studentId] > 0
    );
  };

  const absencesMap = getUnexcusedAbsences(schedulesList);

  const getStudents = absencesMap => {
    return Object.keys(absencesMap)
      .filter(studentId => absencesMap[studentId] > 0) // hiển thị những học sinh nghỉ học nhiều
      .map(studentId => ({
        id: studentId,
        absences: absencesMap[studentId],
      }));
  };

  const selectedStudentList = getStudents(absencesMap);

  const getSclassNameById = id => {
    const sclass = sclassesList.find(sclass => sclass._id === id);
    return sclass ? `${sclass.sclassName}` : "Unknown";
  };

  const getSclassNameByStudentId = studentId => {
    const student = studentsList.find(student => student._id === studentId);
    if (student) {
      const sclass = sclassesList.find(
        sclass => sclass._id === student.sclassName
      );
      return sclass ? `${sclass.sclassName}` : "Unknown";
    }
    return "Unknown";
  };

  const getRoomNameById = id => {
    const room = roomsList.find(room => room._id === id);
    return room ? `${room.name} - ${room.location}` : "Unknown";
  };

  const getTeacherNameById = id => {
    const teacher = teachersList.find(teacher => teacher._id === id);
    return teacher ? `${teacher.name}` : "Unknown";
  };

  const getAssistantNameById = id => {
    const assistant = assistantsList.find(assistant => assistant._id === id);
    return assistant ? `${assistant.name}` : "Unknown";
  };

  const getStudentNameById = id => {
    const student = studentsList.find(student => student._id === id);
    return student ? `${student.name}` : "Unknown";
  };

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <TitleComponent>THỐNG KÊ TRUNG TÂM LUYỆN THI HC EDUCATION</TitleComponent>
        <Grid container spacing={3} mb={2}>
          <Grid item xs={12} md={2} lg={2}>
            <StyledPaper
              onClick={() => {
                navigate("/Admin/classes");
              }}
            >
              <img src={Classes} alt="Classes" width="64px" />
              <Title>Số lớp học</Title>
              <Data start={0} end={numberOfClasses} duration={1} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <StyledPaper
              onClick={() => {
                navigate("/Admin/teachers");
              }}
            >
              <img src={Teachers} alt="Teachers" />
              <Title>Số giáo viên</Title>
              <Data start={0} end={numberOfTeachers} duration={1} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <StyledPaper
              onClick={() => {
                navigate("/Admin/assistants");
              }}
            >
              <img src={Assistants} alt="Assistants" width="64px" />
              <Title>Số trợ giảng</Title>
              <Data start={0} end={numberOfAssistants} duration={1} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <StyledPaper
              onClick={() => {
                navigate("/Admin/students");
              }}
            >
              <img src={Students} alt="Students" />
              <Title>Số học sinh</Title>
              <Data start={0} end={numberOfStudents} duration={1} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <StyledPaper
              onClick={() => {
                navigate("/Admin/rooms");
              }}
            >
              <img src={Rooms} alt="Rooms" />
              <Title>Số phòng học</Title>
              <Data start={0} end={numberOfRooms} duration={1} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <StyledPaper
              onClick={() => {
                navigate("/Admin/accounts");
              }}
            >
              <img src={Admins} alt="Admins" width="64px" />
              <Title>Số tài khoản quản trị</Title>
              <Data start={0} end={numberOfAdmins} duration={1} />
            </StyledPaper>
          </Grid>
        </Grid>
        <TitleComponent>LỊCH HỌC TRONG NGÀY</TitleComponent>
        {!selectedSchedule && (
          <Typography
            variant="h5"
            style={{
              color: "#555555",
              fontWeight: "400",
            }}
          >
            Không có lịch học trong ngày
          </Typography>
        )}
        <Grid container spacing={3}>
          {selectedSchedule.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <ScheduleItem onClick={() => handleClick(item)}>
                <p>
                  Thời gian:{" "}
                  {dayjs(item.startTime).tz("Asia/Bangkok").format("HH:mm")} -{" "}
                  {dayjs(item.endTime).tz("Asia/Bangkok").format("HH:mm")}{" "}
                  {dayjs(item.startTime)
                    .tz("Asia/Bangkok")
                    .format("DD/MM/YYYY")}
                </p>
                <p>Giáo viên: {getTeacherNameById(item.teacher)}</p>
                <p>Trợ giảng: {getAssistantNameById(item.assistant)}</p>
                <p>Địa điểm: {getRoomNameById(item.room)}</p>
              </ScheduleItem>
            </Grid>
          ))}
        </Grid>
        {currentRole == "Admin" && (
          <>
            <TitleComponent>{`HỌC SINH NGHỈ KHÔNG PHÉP TRONG THÁNG ${new Date().getMonth() + 1}/${new Date().getFullYear()}`}</TitleComponent>
            {selectedStudentList.length == 0 && (
              <Typography
                variant="h5"
                style={{
                  color: "#555555",
                  fontWeight: "400",
                }}
              >
                Danh sách trống
              </Typography>
            )}
            <Grid container spacing={3}>
              {selectedStudentList.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <ScheduleItem onClick={() => handleStudentClick(item.id)}>
                    <p>Họ tên: {getStudentNameById(item.id)}</p>
                    <p>Lớp: {getSclassNameByStudentId(item.id)}</p>
                    <p>Số lần nghỉ không phép: {item.absences}</p>
                  </ScheduleItem>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        {selectedScheduleDetail && (
          <ScheduleModal
            open={modalOpen}
            handleClose={handleClose}
            schedule={selectedScheduleDetail}
          />
        )}
      </div>
    </>
  );
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  border-radius: 15px !important;
  cursor: pointer;

  &:hover {
    background-color: #efefef;
  }
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + 0.6vw);
  color: green;
`;

const TitleComponent = styled.div`
  font-family: system-ui !important;
  font-size: calc(1.3rem + 0.6vw);
  font-weight: 500;
  color: #f47400;
  margin-bottom: 1rem;
`;

const ScheduleItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #252590;
  color: white;
  padding: 1rem;
  border-radius: 15px;
  margin-bottom: 0.35em;
  cursor: pointer;

  p {
    font-size: 1.25rem !important;
  }

  &:hover {
    background-color: #030385;
  }
`;

export default AdminHomePage;
