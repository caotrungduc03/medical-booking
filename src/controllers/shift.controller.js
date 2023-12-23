const { Count, Shift } = require('../models');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const getShifts = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = {};

  if (query.search?.value) {
    let searchValue = query.search['value'];
    filter.place = { $regex: searchValue, $options: 'i' };
  }

  if (query.doctor) {
    filter.doctor = query.doctor;
  }

  let columnIndex;
  let columnName;
  let columnSortOrder;
  if (query.order) {
    columnIndex = query.order[0]['column']; // Column index
    columnName = query.columns[columnIndex]['data']; // Column name
    columnSortOrder = query.order[0]['dir']; // asc or desc
  }
  let order = `${columnName}:${columnSortOrder}`;
  const options = pick(query, ['draw', 'order', 'length', 'start', 'populate']);
  let page = parseInt(options.start) / parseInt(options.length);
  options['limit'] = options['length'];
  delete options['length'];
  options['page'] = options['start'];
  delete options['start'];
  options['page'] = page + 1;
  options['sortBy'] = options['order'];
  delete options['order'];
  options['sortBy'] = order;

  const shifts = await Shift.paginate(filter, options);

  res.status(200).json(response(200, 'Thành công', shifts));
});

const createShift = catchAsync(async (req, res) => {
  const data = req.body;
  await Shift.create(data);

  res.status(201).json(response(201, 'Thành công'));
});

const updateShiftById = catchAsync(async (req, res) => {
  const { shiftId } = req.params;

  const dataUpdate = pick(req.body, [
    'doctor',
    'date',
    'time',
    'place',
    'maxSlot',
    'note',
  ]);
  const updatedShift = await Shift.findByIdAndUpdate(shiftId, dataUpdate);
  if (!updatedShift) {
    throw new ApiError(404, 'Shift not found');
  }

  res.status(200).json(response(200, 'Thành công'));
});

const deleteShiftById = catchAsync(async (req, res) => {
  const { shiftId } = req.params;

  const deletedShift = await Shift.findByIdAndDelete(shiftId);
  if (!deletedShift) {
    throw new ApiError(404, 'Shift not found');
  }

  res.status(200).json(response(200, 'Thành công'));
});

module.exports = {
  getShifts,
  createShift,
  updateShiftById,
  deleteShiftById,
};
