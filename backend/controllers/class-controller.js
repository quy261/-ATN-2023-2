const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Teacher = require("../models/teacherSchema.js");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const sclassCreate = async (req, res) => {
  try {
    const sclass = new Sclass({
      sclassName: req.body.sclassName,
    });

    const existingSclassByName = await Sclass.findOne({
      sclassName: req.body.sclassName,
    });

    if (existingSclassByName) {
      res.send({ message: "Tên lớp đã tồn tại" });
    } else {
      const result = await sclass.save();
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateSclass = async (req, res) => {
  try {
    const sclassId = req.params.id;
    const { sclassName } = req.body;
    const existingSclass = await Sclass.findById(sclassId);
    if (!existingSclass) {
      return res.status(404).send({ message: "Lớp học không tồn tại" });
    }
    const existingSclassByName = await Sclass.findOne({ sclassName });
    if (
      existingSclassByName &&
      existingSclassByName._id.toString() !== sclassId
    ) {
      return res.send({ message: "Tên lớp đã tồn tại" });
    }
    existingSclass.sclassName = sclassName;
    const updatedSclass = await existingSclass.save();
    res.send(updatedSclass);
  } catch (err) {
    res.status(500).json(err);
  }
};

const sclassList = async (req, res) => {
  try {
    const schoolId = new ObjectId(req.params.id);
    let sclassesAggregate = await Sclass.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "sclassName",
          foreignField: "sclassName",
          as: "students",
        },
      },
      {
        $addFields: {
          studentCount: { $size: "$students" },
        },
      },
      {
        $project: {
          _id: 1,
          sclassName: 1,
          school: 1,
          studentCount: 1,
        },
      },
    ]);
    if (sclassesAggregate.length > 0) {
      res.send(sclassesAggregate);
    } else {
      res.send({ message: "No sclasses found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSclassDetail = async (req, res) => {
  try {
    let sclass = await Sclass.findById(req.params.id);
    if (sclass) {
      res.send(sclass);
    } else {
      res.send({ message: "No class found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSclassStudents = async (req, res) => {
  try {
    let students = await Student.find({ sclassName: req.params.id });
    if (students.length > 0) {
      let modifiedStudents = students.map(student => {
        return { ...student._doc, password: undefined };
      });
      res.send(modifiedStudents);
    } else {
      res.send({ message: "No students found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteSclass = async (req, res) => {
  try {
    const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.send({ message: "Class not found" });
    }
    const deletedStudents = await Student.deleteMany({
      sclassName: req.params.id,
    });
    res.send(deletedClass);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  sclassCreate,
  updateSclass,
  sclassList,
  getSclassDetail,
  getSclassStudents,
  deleteSclass,
};
