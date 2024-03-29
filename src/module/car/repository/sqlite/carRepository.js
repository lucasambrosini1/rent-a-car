const { fromModelToEntity } = require('../../mapper/carMapper');
const AbstractCarRepository = require('../abstractCarRepository');
const CarNotFoundError = require('../error/carNotFoundError');
const CarIdNotDefinedError = require('../error/carIdNotDefinedError');
const Car = require('../../entity/Car');

module.exports = class CarRepository extends AbstractCarRepository {
  /**
     * @param {typeof import('../../model/carModel')} carModel
     */
  constructor(carModel, reservationModel) {
    super();
    this.carModel = carModel;
    this.reservationModel = reservationModel;
  }

  /**
     * @param {import('../../entity/Car')} car
     * @returns {Promise<import('../../entity/car')>}
     */
  async save(car) {
    let carModel;

    const buildOptions = { isNewRecord: !car.id };
    carModel = this.carModel.build(car, buildOptions);
    carModel = await carModel.save();

    return fromModelToEntity(carModel);
  }

  /**
     * @param {import('../../entity/car')} car
     * @returns {Boolean} devuelve true si se borró algo, false si no se borró nada.
     */
  async delete(car) {
    if (!car || !car.id) {
      throw new CarIdNotDefinedError();
    }

    return Boolean(await this.carModel.destroy({ where: { id: car.id } }));
  }

  /**
     * @param {Number} id
     * @returns {Promise<import('../../entity/car')>}
     */
  async getById(id) {
    if (!id) {
      throw new CarIdNotDefinedError();
    }
    const carModel = await this.carModel.findOne({
      where: { id },
      include: { model: this.reservationModel },
    });

    if (!carModel) {
      throw new CarNotFoundError(`Car with ID: ${id} has not been found`);
    }

    return fromModelToEntity(carModel);
  }

  /**
     * @return {Promise<Array<import('../../entity/car')>>}
     */
  async getAll() {
    const cars = await this.carModel.findAll({ include: { model: this.reservationModel } });
    return cars.map(fromModelToEntity);
  }
};
