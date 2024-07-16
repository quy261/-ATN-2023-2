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
import {
  updateMoneyDef,
  updateSchedule,
} from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getMoneyDefDetails } from "../../../redux/moneyDefRelated/moneyDefHandle";

const EditMoneyDef = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  dayjs.extend(isSameOrAfter);

  const userState = useSelector(state => state.user);

  const { status, currentUser, response, error } = userState;

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getMoneyDefDetails(id));
  }, [adminID, dispatch]);

  const { moneyDefDetails, loading } = useSelector(state => state.moneyDef);

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  dayjs.extend(utc);

  dayjs.extend(timezone);

  const [loader, setLoader] = useState(false);

  const [amount, setAmount] = useState("");

  const [type, setType] = useState("");

  const fields = {
    amount,
  };

  useEffect(() => {
    if (moneyDefDetails && moneyDefDetails._id === id) {
      setAmount(moneyDefDetails.amount);
      setType(moneyDefDetails.type);
    }
  }, [moneyDefDetails, id]);

  const submitHandler = event => {
    event.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setMessage("Please enter a valid amount greater than 0.");
      setShowPopup(true);
      return;
    }
    setLoader(true);
    dispatch(updateMoneyDef(id, fields));
  };

  useEffect(() => {
    if (status === "updated") {
      navigate("/Admin/moneys/");
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

  const handleAmountChange = event => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

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
                    Chỉnh sửa khoản thu chi
                  </Stack>
                  <form onSubmit={submitHandler}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <InputLabel id="sclass-select-label">
                          Nguồn thu chi
                        </InputLabel>
                        <TextField
                          fullWidth
                          placeholder="Số tiền"
                          variant="outlined"
                          value={type}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputLabel id="sclass-select-label">
                          Khoản tiền (đ)
                        </InputLabel>
                        <TextField
                          fullWidth
                          placeholder="Số tiền"
                          variant="outlined"
                          value={amount}
                          onChange={handleAmountChange}
                          error={!amount || parseFloat(amount) <= 0}
                          helperText={
                            !amount || parseFloat(amount) <= 0
                              ? "Please enter a valid amount greater than 0."
                              : ""
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container justifyContent={"center"}>
                          <Grid item xs={12}>
                            <LightOrangeButton
                              fullWidth
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

export default EditMoneyDef;

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
