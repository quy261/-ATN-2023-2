import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Settings, Logout } from "@mui/icons-material";
import { useSelector } from "react-redux";
import styled from "styled-components";

const AccountMenu = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const { currentRole, currentUser } = useSelector(state => state.user);


  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>
            {String(currentUser.name).charAt(0)}
          </Avatar>
        </IconButton>
      </Box>
      <MyMenu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: styles.styledPaper,
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{ padding: "0 !important" }}
      >
        <MenuItem
          sx={{
            minHeight: "50px !important",
            minWidth: "150px !important",
            paddingLeft: "1.5rem",
          }}
          onClick={() => {
            navigate("/Admin/profile");
          }}
        >
          <Avatar />
          <span>Tài khoản</span>
        </MenuItem>
        <Divider sx={{ margin: "0 !important" }} />
        <MenuItem
          sx={{
            minHeight: "50px !important",
            minWidth: "150px !important",
            paddingLeft: "1.5rem",
          }}
          onClick={() => {
            navigate("/logout");
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <span>Đăng xuất</span>
        </MenuItem>
      </MyMenu>
    </>
  );
};

export default AccountMenu;

const styles = {
  styledPaper: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

const MyMenu = styled(Menu)`
  .MuiList-root {
    padding: 0 !important;
  }
`;
