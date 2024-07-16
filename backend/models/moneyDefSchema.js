const mongoose = require("mongoose");

const moneyDefSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    amount: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("moneyDef", moneyDefSchema);
