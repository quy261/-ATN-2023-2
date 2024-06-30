import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";

import {
  CircularProgress,
  Box,
  Grid,
  Button,
  Typography,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";

import { getAllAssistants } from "../../../redux/assistantRelated/assistantHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { BlueButton } from "../../../components/buttonStyles";

import {
  LightOrangeButton,
  OrangeButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import NoData from "../../../assets/no-data.webp";

const ShowAssistants = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { assistantsList, loading, error, response } = useSelector(
    state => state.assistant
  );

  const { currentUser, currentRole } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getAllAssistants(currentUser._id));
  }, [currentUser._id, dispatch]);

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllAssistants(currentUser._id));
    });
  };

  const columns = [
    { id: "stt", label: "STT", minWidth: 50 },
    { id: "name", label: "HỌ TÊN", minWidth: 170 },
    { id: "sclassName", label: "HỌC VỊ", minWidth: 100 },
    { id: "dob", label: "NGÀY SINH", minWidth: 170 },
    { id: "phone", label: "SĐT", minWidth: 170 },
    { id: "email", label: "EMAIL", minWidth: 170 },
  ];

  const getLastName = fullName => {
    const nameParts = fullName.split(" ");
    return nameParts[nameParts.length - 1];
  };

  const sortedAssistants = [...assistantsList].sort((a, b) => {
    const lastNameA = getLastName(a.name).toLowerCase();
    const lastNameB = getLastName(b.name).toLowerCase();
    return lastNameA.localeCompare(lastNameB);
  });

  const rows = sortedAssistants.map((assistant, index) => {
    return {
      stt: index + 1,
      name: assistant.name,
      sclassName: assistant.sclassName,
      dob: dayjs(assistant.dob).format("DD/MM/YYYY"),
      phone: assistant.phone,
      email: assistant.email,
      id: assistant._id,
    };
  });

  const [showModal, setShowModal] = useState(false);

  const [deleteID, setDeleteID] = useState(null);

  const [address, setAddress] = useState("");

  const handleDeleteClick = (id, addr) => {
    setDeleteID(id);
    setAddress(addr);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    deleteHandler(deleteID, address);
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const AssistantButtonHaver = ({ row }) => {
    return (
      <ButtonContainer>
        <OrangeButton
          variant="contained"
          onClick={() => navigate("/Admin/assistant/" + row.id)}
          style={{ fontSize: "1rem" }}
        >
          <EditNoteIcon mr={1} />
          CHI TIẾT
        </OrangeButton>
        {currentRole == "Admin" ? (
          <BlueButton
            variant="contained"
            onClick={() => handleDeleteClick(row.id, "Assistant")}
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
            {currentRole == "Admin" || currentRole == "Accountant" ? (
              <TitleBox>Quản lý trợ giảng</TitleBox>
            ) : (
              <TitleBox>Danh sách trợ giảng</TitleBox>
            )}
            {!response &&
              (currentRole == "Admin" ? (
                <LightOrangeButton
                  variant="contained"
                  onClick={() => navigate("/Admin/assistantadd")}
                  style={{ marginBottom: "1rem" }}
                >
                  <AddIcon style={{ marginRight: "0.5rem" }} />
                  Thêm Trợ Giảng
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
                  Chưa có dữ liệu trợ giảng
                </Grid>
                <Grid
                  xs={12}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {currentRole == "Admin" ? (
                    <LightOrangeButton
                      variant="contained"
                      onClick={() => navigate("/Admin/assistantadd")}
                    >
                      <AddIcon style={{ marginRight: "0.5rem" }} />
                      Thêm Trợ Giảng
                    </LightOrangeButton>
                  ) : null}
                </Grid>
              </Grid>
            </Box>
          ) : (
            <>
              {Array.isArray(assistantsList) && assistantsList.length > 0 && (
                <TableTemplate
                  buttonHaver={AssistantButtonHaver}
                  columns={columns}
                  rows={rows}
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

export default ShowAssistants;

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
