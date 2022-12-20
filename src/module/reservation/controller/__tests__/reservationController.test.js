const ReservationController = require('../reservationController');
const createTestReservation = require('./reservations.fixture');
const ReservationIdNotDefinedError = require('../error/reservationIdNotDefinedError');
const createTestCar = require('../../../car/controller/__tests__/cars.fixture');
const createTestUser = require('../../../user/controller/__tests__/users.fixture');

const serviceMock = {
  save: jest.fn((reservation) => createTestReservation(reservation.id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestReservation(id + 1))),
  getById: jest.fn((id) => createTestReservation(id)),
  delete: jest.fn(),
};

const serviceCarMock = {
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestCar(id + 1))),
};

const serviceUserMock = {
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestUser(id + 1))),
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
const mockController = new ReservationController(serviceMock, serviceCarMock, serviceUserMock);

describe('ReservationController methods', () => {
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
  });

  test('index returns a list of reservations', async () => {
    const reservations = serviceMock.getAll();
    await mockController.index(reqMock, resMock);

    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith(reservations, [], []);
  });

  test('view returns a reservation', async () => {
    const reservation = serviceMock.getById(reqMock.params.id);
    await mockController.view(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith(reservation);
  });

  test('view throws an error without id', async () => {
    const reqMockWithoutId = {
      params: { id: undefined },
    };
    await expect(mockController.view(reqMockWithoutId, resMock)).rejects.toThrowError(
      ReservationIdNotDefinedError,
    );
  });

  test('save updates a reservation if req has an id', async () => {
    reqMock.body = createTestReservation(1);
    serviceMock.save(reqMock);
    await mockController.save(reqMock, resMock);

    expect(serviceMock.save).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith([`The reservation ID:${reqMock.body.id} has been updated`]);
  });

  test('save creates a reservation if req has not an id', async () => {
    reqMock.body = createTestReservation(1);
    reqMock.body.id = undefined;
    const reservation = serviceMock.save(reqMock);
    await mockController.save(reqMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith([`The reservation ID:${reservation.id} has been created`]);
  });

  test('delete a reservation', async () => {
    serviceMock.delete(reqMock);
    await mockController.delete(reqMock, resMock);
    expect(serviceMock.delete).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith([`The reservation ID: ${reqMock.params.id} has been deleted`]);
  });

  test('pay a reservation', async () => {
    reqMock.paymentStatus = 'PENDING';
    await mockController.pay(reqMock, resMock);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith(`The reservation with ID: ${reqMock.params.id} has been paid`);
  });

  test('finish a reservation', async () => {
    reqMock.paymentStatus = 'PAID';
    await mockController.finish(reqMock, resMock);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith(`The reservation with ID: ${reqMock.params.id} has been finished`);
  });
});
