const bcrypt = require("bcrypt");
const Assistant = require("../models/assistantSchema.js");
const Teacher = require("../models/teacherSchema.js");
const path = require("path");
const fs = require("fs");

const assistantRegister = async (req, res) => {
  const { name, sclassName, dob, phone, email, password, role, adminID } =
    req.body;
  const avatar = req.file ? req.file.path : req.body.avatar;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const assistant = new Assistant({
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
    const existingAssistantByEmail = await Assistant.findOne({ email });
    if (existingAssistantByEmail) {
      res.send({ message: "Email đã được sử dụng" });
    } else {
      let result = await assistant.save();
      result.password = undefined;
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const assistantLogIn = async (req, res) => {
  try {
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
      res.send({ message: "Assistant not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAssistants = async (req, res) => {
  try {
    let assistants = await Assistant.find({});
    if (assistants.length > 0) {
      let modifiedAssistants = assistants.map(assistant => {
        return { ...assistant._doc, password: undefined };
      });
      res.send(modifiedAssistants);
    } else {
      res.send({ message: "No assistants found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAssistantDetail = async (req, res) => {
  try {
    let assistant = await Assistant.findById(req.params.id);
    if (assistant) {
      assistant.password = undefined;
      res.send(assistant);
    } else {
      res.send({ message: "No assistant found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateAssistant = async (req, res) => {
  try {
    const assistantId = req.params.id;
    const { name, sclassName, dob, phone } = req.body;
    const avatar = req.file ? req.file.filename : req.body.avatar;

    const existingAssistant = await Assistant.findById(assistantId);
    if (!existingAssistant) {
      return res.status(404).send({ message: "Trợ giảng không tồn tại" });
    }

    // Xóa ảnh cũ nếu tồn tại
    if (existingAssistant.avatar) {
      const oldPath = path.join(__dirname, "..", 'public/avatar', existingAssistant.avatar);
      if (fs.existsSync(oldPath)) {
        await fs.unlinkSync(oldPath);
        console.log("Xoá ảnh cũ thành công!!!");
      }
    }
    existingAssistant.name = name;
    existingAssistant.sclassName = sclassName;
    existingAssistant.dob = dob;
    existingAssistant.phone = phone;
    existingAssistant.avatar = avatar;

    const updatedAssistant = await existingAssistant.save();
    res.send(updatedAssistant);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteAssistant = async (req, res) => {
  try {
    const deletedAssistant = await Assistant.findByIdAndDelete(req.params.id);

    await Subject.updateOne(
      { assistant: deletedAssistant._id, assistant: { $exists: true } },
      { $unset: { assistant: 1 } }
    );

    res.send(deletedAssistant);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteAssistants = async (req, res) => {
  try {
    const deletionResult = await Assistant.deleteMany({
      school: req.params.id,
    });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No assistants found to delete" });
      return;
    }

    const deletedAssistants = await Assistant.find({ school: req.params.id });

    await Subject.updateMany(
      {
        assistant: { $in: deletedAssistants.map(assistant => assistant._id) },
        assistant: { $exists: true },
      },
      { $unset: { assistant: "" }, $unset: { assistant: null } }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteAssistantsByClass = async (req, res) => {
  try {
    const deletionResult = await Assistant.deleteMany({
      sclassName: req.params.id,
    });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No assistants found to delete" });
      return;
    }

    const deletedAssistants = await Assistant.find({
      sclassName: req.params.id,
    });

    await Subject.updateMany(
      {
        assistant: { $in: deletedAssistants.map(assistant => assistant._id) },
        assistant: { $exists: true },
      },
      { $unset: { assistant: "" }, $unset: { assistant: null } }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const assistantAttendance = async (req, res) => {
  const { status, date } = req.body;

  try {
    const assistant = await Assistant.findById(req.params.id);

    if (!assistant) {
      return res.send({ message: "Assistant not found" });
    }

    const existingAttendance = assistant.attendance.find(
      a => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      assistant.attendance.push({ date, status });
    }

    const result = await assistant.save();
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  assistantRegister,
  assistantLogIn,
  getAssistants,
  getAssistantDetail,
  deleteAssistant,
  deleteAssistants,
  deleteAssistantsByClass,
  assistantAttendance,
  updateAssistant,
};
