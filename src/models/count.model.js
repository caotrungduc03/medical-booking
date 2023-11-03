const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');
const paginate = require('../utils/paginate');

const countSchema = mongoose.Schema(
  {
    model: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    type: {
      type: String,
      trim: true,
    },
    number: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

// add plugin that converts mongoose to json
countSchema.plugin(toJSON);
countSchema.plugin(paginate);

const Count = mongoose.model('Count', countSchema);

(async () => {
  const CKObj = { model: 'department', type: 'departmentCode' };
  const BSObj = { model: 'doctor', type: 'doctorCode' };
  const CLVObj = { model: 'shift', type: 'shiftCode' };

  await Promise.all([
    await Count.findOneAndUpdate(
      CKObj,
      { $setOnInsert: CKObj },
      { upsert: true },
    ),
    await Count.findOneAndUpdate(
      BSObj,
      { $setOnInsert: BSObj },
      { upsert: true },
    ),
    await Count.findOneAndUpdate(
      CLVObj,
      { $setOnInsert: CLVObj },
      { upsert: true },
    ),
  ]);
})();

module.exports = Count;