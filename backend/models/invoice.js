'use strict';

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {}, { timestamps: true });
  Invoice.associate = function(models) {
    Invoice.hasMany(models.Row);
  };
  return Invoice;
};