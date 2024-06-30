const mongoose = require("mongoose")

const moneySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("money", moneySchema)