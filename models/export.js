'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Export extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Export.belongsTo(models.Document, { foreignKey: 'documentId' });
      Export.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Export.init({
    format: DataTypes.ENUM('pdf', 'docx'),
    fileUrl: DataTypes.STRING,
    documentId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Export',
  });
  return Export;
};