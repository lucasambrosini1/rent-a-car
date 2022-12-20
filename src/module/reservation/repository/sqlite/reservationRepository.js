const { fromModelToEntity } = require('../../mapper/reservationMapper');
const AbstractReservationRepository = require('../abstractReservationRepository');
const ReservationNotFoundError = require('../error/reservationNotFoundError');
const ReservationIdNotDefinedError = require('../error/reservationIdNotDefinedError');

module.exports = class reservationRepository extends AbstractReservationRepository {
  constructor(reservationModel, carModel, userModel) {
    super();
    this.reservationModel = reservationModel;
    this.carModel = carModel;
    this.userModel = userModel;
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
    if (!id) {
      throw new ReservationIdNotDefinedError();
    }
    const reservationModel = await this.reservationModel.findOne({
      where: { id },
      include: [
        { model: this.carModel },
        { model: this.userModel }]
      ,
    });

    if (!reservationModel) {
      throw new ReservationNotFoundError(`Reservation with ID: ${id} has not been found`);
    }

    return fromModelToEntity(reservationModel);
  }

  async getAll() {
    const reservations = await this.reservationModel.findAll({
      include: [
        { model: this.carModel },
        { model: this.userModel }],
    });
    return reservations.map(fromModelToEntity);
  }
};
