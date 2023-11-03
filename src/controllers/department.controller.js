const { Department, Count } = require('../models');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const getDepartments = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = {};

  if (query.search) {
    let searchValue = query.search['value'];
    filter.name = { $regex: searchValue, $options: 'i' };
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

  const departments = await Department.paginate(filter, options);

  res.status(200).json(response(200, 'Thành công', departments));
});

const createDepartment = catchAsync(async (req, res) => {
  const countObj = {
    model: 'department',
    type: 'departmentCode',
  };
  let count = await Count.findOne(countObj);
  if (!count) {
    count = new Count(countObj);
  }

  const departmentCode = 'CK.' + count.number.toString().padStart(6, '0');

  await Department.create({ ...req.body, departmentCode });
  count.number += 1;
  await count.save();

  res.status(201).json(response(201, 'Thành công'));
});

const updateDepartmentById = catchAsync(async (req, res) => {
  const { departmentId } = req.params;

  const dataUpdate = pick(req.body, ['name', 'year', 'leader', 'description']);
  const updatedDepartment = await Department.findByIdAndUpdate(
    departmentId,
    dataUpdate,
  );
  if (!updatedDepartment) {
    throw new ApiError(404, 'Department not found');
  }

  res.status(200).json(response(200, 'Thành công'));
});

const deleteDepartmentById = catchAsync(async (req, res) => {
  const { departmentId } = req.params;

  const deletedDepartment = await Department.findByIdAndDelete(departmentId);
  if (!deletedDepartment) {
    throw new ApiError(404, 'Department not found');
  }

  res.status(200).json(response(200, 'Thành công'));
});

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartmentById,
  deleteDepartmentById,
};
