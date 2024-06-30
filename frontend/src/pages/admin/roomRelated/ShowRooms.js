import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";

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

import { getAllRooms } from "../../../redux/roomRelated/roomHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { getAllSchedules } from "../../../redux/scheduleRelated/scheduleHandle";
import { BlueButton } from "../../../components/buttonStyles";
import {
  LightOrangeButton,
  OrangeButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import NoData from "../../../assets/no-data.webp";

const ShowRooms = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { currentUser, currentRole } = useSelector(state => state.user);

  const adminID = currentUser._id;
  useEffect(() => {
    dispatch(getAllRooms(currentUser._id));
    dispatch(getAllSchedules(adminID, "schedule"));
  }, [currentUser._id, dispatch]);

  const { roomsList, loading, response } = useSelector(state => state.room);

  const { schedulesList } = useSelector(state => state.schedule);

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllRooms(currentUser._id));
    });
  };

  const columns = [
    { id: "stt", label: "STT", minWidth: 50 },
    { id: "name", label: "TÊN PHÒNG", minWidth: 170 },
    { id: "capacity", label: "SỨC CHỨA", minWidth: 100 },
    { id: "location", label: "ĐỊA ĐIỂM", minWidth: 100 },
    { id: "resources", label: "CƠ SỞ VẬT CHẤT", minWidth: 170 },
    { id: "availability", label: "TÌNH TRẠNG", minWidth: 170 },
  ];

  const compareRooms = (a, b) => {
    if (a.location.toLowerCase() < b.location.toLowerCase()) return -1;
    if (a.location.toLowerCase() > b.location.toLowerCase()) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  };

  const sortedRoomsList = [...roomsList].sort(compareRooms);

  const currentTime = dayjs();

  const rows = sortedRoomsList.map((room, index) => {
    const isAvailable = schedulesList.every(schedule => {
      const scheduleStart = dayjs(schedule.startTime);
      const scheduleEnd = dayjs(schedule.endTime);
      return (
        schedule.room !== room._id ||
        scheduleEnd.isBefore(currentTime) ||
        scheduleStart.isAfter(currentTime)
      );
    });
    return {
      stt: index + 1,
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      resources: (
        <>
          Bảng: {room.resources.board}
          <br />
          Máy tính: {room.resources.laptop}
          <br />
          Máy chiếu: {room.resources.project}
          <br />
          Bộ bàn ghế: {room.resources.seat}
        </>
      ),
      availability: isAvailable ? "Trống" : "Đang sử dụng",
      id: room._id,
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

  const RoomButtonHaver = ({ row }) => {
    return (
      <ButtonContainer>
        <OrangeButton
          variant="contained"
          onClick={() => navigate("/Admin/room/" + row.id)}
          style={{ fontSize: "1rem" }}
        >
          <EditNoteIcon mr={1} />
          CHI TIẾT
        </OrangeButton>
        {currentRole == "Admin" ? (
          <BlueButton
            variant="contained"
            onClick={() => handleDeleteClick(row.id, "Room")}
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
            <TitleBox>Quản lý phòng học</TitleBox>
            {!response &&
              (currentRole == "Admin" ? (
                <LightOrangeButton
                  variant="contained"
                  onClick={() => navigate("/Admin/roomadd")}
                  style={{ marginBottom: "1rem" }}
                >
                  <AddIcon style={{ marginRight: "0.5rem" }} />
                  Thêm Phòng Học
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
                  Chưa có dữ liệu phòng học
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
                      onClick={() => navigate("/Admin/roomadd")}
                    >
                      <AddIcon style={{ marginRight: "0.5rem" }} />
                      Thêm Phòng Học
                    </LightOrangeButton>
                  ) : null}
                </Grid>
              </Grid>
            </Box>
          ) : (
            <>
              {Array.isArray(roomsList) && roomsList.length > 0 && (
                <TableTemplate
                  buttonHaver={RoomButtonHaver}
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

export default ShowRooms;

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
