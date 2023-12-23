const updateTbl = () => {
  $('#allShiftTbl').DataTable().ajax.reload();
};

const configAllShiftTbl = () => {
  $('#allShiftTbl').dataTable({
    autoWidth: false,
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: '/api/v1/shifts?populate=doctor',
      dataSrc: function (json) {
        $('#allShiftNav').html(`<span>Tất cả (${json.data.length})</span>`);

        json.data.forEach((element, index) => {
          element.index = index + 1;
          element.groupDoctorName = `
            <div>
              <div class="text-primary"><small><b>${element.doctor?.doctorCode}</b></small></div>
              <span>${element.doctor?.name}</span>
            </div>
          `;
          element.currentSlot = element.slot + '/' + element.maxSlot;
          element.method = `
          <div class="div_icon">
            <a href="#" id="btn-update" title="Sửa" data-toggle="modal" data-target="#updateShiftModal" class="mr-1"><i class="ti-pencil-alt"></i></a>
            <span id="btn-delete" class="model_img" title="Xoá"><i class="ti-close"></i></span>
          </div>
          `;
        });

        return json.data;
      },
    },
    columns: [
      { data: 'index', width: '4%' },
      { data: 'groupDoctorName', width: '*' },
      {
        data: 'date',
        width: '12%',
        render: (value) => {
          return moment(value).format('DD-MM-YYYY');
        },
      },
      { data: 'time', width: '12%' },
      { data: 'place', width: '24%' },
      { data: 'currentSlot', width: '10%' },
      { data: 'method', className: 'text-center', width: '8%' },
    ],
    columnDefs: [
      {
        searchable: true,
        targets: 1,
      },
      {
        orderable: false,
        targets: [0, 1, 4, 6],
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
      sSearch: 'Tìm kiếm theo địa điểm:',
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

const handleAddShift = () => {
  const modalId = `#addShiftModal`;
  const formId = `#addShiftForm`;

  $(formId).on('submit', async function (e) {
    e.preventDefault();
    const data = {};
    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      data[field.name] = field.value;
    });

    try {
      let result = await (
        await fetch(`/api/v1/shifts`, {
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

const handleDeleteShift = () => {
  let shift;

  $(`#allShiftTbl tbody`).on('click', '#btn-delete', async function () {
    shift = $('#allShiftTbl').DataTable().row($(this).parents('tr')).data();

    swal({
      title: 'Bạn có chắc chắn ?',
      text: `Muốn XOÁ ca làm việc này`,
      icon: 'warning',
      buttons: ['Hủy', 'Xóa'],
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const result = await (
            await fetch(`/api/v1/shifts/${shift.id}`, {
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

const handleUpdateShift = () => {
  const tblId = '#allShiftTbl';
  const modalId = '#updateShiftModal';
  const formId = '#updateShiftForm';
  let shift;

  $(`${tblId} tbody`).on('click', '#btn-update', function () {
    shift = $(tblId).DataTable().row($(this).parents('tr')).data();

    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      if (field.name === 'time') {
        $(`${formId} [name='time']`).val(shift.time).change();
      } else if (field.name === 'date') {
        $(`${formId} [name='date']`).val(
          moment(shift.date).format('YYYY-MM-DD'),
        );
      } else {
        $(`${formId} [name='${field.name}']`).val(shift[field.name]).change();
      }
    });
    $(`${formId} #doctor-select2`).html(
      `<option value="${shift.doctor?.id}" selected>${shift.doctor?.name}</option>`,
    );
  });

  $(formId).on('submit', async function (e) {
    e.preventDefault();
    const data = {};
    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      data[field.name] = field.value;
    });

    try {
      let result = await (
        await fetch(`/api/v1/shifts/${shift.id}`, {
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
  configAllShiftTbl();
  handleAddShift();
  handleDeleteShift();
  handleUpdateShift();
  doctorSelect2Filter('#addShiftForm #doctor-select2');
  doctorSelect2Filter('#updateShiftForm #doctor-select2');
});
