import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { AppBar, Drawer } from "../../components/styles";
import AccountMenu from "../../components/AccountMenu";

import Logout from "../Logout";
import SideBar from "./SideBar";

import AdminProfile from "./AdminProfile";
import AdminHomePage from "./AdminHomePage";

import ShowStudents from "./studentRelated/ShowStudents";
import AddStudent from "./studentRelated/AddStudent";
import StudentDetails from "./studentRelated/StudentDetails";
import EditStudent from "./studentRelated/EditStudent";

import ShowTeachers from "./teacherRelated/ShowTeachers";
import AddTeacher from "./teacherRelated/AddTeacher";
import TeacherDetails from "./teacherRelated/TeacherDetails";
import EditTeacher from "./teacherRelated/EditTeacher";

import ShowAssistants from "./assistantRelated/ShowAssistants";
import AddAssistant from "./assistantRelated/AddAssistant";
import AssistantDetails from "./assistantRelated/AssistantDetails";
import EditAssistant from "./assistantRelated/EditAssistant";

import ShowClasses from "./classRelated/ShowClasses";
import AddClass from "./classRelated/AddClass";
import ClassDetails from "./classRelated/ClassDetails";
import EditClass from "./classRelated/EditClass";

import ShowRooms from "./roomRelated/ShowRooms";
import AddRoom from "./roomRelated/AddRoom";
import RoomDetails from "./roomRelated/RoomDetails";
import EditRoom from "./roomRelated/EditRoom";

import ShowSchedules from "./scheduleRelated/ShowSchedules";
import ScheduleDetails from "./scheduleRelated/ScheduleDetails";
import EditSchedule from "./scheduleRelated/EditSchedule";

import ShowAccounts from "./accountRelated/ShowAccounts";
import AddAccount from "./accountRelated/AddAccount";
import EditAccount from "./accountRelated/EditAccount";

import ShowMoneys from "./moneyRelated/ShowMoneys";
import AddMoneyWage from "./moneyRelated/AddMoneyWage";
import AddMoneyTuition from "./moneyRelated/AddMoneyTuition";
import UserDetails from "./UserDetails";
import AddComment from "./studentRelated/AddComment";
import EditContentSchedule from "./scheduleRelated/EditContentSchedule";
import EditAttendanceSchedule from "./scheduleRelated/EditAttendaceSchedule";

const LogedinDashboard = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { currentRole } = useSelector(state => state.user);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          open={open}
          position="absolute"
          sx={{ backgroundColor: "#f47400" }}
        >
          <Toolbar sx={{ pr: "24px" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h5"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {currentRole == "Admin" || currentRole == "Accountant"
                ? "TAE - PHÂN HỆ QUẢN LÝ"
                : "TAE - PHÂN HỆ NGƯỜI DÙNG"}
            </Typography>
            <AccountMenu />
          </Toolbar>
        </AppBar>
        <MyDrawer
          variant="permanent"
          open={open}
          sx={open ? styles.drawerStyled : styles.hideDrawer}
        >
          <Toolbar sx={styles.toolBarStyled}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <SideBar />
          </List>
        </MyDrawer>
        <Box component="main" sx={styles.boxStyled}>
          <Toolbar />
          <Routes>
            {currentRole == "Admin" || currentRole == "Accountant" ? (
              <Route path="/" element={<AdminHomePage />} />
            ) : (
              <Route path="/" element={<UserDetails />} />
            )}

            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/Admin/profile" element={<AdminProfile />} />
            <Route path="/logout" element={<Logout />} />

            {/* Class */}
            <Route path="/Admin/classes" element={<ShowClasses />} />
            <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
            {currentRole == "Admin" ? (
              <>
                <Route path="/Admin/classadd" element={<AddClass />} />
                <Route path="/Admin/classedit/:id" element={<EditClass />} />
                <Route
                  path="/Admin/class/studentadd/:id"
                  element={<AddStudent situation="Class" />}
                />
              </>
            ) : null}
            {currentRole == "Teacher" || currentRole == "Assistant" ? (
              <Route
                path="/Admin/classaddcomment/:id"
                element={<AddComment />}
              />
            ) : null}

            {/* Student */}
            <Route path="/Admin/students" element={<ShowStudents />} />
            <Route path="/Admin/student/:id" element={<StudentDetails />} />
            {currentRole == "Admin" ? (
              <>
                <Route
                  path="/Admin/studentadd"
                  element={<AddStudent situation="Student" />}
                />
                <Route
                  path="/Admin/studentedit/:id"
                  element={<EditStudent />}
                />
              </>
            ) : null}

            {/* Teacher */}
            <Route path="/Admin/teachers" element={<ShowTeachers />} />
            <Route path="/Admin/teacher/:id" element={<TeacherDetails />} />
            {currentRole == "Admin" ? (
              <>
                <Route path="/Admin/teacheradd" element={<AddTeacher />} />
                <Route
                  path="/Admin/teacheredit/:id"
                  element={<EditTeacher />}
                />
              </>
            ) : null}

            {/* Assistant */}
            <Route path="/Admin/assistants" element={<ShowAssistants />} />
            <Route path="/Admin/assistant/:id" element={<AssistantDetails />} />
            {currentRole == "Admin" ? (
              <>
                <Route path="/Admin/assistantadd" element={<AddAssistant />} />
                <Route
                  path="/Admin/assistantedit/:id"
                  element={<EditAssistant />}
                />
              </>
            ) : null}

            {/* Room */}
            {currentRole == "Admin" ? (
              <>
                <Route path="/Admin/rooms" element={<ShowRooms />} />
                <Route path="/Admin/room/:id" element={<RoomDetails />} />
                <Route path="/Admin/roomadd" element={<AddRoom />} />
                <Route path="/Admin/roomedit/:id" element={<EditRoom />} />
              </>
            ) : null}

            {/* Money */}
            {currentRole == "Accountant" ? (
              <>
                <Route path="/Admin/moneys" element={<ShowMoneys />} />
                <Route
                  path="/Admin/moneyaddtuition"
                  element={<AddMoneyTuition />}
                />
                <Route path="/Admin/moneyaddwage" element={<AddMoneyWage />} />
              </>
            ) : null}

            {/* Schedule */}
            <Route path="/Admin/schedules" element={<ShowSchedules />} />
            <Route path="/Admin/schedule/:id" element={<ScheduleDetails />} />
            {currentRole == "Admin" ? (
              <Route
                path="/Admin/scheduleedit/:id"
                element={<EditSchedule />}
              />
            ) : null}
            {currentRole == "Teacher" || currentRole == "Assistant" ? (
              <>
                <Route
                  path="/Admin/scheduleeditcontent/:id"
                  element={<EditContentSchedule />}
                />
                <Route
                  path="/Admin/scheduleeditattendance/:id"
                  element={<EditAttendanceSchedule />}
                />
              </>
            ) : null}

            {/* Account */}
            <Route path="/Admin/accounts" element={<ShowAccounts />} />
            <Route path="/Admin/accountedit/:id" element={<EditAccount />} />
            {currentRole == "Admin" ? (
              <Route path="/Admin/accountadd" element={<AddAccount />} />
            ) : null}
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default LogedinDashboard;

const styles = {
  boxStyled: {
    backgroundColor: theme =>
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  toolBarStyled: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    px: [1],
  },
  drawerStyled: {
    display: "flex",
  },
  hideDrawer: {
    display: "flex",
    "@media (max-width: 600px)": {
      display: "none",
    },
  },
};

const MyDrawer = styled(Drawer)`
  nav {
    padding: 0 !important;
  }
`;
