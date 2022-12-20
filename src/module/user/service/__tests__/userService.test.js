const UserService = require('../userService');
const createTestUser = require('../../controller/__tests__/users.fixture');
const UserNotDefinedError = require('../error/userNotDefinedError');
const UserIdNotDefinedError = require('../error/userIdNotDefinedError');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
};

const mockService = new UserService(repositoryMock);

describe('UserService methods', () => {
  test('save calls repository.save', async () => {
    const user = createTestUser(1);
    await mockService.save(user);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(user);
  });

  test('save throws an error if is called without user entity', async () => {
    await expect(mockService.save()).rejects.toThrowError(
      UserNotDefinedError,
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
    await expect(mockService.getById()).rejects.toThrowError(UserIdNotDefinedError);
  });

  test("delete calls repository's delete method", async () => {
    const user = createTestUser(1);
    await mockService.delete(user);

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(user);
  });

  test('delete throws an error if is called without a user entity', async () => {
    await expect(
      mockService.delete(),
    ).rejects.toThrowError(UserNotDefinedError);
  });
});
