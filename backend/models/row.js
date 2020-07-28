'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Row = sequelize.define('Row', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sellPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
      get() {
        const coefficient = moment().subtract(30, 'days').isAfter(moment(this.dueDate).endOf('day')) ? 0.5 : 0.3;
        return +this.amount * coefficient;
      },
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      references: 'Invoice',
      referencesKey: 'id',
      allowNull: false,
    }
  }, {});
  Row.associate = function(models) {};
  return Row;
};