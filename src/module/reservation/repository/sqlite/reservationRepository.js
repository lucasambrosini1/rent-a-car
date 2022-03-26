const { fromModelToEntity } = require('../../mapper/reservationMapper');
const AbstractReservationRepository = require('../abstractReservationRepository');
const ReservationNotFoundError = require('../error/reservationNotFoundError');
const ReservationIdNotDefinedError = require('../error/reservationIdNotDefinedError');

module.exports = class reservationRepository extends AbstractReservationRepository {
  constructor(reservationModel) {
    super();
    this.reservationModel = reservationModel;
  }

  async save(reservation) {
    let reservationModel;
    const buildOptions = { isNewRecord: !reservation.id };
    reservationModel = this.reservationModel.build(reservation, buildOptions);
    reservationModel = await reservationModel.save();

    return fromModelToEntity(reservationModel);
  }

  async delete(reservation) {
    if (!reservation || !reservation.id) {
      throw new ReservationIdNotDefinedError();
    }
    return Boolean(await this.reservationModel.destroy({ where: { id: reservation.id } }));
  }

  async getById(id) {
    const reservationModel = await this.reservationModel.findOne({ where: { id } });

    if (!reservationModel) {
      throw new ReservationNotFoundError(`Reservation with ID: ${id} has not been found`);
    }
    return fromModelToEntity(reservationModel);
  }

  async getAll() {
    const reservations = await this.reservationModel.findAll();
    return reservations.map(fromModelToEntity);
  }
};
