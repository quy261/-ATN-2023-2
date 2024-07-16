const Student = require("../models/studentSchema.js");
const Schedule = require("../models/scheduleSchema.js");
const mongoose = require("mongoose");

const scheduleCreate = async (req, res) => {
  const { sclass, room, teacher, assistant, startTime, endTime, adminID } =
    req.body;
  try {
    const conflictingSchedules = await Schedule.find({
      $or: [{ sclass }, { room }, { teacher }, { assistant }],
      $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }],
    });

    if (conflictingSchedules.length > 0) {
      let conflictMessage = "Lịch học bị trùng đối với: ";
      conflictingSchedules.forEach(schedule => {
        if (schedule.sclass.toString() === sclass) {
          conflictMessage += "lớp học, ";
        }
        if (schedule.room.toString() === room) {
          conflictMessage += "phòng học, ";
        }
        if (schedule.teacher.toString() === teacher) {
          conflictMessage += "giáo viên, ";
        }
        if (schedule.assistant.toString() === assistant) {
          conflictMessage += "trợ giảng, ";
        }
      });
      conflictMessage = conflictMessage.replace(/, $/, "");
      return res.status(500).json({ message: conflictMessage });
    }

    const schedule = new Schedule({
      sclass,
      room,
      teacher,
      assistant,
      startTime,
      endTime,
      absences: [],
      content: "",
      linkZoom: "",
      linkFile: "",
      school: adminID,
    });

    let result = await schedule.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const scheduleList = async (req, res) => {
  try {
    let scheduleList = await Schedule.find();
    if (scheduleList.length > 0) {
      res.send(scheduleList);
    } else {
      res.send({ message: "No schedule found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const schedulesByClass = async (req, res) => {
  const sclass = req.params.id;
  try {
    let scheduleList = await Schedule.find({ sclass: sclass });
    if (scheduleList.length > 0) {
      res.send(scheduleList);
    } else {
      res.send({ message: "No schedule found 2" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const schedulesByTeacher = async (req, res) => {
  const teacher = req.params.id;
  try {
    let scheduleList = await Schedule.find({ teacher: teacher });
    if (scheduleList.length > 0) {
      res.send(scheduleList);
    } else {
      res.send({ message: "No schedule found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const schedulesByAssistant = async (req, res) => {
  const assistant = req.params.id;
  try {
    let scheduleList = await Schedule.find({ assistant: assistant });
    if (scheduleList.length > 0) {
      res.send(scheduleList);
    } else {
      res.send({ message: "No schedule found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const schedulesByStudent = async (req, res) => {
  const studentId = req.params.id;
  try {
    let student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    const sclassName = student.sclassName;
    let scheduleList = await Schedule.find({ sclass: sclassName });
    if (scheduleList.length > 0) {
      res.send(scheduleList);
    } else {
      res.send({ message: "No schedule found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const schedulesByRoom = async (req, res) => {
  const room = req.params.id;
  try {
    let scheduleList = await Schedule.find({ room: room });
    if (scheduleList.length > 0) {
      res.send(scheduleList);
    } else {
      res.send({ message: "No schedule found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getScheduleDetails = async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.id);
    if (schedule) {
      res.send(schedule);
    } else {
      res.send({ message: "No class found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    await Subject.updateOne(
      { scheudle: deletedSchedule._id, scheudle: { $exists: true } },
      { $unset: { scheudle: 1 } }
    );
    res.send(deletedSchedule);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateSchedule = async (req, res) => {
  const scheduleId = req.params.id;
  if (!req.body.type) {
    const { sclass, room, teacher, assistant, startTime, endTime, adminID } =
      req.body;
    try {
      const existingSchedule = await Schedule.findById(scheduleId);
      if (!existingSchedule) {
        return res.status(404).json({ message: "Lịch học không tồn tại" });
      }
      const conflictingSchedules = await Schedule.find({
        $and: [
          { _id: { $ne: scheduleId } },
          {
            $or: [{ sclass }, { room }, { teacher }, { assistant }],
          },
          { startTime: { $lt: endTime } },
          { endTime: { $gt: startTime } },
        ],
      });
      if (conflictingSchedules.length > 0) {
        let conflictMessage = "Lịch học bị trùng đối với: ";
        conflictingSchedules.forEach(schedule => {
          if (schedule.sclass.toString() === sclass) {
            conflictMessage += "lớp học, ";
          }
          if (schedule.room.toString() === room) {
            conflictMessage += "phòng học, ";
          }
          if (schedule.teacher.toString() === teacher) {
            conflictMessage += "giáo viên, ";
          }
          if (schedule.assistant.toString() === assistant) {
            conflictMessage += "trợ giảng, ";
          }
        });
        conflictMessage = conflictMessage.replace(/, $/, "");
        return res.status(500).json({ message: conflictMessage });
      }
      existingSchedule.sclass = sclass;
      existingSchedule.room = room;
      existingSchedule.teacher = teacher;
      existingSchedule.assistant = assistant;
      existingSchedule.startTime = startTime;
      existingSchedule.endTime = endTime;
      existingSchedule.school = adminID;
      const updatedSchedule = await existingSchedule.save();
      res.send(updatedSchedule);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  // cập nhật tài liệu
  else if (req.body.type == "content") {
    const { content, linkZoom, linkFile } = req.body;
    try {
      const existingSchedule = await Schedule.findById(scheduleId);
      if (!existingSchedule) {
        return res.status(404).json({ message: "Lịch học không tồn tại" });
      }
      existingSchedule.content = content;
      existingSchedule.linkZoom = linkZoom;
      existingSchedule.linkFile = linkFile;
      const updatedSchedule = await existingSchedule.save();
      res.send(updatedSchedule);
    } catch (err) {
      res.status(500).json(err);
    }
  } else if (req.body.type == "absence") {
    const { absences } = req.body;
    try {
      const existingSchedule = await Schedule.findById(scheduleId);
      if (!existingSchedule) {
        return res.status(404).json({ message: "Lịch học không tồn tại" });
      }
      existingSchedule.absences = absences;
      const updatedSchedule = await existingSchedule.save();
      res.send(updatedSchedule);
    } catch (err) {
      res.status(500).json(err);
    }
  } 
  // điểm danh
  else {
    const { userId, asked, reason } = req.body;
    try {
      const existingSchedule = await Schedule.findById(scheduleId);
      if (!existingSchedule) {
        return res.status(404).json({ message: "Lịch học không tồn tại" });
      }
      const index = existingSchedule.absences.findIndex(
        item => item.id === userId
      );
      if (!asked) {
        if (index === -1) {
          existingSchedule.absences.push({ id: userId, asked: "true", reason: reason });
        }
      } else {
        if (index !== -1) {
          existingSchedule.absences.splice(index, 1);
        }
      }
      const updatedSchedule = await existingSchedule.save();
      res.send(updatedSchedule);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

module.exports = {
  scheduleCreate,
  scheduleList,
  getScheduleDetails,
  schedulesByClass,
  schedulesByTeacher,
  schedulesByAssistant,
  schedulesByStudent,
  schedulesByRoom,
  deleteSchedule,
  updateSchedule,
};
