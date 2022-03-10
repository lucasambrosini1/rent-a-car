require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');

const configureDependencyInjection = require('./config/di');
const { init: initCarModule } = require('./module/car/module');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

nunjucks.configure('src/module', {
  autoescape: true,
  express: app,
});

const container = configureDependencyInjection(app);
app.use(container.get('Session'));

initCarModule(app, container);

/**
 * @type {import('./module/club/controller/clubController')} controller;
 */
const carController = container.get('CarController');
app.get('/', carController.index.bind(carController));

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
