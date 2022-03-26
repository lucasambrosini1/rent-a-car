const { fromModelToEntity } = require('../../mapper/userMapper');
const AbstractUserRepository = require('../abstractUserRepository');
const UserNotFoundError = require('../error/userNotFoundError');
const UserIdNotDefinedError = require('../error/userIdNotDefinedError');

module.exports = class UserRepository extends AbstractUserRepository {
  /**
     * @param {typeof import('../../model/carModel')} userModel
     */

  constructor(userModel) {
    super();
    this.userModel = userModel;
  }

  /**
     * @param {import('../../entity/User')} user
     * @returns {Promise<import('../../entity/user')>}
     */

  async save(user) {
    let userModel;
    const buildOptions = { isNewRecord: !user.id };
    userModel = this.userModel.build(user, buildOptions);
    userModel = await userModel.save();

    return fromModelToEntity(userModel);
  }

  /**
     * @param {import('../../entity/User')} user
     * @returns {Boolean}
     */

  async deleteById(id) {
    if (!id) {
      throw new UserIdNotDefinedError();
    }

    return Boolean(await this.userModel.destroy({ where: { id } }));
  }

  /**
     * @param {Number} id
     * @returns {Promise<import('../../entity/user')>}
     */

  async getById(id) {
    const userModel = await this.userModel.findOne({
      where: { id },
    });

    if (!userModel) {
      throw new UserNotFoundError(`User with ID: ${id} has not been found`);
    }
    return fromModelToEntity(userModel);
  }

  /**
     * @return {Promise<Array<import('../../entity/user')>>}
     */
  async getAll() {
    const users = await this.userModel.findAll();
    return users.map(fromModelToEntity);
  }
};
