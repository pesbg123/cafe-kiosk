const { Users } = require('../models');

class AuthRepository {
  // username기준으로 사용자 조회
  async findByUserName(username) {
    const data = await Users.findOne({ where: { username } });
    return data;
  }
  // 유저 정보 DB에 저장
  async createUser(username, password, is_admin) {
    await Users.create({
      username,
      password,
      is_admin,
    });
    return { message: 'Sign up successful!' };
  }
}

module.exports = AuthRepository;
