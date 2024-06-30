const Money = require("../models/moneySchema.js");

const moneyCreate = async (req, res) => {
  const {
    name,
    month,
    amount,
    type,
    adminID,
  } = req.body;

  try {
    const money = new Money({
      name,
      month,
      amount,
      type,
      adminID,
    });

    const existingMoneyByName = await Money.findOne({
      name: name,
      month: month,
    });

    if (existingMoneyByName) {
      res.send({ message: "Doanh thu đã tồn tại" });
    } else {
      let result = await money.save();
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getMoneys = async (req, res) => {
  try {
    let moneys = await Money.find({});
    if (moneys.length > 0) {
      res.send(moneys);
    } else {
      res.send({ message: "No moneys found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getMoneyDetail = async (req, res) => {
  try {
    let money = await Money.findById(req.params.id);
    if (money) {
      money.password = undefined;
      res.send(money);
    } else {
      res.send({ message: "No money found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteMoney = async (req, res) => {
  try {
    const deletedMoney = await Money.findByIdAndDelete(req.params.id);

    await Subject.updateOne(
      { money: deletedMoney._id, money: { $exists: true } },
      { $unset: { money: 1 } }
    );

    res.send(deletedMoney);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  moneyCreate,
  getMoneys,
  getMoneyDetail,
  deleteMoney,
};
