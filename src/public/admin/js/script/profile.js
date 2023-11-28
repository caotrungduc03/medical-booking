const updateProfile = () => {
  $('#updateProfileForm').on('submit', async function (e) {
    e.preventDefault();
    const data = new FormData();
    const formFields = $(this).serializeArray();
    const documents = $(`input[name="avatar"]`);
    formFields.forEach((field) => {
      data.append(field.name, field.value);
    });
    data.append('avatar', documents[0].files[0]);

    try {
      let result = await (
        await fetch(`/api/v1/users/profile`, {
          method: 'PATCH',
          body: data,
        })
      ).json();
      if (result.code === 200) {
        swal('Cập nhật thành công', {
          icon: 'success',
        });
        setTimeout(() => window.location.reload(), 1000);
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
