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
  CarModel.setup(container.get('Sequelize'));
  return CarModel;
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
      cb(null, process.env.CRESTS_UPLOAD_DIR);
    },
    filename(req, file, cb) {
      // https://stackoverflow.com/questions/31592726/how-to-store-a-file-with-file-extension-with-multer
      // al tener una extensión, el navegador lo sirve en vez de descargarlo
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
    CarRepository: object(CarRepository).construct(use('CarModel')),
    CarModel: factory(configureCarModel),
  });
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addCarModuleDefinitions(container);
  return container;
};
