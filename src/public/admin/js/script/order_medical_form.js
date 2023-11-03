const orderMedicalForm = () => {
  $('#orderMedicalForm').on('submit', async function (e) {
    e.preventDefault();
    const data = {};
    const formFields = $(this).serializeArray();
    formFields.forEach((field) => {
      data[field.name] = field.value;
    });

    try {
      let result = await (
        await fetch(`/api/v1/medical-forms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      ).json();
      if (result.code === 201) {
        swal('Tạo thành công', {
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
  orderMedicalForm();
});
