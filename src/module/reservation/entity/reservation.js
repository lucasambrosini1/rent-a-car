module.exports = class Reservation {
  constructor({
    id,
    userId,
    carId,
    dayPrice,
    startDate,
    finishedDate,
    paymentMethod,
    paymentStatus,
    car,
    user,
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
    this.totalPrice = this.calculateTotalPrice();
    this.paymentMethod = paymentMethod;
    this.paymentStatus = paymentStatus;
    this.car = car;
    this.user = user;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  calculateReservationDuration() {
    const DAY_IN_MILISECONDS = 86400000;
    return (new Date(this.finishedDate).getTime() - new Date(this.startDate).getTime())
    / DAY_IN_MILISECONDS;
  }

  changePaymentStatus(status) {
    if (status !== 'PENDING' && status !== 'PAID' && status !== 'FINISHED') throw new Error('Enter a valid status');
    if ((this.paymentStatus === 'PENDING' && status !== 'PAID') || (this.paymentStatus === 'PAID' && status !== 'FINISHED') || this.paymentStatus === 'FINISHED') throw new Error('Enter a valid status change');
    this.paymentStatus = status;
  }

  calculateTotalPrice() {
    return this.dayPrice * this.calculateReservationDuration();
  }
};
