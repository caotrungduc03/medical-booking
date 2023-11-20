const mongoose = require('mongoose');
const paginate = require('../utils/paginate');
const toJSON = require('../utils/toJSON');

const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

tokenSchema.plugin(paginate);
tokenSchema.plugin(toJSON);

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
