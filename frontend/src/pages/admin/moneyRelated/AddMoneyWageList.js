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
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import {
  OrangeButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import NoData from "../../../assets/no-data.webp";
import { getAllAssistants } from "../../../redux/assistantRelated/assistantHandle";

const AddMoneyWageList = () => {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { teachersList, loading, error, response } = useSelector(
    state => state.teacher
  );

  const { assistantsList, res = response } = useSelector(
    state => state.assistant
  );

  const { currentUser, currentRole } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getAllTeachers(currentUser._id));
    dispatch(getAllAssistants(currentUser._id));
  }, [currentUser._id, dispatch]);

  const [showPopup, setShowPopup] = useState(false);

  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllTeachers(currentUser._id));
    });
  };

  const columns = [
    { id: "stt", label: "STT", minWidth: 50 },
    { id: "name", label: "HỌ TÊN", minWidth: 170 },
    { id: "sclassName", label: "HỌC VỊ", minWidth: 100 },
    { id: "dob", label: "NGÀY SINH", minWidth: 170 },
  ];

  const getLastName = fullName => {
    const nameParts = fullName.split(" ");
    return nameParts[nameParts.length - 1];
  };

  const sortedTeachers = [...teachersList].sort((a, b) => {
    const lastNameA = getLastName(a.name).toLowerCase();
    const lastNameB = getLastName(b.name).toLowerCase();
    return lastNameA.localeCompare(lastNameB);
  });

  const sortedAssistants = [...assistantsList].sort((a, b) => {
    const lastNameA = getLastName(a.name).toLowerCase();
    const lastNameB = getLastName(b.name).toLowerCase();
    return lastNameA.localeCompare(lastNameB);
  });

  const rows = sortedTeachers.map((teacher, index) => {
    return {
      stt: index + 1,
      name: teacher.name,
      sclassName: teacher.sclassName,
      dob: dayjs(teacher.dob).format("DD/MM/YYYY"),
      id: teacher._id,
    };
  });

  const rows1 = sortedAssistants.map((teacher, index) => {
    return {
      stt: index + 1,
      name: teacher.name,
      sclassName: teacher.sclassName,
      dob: dayjs(teacher.dob).format("DD/MM/YYYY"),
      id: teacher._id,
    };
  });

  const [showModal, setShowModal] = useState(false);

  const [deleteID, setDeleteID] = useState(null);

  const [address, setAddress] = useState("");

  const handleConfirmDelete = () => {
    deleteHandler(deleteID, address);
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const TeacherButtonHaver = ({ row }) => {
    return (
      <ButtonContainer>
        <OrangeButton
          variant="contained"
          onClick={() => navigate("/Admin/teacher/" + row.id)}
          style={{ fontSize: "1rem" }}
        >
          <EditNoteIcon mr={1} />
          THÊM LƯƠNG
        </OrangeButton>
      </ButtonContainer>
    );
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
          THÊM LƯƠNG
        </OrangeButton>
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
            <div style={{ display: "flex", flexDirection: "row" }}>
              <BackButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </BackButton>
              <TitleBox>Danh sách giáo viên, trợ giảng</TitleBox>
            </div>
          </div>
          <Grid container>
            <Grid xs={12} sm={6} paddingRight={"1rem"}>
              <Typography
                variant="h5"
                style={{
                  color: "#f47400",
                  fontWeight: "600",
                }}
              >
                Danh sách giáo viên
              </Typography>
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
                        <img
                          src={NoData}
                          alt="no-data"
                          style={{ width: "100%" }}
                        />
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
                      Chưa có dữ liệu giáo viên
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <>
                  {Array.isArray(teachersList) && teachersList.length > 0 && (
                    <TableTemplate
                      buttonHaver={TeacherButtonHaver}
                      columns={columns}
                      rows={rows}
                    />
                  )}
                </>
              )}
            </Grid>
            <Grid xs={12} sm={6} paddingLeft={"1rem"}>
              <Typography
                variant="h5"
                style={{
                  color: "#f47400",
                  fontWeight: "600",
                }}
              >
                Danh sách trợ giảng
              </Typography>
              {res ? (
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
                        <img
                          src={NoData}
                          alt="no-data"
                          style={{ width: "100%" }}
                        />
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
                      Chưa có dữ liệu giáo viên
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <>
                  {Array.isArray(teachersList) && teachersList.length > 0 && (
                    <TableTemplate
                      buttonHaver={AssistantButtonHaver}
                      columns={columns}
                      rows={rows1}
                    />
                  )}
                </>
              )}
            </Grid>
          </Grid>
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

export default AddMoneyWageList;

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
