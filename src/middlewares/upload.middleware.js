const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');

const getDest = (uploadDir) => {
  return path.join(__dirname, `../public/admin/uploads/${uploadDir}`);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check the fieldname and store files accordingly
    if (file.fieldname === 'avatar') {
      cb(null, getDest('AVATAR'));
    } else if (file.fieldname === 'CCCD') {
      cb(null, getDest('CCCD'));
    } else if (file.fieldname === 'BHYT') {
      cb(null, getDest('BHYT'));
    } else {
      cb(new ApiError(400, 'Trường không hợp lệ!'));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // up to 10 MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const checkFileType = (file, cb) => {
  // Allowed extensions
  const fileType = /jpeg|jpg|png/;
  // Check extension
  const extname = fileType.test(path.extname(file.originalname).toLowerCase());
  // Check mimetype
  const mimetype = fileType.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new ApiError(400, 'Định dạng file không hỗ trợ!'));
  }
};

const uploadAvatar = upload.fields([{ name: 'avatar', maxCount: 1 }]);

module.exports = {
  upload,
  uploadAvatar,
};
