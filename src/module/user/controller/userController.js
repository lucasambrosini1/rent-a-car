const { fromDataToEntity } = require('../mapper/userMapper');
const UserIdNotDefinedError = require('./error/userIdNotDefinedError');
const AbstractController = require('../../abstractController');

module.exports = class UserController extends AbstractController {
  /**
   * @param {import('../service/carService')} userService
   */

  constructor(userService) {
    super();
    this.ROUTE_BASE = '/user';
    this.USER_VIEWS = 'user/view';
    this.userService = userService;
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}/`, this.index.bind(this));
    app.get(`${ROUTE}/view/:id`, this.view.bind(this));
    app.post(`${ROUTE}/save`, this.save.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.delete.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    try {
      const users = await this.userService.getAll();
      res.json(users);
    } catch (e) {
      req.session.errors = [e.message];
      res.json(e.message);
    }
  }

  async view(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new UserIdNotDefinedError();
    }
    try {
      const user = await this.userService.getById(id);
      res.json(user);
    } catch (e) {
      req.session.errors = [e.message];
      res.json(e.message);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async save(req, res) {
    try {
      const user = fromDataToEntity(req.body);
      const savedUser = await this.userService.save(user);
      if (user.id) {
        req.session.messages = [`The user with ID:${user.id} has been updated`];
      } else {
        req.session.messages = [`The user with ID:${savedUser.id} (${savedUser.name}) has been created`];
      }
      res.json(req.session.messages);
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.json(req.session.errors);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userService.getById(id);
      await this.userService.delete(user);
      res.json(`The user ID: ${id} has been deleted`);
    } catch (e) {
      res.json(e.message);
    }
  }
};
