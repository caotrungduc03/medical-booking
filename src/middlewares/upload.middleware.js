const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const ApiError = require('../utils/ApiError');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRECT,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'medical-booking',
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

const uploadMedicalForm = upload.fields([
  {
    name: 'cccd',
    maxCount: 1,
  },
  {
    name: 'bhyt',
    maxCount: 1,
  },
]);

module.exports = {
  upload,
  uploadAvatar,
  uploadMedicalForm,
};
