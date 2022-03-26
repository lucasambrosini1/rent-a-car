/**
 * @typedef {import('../repository/abstractCarRepository')} AbstractCarRepository
 */

const UserNotDefinedError = require('./error/userNotDefinedError');
const UserIdNotDefinedError = require('./error/userIdNotDefinedError');
const User = require('../entity/user');

module.exports = class userService {
  /**
      *
      * @param {AbstractUserRepository} userRepository
      */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  /**
    * @param {user} user
    */

  async save(user) {
    if (user === undefined) {
      throw new UserNotDefinedError();
    }
    return this.userRepository.save(user);
  }

  /**
    * @param {user} user
    */
  async delete(user) {
    if (!(user instanceof User)) {
      throw new UserNotDefinedError();
    }
    return this.userRepository.delete(user);
  }

  async getById(id) {
    if (id === undefined) {
      throw new UserIdNotDefinedError();
    }
    return this.userRepository.getById(id);
  }

  async getAll() {
    return this.userRepository.getAll();
  }
};
