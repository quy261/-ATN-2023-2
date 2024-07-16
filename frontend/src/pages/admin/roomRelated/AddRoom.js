import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  LightWhiteButton,
  LightOrangeButton,
} from "../../../components/buttonStyles";

import Classroom from "../../../assets/classroom.webp";
import { addStuff } from "../../../redux/userRelated/userHandle";

import styled from "styled-components";

const AddRoom = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userState = useSelector(state => state.user);

  const { status, currentUser, response, error } = userState;

  const [name, setName] = useState("");

  const [capacity, setCapacity] = useState("");

  const [location, setLocation] = useState("");

  const [board, setBoard] = useState("");

  const [laptop, setLaptop] = useState("");

  const [project, setProject] = useState("");

  const [seat, setSeat] = useState("");

  const adminID = currentUser._id;

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  const [loader, setLoader] = useState(false);

  const fields = {
    name,
    capacity,
    location,
    resources: {
      board: board,
      laptop: laptop,
      project: project,
      seat: seat
    },
    availability: "true",
    schedule: [],
    adminID,
  };

  const address = "Room";

  const submitHandler = event => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate(-1);
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

  const locationList = [
    {
      id: "CS1",
      name: "CS1",
    },
    {
      id: "CS2",
      name: "CS2",
    },
    {
      id: "CS3",
      name: "CS3",
    },
  ];

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
              Thêm mới Phòng học
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
                    label="Tên phòng"
                    variant="outlined"
                    value={name}
                    onChange={event => {
                      setName(event.target.value);
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Sức chứa"
                    variant="outlined"
                    value={capacity}
                    onChange={event => {
                      const value = event.target.value;
                      if (!isNaN(value)) {
                        setCapacity(value);
                      }
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="sclass-select-label">Địa điểm</InputLabel>
                    <Select
                      labelId="sclass-select-label"
                      id="sclass-select"
                      value={location}
                      onChange={event => setLocation(event.target.value)}
                      label="Địa điểm"
                    >
                      {locationList.map(loc => (
                        <MenuItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" color="#888888" fontWeight="600">
                    Cơ sở vật chất
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Bảng"
                    variant="outlined"
                    value={board}
                    onChange={event => {
                      const value = event.target.value;
                      if (!isNaN(value)) {
                        setBoard(value);
                      }
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Máy tính"
                    variant="outlined"
                    value={laptop}
                    onChange={event => {
                      const value = event.target.value;
                      if (!isNaN(value)) {
                        setLaptop(value);
                      }
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Máy chiếu"
                    variant="outlined"
                    value={project}
                    onChange={event => {
                      const value = event.target.value;
                      if (!isNaN(value)) {
                        setProject(value);
                      }
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Bộ bàn ghế"
                    variant="outlined"
                    value={seat}
                    onChange={event => {
                      const value = event.target.value;
                      if (!isNaN(value)) {
                        setSeat(value);
                      }
                    }}
                    required
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

export default AddRoom;

const StyledContainer = styled(Box)`
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  max-width: 700px;
  padding: 2rem 3rem;
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
