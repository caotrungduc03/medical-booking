const { MedicalForm } = require('../models');
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

  if (query.search) {
    let searchValue = query.search['value'];
    filter.fullName = { $regex: searchValue, $options: 'i' };
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
  await MedicalForm.create({ ...req.body, status: 0 });

  res.status(201).json(response(201, 'Thành công'));
});

const getMedicalFormsByUser = catchAsync(async (req, res) => {
  const user = req.user;

  const medicalForms = await MedicalForm.find({ user: user._id });

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
  const medicalForms = await MedicalForm.find();

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
