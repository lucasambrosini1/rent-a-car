const { fromDataToEntity } = require('../mapper/reservationMapper');
const ReservationIdNotDefinedError = require('./error/reservationIdNotDefinedError');
const AbstractController = require('../../abstractController');
const ReservationError = require('./error/reservationError');

module.exports = class ReservationController extends AbstractController {
  /**
   * @param {import('../service/carService')} reservationService
   */
  constructor(reservationService, carService, userService) {
    super();
    this.reservationService = reservationService;
    this.carService = carService;
    this.userService = userService;
    this.ROUTE_BASE = '/reservation';
    this.RESERVATION_VIEWS = 'reservation/views';
  }

  /**
   * @param {import('express').Application} app
   */

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}/create`, this.create.bind(this));
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/view/:id`, this.view.bind(this));
    app.post(`${ROUTE}/save`, this.save.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.delete.bind(this));
    app.post(`${ROUTE}/pay/:id`, this.pay.bind(this));
    app.post(`${ROUTE}/finish/:id`, this.finish.bind(this));
  }

  async create(req, res, next) {
    try {
      const cars = await this.carService.getAll();
      const users = await this.userService.getAll();
      if (!cars.length) {
        throw new ReservationError('There are not cars created');
      }

      if (!users.length) {
        throw new ReservationError('There are not users created');
      }
      res.json(cars, users);
    } catch (e) {
      next(e);
    }
  }

  async index(req, res) {
    try {
      const reservations = await this.reservationService.getAll();
      const { errors, messages } = req.session;
      if (!reservations.length) {
        req.session.errors = [];
        req.session.messages = ['There are not reservations'];
        res.json(reservations, messages, errors);
      }
      req.session.errors = [];
      req.session.messages = [];
      res.json(reservations, messages, errors);
    } catch (e) {
      req.session.errors = [e.message];
      res.json(e.message);
    }
  }

  async view(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new ReservationIdNotDefinedError();
    }
    try {
      const reservation = await this.reservationService.getById(id);
      res.json(reservation);
    } catch (e) {
      req.session.errors = [e.message];
      res.json(req.session.errors);
    }
  }

  async save(req, res) {
    try {
      const reservation = fromDataToEntity(req.body);
      const savedReservation = await this.reservationService.save(reservation);
      if (reservation.id) {
        req.session.messages = [`The reservation ID:${reservation.id} has been updated`];
      } else {
        req.session.messages = [`The reservation ID:${savedReservation.id} has been created`];
      }
      res.json(req.session.messages);
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.json(req.session.errors);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const reservation = await this.reservationService.getById(id);
      await this.reservationService.delete(reservation);
      req.session.messages = [`The reservation ID: ${id} has been deleted`];
      res.status(202);
      res.json(req.session.messages);
    } catch (e) {
      req.session.errors = [e.message];
      res.json(req.session.errors);
    }
  }

  async pay(req, res) {
    try {
      const { id } = req.params;
      const reservation = await this.reservationService.getById(id);
      reservation.changePaymentStatus('PAID');
      await this.reservationService.save(reservation);
      res.json(`The reservation with ID: ${id} has been paid`);
    } catch (e) {
      res.json(e.message);
    }
  }

  async finish(req, res) {
    try {
      const { id } = req.params;
      const reservation = await this.reservationService.getById(id);
      reservation.changePaymentStatus('FINISHED');
      await this.reservationService.save(reservation);
      res.json(`The reservation with ID: ${id} has been finished`);
    } catch (e) {
      res.json(e.message);
    }
  }
};
