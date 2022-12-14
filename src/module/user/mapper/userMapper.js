const User = require('../entity/user');

/**
 *
 * @param {Object} formData
 * @returns User
 */

function fromDataToEntity({
  id,
  name,
  lastname,
  documentType,
  documentId,
  adress,
  mail,
  nationality,
  dateOfBirth,

}) {
  return new User({
    id,
    name,
    lastname,
    documentType,
    documentId,
    adress,
    mail,
    nationality,
    dateOfBirth,
  });
}
function fromModelToEntity(model) {
  const user = model.toJSON();
  user.reservations = model.Reservations;
  return new User(user);
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
