const Room = require("../models/roomSchema.js");

const roomCreate = async (req, res) => {
  const {
    name,
    capacity,
    location,
    resources,
    availability,
    schedule,
    role,
    adminID,
  } = req.body;
  try {
    const room = new Room({
      name,
      capacity,
      location,
      resources,
      availability,
      schedule,
      role,
      school: adminID,
    });
    const existingRoomByName = await Room.findOne({
      name: name,
      location: location,
    });
    if (existingRoomByName) {
      res.send({ message: "Tên phòng học đã được sử dụng" });
    } else {
      let result = await room.save();
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getRooms = async (req, res) => {
  try {
    let rooms = await Room.find({});
    if (rooms.length > 0) {
      let modifiedRooms = rooms.map(room => {
        return { ...room._doc, password: undefined };
      });
      res.send(modifiedRooms);
    } else {
      res.send({ message: "No rooms found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getRoomDetail = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    if (room) {
      room.password = undefined;
      res.send(room);
    } else {
      res.send({ message: "No room found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const {
      name,
      capacity,
      location,
      resources,
      availability,
      schedule,
      adminID,
    } = req.body;
    const existingRoom = await Room.findById(roomId);
    if (!existingRoom) {
      return res.status(404).send({ message: "Lớp học không tồn tại" });
    }
    const existingRoomByName = await Room.findOne({
      name: name,
      location: location,
    });
    if (existingRoomByName && existingRoomByName._id.toString() !== roomId) {
      return res.status(405).send({ message: "Tên phòng học đã được sử dụng" });
    }
    existingRoom.name = name;
    existingRoom.capacity = capacity;
    existingRoom.location = location;
    existingRoom.resources = resources;
    existingRoom.availability = availability;
    existingRoom.schedule = schedule;
    existingRoom.school = adminID;
    const updatedRoom = await existingRoom.save();
    return res.send(updatedRoom);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateRoomSubject = async (req, res) => {
  const { roomId, teachSubject } = req.body;
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { teachSubject },
      { new: true }
    );
    await Subject.findByIdAndUpdate(teachSubject, {
      room: updatedRoom._id,
    });
    res.send(updatedRoom);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    await Subject.updateOne(
      { room: deletedRoom._id, room: { $exists: true } },
      { $unset: { room: 1 } }
    );
    res.send(deletedRoom);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteRooms = async (req, res) => {
  try {
    const deletionResult = await Room.deleteMany({ school: req.params.id });
    const deletedCount = deletionResult.deletedCount || 0;
    if (deletedCount === 0) {
      res.send({ message: "No rooms found to delete" });
      return;
    }
    const deletedRooms = await Room.find({ school: req.params.id });
    await Subject.updateMany(
      {
        room: { $in: deletedRooms.map(room => room._id) },
        room: { $exists: true },
      },
      { $unset: { room: "" }, $unset: { room: null } }
    );
    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteRoomsByClass = async (req, res) => {
  try {
    const deletionResult = await Room.deleteMany({
      sclassName: req.params.id,
    });
    const deletedCount = deletionResult.deletedCount || 0;
    if (deletedCount === 0) {
      res.send({ message: "No rooms found to delete" });
      return;
    }
    const deletedRooms = await Room.find({ sclassName: req.params.id });
    await Subject.updateMany(
      {
        room: { $in: deletedRooms.map(room => room._id) },
        room: { $exists: true },
      },
      { $unset: { room: "" }, $unset: { room: null } }
    );
    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const roomAttendance = async (req, res) => {
  const { status, date } = req.body;
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.send({ message: "Room not found" });
    }
    const existingAttendance = room.attendance.find(
      a => a.date.toDateString() === new Date(date).toDateString()
    );
    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      room.attendance.push({ date, status });
    }
    const result = await room.save();
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  roomCreate,
  getRooms,
  getRoomDetail,
  updateRoom,
  updateRoomSubject,
  deleteRoom,
  deleteRooms,
  deleteRoomsByClass,
  roomAttendance,
};
