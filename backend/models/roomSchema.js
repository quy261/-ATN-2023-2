const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    resources: {
      type: Map,
      of: String,
      required: true,
    },
    availability: {
      type: String,
      required: true,
    },
    schedule: {
      type: [String],
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("room", roomSchema);
