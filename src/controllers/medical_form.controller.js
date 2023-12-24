const moment = require('moment');
const { MedicalForm, Shift } = require('../models');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { sendApprovalConfirmation } = require('../utils/mail');

const getMedicalForms = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = {};

  if (query.status) {
    if (Array.isArray(query.status)) {
      filter.status = { $in: [...query.status] };
    } else {
      filter.status = { $in: [query.status] };
    }
  }

  if (query.search?.['value']) {
    let searchValue = query.search['value'];
    filter.fullName = { $regex: searchValue, $options: 'i' };
  }

  if (query.columns?.[0].search?.['value']) {
    const departmentValue = query.columns[0]?.search['value'];
    filter.medicalDepartment = departmentValue;
  }

  if (query.columns?.[1].search?.['value']) {
    const dateValue = query.columns[1]?.search['value'];
    const date = moment(dateValue);
    const shifts = await Shift.find({
      date: {
        $gte: date.startOf('day').toDate(),
        $lte: date.endOf('day').toDate(),
      },
    });
    const shiftIds = shifts.map((shift) => shift.id);
    filter.shift = { $in: shiftIds };
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

  const medicalForms = await MedicalForm.paginate(filter, options);

  res.status(200).json(response(200, 'Thành công', medicalForms));
});

const createMedicalForm = catchAsync(async (req, res) => {
  const data = req.body;
  const files = req.files;
  let cccd;
  let bhyt = '';

  if (files.cccd) {
    cccd = files.cccd[0].path;
  } else {
    throw new ApiError(400, 'Vui lòng gửi file ảnh CMND/CCCD');
  }

  if (files.bhyt?.[0]) {
    bhyt = files.bhyt[0].path;
  }

  const shift = await Shift.findById(data.shift);
  if (!shift) {
    throw new ApiError(404, 'Ca khám bệnh không tìm thấy');
  }

  await MedicalForm.create({
    ...data,
    cccd,
    bhyt,
    status: 0,
  });

  shift.slot++;
  await shift.save();

  res.status(201).json(response(201, 'Thành công'));
});

const getMedicalFormsByUser = catchAsync(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const filter = {};

  if (query.status) {
    if (Array.isArray(query.status)) {
      filter.status = { $in: [...query.status] };
    } else {
      filter.status = { $in: [query.status] };
    }
  }

  if (query.search) {
    let searchValue = query.search['value'];
    filter.fullName = { $regex: searchValue, $options: 'i' };
  }

  filter.user = user._id;

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

  const medicalForms = await MedicalForm.paginate(filter, options);

  res.status(200).json(response(200, 'Thành công', medicalForms));
});

const updateMedicalFormByUser = catchAsync(async (req, res) => {
  const { medicalFormId } = req.params;

  const medicalForm = await MedicalForm.findById(medicalFormId);

  if (!req.user._id.equals(medicalForm?.user)) {
    throw new ApiError(403, 'Không có quyền');
  }

  Object.assign(medicalForm, req.body);
  await medicalForm.save();

  res.status(200).json(response(200, 'Thành công'));
});

const getAllMedicalForms = catchAsync(async (req, res) => {
  const medicalForms = await MedicalForm.find().populate('medicalDepartment');

  res.status(200).json(response(200, 'Thành công', medicalForms));
});

const updateMedicalFormStatus = async (req, res) => {
  const { medicalFormId } = req.params;
  const { status } = req.body;

  const medicalForm = await MedicalForm.findById(medicalFormId);

  if (!medicalForm) {
    throw new ApiError(404, 'Đơn khám không tồn tại');
  }

  Object.assign(medicalForm, { status });
  await medicalForm.save();

  sendApprovalConfirmation({
    to: medicalForm.email,
    fullName: medicalForm.fullName,
    medicalTime: new Date(),
    medicalOrder: Math.floor(Math.random() * 100),
    isApproved: status === 1,
  });

  res.status(200).json(response(200, 'Thành công'));
};

module.exports = {
  getMedicalForms,
  createMedicalForm,
  getMedicalFormsByUser,
  updateMedicalFormByUser,
  getAllMedicalForms,
  updateMedicalFormStatus,
};
