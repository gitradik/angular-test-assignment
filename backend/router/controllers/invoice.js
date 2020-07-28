const InvoiceCSVRowParts = require('../../utils/invoiceCSV');
const { Invoice } = require('../../models');
const { Row } = require('../../models');
const db = require('../../models');
const sequelize = require('sequelize')

module.exports.saveInvoiceRows = async (req, res, next) => {
  let transaction;
  let rows = [];

  try {
    transaction = await db.sequelize.transaction();

    const invoice = new Invoice();
    const newInvoice = await invoice.save({ transaction });

    let isHaveInvalidRow = false;
    const cbPart = (part) => {
      return new Promise(async (resolve, reject) => {
        if (!isHaveInvalidRow && part.length && part.every(p => p.hasOwnProperty('invoiceId'))) {
          try {
            await Row.bulkCreate(part, { transaction });
          } catch (e) {
            reject(e);
          }
        } else {
          if (!isHaveInvalidRow) {
            isHaveInvalidRow = true;
          }

          rows = rows.concat(part.filter(p => !p.hasOwnProperty('invoiceId')));

          if (!transaction.finished) {
            await transaction.rollback();
          }
        }
        resolve();
      })
    }

    const csvParts = new InvoiceCSVRowParts(req.file.filename, newInvoice.id);
    await csvParts.fileProcessing(cbPart);

    if (!transaction.finished) {
      await transaction.commit();
    }
  } catch (e) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
  } finally {
    if (rows.length) {
      res.status(400).send(rows);
    } else {
      res.send([]);
    }
  }
};

module.exports.sendInvoiceById = async (req, res, next) => {
  let invoices = [];
  try {
    invoices = await Invoice.findAll({
      where: {
        id: req.headers.invoiceid,
      },
      attributes: ['id', 'createdAt'],
      include: [{
        model: Row,
        attributes: ['number', 'amount', 'dueDate', 'sellPrice'],
      }],
      group: ['id', 'Rows.id'],
    });
  } catch (e) {
    console.log(e)
    res.send(e);
  } finally {
    res.send(invoices);
  }
};

function getInvoiceSumSellPrice(invoices) {

}