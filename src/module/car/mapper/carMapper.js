const Car = require('../entity/car');

/**
 *
 * @param {Object} formData
 * @returns Car
 */
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
  });
}

module.exports = {
  fromModelToEntity,
};
