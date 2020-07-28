const lineByLine = require('n-readlines');
const yup = require('yup');
const moment = require('moment');

const parseFormats = ['YYYY-MM-DD'];
const invalidDate = new Date('');

function numberValidation() {
  return yup.number().min(1).required();
}
function amountValidation() {
  return yup.number().min(1).required();
}
function dueDateValidation() {
  return yup.date().max(new Date()).transform(function (value, originalValue) {
   value = moment(originalValue, parseFormats);
   return value.isValid() ? value.toDate() : invalidDate;
  }).required();
}

const schema = yup.object().shape({
  number: numberValidation(),
  amount: amountValidation(),
  dueDate: dueDateValidation(),
});

class InvoiceCSVRow {
  constructor(line, invoiceId) {
    this.invoiceId = invoiceId;
    this.line = line;
  }

  getRow() {
    return new Promise(async (resolve) => {
      const arr = this.line.split(',');
      const obj = {
        number: arr[0] ? arr[0] : '',
        amount: arr[1] ? arr[1] : '',
        dueDate: arr[2] ? arr[2] : '',
      }

      try {
        await schema.validate(obj);
        resolve({ ...obj, invoiceId: this.invoiceId });
      } catch (e) {
        resolve({
          ...obj,
          errors: [
            {
              field: 'number',
              isValid: await numberValidation().isValid(obj.number),
            },
            {
              field: 'amount',
              isValid: await amountValidation().isValid(obj.amount),
            },
            {
              field: 'dueDate',
              isValid: await dueDateValidation().isValid(obj.dueDate),
            },
          ],
        });
      }
    })
  }
}

class InvoiceCSVRowParts {
  constructor(fileName, invoiceId) {
    this.invoiceId = invoiceId;
    this.liner = new lineByLine(`./public/invoiceCSV/${fileName}`);
  }

  fileProcessing(cb) {
    return new Promise(async (resolve, reject) => {
      const lines = [];

      try {
        let line;
        while (line = this.liner.next()) {
          const invoiceCSVRow = new InvoiceCSVRow(
            line.toString().replace('\r', ''),
            this.invoiceId,
          );
          lines.push(await invoiceCSVRow.getRow());

          if (lines.length / 100 === 1) {
            await cb([...lines]);
            lines.length = 0;
          }
        }

        if (lines.length) {
          await cb([...lines]);
        }
      } catch (e) {
        reject(e);
      }

      resolve();
    });
  }
}

module.exports = InvoiceCSVRowParts;