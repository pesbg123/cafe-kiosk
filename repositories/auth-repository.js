const { Users } = require('../models');

class AuthRepository {
  // userName기준으로 사용자 조회
  async findByuserName(userName) {
    const data = await Users.findOne({ where: { userName } });
    return data;
  }
  // 유저 정보 DB에 저장
  async createUser(userName, password, is_admin) {
    await Users.create({
      userName,
      password,
      is_admin,
    });
    return { message: 'Sign up successful!' };
  }

  // // admin인지 구분
  // async adminCheck(userId) {
  //   const adminCheck = await Users.findOne({ where: { userId } });
  //   return adminCheck.is_admin;
  // }
}

module.exports = AuthRepository;
