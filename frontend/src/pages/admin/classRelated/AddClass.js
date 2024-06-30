import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import {
  LightWhiteButton,
  LightOrangeButton,
} from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import Classroom from "../../../assets/classroom.png";
import styled from "styled-components";

const AddClass = () => {
  const [sclassName, setSclassName] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userState = useSelector(state => state.user);

  const { status, currentUser, response, error, tempDetails } = userState;

  const adminID = currentUser._id;

  const address = "Sclass";

  const [loader, setLoader] = useState(false);

  const [message, setMessage] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const fields = {
    sclassName,
    adminID,
  };

  const submitHandler = event => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added" && tempDetails) {
      navigate("/Admin/classes/class/" + tempDetails._id);
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
      <BackButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </BackButton>
      <div
        style={{
          height: "calc(100% - 64px)",
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
              Thêm mới Lớp học
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
              <Stack spacing={3}>
                <TextField
                  label="Tên lớp học"
                  variant="outlined"
                  value={sclassName}
                  onChange={event => {
                    setSclassName(event.target.value);
                  }}
                  required
                />
                <LightOrangeButton
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  variant="contained"
                  type="submit"
                  disabled={loader}
                >
                  {loader ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "TẠO"
                  )}
                </LightOrangeButton>
                <LightWhiteButton onClick={() => navigate(-1)}>
                  Quay lại
                </LightWhiteButton>
              </Stack>
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

export default AddClass;

const StyledContainer = styled(Box)`
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  max-width: 550px;
  padding: 50px 3rem 50px;
  margin-top: 1rem;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const BackButton = styled(Button)`
  position: 'absolute';
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
