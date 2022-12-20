const ReservationService = require('../reservationService');
const createTestReservation = require('../../controller/__tests__/reservations.fixture');
const ReservationNotDefinedError = require('../error/reservationNotDefinedError');
const ReservationIdNotDefinedError = require('../error/reservationIdNotDefinedError');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
};

const mockService = new ReservationService(repositoryMock);

describe('ReservationService methods', () => {
  test('save calls repository.save', async () => {
    const reservation = createTestReservation(1);
    await mockService.save(reservation);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(reservation);
  });

  test('save throws an error if is called without reservation entity', async () => {
    await expect(mockService.save()).rejects.toThrowError(
      ReservationNotDefinedError,
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
    await expect(mockService.getById()).rejects.toThrowError(ReservationIdNotDefinedError);
  });

  test("delete calls repository's delete method", async () => {
    const reservation = createTestReservation(1);
    await mockService.delete(reservation);

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(reservation);
  });

  test('delete throws an error if is called without a reservation entity', async () => {
    await expect(
      mockService.delete(),
    ).rejects.toThrowError(ReservationNotDefinedError);
  });
});
