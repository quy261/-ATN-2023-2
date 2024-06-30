import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  CircularProgress,
  Grid,
  Button,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import styled from "styled-components";

import { deleteUser } from "../../../redux/userRelated/userHandle";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { getAllStudents } from "../../../redux/studentRelated/studentHandle";

import {
  BlueButton,
  LightOrangeButton,
  OrangeButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import NoData from "../../../assets/no-data.webp";

const ShowClasses = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector(
    state => state.sclass
  );

  const { studentsList } = useSelector(state => state.student);

  const { currentUser, currentRole } = useSelector(state => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllStudents(adminID));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error);
  }

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllSclasses(adminID, "Sclass"));
    });
  };

  const sclassColumns = [
    { id: "stt", label: "STT", minWidth: 100 },
    { id: "name", label: "TÊN LỚP", minWidth: 170 },
    { id: "count", label: "SỐ HỌC SINH", minWidth: 200 },
  ];

  const sortedSclassesList = [...sclassesList].sort((a, b) =>
    a.sclassName.localeCompare(b.sclassName)
  );

  const sclassRows = sortedSclassesList.map((sclass, index) => {
    const studentCount = studentsList.filter(
      student => student.sclassName === sclass._id
    ).length;

    return {
      stt: index + 1,
      name: sclass.sclassName,
      count: studentCount,
      id: sclass._id,
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

  const SclassButtonHaver = ({ row }) => {
    return (
      <ButtonContainer>
        <OrangeButton
          variant="contained"
          onClick={() => navigate("/Admin/classes/class/" + row.id)}
          style={{ fontSize: "1rem" }}
        >
          <EditNoteIcon mr={1} />
          CHI TIẾT
        </OrangeButton>
        {currentRole === "Admin" ? (
          <BlueButton
            variant="contained"
            onClick={() => handleDeleteClick(row.id, "Sclass")}
            style={{ fontSize: "1rem" }}
          >
            <DeleteIcon mr={1} />
            XÓA
          </BlueButton>
        ) : (
          <></>
        )}
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
              <TitleBox>Quản lý lớp học </TitleBox>
            ) : (
              <TitleBox>Danh sách lớp học </TitleBox>
            )}
            {!getresponse && currentRole == "Admin" ? (
              <LightOrangeButton
                variant="contained"
                onClick={() => navigate("/Admin/classadd")}
                style={{ marginBottom: "1rem" }}
              >
                <AddIcon style={{ marginRight: "0.5rem" }} />
                Thêm Lớp Học
              </LightOrangeButton>
            ) : (
              <></>
            )}
          </div>
          {getresponse ? (
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
                  Chưa có dữ liệu lớp học
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
                      onClick={() => navigate("/Admin/classadd")}
                    >
                      <AddIcon style={{ marginRight: "0.5rem" }} />
                      Thêm Lớp Học
                    </LightOrangeButton>
                  ) : (
                    <></>
                  )}
                </Grid>
              </Grid>
            </Box>
          ) : (
            <>
              {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                <TableTemplate
                  buttonHaver={SclassButtonHaver}
                  columns={sclassColumns}
                  rows={sclassRows}
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

export default ShowClasses;

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
