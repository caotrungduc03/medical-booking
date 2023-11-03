const mongoose = require('mongoose');
const paginate = require('../utils/paginate');
const toJSON = require('../utils/toJSON');

const Schema = mongoose.Schema;

const departmentSchema = new Schema(
  {
    departmentCode: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    leader: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      default: '/static/admin/images/department.png',
    },
  },
  {
    timestamps: true,
  },
);

departmentSchema.plugin(paginate);
departmentSchema.plugin(toJSON);

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
