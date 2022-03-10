module.exports = class Car {
  constructor({
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
    this.id = id;
    this.brand = brand;
    this.year = year;
    this.kms = kms;
    this.photo = photo;
    this.color = color;
    this.airConditioning = airConditioning;
    this.passengers = passengers;
    this.transmission = transmission;
    this.price = price;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedA = deletedAt;
  }
};
