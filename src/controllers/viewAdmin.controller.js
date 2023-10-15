const catchAsync = require('../utils/catchAsync');

const dashboard = catchAsync(async (req, res) => {
  res.render('admin/dashboard');
});

module.exports = {
  dashboard,
};
