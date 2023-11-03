const updateProfile = () => {
  $('#updateProfileForm').on('submit', async function (e) {
    e.preventDefault();
    const data = {};
    const formFields = $(this).serializeArray();
    formFields.forEach((field) => {
      data[field.name] = field.value;
    });

    try {
      let result = await (
        await fetch(`/api/v1/users/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      ).json();
      if (result.code === 200) {
        swal('Cập nhật thành công', {
          icon: 'success',
        });
      } else {
        swal(result.message, {
          icon: 'error',
        });
      }
    } catch (error) {
      notiError(error);
    }
  });
};

$(document).ready(function () {
  updateProfile();
});
