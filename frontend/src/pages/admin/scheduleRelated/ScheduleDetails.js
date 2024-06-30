import { React, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
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
import EditNoteIcon from "@mui/icons-material/EditNote";

import { getAllAssistants } from "../../../redux/assistantRelated/assistantHandle";
import { LightWhiteButton } from "../../../components/buttonStyles";
import { getAllRooms } from "../../../redux/roomRelated/roomHandle";
import {
  getAllSclasses,
  getClassStudents,
} from "../../../redux/sclassRelated/sclassHandle";
import { getScheduleDetails } from "../../../redux/scheduleRelated/scheduleHandle";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { updateSchedule } from "../../../redux/userRelated/userHandle";

const ScheduleDetails = () => {
  const params = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  dayjs.extend(isSameOrAfter);

  const userState = useSelector(state => state.user);

  const { status, currentUser, currentRole, error } = userState;

  const userId = currentUser._id;

  const scheduleID = params.id;

  useEffect(() => {
    dispatch(getScheduleDetails(scheduleID));
    dispatch(getAllSclasses(userId, "Sclass"));
    dispatch(getAllRooms(userId));
    dispatch(getAllTeachers(userId));
    dispatch(getAllAssistants(userId));
  }, [dispatch, scheduleID]);

  const { scheduleDetails, loading, response } = useSelector(
    state => state.schedule
  );

  const totalAbsent = scheduleDetails.absences
    ? scheduleDetails.absences.filter(absence => absence.asked).length
    : 0;

  const [absentStudentNames, setAbsentStudentNames] = useState([]);

  const { sclassesList, sclassStudents } = useSelector(state => state.sclass);

  const [isAbsent, setIsAbsent] = useState(false);

  const [isPast, setIsPast] = useState(false);

  const isAbsentRequested = (absences, userId) => {
    if (!Array.isArray(absences)) {
      return false;
    }
    return absences.some(
      absence => absence.id === userId && absence.asked === "true"
    );
  };

  const isPastStartTime = startTime => {
    const currentTime = new Date();
    const startDateTime = new Date(startTime);
    return currentTime > startDateTime;
  };

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  const [loader, setLoader] = useState(false);

  const handleToggleAsk = () => {
    setLoader(true);
    const fields = {
      userId,
      asked: isAbsent,
      type: "asking",
    };
    dispatch(updateSchedule(scheduleDetails._id, fields));
  };

  useEffect(() => {
    if (status === "updated") {
      navigate(0);
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

  useEffect(() => {
    dispatch(getClassStudents(scheduleDetails.sclass));
    setIsAbsent(isAbsentRequested(scheduleDetails.absences, userId));
    setIsPast(isPastStartTime(scheduleDetails.startTime));
  }, [dispatch, scheduleDetails]);

  useEffect(() => {
    const names = [];
    if (scheduleDetails.absences) {
      scheduleDetails.absences.forEach(absence => {
        const absentStudent = sclassStudents.find(
          student => student._id === absence.id
        );
        if (absentStudent) {
          const status = absence.asked === "true" ? "(P)" : "(KP)";
          names.push(`${absentStudent.name} ${status}`);
        }
      });
    }
    setAbsentStudentNames(names);
  }, [sclassStudents]);

  const [localSclassesList, setLocalSclassesList] = useState([]);

  useEffect(() => {
    if (sclassesList.length > 0) {
      setLocalSclassesList(sclassesList);
    }
  }, [sclassesList]);

  const { roomsList } = useSelector(state => state.room);

  const { teachersList } = useSelector(state => state.teacher);

  const { assistantsList } = useSelector(state => state.assistant);

  const getClassNameById = id => {
    const sclass = localSclassesList.find(sclass => sclass._id === id);
    return sclass ? `${sclass.sclassName}` : "";
  };

  const getRoomNameById = id => {
    const room = roomsList.find(room => room._id === id);
    return room ? `${room.name} - ${room.location}` : "";
  };

  const getTeacherNameById = id => {
    const teacher = teachersList.find(teacher => teacher._id === id);
    return teacher ? `${teacher.name}` : "";
  };

  const getAssistantNameById = id => {
    const assistant = assistantsList.find(assistant => assistant._id === id);
    return assistant ? assistant.name : "";
  };

  if (error) {
    console.log(error);
  }

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

  const DetailsSection = () => {
    return (
      <>
        <MyGrid container>
          <Grid
            item
            xs={12}
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
                Lớp học:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {scheduleDetails && getClassNameById(scheduleDetails.sclass)}
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
                Địa điểm:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {scheduleDetails && getRoomNameById(scheduleDetails.room)}
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
                Giáo viên:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {scheduleDetails &&
                    getTeacherNameById(scheduleDetails.teacher)}
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
                Trợ giảng:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {scheduleDetails &&
                    getAssistantNameById(scheduleDetails.assistant)}
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
                Thời gian:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {scheduleDetails &&
                    formatTimes(
                      scheduleDetails.startTime,
                      scheduleDetails.endTime
                    )}
                </span>
              </Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              {currentRole == "Admin" ? (
                <LightWhiteButton
                  variant="contained"
                  onClick={() => navigate("/Admin/scheduleedit/" + scheduleID)}
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

  const AttendanceSection = () => {
    return (
      <>
        <MyGrid container>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              gutterBottom
              style={{
                color: "#f47400",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Sĩ số:{" "}
              <span style={{ color: "black", fontWeight: "400" }}>
                {sclassStudents
                  ? `${sclassStudents.length - totalAbsent} / ${
                      sclassStudents.length
                    }`
                  : "Loading..."}
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
              Vắng:{" "}
              <span style={{ color: "black", fontWeight: "400" }}>
                {totalAbsent} {absentStudentNames.join(" ")}
              </span>
            </Typography>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "end" }}
            >
              {currentRole == "Teacher" || currentRole == "Assistant" ? (
                <LightWhiteButton
                  variant="contained"
                  onClick={() =>
                    navigate("/Admin/scheduleeditattendance/" + scheduleID)
                  }
                >
                  <EditNoteIcon style={{ marginRight: "0.5rem" }} />
                  Điểm danh
                </LightWhiteButton>
              ) : currentRole == "Student" ? (
                !isPast && (
                  <LightWhiteButton
                    variant="contained"
                    onClick={handleToggleAsk}
                  >
                    <EditNoteIcon style={{ marginRight: "0.5rem" }} />
                    {isAbsent ? "Hủy xin nghỉ" : "Xin nghỉ học"}
                  </LightWhiteButton>
                )
              ) : null}
            </Grid>
          </Grid>
        </MyGrid>
      </>
    );
  };

  const ContentSection = () => {
    return (
      <>
        <MyGrid container>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              gutterBottom
              style={{
                color: "#f47400",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Nội dung buổi học:
              <p style={{ color: "black", fontWeight: "400" }}>
                {scheduleDetails.content}
              </p>
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
              Link học trực tuyến:
              <p style={{ color: "black", fontWeight: "400" }}>
                {scheduleDetails.linkZoom}
              </p>
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
              Link tài liệu liên quan:
              <p style={{ color: "black", fontWeight: "400" }}>
                {scheduleDetails.linkFile}
              </p>
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
            {currentRole == "Teacher" || currentRole == "Assistant" ? (
              <LightWhiteButton
                variant="contained"
                onClick={() =>
                  navigate("/Admin/scheduleeditcontent/" + scheduleID)
                }
              >
                <EditNoteIcon style={{ marginRight: "0.5rem" }} />
                Sửa thông tin
              </LightWhiteButton>
            ) : null}
          </Grid>
        </MyGrid>
      </>
    );
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex" }}>
              <BackButton onClick={() => navigate("/Admin/schedules")}>
                <ArrowBackIcon />
              </BackButton>
              <TitleBox>Chi tiết lịch học</TitleBox>
            </div>
            <Grid container spacing={2}>
              <Grid
                item
                md={12}
                xl={response ? 12 : 4}
                display="flex"
                flexDirection="column"
                gap="1rem"
              >
                <DetailsSection />
                <AttendanceSection />
              </Grid>
              <Grid item md={12} xl={response ? 12 : 8}>
                <ContentSection />
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </>
  );
};

export default ScheduleDetails;

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
