const mongoose = require('mongoose');
const paginate = require('../utils/paginate');
const toJSON = require('../utils/toJSON');

const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    roleName: {
      type: String,
      trim: true,
      required: true,
    },
    roleIndex: {
      type: String,
      trim: true,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

roleSchema.plugin(paginate);
roleSchema.plugin(toJSON);

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
