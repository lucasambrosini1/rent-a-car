const User = require('../../entity/user');

module.exports = function createTestUser(id = undefined) {
  return new User(
    {
      id,
      name: 'Pepe',
      lastname: 'Gomez',
      documentType: 'DNI',
      documentId: 1234,
      adress: 'Corrientes 134',
      mail: 'mail@mail.com',
      nationality: 'Argentina',
      dateOfBirth: new Date('January 1, 2000 12:00:00'),
      reservations: [],
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,

    },
  );
};
