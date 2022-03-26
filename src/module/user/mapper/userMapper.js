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
function fromModelToEntity({
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

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
