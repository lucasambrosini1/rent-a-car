/**
 * @typedef {import('../repository/abstractReservationRepository')} AbstractReservationRepository
 */

const ReservationNotDefinedError = require('./error/reservationNotDefinedError');
const ReservationIdNotDefinedError = require('./error/reservationIdNotDefinedError');
const Reservation = require('../entity/reservation');

module.exports = class reservationService {
  /**
    *
    * @param {AbstractReservationRepository} reservationRepository
    */

  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  async save(reservation) {
    if (reservation === undefined) {
      throw new ReservationNotDefinedError();
    }
    return this.reservationRepository.save(reservation);
  }

  async delete(reservation) {
    if (!(reservation instanceof Reservation)) {
      throw new ReservationNotDefinedError();
    }
    return this.reservationRepository.delete(reservation);
  }

  async getById(id) {
    if (id === undefined) {
      throw new ReservationIdNotDefinedError();
    }
    return this.reservationRepository.getById(id);
  }

  async getAll() {
    return this.reservationRepository.getAll();
  }
};
