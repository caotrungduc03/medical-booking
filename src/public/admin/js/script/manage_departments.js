const updateTbl = () => {
  $('#allDepartmentTbl').DataTable().ajax.reload();
};

const configAllDepartmentTbl = () => {
  $('#allDepartmentTbl').dataTable({
    autoWidth: false,
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: '/api/v1/departments?populate=leader',
      dataSrc: function (json) {
        $('#allDepartmentNav').html(
          `<span>Tất cả (${json.data.length})</span>`,
        );

        json.data.forEach((element, index) => {
          element.index = index + 1;
          element.groupName = `
            <div>
              <div class="text-primary"><small><b>${element.departmentCode}</b></small></div>
              <span>${element.name}</span>
            </div>
          `;
          element.method = `
          <div class="div_icon">
            <a href="#" id="btn-update" title="Sửa" data-toggle="modal" data-target="#updateDepartmentModal" class="mr-1"><i class="ti-pencil-alt"></i></a>
            <span id="btn-delete" class="model_img" title="Xoá"><i class="ti-close"></i></span>
          </div>
          `;
        });

        return json.data;
      },
    },
    columns: [
      { data: 'index', width: '10%' },
      { data: 'groupName', width: '*' },
      { data: 'year', width: '15%' },
      {
        data: 'leader',
        width: '20%',
        render: (item) => {
          if (!item) return 'Chưa có';
          return `<div>
            <div class="text-primary"><small><b>${item.doctorCode}</b></small></div>
            <span>${item.name}</span>
          </div>`;
        },
      },
      { data: 'method', className: 'text-center', width: '15%' },
      { data: 'createdAt' },
    ],
    columnDefs: [
      {
        searchable: true,
        targets: 1,
      },
      {
        orderable: false,
        targets: [0, 3],
      },
      {
        visible: false,
        targets: 5,
      },
    ],
    order: [[5, 'desc']],
    fnRowCallback: function (nRow, aData, iDisplayIndex) {
      var oSettings = this.fnSettings();
      $('td:first', nRow).html(oSettings._iDisplayStart + iDisplayIndex + 1);
      return nRow;
    },
    language: {
      sProcessing: 'Đang xử lý...',
      sLengthMenu: 'Chọn số bản ghi hiển thị trên một trang _MENU_',
      sZeroRecords: 'Không có dữ liệu để hiển thị.',
      sInfo: 'Hiển thị từ _START_ đến _END_ trong tổng số _TOTAL_',
      sInfoEmpty: 'Hiển thị từ 0 đến 0 trong tổng số 0 mục',
      sInfoFiltered: '(được lọc từ _MAX_ bản ghi)',
      sInfoPostFix: '',
      sSearch: 'Tìm kiếm theo tên chuyên khoa:',
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

const resetForm = (formId) => {
  const formFields = $(formId).serializeArray();
  formFields.forEach((field) => {
    if (field.name !== '_csrf') {
      $(`${formId} [name='${field.name}']`).val('').change();
    }
  });
};

const handleAddDepartment = () => {
  const modalId = `#addDepartmentModal`;
  const formId = `#addDepartmentForm`;

  $(formId).on('submit', async function (e) {
    e.preventDefault();
    const data = {};
    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      data[field.name] = field.value;
    });

    try {
      let result = await (
        await fetch(`/api/v1/departments`, {
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
        resetForm(formId);
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

const handleDeleteDepartment = () => {
  let department;

  $(`#allDepartmentTbl tbody`).on('click', '#btn-delete', async function () {
    department = $('#allDepartmentTbl')
      .DataTable()
      .row($(this).parents('tr'))
      .data();

    swal({
      title: 'Bạn có chắc chắn ?',
      text: `Muốn XOÁ chuyên khoa ${department.name?.toUpperCase()}`,
      icon: 'warning',
      buttons: ['Hủy', 'Xóa'],
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const result = await (
            await fetch(`/api/v1/departments/${department.id}`, {
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

const handleUpdateDepartment = () => {
  const tblId = '#allDepartmentTbl';
  const modalId = '#updateDepartmentModal';
  const formId = '#updateDepartmentForm';
  let department;

  $(`${tblId} tbody`).on('click', '#btn-update', function () {
    department = $(tblId).DataTable().row($(this).parents('tr')).data();

    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      $(`${formId} [name='${field.name}']`)
        .val(department[field.name])
        .change();
    });
    $(`${formId} #departmentCode`).val(department.departmentCode);
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
        await fetch(`/api/v1/departments/${department.id}`, {
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
        resetForm(formId);
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
  configAllDepartmentTbl();
  handleAddDepartment();
  handleDeleteDepartment();
  handleUpdateDepartment();
  doctorSelect2Filter('#addDepartmentModal #doctor-select2');
  doctorSelect2Filter('#updateDepartmentModal #doctor-select2');
});
