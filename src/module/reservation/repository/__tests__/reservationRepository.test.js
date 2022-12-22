const { Sequelize } = require('sequelize');
const ReservationRepository = require('../sqlite/reservationRepository');
const reservationModel = require('../../model/reservationModel');
const carModel = require('../../../car/model/carModel');
const userModel = require('../../../user/model/userModel');
const createTestReservation = require('../../controller/__tests__/reservations.fixture');
const createTestCar = require('../../../car/controller/__tests__/cars.fixture');
const createTestUser = require('../../../user/controller/__tests__/users.fixture');
const ReservationNotFoundError = require('../error/reservationNotFoundError');
const ReservationIdNotDefinedError = require('../error/reservationIdNotDefinedError');

describe('ReservationRepository methods', () => {
  let sequelize; let ReservationModel; let CarModel; let UserModel; let
    reservationRepository;
  beforeEach(async () => {
    sequelize = new Sequelize('sqlite::memory');
    ReservationModel = reservationModel.setup(sequelize);
    UserModel = userModel.setup(sequelize);
    CarModel = carModel.setup(sequelize);
    ReservationModel.setupAssociations(UserModel, CarModel);
    reservationRepository = new ReservationRepository(ReservationModel, CarModel, UserModel);
    await sequelize.sync({ force: true });
    const testCar = createTestCar(1);
    const testUser = createTestUser(1);
    const carModelTest = CarModel.build(testCar, { isNewRecord: true });
    await carModelTest.save();
    const userModelTest = UserModel.build(testUser, { isNewRecord: true });
    await userModelTest.save();
  });

  test('saves a new reservation in DB', async () => {
    const reservationWithoutId = createTestReservation();
    const { id } = await reservationRepository.save(reservationWithoutId);
    expect(id).toEqual(1);
  });

  test('updates a reservation in DB', async () => {
    const reservationWithoutId = createTestReservation();
    const reservationWithId = createTestReservation(1);
    reservationWithId.dayPrice = 10000;

    const newReservation = await reservationRepository.save(reservationWithoutId);
    const newReservationTwo = await reservationRepository.save(reservationWithoutId);
    expect(newReservation.id).toEqual(1);
    expect(newReservationTwo.id).toEqual(2);

    const updatedReservation = await reservationRepository.save(reservationWithId);
    expect(updatedReservation.id).toEqual(1);
    expect(updatedReservation.dayPrice).toEqual(10000);
  });

  test('getAll returns every reservation stored in DB', async () => {
    const reservationWithoutId = createTestReservation();
    await reservationRepository.save(reservationWithoutId);
    await reservationRepository.save(reservationWithoutId);
    const reservations = await reservationRepository.getAll();

    expect(reservations).toHaveLength(2);
    expect(reservations[0].id).toEqual(1);
    expect(reservations[1].id).toEqual(2);
  });

  test('getById throws an error on undefined reservationId as argument', async () => {
    await expect(reservationRepository.getById()).rejects.toThrowError(ReservationIdNotDefinedError);
  });

  test('getById throws an error because there is no reservation stored in DB with this ID', async () => {
    const reservationId = 2;

    await expect(reservationRepository.getById(reservationId)).rejects.toThrowError(ReservationNotFoundError);
    await expect(reservationRepository.getById(reservationId)).rejects.toThrowError(
      `Reservation with ID: ${reservationId} has not been found`,
    );
  });

  test('deletes an existing reservation in DB and returns true', async () => {
    const reservationWithoutId = createTestReservation();
    await reservationRepository.save(reservationWithoutId);
    await reservationRepository.save(reservationWithoutId);
    await reservationRepository.save(reservationWithoutId);

    const reservation = await reservationRepository.getById(2);
    const deletedReservation = await reservationRepository.delete(reservation);
    const remainingReservations = await reservationRepository.getAll();

    expect(deletedReservation).toEqual(true);
    expect(remainingReservations[0].id).toEqual(1);
    expect(remainingReservations[1].id).toEqual(3);
  });

  test('tries to delete non-existent reservation in DB and returns false', async () => {
    const reservationWithoutId = createTestReservation();
    await reservationRepository.save(reservationWithoutId);
    await reservationRepository.save(reservationWithoutId);

    const reservationNumberThree = createTestReservation(3);
    const deletedReservation = await reservationRepository.delete(reservationNumberThree);

    expect(deletedReservation).toEqual(false);
  });

  test('throws an error if is called without reservation', async () => {
    await expect(reservationRepository.delete()).rejects.toThrowError(ReservationIdNotDefinedError);
  });
});
