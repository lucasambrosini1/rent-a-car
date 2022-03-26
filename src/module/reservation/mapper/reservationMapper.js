const Reservation = require('../entity/reservation');

function fromDataToEntity({
  id,
  userId,
  carId,
  dayPrice,
  startDate,
  finishedDate,
  totalPrice,
  paymentMethod,
  isPaid,
}) {
  return new Reservation({
    id,
    userId,
    carId,
    dayPrice,
    startDate,
    finishedDate,
    totalPrice,
    paymentMethod,
    isPaid,

  });
}

function fromModelToEntity({
  id,
  userId,
  carId,
  dayPrice,
  startDate,
  finishedDate,
  totalPrice,
  paymentMethod,
  isPaid,
  createdAt,
  updatedAt,
  deletedAt,
}) {
  return new Reservation({
    id: Number(id),
    userId: Number(userId),
    carId: Number(carId),
    dayPrice,
    startDate,
    finishedDate,
    totalPrice,
    paymentMethod,
    isPaid,
    createdAt,
    updatedAt,
    deletedAt,
  });
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
