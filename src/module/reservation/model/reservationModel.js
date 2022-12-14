const { Model, DataTypes } = require('sequelize');

module.exports = class ReservationModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof ReservationModel}
   */

  static setup(sequelizeInstance) {
    ReservationModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true,
        },
        dayPrice: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,

        },
        finishedDate: {
          type: DataTypes.DATE,
          allowNull: false,

        },
        totalPrice: {
          type: DataTypes.DECIMAL,
          allowNull: false,

        },
        paymentMethod: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        paymentStatus: {
          type: DataTypes.STRING,
          allowNull: false,

        },

      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Reservation',
        tableName: 'reservations',
        underscored: true,
        paranoid: true,
      },
    );
    return ReservationModel;
  }

  static setupAssociations(CarModel, UserModel) {
    CarModel.hasMany(ReservationModel, { foreignKey: 'carId', constraints: false });
    ReservationModel.belongsTo(CarModel, { foreignKey: 'carId', constraints: false });
    UserModel.hasMany(ReservationModel, { foreignKey: 'userId', constraints: false });
    ReservationModel.belongsTo(UserModel, { foreignKey: 'userId', constraints: false });

    return ReservationModel;
  }
};
