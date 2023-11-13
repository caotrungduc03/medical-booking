const mongoose = require('mongoose');
const moment = require('moment/moment');
const toJSON = require('../utils/toJSON');
const paginate = require('../utils/paginate');

const Schema = mongoose.Schema;

const medicalFormSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    fullName: {
      type: String,
      require: true,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: ['Nam', 'Nữ'],
      require: true,
    },
    cardId: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!value.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)) {
          throw new Error('Email không hợp lệ');
        }
      },
    },
    birthday: {
      type: Date,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    medicalDepartment: {
      type: String,
      trim: true,
      required: true,
    },
    medicalDay: {
      type: Date,
      required: true,
    },
    medicalHour: {
      type: String,
      trim: true,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    status: Number,
  },
  {
    timestamps: true,
  },
);

medicalFormSchema.plugin(toJSON);
medicalFormSchema.plugin(paginate);

medicalFormSchema.virtual('birthdayFormat').get(function () {
  return moment(this.birthday).format('YYYY-MM-DD');
});

medicalFormSchema.virtual('medicalDayFormat').get(function () {
  return moment(this.medicalDay).format('YYYY-MM-DD');
});

const MedicalForm = mongoose.model('MedicalForm', medicalFormSchema);

module.exports = MedicalForm;
