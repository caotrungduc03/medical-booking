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
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
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
    phone: {
      type: String,
      trim: true,
    },
    medicalDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    shift: {
      type: Schema.Types.ObjectId,
      ref: 'Shift',
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    cccd: {
      type: String,
      trim: true,
      required: true,
    },
    bhyt: {
      type: String,
      trim: true,
      // required: true,
    },
    deniedReason: {
      type: String,
      trim: true,
      default: '',
    },
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
