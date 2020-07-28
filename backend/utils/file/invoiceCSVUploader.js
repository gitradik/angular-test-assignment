require('dotenv/config');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './public/invoiceCSV',
  filename: function (req, file, cb) {
    let orgName = JSON.stringify(file.originalname);
    let newName = '';
    for (let i = 0; i < orgName.length; i++) {
      if (i !== orgName.length - 1) {
        newName += orgName.charAt(i) === '"' || orgName.charAt(i) === ' ' ? '-' : orgName.charAt(i);
      }
    }
    cb(null, Date.now() + '-' + newName);
  }
});

const uploadInvoiceCSV = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: function (req, file, cb) {
    sanitizeFile(file, cb);
  }
}).single(process.env.INVOICE_CSV_FILE_FIELD);

function sanitizeFile(file, cb) {
  const fileExts = ['csv'];

  let newStr = '';

  for (let i = file.originalname.length - 1; i > 0; i--) {
    if (file.originalname.charAt(i) === '.') break;
    newStr += file.originalname.charAt(i);
  }

  newStr = [...newStr].reverse().join('');

  const isAllowedExt = fileExts.includes(newStr.toLowerCase());

  const isAllowedMimeType = file.mimetype === process.env.INVOICE_CSV_FILE_TYPE;

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true);
  } else {
    cb({ errorType: 'INAPPROPRIATE_FILE_TYPE' });
  }
}

module.exports = uploadInvoiceCSV;
