module.exports = class Reservation {
  constructor({
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
    this.id = id;
    this.userId = userId;
    this.carId = carId;
    this.dayPrice = dayPrice;
    this.startDate = startDate;
    this.finishedDate = finishedDate;
    this.totalPrice = totalPrice;
    this.paymentMethod = paymentMethod;
    this.isPaid = isPaid;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
};
