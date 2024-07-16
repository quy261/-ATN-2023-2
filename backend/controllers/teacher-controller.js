const bcrypt = require("bcrypt");
const Teacher = require("../models/teacherSchema.js");
const Assistant = require("../models/assistantSchema.js");
const path = require("path");
const fs = require("fs");



const teacherRegister = async (req, res) => {
  const { name, sclassName, dob, phone, email, password, role, adminID } =
    req.body;
  const avatar = req.file ? req.file.filename : req.body.avatar;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const teacher = new Teacher({
      name,
      sclassName,
      dob,
      phone,
      email,
      password: hashedPass,
      avatar,
      role,
      school: adminID,
    });
    const existingTeacherByEmail = await Teacher.findOne({ email });
    if (existingTeacherByEmail) {
      res.send({ message: "Email đã được sử dụng" });
    } else {
      let result = await teacher.save();
      result.password = undefined;
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const teacherLogIn = async (req, res) => {
  try {
    let teacher = await Teacher.findOne({ email: req.body.email });
    if (teacher) {
      const validated = await bcrypt.compare(
        req.body.password,
        teacher.password
      );
      if (validated) {
        teacher.password = undefined;
        res.send(teacher);
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      let assistant = await Assistant.findOne({ email: req.body.email });
      if (assistant) {
        const validated = await bcrypt.compare(
          req.body.password,
          assistant.password
        );
        if (validated) {
          assistant.password = undefined;
          res.send(assistant);
        } else {
          res.send({ message: "Invalid password" });
        }
      } else {
        res.send({ message: "User not found" });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getTeachers = async (req, res) => {
  try {
    let teachers = await Teacher.find({});
    if (teachers.length > 0) {
      let modifiedTeachers = teachers.map(teacher => {
        return { ...teacher._doc, password: undefined };
      });
      res.send(modifiedTeachers);
    } else {
      res.send({ message: "No teachers found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getTeacherDetail = async (req, res) => {
  try {
    let teacher = await Teacher.findById(req.params.id);
    console.log(teacher.avatar);
    if (teacher) {
      teacher.password = undefined;
      res.send(teacher);
    } else {
      res.send({ message: "No teacher found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const { name, sclassName, dob, phone } = req.body;
    const avatar = req.file ? req.file.filename : req.body.avatar;
    const existingTeacher = await Teacher.findById(teacherId);
    if (!existingTeacher) {
      return res.status(404).send({ message: "Giáo viên không tồn tại" });
    }

    // Xóa ảnh cũ nếu tồn tại
    if (existingTeacher.avatar) {
      const oldPath = path.join(__dirname, "..", 'public/avatar', existingTeacher.avatar);
      if (fs.existsSync(oldPath)) {
        await fs.unlinkSync(oldPath);
        console.log("Xoá ảnh cũ thành công!!!");
      }
    }

    existingTeacher.name = name;
    existingTeacher.sclassName = sclassName;
    existingTeacher.dob = dob;
    existingTeacher.phone = phone;
    existingTeacher.avatar = avatar;
    const updatedTeacher = await existingTeacher.save();
    res.send(updatedTeacher);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    res.send(deletedTeacher);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  updateTeacher,
  deleteTeacher,
};
