const handleRegister = () => {
  $('#registerForm').on('submit', async function (e) {
    e.preventDefault();
    const data = {};
    const formFields = $('#registerForm').serializeArray();
    formFields.forEach((field) => {
      data[field.name] = field.value;
    });

    if (!data.email?.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)) {
      return notiError('Email không hợp lệ');
    }

    if (!data.password?.match(/\d/) || !data.password?.match(/[a-zA-Z]/)) {
      return notiError(
        'Mật khẩu cần tối thiểu 8 kí tự, gồm cả chữ cái và chữ số',
      );
    }

    if (data.password !== data.confirmPassword) {
      return notiError('Xác nhận mật khẩu không trùng khớp!');
    }

    try {
      let result = await (
        await fetch(`/api/v1/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      ).json();

      if (result.code === 201) {
        notiSuccess('Đăng ký thành công');
        setTimeout(() => (window.location.href = '/login'), 2000);
      } else {
        notiError(result.message);
      }
    } catch (error) {
      notiError(error);
    }
  });
};

const handleLogin = () => {
  const formId = '#loginForm';

  $(formId).on('submit', async function (e) {
    e.preventDefault();
    const email = $(`${formId} #email`).val();
    const password = $(`${formId} #password`).val();

    if (!email.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)) {
      return notiError('Email không hợp lệ');
    }
    if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
      return notiError(
        'Mật khẩu cần tối thiểu 8 kí tự, gồm cả chữ cái và chữ số',
      );
    }

    try {
      let result = await (
        await fetch(`/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
      ).json();

      if (result.code === 200) {
        const accessToken = result.data;
        window.localStorage.setItem('access-token-mb', accessToken);
        notiSuccess('Đăng nhập thành công!');
        setTimeout(() => (window.location.href = '/admin'), 2000);
      } else {
        notiError(result.message);
      }
    } catch (error) {
      notiError(error);
    }
  });
};

const handleEnterPassword = () => {
  const eyeBtn = $('#btn-eye');
  const password = $('#loginForm #password');

  password.on('keyup', function (e) {
    if (e.target.value) {
      eyeBtn.show();
    } else {
      eyeBtn.hide();
    }
  });

  eyeBtn.on('click', function (e) {
    if (password.attr('type') === 'password') {
      password.attr('type', 'text');
      eyeBtn.html('<i class="fa fa-eye-slash"></i>');
    } else {
      password.attr('type', 'password');
      eyeBtn.html('<i class="fa fa-eye"></i>');
    }
  });
};

$(document).ready(function () {
  handleRegister();
  handleLogin();
  handleEnterPassword();
});
