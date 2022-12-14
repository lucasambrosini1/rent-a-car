const Reservation = require('../entity/reservation');

function fromDataToEntity({
  id,
  userId,
  carId,
  dayPrice,
  startDate,
  car,
  user,
  finishedDate,
  paymentMethod,
  paymentStatus,
}) {
  return new Reservation({
    id,
    userId,
    carId,
    dayPrice,
    startDate,
    car,
    user,
    finishedDate,
    paymentMethod,
    paymentStatus,

  });
}

function fromModelToEntity(model) {
  const reservation = model.toJSON();
  reservation.user = model.User;
  reservation.car = model.Car;
  return new Reservation(reservation);
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
