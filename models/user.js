'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Document, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Application, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Export, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    tier: DataTypes.ENUM('free', 'pro'),
    aiCredits: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    hooks: {

      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });
  return User;
};