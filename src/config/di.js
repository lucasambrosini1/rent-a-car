// configure DI container
const path = require('path');
const {
  default: DIContainer, object, use, factory,
} = require('rsdi');
const { Sequelize } = require('sequelize');
const multer = require('multer');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const {
  CarController, CarService, CarRepository, CarModel,
} = require('../module/car/module');
const {
  UserController, UserService, UserRepository, UserModel,
} = require('../module/user/module');
const {
  ReservationController, ReservationService, ReservationRepository, ReservationModel,
} = require('../module/reservation/module');

function configureMainSequelizeDatabase() {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH,
  });
  return sequelize;
}

function configureSessionSequelizeDatabase() {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SESSION_DB_PATH,
  });
  return sequelize;
}

/**
 * @param {DIContainer} container
 */
function configureCarModel(container) {
  return CarModel.setup(container.get('Sequelize'));
}

/**
 * @param {DIContainer} container
 */
function configureUserModel(container) {
  return UserModel.setup(container.get('Sequelize'));
}

/**
 * @param {DIContainer} container
 */
function configureReservationModel(container) {
  return ReservationModel.setup(container.get('Sequelize'));
}

/**
 * @param {DIContainer} container
 */
function configureSession(container) {
  const ONE_WEEK_IN_SECONDS = 604800000;

  const sequelize = container.get('SessionSequelize');
  const sessionOptions = {
    store: new SequelizeStore({ db: sequelize }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: ONE_WEEK_IN_SECONDS },
  };
  return session(sessionOptions);
}

function configureMulter() {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, process.env.MULTER_UPLOAD_DIR);
    },
    filename(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  return multer({ storage });
}

/**
 * @param {DIContainer} container
 */
function addCommonDefinitions(container) {
  container.add({
    Sequelize: factory(configureMainSequelizeDatabase),
    SessionSequelize: factory(configureSessionSequelizeDatabase),
    Session: factory(configureSession),
    Multer: factory(configureMulter),
  });
}

/**
 * @param {DIContainer} container
 */
function addCarModuleDefinitions(container) {
  container.add({
    CarController: object(CarController).construct(
      use('Multer'),
      use('CarService'),
    ),
    CarService: object(CarService).construct(use('CarRepository')),
    CarRepository: object(CarRepository).construct(use('CarModel'), use('ReservationModel')),
    CarModel: factory(configureCarModel),
  });
}

function addUserModuleDefinitions(container) {
  container.add({
    UserController: object(UserController).construct(
      use('UserService'),
    ),
    UserService: object(UserService).construct(use('UserRepository')),
    UserRepository: object(UserRepository).construct(use('UserModel'), use('ReservationModel')),
    UserModel: factory(configureUserModel),
  });
}

function addReservationModuleDefinitions(container) {
  container.add({
    ReservationController: object(ReservationController).construct(
      use('ReservationService'),
    ),
    ReservationService: object(ReservationService).construct(use('ReservationRepository')),
    ReservationRepository: object(ReservationRepository).construct(use('ReservationModel'), use('CarModel'), use('UserModel')),
    ReservationModel: factory(configureReservationModel),
  });
}

function setupAssociations(container) {
  const carModel = container.get('CarModel');
  const userModel = container.get('UserModel');
  const reservationModel = container.get('ReservationModel');
  reservationModel.setupAssociations(carModel, userModel);
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addCarModuleDefinitions(container);
  addUserModuleDefinitions(container);
  addReservationModuleDefinitions(container);
  setupAssociations(container);
  return container;
};
