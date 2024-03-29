const { fromDataToEntity } = require('../mapper/carMapper');
const CarIdNotDefinedError = require('./error/carIdNotDefinedError');
const AbstractController = require('../../abstractController');

module.exports = class CarController extends AbstractController {
  /**
   * @param {import('../service/carService')} carService
   */
  constructor(uploadMiddleware, carService) {
    super();
    this.ROUTE_BASE = '/car';
    this.CAR_VIEWS = 'car/view';
    this.uploadMiddleware = uploadMiddleware;
    this.carService = carService;
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/view/:id`, this.view.bind(this));
    app.post(`${ROUTE}/save`, this.uploadMiddleware.single('photo'), this.save.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.delete.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const cars = await this.carService.getAll();
    const { errors, messages } = req.session;
    res.json(cars, messages, errors);
    req.session.errors = [];
    req.session.messages = [];
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async view(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new CarIdNotDefinedError();
    }

    try {
      const car = await this.carService.getById(id);
      res.json(car);
    } catch (e) {
      req.session.errors = [e.message];
      res.json(req.session.errors);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async save(req, res) {
    try {
      const car = fromDataToEntity(req.body);
      if (req.file) {
        const { path } = req.file;
        car.photo = path;
      }
      const savedCar = await this.carService.save(car);
      if (car.id) {
        req.session.messages = [`The car with ID:${car.id} has been updated`];
      } else {
        req.session.messages = [`The car with ID:${savedCar.id} has been created`];
      }
      res.status(201);
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
      const car = await this.carService.getById(id);
      await this.carService.delete(car);
      req.session.messages = [`The car ID: ${id} has been deleted`];
      res.status(202);
      res.json(req.session.messages);
    } catch (e) {
      req.session.errors = [e.message];
      res.json(req.session.errors);
    }
  }
};
