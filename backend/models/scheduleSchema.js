const mongoose = require("mongoose");

const absenceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  asked: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: false,
  },
});

const scheduleSchema = new mongoose.Schema(
  {
    sclass: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    teacher: {
      type: String,
      required: true,
    },
    assistant: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    absences: {
      type: [absenceSchema],
      default: [],
    },
    content: {
      type: String,
    },
    linkZoom: {
      type: String,
    },
    linkFile: {
      type: String,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("schedule", scheduleSchema);
