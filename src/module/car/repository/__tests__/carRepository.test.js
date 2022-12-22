const { Sequelize } = require('sequelize');
const CarRepository = require('../sqlite/carRepository');
const carModel = require('../../model/carModel');
const reservationModel = require('../../../reservation/model/reservationModel');
const createTestCar = require('../../controller/__tests__/cars.fixture');
const CarNotFoundError = require('../error/carNotFoundError');
const CarIdNotDefinedError = require('../error/carIdNotDefinedError');

describe('CarRepository methods', () => {
  let sequelize; let CarModel; let ReservationModel; let
    carRepository;
  beforeEach(async () => {
    sequelize = new Sequelize('sqlite::memory');
    CarModel = carModel.setup(sequelize);
    ReservationModel = reservationModel.setup(sequelize);
    CarModel.hasMany(ReservationModel, { foreignKey: 'carId' });
    ReservationModel.belongsTo(CarModel, { foreignKey: 'carId' });
    carRepository = new CarRepository(CarModel, ReservationModel);
    await sequelize.sync({ force: true });
  });

  test('saves a new car in DB', async () => {
    const carWithoutId = createTestCar();
    const { id, brand } = await carRepository.save(carWithoutId);
    expect(id).toEqual(1);
    expect(brand).toEqual('Ford');
  });

  test('updates a car in DB', async () => {
    const carWithoutId = createTestCar();
    const carWithId = createTestCar(1);
    carWithId.brand = 'Chevrolet';

    const newCar = await carRepository.save(carWithoutId);
    const newCarTwo = await carRepository.save(carWithoutId);
    expect(newCar.id).toEqual(1);
    expect(newCarTwo.id).toEqual(2);

    const updatedCar = await carRepository.save(carWithId);
    expect(updatedCar.id).toEqual(1);
    expect(updatedCar.brand).toEqual('Chevrolet');
  });

  test('getAll returns every car stored in DB', async () => {
    const carWithoutId = createTestCar();
    await carRepository.save(carWithoutId);
    await carRepository.save(carWithoutId);
    const cars = await carRepository.getAll();

    expect(cars).toHaveLength(2);
    expect(cars[0].id).toEqual(1);
    expect(cars[1].id).toEqual(2);
  });

  test('getById throws an error on undefined carId as argument', async () => {
    await expect(carRepository.getById()).rejects.toThrowError(CarIdNotDefinedError);
  });

  test('getById throws an error because there is no car stored in DB with this ID', async () => {
    const carId = 2;

    await expect(carRepository.getById(carId)).rejects.toThrowError(CarNotFoundError);
    await expect(carRepository.getById(carId)).rejects.toThrowError(
      `Car with ID: ${carId} has not been found`,
    );
  });

  test('deletes an existing car in DB and returns true', async () => {
    const carWithoutId = createTestCar();
    await carRepository.save(carWithoutId);
    await carRepository.save(carWithoutId);
    await carRepository.save(carWithoutId);

    const car = await carRepository.getById(2);
    const deletedCar = await carRepository.delete(car);
    const remainingCars = await carRepository.getAll();

    expect(deletedCar).toEqual(true);
    expect(remainingCars[0].id).toEqual(1);
    expect(remainingCars[1].id).toEqual(3);
  });

  test('tries to delete non-existent car in DB and returns false', async () => {
    const carWithoutId = createTestCar();
    await carRepository.save(carWithoutId);
    await carRepository.save(carWithoutId);

    const carNumberThree = createTestCar(3);
    const deletedCar = await carRepository.delete(carNumberThree);

    expect(deletedCar).toEqual(false);
  });

  test('throws an error if is called without car', async () => {
    await expect(carRepository.delete()).rejects.toThrowError(CarIdNotDefinedError);
  });
});
