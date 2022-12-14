const Car = require('../entity/car');

/**
 *
 * @param {Object} formData
 * @returns Car
 */

function fromDataToEntity({
  id,
  brand,
  year,
  kms,
  photo,
  color,
  airConditioning,
  passengers,
  transmission,
  price,

}) {
  return new Car({
    id,
    brand,
    year,
    kms,
    photo,
    color,
    airConditioning,
    passengers,
    transmission,
    price,
  });
}
function fromModelToEntity(model) {
  const car = model.toJSON();
  car.reservations = model.Reservations;
  return new Car(car);
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
