/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const AbstractCarRepositoryError = require('./error/abstractCarRepositoryError');

module.exports = class AbstractCarRepository {
  constructor() {
    if (new.target === AbstractCarRepository) {
      throw new AbstractCarRepositoryError(
        'No se puede instanciar el repositorio de cars abstracto.',
      );
    }
  }

  /**
   * @param {import('../entity/car')} car
   * @returns {import('../entity/car')}
   */
  async save(car) {}

  /**
   * @param {Number} car
   */
  async delete(car) {}

  /**
   * @param {Number} id
   * @returns {import('../entity/car')}
   */
  async getById(id) {}

  /**
   * @returns {Array<import('../entity/car')>}
   */
  async getAll() {}
};
