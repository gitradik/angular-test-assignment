const express = require('express');
const router = express.Router();

const { invoiceController } = require('./controllers');
const { invoiceMiddleware } = require('./middleware');

router.post('/',
  invoiceMiddleware.uploadInvoiceCSV,
  invoiceController.saveInvoiceRows,
);
router.get('/',
  invoiceController.sendInvoiceById,
);

module.exports = router;