const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');
const response = require('../utils/response');
const pick = require('../utils/pick');

const getUsers = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = {};

  if (query.isLocked) {
    filter.isLocked = query.isLocked;
  }

  if (query.search) {
    let searchValue = query.search['value'];
    filter['$or'] = [
      { firstName: { $regex: searchValue, $options: 'i' } },
      { lastName: { $regex: searchValue, $options: 'i' } },
    ];
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

  const users = await User.paginate(filter, options);

  res.status(200).json(response(200, 'Thành công', users));
});

const createUser = catchAsync(async (req, res) => {
  await User.create(req.body);

  res.status(201).json(response(201, 'Thành công'));
});

const getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(response(200, 'Thành công', user));
});

const updateUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { confirmPassword, ...remainingData } = req.body;

  const dataUpdate = pick(remainingData, [
    'firstName',
    'lastName',
    'password',
    'gender',
    'cardId',
    'birthday',
    'phone',
    'address',
    'isLocked',
    'roles',
  ]);

  if (!dataUpdate.password) {
    delete dataUpdate.password;
  }

  if (confirmPassword && dataUpdate?.password !== confirmPassword) {
    throw new ApiError(400, 'Xác nhận mật khẩu không trùng khớp!');
  }

  const user = await User.findById(userId);
  Object.assign(user, dataUpdate);

  await user.save();

  res.status(200).json(response(200, 'Thành công'));
});

const deleteUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(response(200, 'Thành công'));
});

const updateProfile = catchAsync(async (req, res) => {
  const user = req.user;

  const dataUpdate = pick(req.body, [
    'firstName',
    'lastName',
    'gender',
    'cardId',
    'birthday',
    'phone',
    'address',
  ]);

  Object.assign(user, dataUpdate);

  await user.save();

  res.status(200).json(response(200, 'Thành công'));
});

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  updateProfile,
};
