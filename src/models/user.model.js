const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const moment = require('moment/moment');
const toJSON = require('../utils/toJSON');
const paginate = require('../utils/paginate');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    avatar: {
      type: String,
      default: '/static/admin/images/avatar/anonymous.png',
    },
    firstName: {
      type: String,
      require: true,
      trim: true,
    },
    lastName: {
      type: String,
      require: true,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: ['Nam', 'Nữ', 'Khác'],
      default: 'Khác',
    },
    cardId: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!value.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)) {
          throw new Error('Email không hợp lệ');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Mật khẩu cần tối thiểu 8 kí tự, gồm cả chữ cái và chữ số',
          );
        }
      },
      select: false,
    },
    birthday: {
      type: Date,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.pre('save', async function (next) {
  const user = this;

  try {
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 7);
    }

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.virtual('fullName').get(function () {
  return this.lastName + ' ' + this.firstName;
});

userSchema.virtual('birthdayFormat').get(function () {
  return moment(this.birthday).format('YYYY-MM-DD');
});

const User = mongoose.model('User', userSchema);

module.exports = User;
