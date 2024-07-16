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

import { getScheduleDetails } from "../../../redux/scheduleRelated/scheduleHandle";
import { LightOrangeButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import { updateSchedule } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";

const EditContentSchedule = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  dayjs.extend(isSameOrAfter);

  const userState = useSelector(state => state.user);

  const { status, currentUser, response, error } = userState;

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getScheduleDetails(id));
  }, [adminID, dispatch]);

  const { scheduleDetails, loading } = useSelector(state => state.schedule);

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  dayjs.extend(utc);

  dayjs.extend(timezone);

  const [loader, setLoader] = useState(false);

  const [content, setContent] = useState("");

  const [linkZoom, setLinkZoom] = useState("");

  const [linkFile, setLinkFile] = useState("");

  const fields = {
    content,
    linkZoom,
    linkFile,
    type: "content"
  };

  const address = "Schedule";

  useEffect(() => {
    if (scheduleDetails && scheduleDetails._id === id) {
      setContent(scheduleDetails.content);
      setLinkZoom(scheduleDetails.linkZoom);
      setLinkFile(scheduleDetails.linkFile);
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
            <Grid
              container
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item xs={12} md={6}>
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
                    Chỉnh sửa nội dung lịch học
                  </Stack>
                  <form onSubmit={submitHandler}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          placeholder="Nội dung"
                          variant="outlined"
                          value={content}
                          onChange={event => {
                            setContent(event.target.value);
                          }}
                          multiline
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          placeholder="Link học trực tuyến"
                          variant="outlined"
                          value={linkZoom}
                          onChange={event => {
                            setLinkZoom(event.target.value);
                          }}
                          multiline
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          placeholder="Link tài liệu"
                          variant="outlined"
                          value={linkFile}
                          onChange={event => {
                            setLinkFile(event.target.value);
                          }}
                          multiline
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
              </Grid>
            </Grid>
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

export default EditContentSchedule;

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
