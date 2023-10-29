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
      return notiError('Mật khẩu không trùng khớp!');
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

$(document).ready(function () {
  handleRegister();
});
