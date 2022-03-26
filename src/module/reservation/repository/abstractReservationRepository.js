/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const AbstractReservationRepositoryError = require('./error/abstractReservationRepositoryError');

module.exports = class AbstractReservationRepository {
  constructor() {
    if (new.target === AbstractReservationRepository) {
      throw new AbstractReservationRepositoryError(
        'No se puede instanciar el repositorio de reservations abstracto.',
      );
    }
  }

  /**
   * @param {import('../entity/reservation')} reservation
   * @returns {import('../entity/reservation')}
   */
  async save(reservation) {}

  /**
   * @param {Number} id
   */
  async delete(id) {}

  /**
   * @param {Number} id
   * @returns {import('../entity/reservation')}
   */
  async getById(id) {}

  /**
   * @returns {Array<import('../entity/reservation')>}
   */
  async getAll() {}
};
