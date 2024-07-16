import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  Box,
  CircularProgress,
  Grid,
  Modal,
  Typography,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { deleteUser } from "../../../redux/userRelated/userHandle";
import {
  BlueButton,
  LightOrangeButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import NoData from "../../../assets/no-data.webp";
import { getAllAdmins } from "../../../redux/accountRelated/accountHandle";

const ShowAccounts = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { adminsList, loading, error, response } = useSelector(
    state => state.admin
  );

  const { currentUser, currentRole } = useSelector(state => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllAdmins(adminID));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error);
  }

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllAdmins(adminID));
    });
  };

  const adminColumns = [
    { id: "stt", label: "STT", minWidth: 100 },
    { id: "name", label: "HỌ TÊN", minWidth: 200 },
    { id: "email", label: "EMAIL", minWidth: 250 },
    { id: "role", label: "QUYỀN", minWidth: 200 },
  ];

  const sortedAdminsList = [...adminsList].sort((a, b) => {
    const roleA = a.role === "Admin" ? "Quản trị viên" : "Nhân viên kế toán";
    const roleB = b.role === "Admin" ? "Quản trị viên" : "Nhân viên kế toán";

    if (roleA > roleB) return -1;
    if (roleA < roleB) return 1;
    return 0;
  });

  const adminRows = sortedAdminsList.map((admin, index) => {
    return {
      stt: index + 1,
      name: admin.name,
      email: admin.email,
      role: admin.role === "Admin" ? "Quản trị viên" : "Nhân viên kế toán",
      id: admin._id,
    };
  });

  const [showModal, setShowModal] = useState(false);

  const [deleteID, setDeleteID] = useState(null);

  const [addresss, setAddresss] = useState("");

  const handleDeleteClick = (id, addr) => {
    setDeleteID(id);
    setAddresss(addr);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    deleteHandler(deleteID, addresss);
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const AdminButtonHaver = ({ row }) => {
    return row.role === "Quản trị viên" ? (
      <></>
    ) : (
      <ButtonContainer>
        {currentRole === "Admin" ? (
          <BlueButton
            variant="contained"
            onClick={() => handleDeleteClick(row.id, "Admin")}
            style={{ fontSize: "1rem" }}
          >
            <DeleteIcon mr={1} />
            XÓA
          </BlueButton>
        ) : null}
      </ButtonContainer>
    );
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TitleBox>Quản lý tài khoản quản trị </TitleBox>
            {!response &&
              (currentRole === "Admin" ? (
                <LightOrangeButton
                  variant="contained"
                  onClick={() => navigate("/Admin/accountadd")}
                  style={{ marginBottom: "1rem" }}
                >
                  <AddIcon style={{ marginRight: "0.5rem" }} />
                  Thêm Tài Khoản
                </LightOrangeButton>
              ) : null)}
          </div>
          {response ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "16px",
              }}
            >
              <Grid container>
                <Grid
                  xs={12}
                  container
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Grid xs={12} md={6} lg={3}>
                    <img src={NoData} alt="no-data" style={{ width: "100%" }} />
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  fontSize={"2rem"}
                  marginBottom={"1.5rem"}
                >
                  Chưa có dữ liệu tài khoản
                </Grid>
                <Grid
                  xs={12}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {currentRole === "Admin" ? (
                    <LightOrangeButton
                      variant="contained"
                      onClick={() => navigate("/Admin/accountadd")}
                    >
                      <AddIcon style={{ marginRight: "0.5rem" }} />
                      Thêm Tài Khoản
                    </LightOrangeButton>
                  ) : null}
                </Grid>
              </Grid>
            </Box>
          ) : (
            <>
              {Array.isArray(adminsList) && adminsList.length > 0 && (
                <TableTemplate
                  buttonHaver={AdminButtonHaver}
                  columns={adminColumns}
                  rows={adminRows}
                />
              )}
            </>
          )}
        </div>
      )}
      {showModal && (
        <Modal
          open={showModal}
          onClose={handleCancelDelete}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Xác nhận xóa
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              Bạn có chắc chắn muốn xóa?
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmDelete}
                  >
                    Xác nhận
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCancelDelete}
                  >
                    Hủy
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ShowAccounts;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TitleBox = styled.div`
  font-size: 1.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 16px;
  background-color: #f47400;
  color: white;
  width: fit-content;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;
