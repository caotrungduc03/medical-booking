const orderMedicalForm = () => {
  $('#orderMedicalForm').on('submit', async function (e) {
    e.preventDefault();
    const data = new FormData();
    const formFields = $(this).serializeArray();
    const documentCCCDs = $(`input[id="cccd"]`);
    const documentBHYTs = $(`input[id="bhyt"]`);
    formFields.forEach((field) => {
      data.append([field.name], field.value);
    });
    data.append('cccd', documentCCCDs[0].files[0]);
    data.append('bhyt', documentBHYTs[0].files[0]);
    try {
      let result = await (
        await fetch(`/api/v1/medical-forms`, {
          method: 'POST',
          body: data,
        })
      ).json();
      if (result.code === 201) {
        swal('Tạo thành công', {
          icon: 'success',
        });
        setTimeout(() => (window.location.href = '/admin/history-order'), 1000);
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
