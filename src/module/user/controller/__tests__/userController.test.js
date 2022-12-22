const UserController = require('../userController');
const createTestUser = require('./users.fixture');
const UserIdNotDefinedError = require('../error/userIdNotDefinedError');

const serviceMock = {
  save: jest.fn((user) => createTestUser(user.id)),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestUser(id + 1))),
  getById: jest.fn((id) => createTestUser(id)),
  delete: jest.fn(),
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
const mockController = new UserController(serviceMock);

describe('UserController methods', () => {
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

  test('index returns a list of users', async () => {
    const users = serviceMock.getAll();
    await mockController.index(reqMock, resMock);

    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith(users);
  });

  test('view returns a user', async () => {
    const user = serviceMock.getById(reqMock.params.id);
    await mockController.view(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith(user);
  });

  test('view throws an error without id', async () => {
    const reqMockWithoutId = {
      params: { id: undefined },
    };
    await expect(mockController.view(reqMockWithoutId, resMock)).rejects.toThrowError(
      UserIdNotDefinedError,
    );
  });

  test('save updates a user if req has an id', async () => {
    reqMock.body = createTestUser(1);
    serviceMock.save(reqMock);
    await mockController.save(reqMock, resMock);

    expect(serviceMock.save).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith([`The user with ID:${reqMock.body.id} has been updated`]);
  });

  test('save creates a user if req has not an id', async () => {
    reqMock.body = createTestUser(1);
    reqMock.body.id = undefined;
    await mockController.save(reqMock, resMock);
    serviceMock.save(reqMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith([`The user with ID:${reqMock.body.id} (${reqMock.body.name}) has been created`]);
  });

  test('delete a user', async () => {
    serviceMock.delete(reqMock);
    await mockController.delete(reqMock, resMock);
    expect(serviceMock.delete).toHaveBeenCalledTimes(2);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith(`The user ID: ${reqMock.params.id} has been deleted`);
  });
});
