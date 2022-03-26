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
function fromModelToEntity({
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
  createdAt,
  updatedAt,
  deletedAt,
}) {
  return new Car({
    id: Number(id),
    brand,
    year: Number(year),
    kms: Number(kms),
    photo,
    color,
    airConditioning,
    passengers: Number(passengers),
    transmission,
    price: Number(price),
    createdAt,
    updatedAt,
    deletedAt,
  });
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
