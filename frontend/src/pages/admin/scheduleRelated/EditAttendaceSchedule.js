import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import {
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getScheduleDetails } from "../../../redux/scheduleRelated/scheduleHandle";
import { LightOrangeButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import { updateSchedule } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getClassStudents } from "../../../redux/sclassRelated/sclassHandle";

const EditAttendanceSchedule = () => {
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

  useEffect(() => {
    dispatch(getClassStudents(scheduleDetails.sclass));
  }, [scheduleDetails, dispatch]);

  const { sclassStudents } = useSelector(state => state.sclass);

  const [checkboxState, setCheckboxState] = useState({});

  useEffect(() => {
    const initialState = {};
    sclassStudents.forEach(item => {
      const absence = scheduleDetails.absences.find(
        absence => absence.id === item._id
      );
      initialState[item._id] = {
        checked: !absence,
        disabled: absence ? absence.asked === "true" : false,
      };
    });
    setCheckboxState(initialState);
  }, [sclassStudents]);

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  dayjs.extend(utc);

  dayjs.extend(timezone);

  const [loader, setLoader] = useState(false);

  const handleCheckboxChange = itemId => {
    setCheckboxState(prevState => ({
      ...prevState,
      [itemId]: {
        ...prevState[itemId],
        checked: !prevState[itemId]?.checked || false,
      },
    }));
  };

  // const fields = {
  //   checkboxState,
  // };

  const submitHandler = event => {
    event.preventDefault();
    setLoader(true);
    const absences = [];
    Object.entries(checkboxState).forEach(([id, { checked, disabled }]) => {
      if (!checked && !disabled) {
        absences.push({ id, asked: "false" });
      } else if (!checked && disabled) {
        absences.push({ id, asked: "true" });
      }
    });
    const fields = {
      absences,
      type: "absence",
    };
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
              <Grid item xs={12} md={4}>
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
                    Điểm danh buổi học
                  </Stack>
                  <form onSubmit={submitHandler}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormGroup>
                          {sclassStudents &&
                            sclassStudents.map((item, index) => {
                              const checkboxProps =
                                checkboxState[item._id] || {};
                              return (
                                <FormControlLabel
                                  key={index}
                                  control={
                                    <Checkbox
                                      checked={checkboxProps.checked}
                                      disabled={checkboxProps.disabled}
                                      onChange={() =>
                                        handleCheckboxChange(item._id)
                                      }
                                    />
                                  }
                                  label={item.name}
                                />
                              );
                            })}
                        </FormGroup>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container justifyContent={"center"}>
                          <Grid item xs={12}>
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

export default EditAttendanceSchedule;

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
