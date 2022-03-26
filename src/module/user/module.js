/* eslint-disable import/no-unresolved */
const UserController = require('./controller/UserController');
const UserRepository = require('./repository/sqlite/UserRepository');
const UserService = require('./service/UserService');
const UserModel = require('./model/UserModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').IDIContainer} container
 */
function init(app, container) {
  /**
   * @type {UserController} controller;
   */
  const controller = container.get('UserController');
  controller.configureRoutes(app);
}

module.exports = {
  init,
  UserController,
  UserService,
  UserRepository,
  UserModel,
};
