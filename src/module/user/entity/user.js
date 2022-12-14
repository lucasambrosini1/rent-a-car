module.exports = class User {
  constructor({
    id,
    name,
    lastname,
    documentType,
    documentId,
    adress,
    mail,
    nationality,
    dateOfBirth,
    reservations,
    lastUpdated,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.documentType = documentType;
    this.documentId = documentId;
    this.adress = adress;
    this.mail = mail;
    this.nationality = nationality;
    this.dateOfBirth = dateOfBirth;
    this.reservations = reservations;
    this.lastUpdated = lastUpdated;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
};
