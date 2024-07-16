const MoneyDef = require("../models/moneyDefSchema.js");

const moneyDefCreate = async (req, res) => {
  const {
    type,
    amount,
    adminID,
  } = req.body;
  try {
    const moneyDef = new MoneyDef({
      type,
      amount,
      adminID,
    });
    const existingMoneyDefByName = await MoneyDef.findOne({
      type: type,
    });
    if (existingMoneyDefByName) {
      res.send({ message: "Định nghĩa doanh thu đã tồn tại" });
    } else {
      let result = await moneyDef.save();
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getMoneyDefs = async (req, res) => {
  try {
    let moneyDefs = await MoneyDef.find({});
    if (moneyDefs.length > 0) {
      res.send(moneyDefs);
    } else {
      res.send({ message: "No money defs found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getMoneyDefDetails = async (req, res) => {
  try {
    const moneyDefId = req.params.id;
    const existingMoneyDef = await MoneyDef.findById(moneyDefId);
    if (existingMoneyDef) {
      console.log(existingMoneyDef);
      res.send(existingMoneyDef);
    } else {
      res.send({ message: "No money def found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const editMoneyDef = async (req, res) => {
  try {
    const moneyDefId = req.params.id;
    const { amount } = req.body;
    const existingMoneyDef = await MoneyDef.findById(moneyDefId);
    if (!existingMoneyDef) {
      return res.status(404).send({ message: "Định nghĩa doanh thu không tồn tại" });
    }
    existingMoneyDef.amount = amount;
    const updatedMoneyDef = await existingMoneyDef.save();
    res.send(updatedMoneyDef);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  moneyDefCreate,
  getMoneyDefs,
  editMoneyDef,
  getMoneyDefDetails,
};
