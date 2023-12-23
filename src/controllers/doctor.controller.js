const { Count, Doctor } = require('../models');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const getDoctors = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = {};

  if (query.department) {
    if (query.department === 'null') {
      filter.department = null;
    } else {
      filter.department = query.department;
    }
  }
  if (query.search) {
    let searchValue = query.search['value'];
    filter.name = { $regex: searchValue, $options: 'i' };
  }
  if (query.q) {
    let qValue = query.q;
    filter.name = { $regex: qValue, $options: 'i' };
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

  const doctors = await Doctor.paginate(filter, options);

  res.status(200).json(response(200, 'Thành công', doctors));
});

const createDoctor = catchAsync(async (req, res) => {
  const data = req.body;
  const files = req.files;
  const countObj = {
    model: 'doctor',
    type: 'doctorCode',
  };
  let count = await Count.findOne(countObj);
  if (!count) {
    count = new Count(countObj);
  }

  data.doctorCode = 'CK.' + count.number.toString().padStart(6, '0');

  if (files.avatar?.[0]) {
    const filePath = files.avatar[0].path;
    data.avatar =
      '/static/admin/uploads/AVATAR/' +
      filePath.substring(filePath.lastIndexOf('\\') + 1);
  } else {
    data.avatar =
      '/static/admin/images/' +
      (data.gender === 'Nữ' ? 'female-doctor.png' : 'male-doctor.png');
  }

  await Doctor.create(data);
  count.number += 1;
  await count.save();

  res.status(201).json(response(201, 'Thành công'));
});

const updateDoctorById = catchAsync(async (req, res) => {
  const { doctorId } = req.params;

  const dataUpdate = pick(req.body, [
    'name',
    'gender',
    'year',
    'leader',
    'description',
  ]);
  const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, dataUpdate);
  if (!updatedDoctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  res.status(200).json(response(200, 'Thành công'));
});

const deleteDoctorById = catchAsync(async (req, res) => {
  const { doctorId } = req.params;

  const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);
  if (!deletedDoctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  res.status(200).json(response(200, 'Thành công'));
});

module.exports = {
  getDoctors,
  createDoctor,
  updateDoctorById,
  deleteDoctorById,
};
