const Reservation = require('../../entity/reservation');

module.exports = function createTestReservation(id = undefined) {
  return new Reservation(
    {
      id,
      userId: 1,
      carId: 1,
      dayPrice: 100,
      startDate: new Date('January 1, 2020 12:00:00'),
      finishedDate: new Date('January 2, 2020 12:00:00'),
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      car: undefined,
      user: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,

    },
  );
};
