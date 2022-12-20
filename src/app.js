require('dotenv').config();
const express = require('express');

const configureDependencyInjection = require('./config/di');
const { init: initCarModule } = require('./module/car/module');
const { init: initUserModule } = require('./module/user/module');
const { init: initReservationModule } = require('./module/reservation/module');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

const container = configureDependencyInjection(app);
app.use(container.get('Session'));

initCarModule(app, container);
initUserModule(app, container);
initReservationModule(app, container);

/**
 * @type {import('./module/reservation/controller/clubController')} controller;
 */
const reservationController = container.get('ReservationController');

app.get('/', reservationController.index.bind(reservationController));

app.use((err, req, res, next) => {
  res.status(500);
  res.json(err);
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
