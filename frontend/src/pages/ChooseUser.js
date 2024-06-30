import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { AccountCircle, School, Group } from "@mui/icons-material";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Teacher from "../assets/teacher/teacher.jpg";
import Student from "../assets/teacher/student.jpg";
import Admin from "../assets/teacher/admin.jpg";
import Popup from "../components/Popup";

const ChooseUser = () => {
  const navigate = useNavigate();

  const { status, currentUser, currentRole } = useSelector(state => state.user);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = user => {
    if (user === "Admin") {
      navigate("/Adminlogin");
    } else if (user === "Student") {
      navigate("/Studentlogin");
    } else if (user === "Teacher") {
      navigate("/Teacherlogin");
    }
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") {
        navigate("/Admin/dashboard");
      } else if (currentRole === "Student") {
        navigate("/Student/dashboard");
      } else if (currentRole === "Teacher") {
        navigate("/Teacher/dashboard");
      }
    } else if (status === "error") {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  const roleItems = [
    {
      role: "Giáo viên/Trợ giảng",
      img: Teacher,
      key: "Teacher",
      desc: "Đăng nhập với quyền Giáo viên/Trợ giảng để tra cứu và bổ sung thông tin giảng dạy",
      icon: <AccountCircle fontSize="large" />,
    },
    {
      role: "Học sinh",
      img: Student,
      key: "Student",
      desc: "Đăng nhập với quyền Học sinh để tra cứu thông tin học tập",
      icon: <School fontSize="large" />,
    },
    {
      role: "Quản trị viên",
      img: Admin,
      key: "Admin",
      desc: "Đăng nhập với quyền Quản trị viên để quản lý chung hoạt động của Trung tâm",
      icon: <Group fontSize="large" />,
    },
  ];

  return (
    <StyledContainer>
      <Container>
        <MyGrid
          container
          rowSpacing={{ xs: 3, md: 0 }}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          {roleItems.map((item, index) => {
            return (
              <Grid item xs={12} md={4}>
                <StyledPaper
                  elevation={3}
                  onClick={() => navigateHandler(item.key)}
                >
                  <img src={item.img} alt={item.key} />
                  <Box mt={1} mb={1}>
                    {item.icon}
                  </Box>
                  <StyledTypography>{item.role}</StyledTypography>
                  <Box p={2}>{item.desc}</Box>
                </StyledPaper>
              </Grid>
            );
          })}
          
        </MyGrid>
      </Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
        Please Wait ...
      </Backdrop>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  background: #ff8400;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MyGrid = styled(Grid)`
  height: 100%;
  padding: 2rem;
`;

const StyledPaper = styled(Paper)`
  text-align: center;
  background-color: #1f1f38;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-radius: 15px !important;
  height: 100%;

  img {
    width: 100%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const StyledTypography = styled.h2`
  font-family: sans-serif !important;
`;
