import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";
import axios from 'axios';


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

import { getAllMoneys } from "../../../redux/moneyRelated/moneyHandle";
import { deleteUser, updateMoney } from "../../../redux/userRelated/userHandle";
import { getAllSchedules } from "../../../redux/scheduleRelated/scheduleHandle";
import { BlueButton } from "../../../components/buttonStyles";
import {
  LightOrangeButton,
  OrangeButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import NoData from "../../../assets/no-data.webp";
import { getAllStudents } from "../../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import { getAllAssistants } from "../../../redux/assistantRelated/assistantHandle";
import { getAllMoneyDefs } from "../../../redux/moneyDefRelated/moneyDefHandle";

const ShowMoneys = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { currentUser, currentRole } = useSelector(state => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllMoneys(adminID));
    dispatch(getAllMoneyDefs(adminID));
    dispatch(getAllStudents(adminID));
    dispatch(getAllTeachers(adminID));
    dispatch(getAllAssistants(adminID));
  }, [currentUser._id, dispatch]);

  const { studentsList } = useSelector(state => state.student);

  const { teachersList } = useSelector(state => state.teacher);

  const { assistantsList } = useSelector(state => state.assistant);

  const { moneysList, loading, response } = useSelector(state => state.money);

  const { moneyDefsList } = useSelector(state => state.moneyDef);

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllMoneys(currentUser._id));
    });
  };
  const updateHandler = (updateID, address) => {
    dispatch(updateMoney(updateID, address)).then(() => {
      dispatch(getAllMoneys(currentUser._id));
    });
  };

  const getStudentNameById = id => {
    const student = studentsList.find(student => student._id === id);
    return student ? `${student.name}` : "Unknown";
  };

  const getTeacherNameById = id => {
    const teacher = teachersList.find(teacher => teacher._id === id);
    return teacher ? `${teacher.name}` : "Unknown";
  };

  const getAssistantNameById = id => {
    const assistant = assistantsList.find(assistant => assistant._id === id);
    return assistant ? `${assistant.name}` : "Unknown";
  };

  const getImageById = id => {
    const money = moneysList.find(money => money._id === id);
    return money ? money.image : "";
  };

  const columns = [
    { id: "stt", label: "STT", minWidth: 50 },
    { id: "name", label: "HỌ TÊN", minWidth: 170 },
    { id: "month", label: "THỜI GIAN", minWidth: 100 },
    { id: "type", label: "LOẠI DOANH THU", minWidth: 100 },
    { id: "amount", label: "SỐ TIỀN (đ)", minWidth: 170 },
  ];

  const columns1 = [
    { id: "stt", label: "STT", minWidth: 50 },
    { id: "type", label: "NGUỒN THU CHI", minWidth: 170 },
    { id: "amount", label: "SỐ TIỀN (đ)", minWidth: 170 },
  ];

  const rows = moneysList
    .filter(item => !item.image)
    .map((money, index) => {
      return {
        stt: index + 1,
        name:
          money.type == "tuition"
            ? getStudentNameById(money.name)
            : getTeacherNameById(money.name) != "Unknown"
            ? getTeacherNameById(money.name)
            : getAssistantNameById(money.name),
        month: money.month,
        type: money.type == "tuition" ? "Học phí" : "Lương",
        amount: money.amount,
        id: money._id,
      };
    });

  const rows2 = moneysList
    .filter(item => item.image)
    .map((money, index) => {
      return {
        stt: index + 1,
        name:
          money.type == "tuition"
            ? getStudentNameById(money.name)
            : getTeacherNameById(money.name) != "Unknown"
            ? getTeacherNameById(money.name)
            : getAssistantNameById(money.name),
        month: money.month,
        type: money.type == "tuition" ? "Học phí" : "Lương",
        amount: money.amount,
        id: money._id,
      };
    });

  const rows1 = moneyDefsList.map((moneyDef, index) => {
    return {
      stt: index + 1,
      type: moneyDef.type,
      amount: moneyDef.amount,
      id: moneyDef._id,
    };
  });

  const [showModal, setShowModal] = useState(false);

  const [showModal2, setShowModal2] = useState(false);

  const [deleteID, setDeleteID] = useState(null);

  const [updateID, setUpdateID] = useState(null);

  const [address, setAddress] = useState("");

  const handleDeleteClick = (id, addr) => {
    setDeleteID(id);
    setAddress(addr);
    setShowModal(true);
  };

  const handleConfirmClick = id => {
    setUpdateID(id);
    setAddress("Money");
    setShowModal2(true);
  };


  const handleConfirmDelete = () => {
    deleteHandler(deleteID, address);
    setShowModal(false);
    setShowModal2(false);
  };

  const handleConfirmSuccess = () => {
    const fields = {
      status: "Đã thanh toán"
    }
    updateHandler(updateID, fields);
    setShowModal2(false)
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const handleCancelConfirm = () => {
    setShowModal2(false);
  };

  const MoneyButtonHaver = ({ row }) => {
    return (
      <ButtonContainer>
        <BlueButton
          variant="contained"
          onClick={() => handleDeleteClick(row.id, "Money")}
          style={{ fontSize: "1rem" }}
        >
          <DeleteIcon mr={1} />
          XÓA
        </BlueButton>
      </ButtonContainer>
    );
  };

  const MoneyButtonHaver2 = ({ row }) => {
    return (
      <ButtonContainer>
        <BlueButton
          variant="contained"
          onClick={() => handleConfirmClick(row.id)}
          style={{ fontSize: "1rem" }}
        >
          <EditNoteIcon mr={1} />
          CHI TIẾT
        </BlueButton>
      </ButtonContainer>
    );
  };

  const MoneyDefButtonHaver = ({ row }) => {
    return (
      <ButtonContainer>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/moneydefedit/" + row.id)}
          style={{ fontSize: "1rem" }}
        >
          <EditNoteIcon mr={1} />
          SỬA
        </BlueButton>
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
            <TitleBox>Quản lý doanh thu</TitleBox>
            {!response && (
              <div style={{ display: "flex", gap: "1rem" }}>
                <LightOrangeButton
                  variant="contained"
                  onClick={() => navigate("/Admin/moneyaddtuitionlist")}
                  style={{ marginBottom: "1rem" }}
                >
                  <AddIcon style={{ marginRight: "0.5rem" }} />
                  Thêm Học phí
                </LightOrangeButton>
                <LightOrangeButton
                  variant="contained"
                  onClick={() => navigate("/Admin/moneyaddwagelist")}
                  style={{ marginBottom: "1rem" }}
                >
                  <AddIcon style={{ marginRight: "0.5rem" }} />
                  Thêm Lương
                </LightOrangeButton>
              </div>
            )}
          </div>
          <Grid container marginTop={"1rem"}>
            <Grid xs={12} sm={8} paddingRight={{ sm: "3rem", xs: "0" }}>
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  color: "#f47400",
                  fontWeight: "600",
                }}
              >
                Các khoản học phí cần xác nhận
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
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"2rem"}
                      marginBottom={"1.5rem"}
                    >
                      Không có khoản học phí cần xác nhận
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <>
                  {Array.isArray(moneysList) && moneysList.length > 0 && (
                    <TableTemplate
                      buttonHaver={MoneyButtonHaver2}
                      columns={columns}
                      rows={rows2}
                    />
                  )}
                </>
              )}
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  color: "#f47400",
                  fontWeight: "600",
                }}
              >
                Danh sách các khoản thu chi
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
                      Chưa có dữ liệu doanh thu
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <>
                  {Array.isArray(moneysList) && moneysList.length > 0 && (
                    <TableTemplate
                      buttonHaver={MoneyButtonHaver}
                      columns={columns}
                      rows={rows}
                    />
                  )}
                </>
              )}
            </Grid>
            <Grid xs={12} sm={4}>
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  color: "#f47400",
                  fontWeight: "600",
                }}
              >
                Danh sách loại doanh thu
              </Typography>
              {Array.isArray(moneyDefsList) && moneyDefsList.length > 0 && (
                <TableTemplate
                  buttonHaver={MoneyDefButtonHaver}
                  columns={columns1}
                  rows={rows1}
                  disableSearch={true}
                />
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
      {showModal2 && (
        <Modal
          open={showModal2}
          onClose={handleCancelConfirm}
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
            <Typography
              id="modal-title"
              variant="h5"
              component="h2"
              style={{
                textAlign: "center",
                fontWeight: "600",
                color: "#ff7900",
                marginBottom: "1.5rem",
              }}
            >
              Xác nhận khoản học phí
            </Typography>
            <img
              src={`${process.env.REACT_APP_BASE_URL}/uploads/image/${getImageById(updateID)}`}
              alt="bill"
              style={{ width: "100%" }}
            />
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmSuccess}
                  >
                    Xác nhận
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteClick(updateID, "Money")}
                  >
                    Từ chối
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCancelConfirm}
                  >
                    Huỷ
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

export default ShowMoneys;

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
