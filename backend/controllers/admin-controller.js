const bcrypt = require("bcrypt");

const Admin = require("../models/adminSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Assistant = require("../models/assistantSchema.js");
const Student = require("../models/studentSchema.js");

const adminRegister = async (req, res) => {
  const { name, email, password, role, schoolName } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const admin = new Admin({
      name,
      email,
      password: hashedPass,
      role,
      schoolName,
    });
    const existingAdminByEmail = await Admin.findOne({ email: email });
    if (existingAdminByEmail) {
      res.send({ message: "Email đã được sử dụng" });
    } else {
      let result = await admin.save();
      result.password = undefined;
      console.log(result);
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const adminLogIn = async (req, res) => {
  if (req.body.email && req.body.password) {
    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
      const isMatch = await bcrypt.compare(req.body.password, admin.password);
      if (isMatch) {
        admin.password = undefined;
        console.log(admin);
        res.send(admin);
      } else {
        res.send({ message: "Sai mật khẩu" });
      }
    } else {
      res.send({ message: "Tài khoản quản trị không tồn tại" });
    }
  } else {
    res.send({ message: "Bạn cần nhập đủ tài khoản mật khẩu" });
  }
};

const accountantLogIn = async (req, res) => {
  if (req.body.email && req.body.password) {
    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
      const isMatch = await bcrypt.compare(req.body.password, admin.password);
      if (isMatch) {
        admin.password = undefined;
        res.send(admin);
      } else {
        res.send({ message: "Sai mật khẩu" });
      }
    } else {
      res.send({ message: "Tài khoản quản trị không tồn tại" });
    }
  } else {
    res.send({ message: "Bạn cần nhập đủ tài khoản mật khẩu" });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    let admins = await Admin.find({});
    if (admins.length > 0) {
      res.send(admins);
    } else {
      res.send({ message: "No admins found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAdminDetail = async (req, res) => {
  try {
    let admin = await Admin.findById(req.params.id);
    if (admin) {
      admin.password = undefined;
      res.send(admin);
    } else {
      res.send({ message: "No admin found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    res.send({
      school: deleteAdmin.schoolName,
      ...deletedAdmin,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const { oldPassword, newPassword, role } = req.body;
    if (oldPassword == newPassword) {
      return res
        .status(400)
        .send({ message: "Mật khẩu mới trùng với mật khẩu cũ" });
    }
    if (role == "Admin" || role == "Accountant") {
      const existingAdmin = await Admin.findById(id);
      if (!existingAdmin) {
        return res.status(404).send({ message: "Admin không tồn tại" });
      }
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        existingAdmin.password
      );
      if (!isPasswordMatch) {
        return res.status(404).send({ message: "Mật khẩu cũ không chính xác" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(newPassword, salt);
      existingAdmin.password = hashedPass;
      const updatedAdmin = await existingAdmin.save();
      res.send(updatedAdmin);
    } else if (role == "Teacher") {
      const existingTeacher = await Teacher.findById(id);
      if (!existingTeacher) {
        return res.status(404).send({ message: "Giáo viên không tồn tại" });
      }
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        existingTeacher.password
      );
      if (!isPasswordMatch) {
        return res.status(404).send({ message: "Mật khẩu cũ không chính xác" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(newPassword, salt);
      existingTeacher.password = hashedPass;
      const updatedTeacher = await existingTeacher.save();
      res.send(updatedTeacher);
    } else if (role == "Assistant") {
      const existingAssistant = await Assistant.findById(id);
      if (!existingAssistant) {
        return res.status(404).send({ message: "Giáo viên không tồn tại" });
      }
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        existingAssistant.password
      );
      if (!isPasswordMatch) {
        return res.status(404).send({ message: "Mật khẩu cũ không chính xác" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(newPassword, salt);
      existingAssistant.password = hashedPass;
      const updatedAssistant = await existingAssistant.save();
      res.send(updatedAssistant);
    } else {
      const existingStudent = await Student.findById(id);
      if (!existingStudent) {
        return res.status(404).send({ message: "Giáo viên không tồn tại" });
      }
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        existingStudent.password
      );
      if (!isPasswordMatch) {
        return res.status(404).send({ message: "Mật khẩu cũ không chính xác" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(newPassword, salt);
      existingStudent.password = hashedPass;
      const updatedStudent = await existingStudent.save();
      res.send(updatedStudent);
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  adminRegister,
  adminLogIn,
  accountantLogIn,
  getAllAdmins,
  getAdminDetail,
  deleteAdmin,
  updateAdmin,
};
