const mongoose = require('mongoose');
const paginate = require('../utils/paginate');
const toJSON = require('../utils/toJSON');

const Schema = mongoose.Schema;

const shiftSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    maxSlot: {
      type: Number,
      required: true,
    },
    slot: {
      type: Number,
      default: 0,
    },
    note: String,
  },
  {
    timestamps: true,
  },
);

shiftSchema.plugin(paginate);
shiftSchema.plugin(toJSON);

const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
