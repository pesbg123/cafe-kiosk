const { Users } = require('../models');

const adminMiddleware = async (req, res, next) => {
  try {
    const { userId } = res.locals.user;

    // admin인지 확인
    const adminCheck = await Users.findOne({ where: { userId } });
    console.log(adminCheck.dataValues.is_admin);
    if (!adminCheck.dataValues.is_admin) {
      return res.status(401).json({ errorMessage: 'You are not an admin' });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = adminMiddleware;
