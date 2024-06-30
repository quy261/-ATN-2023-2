import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { Grid, Typography } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";

import User from "../../assets/user.png";
import { LightWhiteButton } from "../../components/buttonStyles";

const AdminProfile = () => {
  const navigate = useNavigate();

  const { currentUser } = useSelector(state => state.user);

  return (
    <div style={{ padding: "2rem" }}>
      <StyledContainer>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <img src={User} alt="user" style={{ width: "100%" }} />
          </Grid>
          <Grid
            item
            xs={12}
            md={10}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                style={{ color: "#f47400", fontWeight: "600" }}
              >
                THÔNG TIN TÀI KHOẢN
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                style={{ color: "#f47400", fontWeight: "600" }}
              >
                Họ tên:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {currentUser.name}
                </span>
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                style={{ color: "#f47400", fontWeight: "600" }}
              >
                Email:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {currentUser.email}
                </span>
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                style={{ color: "#f47400", fontWeight: "600" }}
              >
                Quyền:{" "}
                <span style={{ color: "black", fontWeight: "400" }}>
                  {currentUser.role == "Admin"
                    ? "Quản trị viên"
                    : currentUser.role == "Accountant"
                    ? "Kế toán"
                    : currentUser.role == "Teacher"
                    ? "Giáo viên"
                    : currentUser.role == "Assistant"
                    ? "Trợ giảng"
                    : "Học sinh"}
                </span>
              </Typography>
            </div>
            <div style={{ display: "flex", alignItems: "end" }}>
              <LightWhiteButton
                variant="contained"
                onClick={() =>
                  navigate("/Admin/accountedit/" + currentUser._id)
                }
                style={{ height: "min-content" }}
              >
                <EditNoteIcon style={{ marginRight: "0.5rem" }} />
                Đổi mật khẩu
              </LightWhiteButton>
            </div>
          </Grid>
        </Grid>
      </StyledContainer>
    </div>
  );
};

export default AdminProfile;

const StyledContainer = styled.div`
  padding: 2rem;
  background-color: white;
  border-radius: 15px;
`;
