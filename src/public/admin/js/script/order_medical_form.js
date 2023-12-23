let shifts = [];

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
        setTimeout(
          () => (window.location.href = '/admin/history-orders'),
          1000,
        );
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

const handleGetShifts = async (doctorId) => {
  try {
    let result = await (
      await fetch(`/api/v1/shifts?doctor=${doctorId}&limit=20`)
    ).json();
    if (result.code === 200) {
      shifts = result.data;
    } else {
      notiError(result.message);
    }
  } catch (error) {
    notiError(error);
  }
};

const handleDoctorSelect2Filter = (departmentId) => {
  doctorSelect2Filter('#orderMedicalForm #doctor-select2', {
    department: departmentId || 'null',
  });
};

const handleOperationSequence = () => {
  $('#medicalDepartment').on('change', function (e) {
    handleDoctorSelect2Filter(e.target.value);
  });
  $('#doctor-select2').on('change', async function (e) {
    await handleGetShifts(e.target.value);

    let medicalDays = shifts.map((shift) =>
      moment(shift.date).format('DD-MM-YYYY'),
    );

    let str = '<option value="" selected>-- Chọn --</option>';
    [...new Set(medicalDays)].forEach(
      (shift) => (str += `<option>${shift}</option>`),
    );
    $('#medicalDay').html(str);
  });
  $('#medicalDay').on('change', function (e) {
    const medicalDayValue = e.target.value;
    let filterShifts = shifts.filter(
      (shift) => moment(shift.date).format('DD-MM-YYYY') === medicalDayValue,
    );

    let str = '<option value="" selected>-- Chọn --</option>';
    filterShifts.forEach(
      (shift) =>
        (str += `<option value="${shift.id}">${shift.time} (${shift.slot}/${shift.maxSlot})</option>`),
    );
    $('#medicalHour').html(str);
  });
};

$(document).ready(function () {
  orderMedicalForm();
  handleDoctorSelect2Filter();
  handleOperationSequence();
});
