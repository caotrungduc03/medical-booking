const { Role } = require('../models');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');
const pick = require('../utils/pick');

const getRoles = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = {};

  if (query.isLocked) {
    filter.isLocked = query.isLocked;
  }

  if (query.search) {
    let searchValue = query.search['value'];
    filter.roleName = { $regex: searchValue, $options: 'i' };
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

  const roles = await Role.paginate(filter, options);

  res.status(200).json(response(200, 'Thành công', roles));
});

const createRole = catchAsync(async (req, res) => {
  await Role.create(req.body);

  res.status(201).json(response(201, 'Thành công'));
});

const updateRoleById = catchAsync(async (req, res) => {
  const { roleId } = req.params;

  const dataUpdate = pick(req.body, ['roleName', 'roleIndex', 'isLocked']);
  const updatedRole = await Role.findByIdAndUpdate(roleId, dataUpdate);
  if (!updatedRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }

  res.status(200).json(response(200, 'Thành công'));
});

const deleteRoleById = catchAsync(async (req, res) => {
  const { roleId } = req.params;

  const deletedRole = await Role.findByIdAndDelete(roleId);
  if (!deletedRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }

  res.status(200).json(response(200, 'Thành công'));
});

module.exports = {
  getRoles,
  createRole,
  updateRoleById,
  deleteRoleById,
};
