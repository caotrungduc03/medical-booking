const handleSubmit = () => {
  $('#resetPasswordForm').on('submit', async (e) => {
    e.preventDefault();
    const token = window.location.href.split('token=').pop();

    const data = {
      token,
      password: $('#password').val(),
      confirmPassword: $('#confirmPassword').val(),
    };

    try {
      const result = await (
        await fetch(`/api/v1/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      ).json();

      if (result.code == 200) {
        notiSuccess('Đặt lại mật khẩu thành công');
        setTimeout(() => (window.location.href = '/login'), 1000);
      } else {
        notiError(result.message);
      }
    } catch (err) {
      notiError(err.message);
    }
  });
};

$(document).ready(function () {
  handleSubmit();
});
