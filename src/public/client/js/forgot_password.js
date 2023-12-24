const handleSubmit = () => {
  $('#forgotPasswordForm').on('submit', async (e) => {
    e.preventDefault();

    const data = {
      email: $('#email').val(),
    };

    try {
      const result = await (
        await fetch(`/api/v1/auth/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      ).json();

      if (result.code == 200) {
        notiSuccess('Gửi thành công, vui lòng check email!');
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
