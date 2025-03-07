const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const {
  adminRegister,
  adminLogIn,
  getAdminDetail,
  getAllAdmins,
  deleteAdmin,
  updateAdmin,
  accountantLogIn,
} = require("../controllers/admin-controller.js");

const {
  sclassCreate,
  sclassList,
  deleteSclass,
  getSclassDetail,
  getSclassStudents,
  updateSclass,
} = require("../controllers/class-controller.js");

const {
  studentRegister,
  studentLogIn,
  getStudents,
  getStudentDetail,
  deleteStudents,
  deleteStudent,
  updateStudent,
  deleteStudentsByClass,
} = require("../controllers/student_controller.js");

const {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  deleteTeacher,
  updateTeacher,
} = require("../controllers/teacher-controller.js");

const {
  assistantRegister,
  assistantLogIn,
  getAssistants,
  getAssistantDetail,
  deleteAssistants,
  deleteAssistantsByClass,
  deleteAssistant,
  assistantAttendance,
  updateAssistant,
} = require("../controllers/assistant-controller.js");

const {
  roomCreate,
  getRooms,
  getRoomDetail,
  updateRoom,
  deleteRoom,
  deleteRooms,
  deleteRoomsByClass,
} = require("../controllers/room-controller.js");

const {
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
} = require("../controllers/schedule-controller.js");

const {
  deleteMoney,
  getMoneyDetail,
  getMoneys,
  moneyCreate,
  updateMoney,
} = require("../controllers/money-controller.js");

const {
  getMoneyDefs,
  moneyDefCreate,
  editMoneyDef,
  getMoneyDefDetails,
} = require("../controllers/money-def-controller.js");

const {
  commentCreate,
  getCommentById,
} = require("../controllers/comment-controller.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "avatar"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "image"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload2 = multer({ storage: storage2 });

// Admin
router.post("/AdminReg", adminRegister);
router.post("/AdminLogin", adminLogIn);
router.get("/Admin/:id", getAdminDetail);
router.get("/Admins", getAllAdmins);
router.delete("/Admin/:id", deleteAdmin);
router.post("/Admin/:id", updateAdmin);
router.post("/AccountantLogin", accountantLogIn);

// Student
router.post("/StudentReg", studentRegister);
router.post("/StudentLogin", studentLogIn);
router.get("/Students/:id", getStudents);
router.get("/Student/:id", getStudentDetail);
router.delete("/Students/:id", deleteStudents);
router.delete("/StudentsClass/:id", deleteStudentsByClass);
router.delete("/Student/:id", deleteStudent);
router.post("/Student/:id", updateStudent);

// Teacher
router.post("/TeacherReg", upload.single("avatar"), teacherRegister);
router.post("/TeacherLogin", teacherLogIn);
router.post("/Teacher/:id", upload.single("avatar"), updateTeacher);
router.get("/Teachers/:id", getTeachers);
router.get("/Teacher/:id", getTeacherDetail);
router.delete("/Teacher/:id", deleteTeacher);

// Assistant
router.post("/AssistantReg", upload.single("avatar"), assistantRegister);
router.post("/AssistantLogin", assistantLogIn);
router.post("/Assistant/:id", upload.single("avatar"), updateAssistant);
router.get("/Assistants/:id", getAssistants);
router.get("/Assistant/:id", getAssistantDetail);
router.delete("/Assistants/:id", deleteAssistants);
router.delete("/AssistantsClass/:id", deleteAssistantsByClass);
router.delete("/Assistant/:id", deleteAssistant);
router.post("/AssistantAttendance/:id", assistantAttendance);

// Room
router.post("/RoomCreate", roomCreate);
router.get("/Rooms/:id", getRooms);
router.get("/Room/:id", getRoomDetail);
router.post("/Room/:id", updateRoom);
router.delete("/Rooms/:id", deleteRooms);
router.delete("/RoomsClass/:id", deleteRoomsByClass);
router.delete("/Room/:id", deleteRoom);

// Money
router.post("/MoneyCreate", upload2.single("image"), moneyCreate);
router.get("/Moneys", getMoneys);
router.get("/Money/:id", getMoneyDetail);
router.post("/Money/:id", updateMoney);
router.delete("/Money/:id", deleteMoney);

// Sclass
router.post("/SclassCreate", sclassCreate);
router.post("/Sclass/:id", updateSclass);
router.get("/SclassList/:id", sclassList);
router.get("/Sclass/:id", getSclassDetail);
router.get("/Sclass/Students/:id", getSclassStudents);
router.delete("/Sclass/:id", deleteSclass);

// Schedule
router.post("/ScheduleCreate", scheduleCreate);
router.post("/Schedule/:id", updateSchedule);
router.get("/ScheduleList", scheduleList);
router.get("/Schedule/:id", getScheduleDetails);
router.get("/ScheduleByClass/:id", schedulesByClass);
router.get("/ScheduleByTeacher/:id", schedulesByTeacher);
router.get("/ScheduleByAssistant/:id", schedulesByAssistant);
router.get("/ScheduleByStudent/:id", schedulesByStudent);
router.get("/ScheduleByRoom/:id", schedulesByRoom);
router.delete("/Schedule/:id", deleteSchedule);

// Comment
router.post("/CommentCreate", commentCreate);
router.get("/Comment/:id", getCommentById);

// MoneyDef
router.post("/MoneyDefCreate", moneyDefCreate);
router.get("/MoneyDefs", getMoneyDefs);
router.get("/MoneyDefDetails/:id", getMoneyDefDetails);
router.post("/MoneyDef/:id", editMoneyDef);

module.exports = router;
