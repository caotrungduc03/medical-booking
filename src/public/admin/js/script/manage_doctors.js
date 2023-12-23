const updateTbl = () => {
  $('#allDoctorTbl').DataTable().ajax.reload();
};

const configAllDoctorTbl = () => {
  $('#allDoctorTbl').dataTable({
    autoWidth: false,
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: '/api/v1/doctors?populate=department',
      dataSrc: function (json) {
        $('#allDoctorNav').html(`<span>Tất cả (${json.data.length})</span>`);

        json.data.forEach((element, index) => {
          element.index = index + 1;
          element.groupName = `
            <div>
              <div class="text-primary"><small><b>${element.doctorCode}</b></small></div>
              <span>${element.name}</span>
            </div>
          `;
          element.departmentName = element.department?.name || '';
          element.method = `
          <div class="div_icon">
            <a href="#" id="btn-update" title="Sửa" data-toggle="modal" data-target="#updateDoctorModal" class="mr-1"><i class="ti-pencil-alt"></i></a>
            <span id="btn-delete" class="model_img" title="Xoá"><i class="ti-close"></i></span>
          </div>
          `;
        });

        return json.data;
      },
    },
    columns: [
      { data: 'index', width: '4%' },
      {
        data: 'avatar',
        width: '10%',
        render: (value) =>
          `<img src="${value}" alt="Avatar" class="img-thumbnail" />`,
      },
      { data: 'groupName', width: '*' },
      { data: 'gender', width: '10%' },
      { data: 'degree', width: '16%' },
      {
        data: 'experience',
        width: '10%',
        render: (value) => (value || '< 1') + ' năm',
      },
      { data: 'departmentName', width: '16%' },
      { data: 'method', className: 'text-center', width: '8%' },
    ],
    columnDefs: [
      {
        searchable: true,
        targets: 1,
      },
      {
        orderable: false,
        targets: [0, 1, 2, 4, 6, 7],
      },
    ],
    language: {
      sProcessing: 'Đang xử lý...',
      sLengthMenu: 'Chọn số bản ghi hiển thị trên một trang _MENU_',
      sZeroRecords: 'Không có dữ liệu để hiển thị.',
      sInfo: 'Hiển thị từ _START_ đến _END_ trong tổng số _TOTAL_',
      sInfoEmpty: 'Hiển thị từ 0 đến 0 trong tổng số 0 mục',
      sInfoFiltered: '(được lọc từ _MAX_ bản ghi)',
      sInfoPostFix: '',
      sSearch: 'Tìm kiếm theo tên bác sĩ:',
      sUrl: '',
      oPaginate: {
        sFirst: 'Đầu',
        sPrevious: 'Trước',
        sNext: 'Tiếp',
        sLast: 'Cuối',
      },
    },
  });
};

const handleAddDoctor = () => {
  const modalId = `#addDoctorModal`;
  const formId = `#addDoctorForm`;

  $(formId).on('submit', async function (e) {
    e.preventDefault();
    const data = new FormData();
    const formFields = $(formId).serializeArray();
    const documentAvatars = $(`input[id="avatar"]`);
    formFields.forEach((field) => {
      data.append(field.name, field.value);
    });
    data.append('avatar', documentAvatars[0].files?.[0]);

    try {
      let result = await (
        await fetch(`/api/v1/doctors`, {
          method: 'POST',
          body: data,
        })
      ).json();
      if (result.code === 201) {
        swal('Tạo thành công', {
          icon: 'success',
        });
        $(modalId).modal('hide');
        $(formId)[0].reset();
        updateTbl();
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

const handleDeleteDoctor = () => {
  let doctor;

  $(`#allDoctorTbl tbody`).on('click', '#btn-delete', async function () {
    doctor = $('#allDoctorTbl').DataTable().row($(this).parents('tr')).data();

    swal({
      title: 'Bạn có chắc chắn ?',
      text: `Muốn XOÁ bác sĩ ${doctor.name?.toUpperCase()}`,
      icon: 'warning',
      buttons: ['Hủy', 'Xóa'],
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const result = await (
            await fetch(`/api/v1/doctors/${doctor.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            })
          ).json();
          if (result.code === 200) {
            swal(`Xoá thành công`, {
              icon: 'success',
            });
            updateTbl();
          } else {
            swal(result.message, {
              icon: 'error',
            });
          }
        }
      })
      .catch((err) => {
        swal('Thất bại', {
          icon: 'error',
          text: `${err}`,
        });
      });
  });
};

const handleUpdateDoctor = () => {
  const tblId = '#allDoctorTbl';
  const modalId = '#updateDoctorModal';
  const formId = '#updateDoctorForm';
  let doctor;

  $(`${tblId} tbody`).on('click', '#btn-update', function () {
    doctor = $(tblId).DataTable().row($(this).parents('tr')).data();

    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      if (field.name === 'department') {
        $(`${formId} [name='department']`).val(doctor.department.id).change();
      } else {
        $(`${formId} [name='${field.name}']`).val(doctor[field.name]).change();
      }
    });
    $(`${formId} #doctorCode`).val(doctor.doctorCode);
  });

  $(formId).on('submit', async function (e) {
    e.preventDefault();
    const data = new FormData();
    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      data[field.name] = field.value;
    });

    try {
      let result = await (
        await fetch(`/api/v1/doctors/${doctor.id}`, {
          method: 'PATCH',
          body: data,
        })
      ).json();
      if (result.code === 200) {
        swal('Cập nhật thành công', {
          icon: 'success',
        });
        $(modalId).modal('hide');
        $(formId)[0].reset();
        updateTbl();
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
  configAllDoctorTbl();
  handleAddDoctor();
  handleDeleteDoctor();
  handleUpdateDoctor();
});
