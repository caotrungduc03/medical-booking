const mongoose = require('mongoose');
const paginate = require('../utils/paginate');
const toJSON = require('../utils/toJSON');

const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    patientCode: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
    cccd: {
      type: String,
      trim: true,
      required: true,
    },
    bhyt: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

patientSchema.plugin(paginate);
patientSchema.plugin(toJSON);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
