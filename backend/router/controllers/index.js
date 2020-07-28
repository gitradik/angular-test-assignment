const {
  saveInvoiceRows,
  sendInvoiceById,
} = require('./invoice');

const invoiceController = {
  saveInvoiceRows,
  sendInvoiceById,
};

module.exports = { invoiceController };