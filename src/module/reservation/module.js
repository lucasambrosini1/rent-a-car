/* eslint-disable import/no-unresolved */
const ReservationController = require('./controller/ReservationController');
const ReservationRepository = require('./repository/sqlite/ReservationRepository');
const ReservationService = require('./service/ReservationService');
const ReservationModel = require('./model/ReservationModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').IDIContainer} container
 */
function init(app, container) {
  /**
   * @type {ReservationController} controller;
   */
  const controller = container.get('ReservationController');
  controller.configureRoutes(app);
}

module.exports = {
  init,
  ReservationController,
  ReservationService,
  ReservationRepository,
  ReservationModel,
};
