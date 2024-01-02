let shifts = [];

const orderMedicalForm = (id) => {
  $(id).on('submit', async function (e) {
    e.preventDefault();
    const data = new FormData();
    const formFields = $(this).serializeArray();
    const documentCCCDs = $(`${id} input[id="cccd"]`);
    const documentBHYTs = $(`${id} input[id="bhyt"]`);
    formFields.forEach((field) => {
      data.append([field.name], field.value);
    });
    data.append('cccd', documentCCCDs[0]?.files[0]);
    data.append('bhyt', documentBHYTs[0]?.files[0]);
    try {
      notiSuccess('Đã gửi yêu cầu, chờ hệ thống xử lý');
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

const handleDoctorSelect2Filter = (id, departmentId) => {
  doctorSelect2Filter(`${id} #doctor-select2`, {
    department: departmentId || 'null',
  });
};

const handleOperationSequence = (id) => {
  $(`${id} #medicalDepartment`).on('change', function (e) {
    handleDoctorSelect2Filter(id, e.target.value);
  });
  $(`${id} #doctor-select2`).on('change', async function (e) {
    await handleGetShifts(e.target.value);

    let medicalDays = shifts.map((shift) =>
      moment(shift.date).format('DD-MM-YYYY'),
    );

    let str = '<option value="" selected>-- Chọn --</option>';
    [...new Set(medicalDays)].forEach(
      (shift) => (str += `<option>${shift}</option>`),
    );
    $(`${id} #medicalDay`).html(str);
  });
  $(`${id} #medicalDay`).on('change', function (e) {
    const medicalDayValue = e.target.value;
    let filterShifts = shifts.filter(
      (shift) => moment(shift.date).format('DD-MM-YYYY') === medicalDayValue,
    );

    let str = '<option value="" selected>-- Chọn --</option>';
    filterShifts.forEach(
      (shift) =>
        (str += `<option value="${shift.id}">${shift.time} (${shift.slot}/${shift.maxSlot})</option>`),
    );
    $(`${id} #medicalHour`).html(str);
  });
};

$(document).ready(function () {
  orderMedicalForm('#orderNormalForm');
  orderMedicalForm('#orderPatientCodeForm');
  handleDoctorSelect2Filter('#orderNormalForm');
  handleDoctorSelect2Filter('#orderPatientCodeForm');
  handleOperationSequence('#orderNormalForm');
  handleOperationSequence('#orderPatientCodeForm');
});
