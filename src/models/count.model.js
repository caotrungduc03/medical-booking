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
  const BNObj = { model: 'patient', type: 'patientCode' };

  await Promise.all([
    Count.findOneAndUpdate(CKObj, { $setOnInsert: CKObj }, { upsert: true }),
    Count.findOneAndUpdate(BSObj, { $setOnInsert: BSObj }, { upsert: true }),
    Count.findOneAndUpdate(CLVObj, { $setOnInsert: CLVObj }, { upsert: true }),
    Count.findOneAndUpdate(BNObj, { $setOnInsert: BNObj }, { upsert: true }),
  ]);
})();

module.exports = Count;
