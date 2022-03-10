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
    app.post(`${ROUTE}/save`, this.uploadMiddleware.single('car-photo'), this.save.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.delete.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const cars = await this.carService.getAll();
    const { errors, messages } = req.session;
    res.render('car/view/index.html', { data: { cars }, messages, errors });
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
      const club = await this.carService.getById(id);
      res.render('car/view/form.html', { data: { club } });
    } catch (e) {
      req.session.errors = [e.message];
      res.redirect('/car');
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
      const savedCar = await this.clubService.save(car);
      if (car.id) {
        req.session.messages = [`The card with ID:${car.id} has been updated`];
      } else {
        req.session.messages = [`The card with ID:${savedCar.id} (${savedCar.name}) has been created`];
      }
      res.redirect('/car');
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect('/car');
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
      req.session.messages = [`The car ID: ${id} (${car.name}) has been eliminated`];
    } catch (e) {
      req.session.errors = [e.message];
    }
    res.redirect('/car');
  }
};
