import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";

import {
  CircularProgress,
  Box,
  Grid,
  Modal,
  Typography,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";

import { getAllStudents } from "../../../redux/studentRelated/studentHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { BlueButton } from "../../../components/buttonStyles";
import {
  LightOrangeButton,
  OrangeButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import NoData from "../../../assets/no-data.webp";
import { getUserDetails } from "../../../redux/userRelated/userHandle";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";

const ShowStudents = () => {
  const params = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { studentsList, loading, response } = useSelector(
    state => state.student
  );

  const { currentUser, currentRole } = useSelector(state => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
  }, [currentUser._id, dispatch]);

  const studentID = params.id;

  const { sclassesList } = useSelector(state => state.sclass);

  const classNames = sclassesList.map(sclass => sclass.sclassName);

  const getClassnameById = id => {
    const sclass = sclassesList.find(sclass => sclass._id === id);
    return sclass ? sclass.sclassName : "Unknown";
  };

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllStudents(currentUser._id));
    });
  };

  const columns = [
    { id: "stt", label: "STT", minWidth: 50 },
    { id: "name", label: "HỌ TÊN", minWidth: 170 },
    { id: "sclassName", label: "LỚP", minWidth: 170 },
    { id: "dob", label: "NGÀY SINH", minWidth: 170 },
    { id: "phone", label: "SĐT", minWidth: 170 },
    { id: "email", label: "EMAIL", minWidth: 170 },
  ];

  const getLastName = fullName => {
    const nameParts = fullName.split(" ");
    return nameParts[nameParts.length - 1];
  };

  const sortedStudents = [...studentsList].sort((a, b) => {
    const lastNameA = getLastName(a.name).toLowerCase();
    const lastNameB = getLastName(b.name).toLowerCase();
    return lastNameA.localeCompare(lastNameB);
  });

  const rows = sortedStudents.map((student, index) => {
    return {
      stt: index + 1,
      name: student.name,
      sclassName: getClassnameById(student.sclassName),
      dob: dayjs(student.dob).format("DD/MM/YYYY"),
      phone: student.phone,
      email: student.email,
      id: student._id,
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

  const TeacherButtonHaver = ({ row }) => {
    return (
      <ButtonContainer>
        <OrangeButton
          variant="contained"
          onClick={() => navigate("/Admin/student/" + row.id)}
          style={{ fontSize: "1rem" }}
        >
          <EditNoteIcon mr={1} />
          CHI TIẾT
        </OrangeButton>
        {currentRole == "Admin" ? (
          <BlueButton
            variant="contained"
            onClick={() => handleDeleteClick(row.id, "Student")}
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
            <TitleBox>Quản lý học sinh</TitleBox>
            {!response &&
              (currentRole == "Admin" ? (
                <LightOrangeButton
                  variant="contained"
                  onClick={() => navigate("/Admin/studentadd")}
                  style={{ marginBottom: "1rem" }}
                >
                  <AddIcon style={{ marginRight: "0.5rem" }} />
                  Thêm Học Sinh
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
                  Chưa có dữ liệu học sinh
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
                      onClick={() => navigate("/Admin/studentadd")}
                    >
                      <AddIcon style={{ marginRight: "0.5rem" }} />
                      Thêm Giáo Viên
                    </LightOrangeButton>
                  ) : null}
                </Grid>
              </Grid>
            </Box>
          ) : (
            <>
              {Array.isArray(studentsList) && studentsList.length > 0 && (
                <TableTemplate
                  buttonHaver={TeacherButtonHaver}
                  columns={columns}
                  rows={rows}
                  classes={classNames}
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

export default ShowStudents;

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
  display: flex;
  align-items: center;
`;
