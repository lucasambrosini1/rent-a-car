/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const AbstractUserRepositoryError = require('./error/abstractUserRepositoryError');

module.exports = class AbstractUserRepository {
  constructor() {
    if (new.target === AbstractUserRepository) {
      throw new AbstractUserRepositoryError(
        'No se puede instanciar el repositorio de users abstracto.',
      );
    }
  }

  /**
   * @param {import('../entity/user')} user
   * @returns {import('../entity/user')}
   */
  async save(user) {}

  /**
   * @param {Number} id
   */
  async delete(id) {}

  /**
   * @param {Number} id
   * @returns {import('../entity/user')}
   */
  async getById(id) {}

  /**
   * @returns {Array<import('../entity/user')>}
   */
  async getAll() {}
};
