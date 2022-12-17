const CarService = require('../carService');
const createTestCar = require('../../controller/__tests__/cars.fixture');
const CarNotDefinedError = require('../error/carNotDefinedError');
const CarIdNotDefinedError = require('../error/carIdNotDefinedError');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
};

const mockService = new CarService(repositoryMock);

describe('CarService methods', () => {
  test('save calls repository.save', async () => {
    const car = createTestCar(1);
    await mockService.save(car);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(car);
  });

  test('save throws an error if is called without car entity', async () => {
    await expect(mockService.save()).rejects.toThrowError(
      CarNotDefinedError,
    );
  });

  test('getAll calls repository.getAll', async () => {
    await mockService.getAll();

    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
  });

  test('getById calls repository.getById', async () => {
    await mockService.getById(1);

    expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getById).toHaveBeenCalledWith(1);
  });

  test('getById throws an error if is called without an id', async () => {
    await expect(mockService.getById()).rejects.toThrowError(CarIdNotDefinedError);
  });

  test("delete calls repository's delete method", async () => {
    const car = createTestCar(1);
    await mockService.delete(car);

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(car);
  });

  test('delete throws an error if is called without a car entity', async () => {
    await expect(
      mockService.delete(),
    ).rejects.toThrowError(CarNotDefinedError);
  });
});
