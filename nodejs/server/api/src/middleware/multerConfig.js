const multer = require('multer');
const path = require('path');

const UPLOAD_FOLDER = path.resolve(process.cwd(), '../../datasets/uploads')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    // File name will be original name + timestamp + extension
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
