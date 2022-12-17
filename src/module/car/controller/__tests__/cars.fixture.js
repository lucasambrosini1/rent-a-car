const Car = require('../../entity/car');

module.exports = function createTestCar(id) {
  return new Car(
    {
      id,
      brand: 'Ford',
      year: 2017,
      kms: 10000,
      photo: 'www.img.com/123',
      color: 'red',
      airConditioning: true,
      passengers: 3,
      price: 100,
      reservations: [],

    },
  );
};
