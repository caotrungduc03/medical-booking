const mongoose = require('mongoose');
const paginate = require('../utils/paginate');
const toJSON = require('../utils/toJSON');

const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    doctorCode: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Nam', 'Nữ'],
      default: 'Nam',
    },
    degree: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    experience: {
      type: Number,
      trim: true,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

doctorSchema.plugin(paginate);
doctorSchema.plugin(toJSON);

const doctor = mongoose.model('doctor', doctorSchema);

module.exports = doctor;
