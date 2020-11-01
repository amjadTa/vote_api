
const UserRepository = require('./userRepository');
const cipher = require('../auth/cipherHelper');


class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async allUsers() {
    const users = await this.repository.allUsers();
    const result = users.map(item => this.userToDto(item));
    return result;
  }

  async login(body) {
    const user = await this.findByTz(body.id);
    const { passwordHash } = cipher.sha512(body.password, user.salt);
    if (!user || user.passwordHash !== passwordHash) {
      throw new Error('Incorrect utils or password.');
    }
    const result =  user;
    return result;
  }

  async updatePassword(body) {
    console.log(body)
    const { salt, passwordHash } = cipher.saltHashPassword(body.password);
    return await this.changePassword(body.id, salt, passwordHash);
  }

  changePassword(id, salt, passwordHash) {
    return this.repository.changePassword(id, salt, passwordHash);
  }

  findByTz(id) {
    return this.repository.findByTz(id);
  }

  addUser(user) {
    return this.repository.add(user);
  }

  editUser(dto) {
    const user = this.mapDtoToUser(dto);
    return this.repository.edit(dto.email, user);
  }

  userToDto(user) {
    return user ? {
      userName: user.user_name,
      role: user.role,
      id: user.tz,
    } : {};
  }
  mapDtoToUser(dto) {
    return dto ? {
      email: dto.email,
      phone: dto.phone,
      role: dto.role,
      login: dto.login,
      firstName: dto.firstName,
      lastName: dto.lastName,
    } : {};
  }


}

module.exports = UserService;
