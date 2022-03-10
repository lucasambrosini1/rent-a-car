/* eslint-disable import/no-unresolved */
const CarController = require('./controller/CarController');
const CarRepository = require('./repository/sqlite/CarRepository');
const CarService = require('./service/CarService');
const CarModel = require('./model/CarModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').IDIContainer} container
 */
function init(app, container) {
  /**
   * @type {CarController} controller;
   */
  const controller = container.get('CarController');
  controller.configureRoutes(app);
}

module.exports = {
  init,
  CarController,
  CarService,
  CarRepository,
  CarModel,
};
