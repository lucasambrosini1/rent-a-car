const CarController = require('../carController');
const createTestCar = require('./cars.fixture');
const CarIdNotDefinedError = require('../error/carIdNotDefinedError');

const serviceMock = {
  save: jest.fn((car) => createTestCar(car.id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestCar(id + 1))),
  getById: jest.fn((id) => createTestCar(id)),
  getLastCar: jest.fn(() => createTestCar(3)),
  delete: jest.fn(),
};

const uploadMock = {
  single: jest.fn(),
};

const reqMock = {
  params: { id: 1 },
  session: {
    errors: [],
    messages: [],
  },
};

const resMock = {
  json: jest.fn(),
  status: jest.fn(),
};
const mockController = new CarController(uploadMock, serviceMock);

describe('CarController methods', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
  });

  test('configures routes for every method', () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };
    mockController.configureRoutes(app);

    expect(app.get).toHaveBeenCalled();
    expect(app.post).toHaveBeenCalled();
    expect(uploadMock.single).toHaveBeenCalled();
  });

  test('index returns a list of cars', async () => {
    const cars = serviceMock.getAll();
    await mockController.index(reqMock, resMock);

    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith(cars, [], []);
  });

  test('view returns a car', async () => {
    const car = serviceMock.getById(reqMock.params.id);
    await mockController.view(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith(car);
  });

  test('view throws an error without id', async () => {
    const reqMockWithoutId = {
      params: { id: undefined },
    };
    await expect(mockController.view(reqMockWithoutId, resMock)).rejects.toThrowError(
      CarIdNotDefinedError,
    );
  });

  test('save updates a car if req has an id', async () => {
    reqMock.body = createTestCar(1);
    serviceMock.save(reqMock);
    await mockController.save(reqMock, resMock);

    expect(serviceMock.save).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith([`The car with ID:${reqMock.body.id} has been updated`]);
  });

  test('save creates a car if req has not an id', async () => {
    reqMock.body = createTestCar(1);
    reqMock.body.id = undefined;
    const car = serviceMock.save(reqMock);
    await mockController.save(reqMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith([`The car with ID:${car.id} has been created`]);
  });

  test('delete a car', async () => {
    serviceMock.delete(reqMock);
    await mockController.delete(reqMock, resMock);
    expect(serviceMock.delete).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith([`The car ID: ${reqMock.params.id} has been deleted`]);
  });
});
