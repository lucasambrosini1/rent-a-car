const { Sequelize } = require('sequelize');
const UserRepository = require('../sqlite/userRepository');
const userModel = require('../../model/userModel');
const reservationModel = require('../../../reservation/model/reservationModel');
const carModel = require('../../../car/model/carModel');
const createTestUser = require('../../controller/__tests__/users.fixture');
const createTestCar = require('../../../reservation/controller/__tests__/reservations.fixture');
const UserNotFoundError = require('../error/userNotFoundError');
const UserIdNotDefinedError = require('../error/userIdNotDefinedError');

describe('UserRepository methods', () => {
  let sequelize; let UserModel; let ReservationModel; let CarModel; let
    userRepository;
  beforeEach(async () => {
    sequelize = new Sequelize('sqlite::memory');
    UserModel = userModel.setup(sequelize);
    CarModel = carModel.setup(sequelize);
    ReservationModel = reservationModel.setup(sequelize);
    ReservationModel.setupAssociations(UserModel, CarModel);
    userRepository = new UserRepository(UserModel, ReservationModel);
    await sequelize.sync({ force: true });
  });

  test('saves a new user in DB', async () => {
    const userWithoutId = createTestUser();
    const { id } = await userRepository.save(userWithoutId);
    expect(id).toEqual(1);
  });

  test('updates a user in DB', async () => {
    const userWithoutId = createTestUser();
    const userWithId = createTestUser(1);
    userWithId.lastname = 'Gutierrez';

    const newUser = await userRepository.save(userWithoutId);
    const newUserTwo = await userRepository.save(userWithoutId);
    expect(newUser.id).toEqual(1);
    expect(newUserTwo.id).toEqual(2);

    const updatedUser = await userRepository.save(userWithId);
    expect(updatedUser.id).toEqual(1);
    expect(updatedUser.lastname).toEqual('Gutierrez');
  });

  test('getAll returns every user stored in DB', async () => {
    const userWithoutId = createTestUser();
    await userRepository.save(userWithoutId);
    await userRepository.save(userWithoutId);
    const users = await userRepository.getAll();

    expect(users).toHaveLength(2);
    expect(users[0].id).toEqual(1);
    expect(users[1].id).toEqual(2);
  });

  test('getById throws an error on undefined userId as argument', async () => {
    await expect(userRepository.getById()).rejects.toThrowError(UserIdNotDefinedError);
  });

  test('getById throws an error because there is no user stored in DB with this ID', async () => {
    const userId = 2;

    await expect(userRepository.getById(userId)).rejects.toThrowError(UserNotFoundError);
    await expect(userRepository.getById(userId)).rejects.toThrowError(
      `User with ID: ${userId} has not been found`,
    );
  });

  test('deletes an existing user in DB and returns true', async () => {
    const userWithoutId = createTestUser();
    await userRepository.save(userWithoutId);
    await userRepository.save(userWithoutId);
    await userRepository.save(userWithoutId);

    const user = await userRepository.getById(2);
    const deletedUser = await userRepository.deleteById(user.id);
    const remainingUsers = await userRepository.getAll();

    expect(deletedUser).toEqual(true);
    expect(remainingUsers[0].id).toEqual(1);
    expect(remainingUsers[1].id).toEqual(3);
  });

  test('tries to delete non-existent user in DB and returns false', async () => {
    const userWithoutId = createTestUser();
    await userRepository.save(userWithoutId);
    await userRepository.save(userWithoutId);

    const userNumberThree = createTestUser(3);
    const deletedUser = await userRepository.deleteById(userNumberThree.id);

    expect(deletedUser).toEqual(false);
  });

  test('throws an error if is called without user ID', async () => {
    await expect(userRepository.deleteById()).rejects.toThrowError(UserIdNotDefinedError);
  });
});
