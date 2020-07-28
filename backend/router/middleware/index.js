const {
  uploadInvoiceCSV,
} = require('./invoice');

const invoiceMiddleware = {
  uploadInvoiceCSV,
};

module.exports = { invoiceMiddleware };