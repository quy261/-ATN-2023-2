import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import styled from "styled-components";

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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";

import Popup from "../../../components/Popup";
import {
  LightWhiteButton,
  LightOrangeButton,
} from "../../../components/buttonStyles";
import { addStuff, registerUser } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import Classroom from "../../../assets/student.jpg";
import {
  getAllStudents,
  getStudentDetails,
} from "../../../redux/studentRelated/studentHandle";

const AddComment = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const params = useParams();

  const userState = useSelector(state => state.user);

  const { status, currentUser, response, error, tempDetails } = userState;

  const { studentsList } = useSelector(state => state.student);

  const getStudentNameById = id => {
    const student = studentsList.find(student => student._id === id);
    return student ? `${student.name}` : "Unknown";
  };

  const [name, setName] = useState("");

  const [comment, setComment] = useState("");

  const adminID = currentUser._id;

  useEffect(() => {
    setName(params.id);
  }, [params.id]);

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(getAllStudents(adminID));
  }, [adminID, dispatch]);

  const fields = {
    name,
    userId: currentUser._id,
    comment,
  };

  const address = "Comment";

  const submitHandler = event => {
    event.preventDefault();
    setLoader(true);
    console.log(fields);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added" && tempDetails) {
      navigate("/Admin/classes");
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
    }
  }, [status, navigate, error, response, dispatch, tempDetails]);

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
                mb: 2,
              }}
            >
              Thêm mới Nhận xét
            </Stack>
            <Stack
              sx={{
                alignItems: "center",
                mb: 3,
              }}
            >
              <img src={Classroom} alt="classroom" style={{ width: "80%" }} />
            </Stack>
            <form onSubmit={submitHandler}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên học sinh"
                    variant="outlined"
                    value={getStudentNameById(name)}
                    onChange={event => {
                      setName(event.target.value);
                    }}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    placeholder="Nhận xét (Enter để xuống dòng)"
                    variant="outlined"
                    value={comment}
                    onChange={event => {
                      setComment(event.target.value);
                    }}
                    required
                    multiline
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
                  "TẠO"
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

export default AddComment;

const StyledContainer = styled(Box)`
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  max-width: 700px;
  padding: 50px 3rem 50px;
  margin-top: 1rem;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  border-radius: 4px;
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
