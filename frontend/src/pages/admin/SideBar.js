import * as React from "react";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RoomIcon from "@mui/icons-material/Room";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const SideBar = () => {
  const location = useLocation();

  const { currentRole } = useSelector(state => state.user);

  return (
    <>
      {currentRole == "Admin" || currentRole == "Accountant" ? (
        <>
          <React.Fragment>
            <MyListItemButton component={Link} to="/">
              <ListItemIcon>
                {location.pathname === ("/" || "/Admin/dashboard") ? (
                  <HomeIcon fontSize="large" style={{ color: "#f47400" }} />
                ) : (
                  <HomeIcon fontSize="large" style={{ color: "inherit" }} />
                )}
              </ListItemIcon>
              <MyListItemText primary="Dashboard" />
            </MyListItemButton>
            <MyListItemButton component={Link} to="/Admin/classes">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/class") ? (
                  <ClassOutlinedIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <ClassOutlinedIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Quản lý lớp học" />
            </MyListItemButton>
            <MyListItemButton component={Link} to="/Admin/teachers">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/teacher") ? (
                  <SupervisorAccountOutlinedIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <SupervisorAccountOutlinedIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Quản lý giáo viên" />
            </MyListItemButton>
            <MyListItemButton component={Link} to="/Admin/assistants">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/assistant") ? (
                  <PersonAddIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <PersonAddIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Quản lý trợ giảng" />
            </MyListItemButton>
            <MyListItemButton component={Link} to="/Admin/students">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/student") ? (
                  <PersonOutlineIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <PersonOutlineIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Quản lý học sinh" />
            </MyListItemButton>
            {currentRole == "Admin" ? (
              <MyListItemButton component={Link} to="/Admin/rooms">
                <ListItemIcon>
                  {location.pathname.startsWith("/Admin/room") ? (
                    <RoomIcon fontSize="large" style={{ color: "#f47400" }} />
                  ) : (
                    <RoomIcon fontSize="large" style={{ color: "inherit" }} />
                  )}
                </ListItemIcon>
                <MyListItemText primary="Quản lý phòng học" />
              </MyListItemButton>
            ) : (
              <MyListItemButton component={Link} to="/Admin/moneys">
                <ListItemIcon>
                  {location.pathname.startsWith("/Admin/money") ? (
                    <AttachMoneyIcon
                      fontSize="large"
                      style={{ color: "#f47400" }}
                    />
                  ) : (
                    <AttachMoneyIcon
                      fontSize="large"
                      style={{ color: "inherit" }}
                    />
                  )}
                </ListItemIcon>
                <MyListItemText primary="Quản lý doanh thu" />
              </MyListItemButton>
            )}

            <MyListItemButton component={Link} to="/Admin/schedules">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/schedule") ? (
                  <EventNoteIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <EventNoteIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Quản lý lịch học" />
            </MyListItemButton>
          </React.Fragment>
          <Divider />
          <React.Fragment>
            <MyListItemButton component={Link} to="/Admin/accounts">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/account") ? (
                  <ManageAccountsIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <ManageAccountsIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Quản lý tài khoản" />
            </MyListItemButton>
            <MyListItemButton component={Link} to="/Admin/profile">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/profile") ? (
                  <AccountCircleOutlinedIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <AccountCircleOutlinedIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Tài khoản" />
            </MyListItemButton>
            <MyListItemButton component={Link} to="/logout">
              <ListItemIcon>
                {location.pathname.startsWith("/logout") ? (
                  <ExitToAppIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <ExitToAppIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Đăng xuất" />
            </MyListItemButton>
          </React.Fragment>
        </>
      ) : (
        <>
          <React.Fragment>
            <MyListItemButton component={Link} to="/">
              <ListItemIcon>
                {location.pathname === ("/" || "/Admin/dashboard") ? (
                  <HomeIcon fontSize="large" style={{ color: "#f47400" }} />
                ) : (
                  <HomeIcon fontSize="large" style={{ color: "inherit" }} />
                )}
              </ListItemIcon>
              <MyListItemText primary="Dashboard" />
            </MyListItemButton>
            <MyListItemButton component={Link} to="/Admin/classes">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/class") ? (
                  <ClassOutlinedIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <ClassOutlinedIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Danh sách lớp học" />
            </MyListItemButton>
            <MyListItemButton component={Link} to="/Admin/teachers">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/teacher") ? (
                  <SupervisorAccountOutlinedIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <SupervisorAccountOutlinedIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Danh sách giáo viên" />
            </MyListItemButton>
            <MyListItemButton component={Link} to="/Admin/assistants">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/assistant") ? (
                  <PersonAddIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <PersonAddIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Danh sách trợ giảng" />
            </MyListItemButton>
            <MyListItemButton component={Link} to="/Admin/schedules">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/schedule") ? (
                  <EventNoteIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <EventNoteIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Danh sách lịch học" />
            </MyListItemButton>
          </React.Fragment>
          <Divider />
          <React.Fragment>
            <MyListItemButton component={Link} to="/Admin/profile">
              <ListItemIcon>
                {location.pathname.startsWith("/Admin/profile") ? (
                  <AccountCircleOutlinedIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <AccountCircleOutlinedIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Tài khoản" />
            </MyListItemButton>
            <MyListItemButton component={Link} to="/logout">
              <ListItemIcon>
                {location.pathname.startsWith("/logout") ? (
                  <ExitToAppIcon
                    fontSize="large"
                    style={{ color: "#f47400" }}
                  />
                ) : (
                  <ExitToAppIcon
                    fontSize="large"
                    style={{ color: "inherit" }}
                  />
                )}
              </ListItemIcon>
              <MyListItemText primary="Đăng xuất" />
            </MyListItemButton>
          </React.Fragment>
        </>
      )}
    </>
  );
};

export default SideBar;

const MyListItemText = styled(ListItemText)`
  span {
    font-size: 1.25rem;
  }
`;

const MyListItemButton = styled(ListItemButton)`
  height: 60px;
`;
