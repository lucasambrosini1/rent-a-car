const configureDI = require('../di');

describe('DI is loading the right dependencies', () => {
  const container = configureDI();
  const { resolvers } = container;
  test('DI is loading the right top level dependencies', () => {
    expect(resolvers).toHaveProperty('Sequelize');
    expect(resolvers).toHaveProperty('Multer');
    expect(resolvers).toHaveProperty('CarController');
    expect(resolvers).toHaveProperty('CarService');
    expect(resolvers).toHaveProperty('CarRepository');
    expect(resolvers).toHaveProperty('CarModel');
    expect(resolvers).toHaveProperty('UserController');
    expect(resolvers).toHaveProperty('UserService');
    expect(resolvers).toHaveProperty('UserRepository');
    expect(resolvers).toHaveProperty('UserModel');
    expect(resolvers).toHaveProperty('ReservationController');
    expect(resolvers).toHaveProperty('ReservationService');
    expect(resolvers).toHaveProperty('ReservationRepository');
    expect(resolvers).toHaveProperty('ReservationModel');
  });

  test('CarController is constructed with the right dependencies', () => {
    const { CarController } = resolvers;
    const expected = [
      expect.objectContaining({ existingDefinitionName: 'CarService' }),
      expect.objectContaining({ existingDefinitionName: 'Multer' }),
    ];
    expect(CarController.deps).toEqual(expect.arrayContaining(expected));
  });

  test('CarService is constructed with the right dependencies', () => {
    const { CarService } = resolvers;
    const expected = [expect.objectContaining({ existingDefinitionName: 'CarRepository' })];
    expect(CarService.deps).toEqual(expect.arrayContaining(expected));
  });

  test('CarRepository is constructed with the right dependencies', () => {
    const { CarRepository } = resolvers;
    const expected = [expect.objectContaining({ existingDefinitionName: 'CarModel' })];
    expect(CarRepository.deps).toEqual(expect.arrayContaining(expected));
  });

  test('UserController is constructed with the right dependencies', () => {
    const { UserController } = resolvers;
    const expected = [expect.objectContaining({ existingDefinitionName: 'UserService' })];
    expect(UserController.deps).toEqual(expect.arrayContaining(expected));
  });

  test('UserService is constructed with the right dependencies', () => {
    const { UserService } = resolvers;
    const expected = [expect.objectContaining({ existingDefinitionName: 'UserRepository' })];
    expect(UserService.deps).toEqual(expect.arrayContaining(expected));
  });

  test('UserRepository is constructed with the right dependencies', () => {
    const { UserRepository } = resolvers;
    const expected = [expect.objectContaining({ existingDefinitionName: 'UserModel' })];
    expect(UserRepository.deps).toEqual(expect.arrayContaining(expected));
  });

  test('ReservationController is constructed with the right dependencies', () => {
    const { ReservationController } = resolvers;
    const expected = [
      expect.objectContaining({ existingDefinitionName: 'ReservationService' }),
    ];
    expect(ReservationController.deps).toEqual(expect.arrayContaining(expected));
  });

  test('ReservationService is constructed with the right dependencies', () => {
    const { ReservationService } = resolvers;
    const expected = [expect.objectContaining({ existingDefinitionName: 'ReservationRepository' })];
    expect(ReservationService.deps).toEqual(expect.arrayContaining(expected));
  });

  test('ReservationRepository is constructed with the right dependencies', () => {
    const { ReservationRepository } = resolvers;
    const expected = [expect.objectContaining({ existingDefinitionName: 'ReservationModel' })];
    expect(ReservationRepository.deps).toEqual(expect.arrayContaining(expected));
  });
});
