const updateTbl = () => {
  $('#unlockRoleTbl').DataTable().ajax.reload();
  $('#lockRoleTbl').DataTable().ajax.reload();
};

const configUnlockRoleTbl = () => {
  $('#unlockRoleTbl').dataTable({
    autoWidth: false,
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: '/api/v1/roles?isLocked=false',
      dataSrc: function (json) {
        $('#unlockRoleNav').html(
          `<span>Không khoá (${json.data.length})</span>`,
        );

        json.data.forEach((element, index) => {
          element.index = index + 1;
          element.method = `
          <div class="div_icon">
            <a href="#" id="btn-update" title="Sửa" data-toggle="modal" data-target="#updateRoleModal" class="mr-1"><i class="ti-pencil-alt"></i></a>
            <span id="btn-lock" class="model_img mr-1" title="Khoá"><i class="ti-lock"></i></span>
          </div>
          `;
        });

        return json.data;
      },
    },
    columns: [
      { data: 'index', width: '10%' },
      { data: 'roleName', width: '*' },
      { data: 'roleIndex', width: '30%' },
      { data: 'method', className: 'text-center', width: '15%' },
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
    ],
    language: {
      sProcessing: 'Đang xử lý...',
      sLengthMenu: 'Chọn số bản ghi hiển thị trên một trang _MENU_',
      sZeroRecords: 'Không có dữ liệu để hiển thị.',
      sInfo: 'Hiển thị từ _START_ đến _END_ trong tổng số _TOTAL_',
      sInfoEmpty: 'Hiển thị từ 0 đến 0 trong tổng số 0 mục',
      sInfoFiltered: '(được lọc từ _MAX_ bản ghi)',
      sInfoPostFix: '',
      sSearch: 'Tìm kiếm theo tên:',
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

const configLockRoleTbl = () => {
  $('#lockRoleTbl').dataTable({
    autoWidth: false,
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: '/api/v1/roles?isLocked=true',
      dataSrc: function (json) {
        $('#lockRoleNav').html(`<span>Khoá (${json.data.length})</span>`);

        json.data.forEach((element, index) => {
          element.index = index + 1;
          element.method = `
          <div class="div_icon">
            <span id="btn-unlock" class="model_img mr-1" title="Mở khoá"><i class="ti-unlock"></i></span>
            <span id="btn-delete" class="model_img" title="Xoá"><i class="ti-close"></i></span>
          </div>
          `;
        });

        return json.data;
      },
    },
    columns: [
      { data: 'index', width: '10%' },
      { data: 'roleName', width: '*' },
      { data: 'roleIndex', width: '30%' },
      { data: 'method', className: 'text-center', width: '15%' },
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
    ],
    language: {
      sProcessing: 'Đang xử lý...',
      sLengthMenu: 'Chọn số bản ghi hiển thị trên một trang _MENU_',
      sZeroRecords: 'Không có dữ liệu để hiển thị.',
      sInfo: 'Hiển thị từ _START_ đến _END_ trong tổng số _TOTAL_',
      sInfoEmpty: 'Hiển thị từ 0 đến 0 trong tổng số 0 mục',
      sInfoFiltered: '(được lọc từ _MAX_ bản ghi)',
      sInfoPostFix: '',
      sSearch: 'Tìm kiếm theo tên:',
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

const handleEnterRoleName = (formId) => {
  $(`${formId} #roleName`).on('input', function () {
    $(`${formId} #roleIndex`).val(convertToSlug(this.value.trim()));
  });
};

const handleAddRole = (id) => {
  const modalId = `#${id}Modal`;
  const formId = `#${id}Form`;

  $(formId).on('submit', async function (e) {
    e.preventDefault();
    const data = {};
    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      data[field.name] = field.value;
    });

    try {
      let result = await (
        await fetch(`/api/v1/roles`, {
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

const handleChangeLock = (tblId, btnId) => {
  let role;
  $(`${tblId} tbody`).on('click', btnId, async function () {
    role = $(tblId).DataTable().row($(this).parents('tr')).data();

    swal({
      title: 'Bạn có chắc chắn ?',
      text: `Muốn ${btnId === '#btn-lock' ? 'KHOÁ' : 'MỞ KHOÁ'} quyền ${
        role.roleName
      }`,
      icon: 'warning',
      buttons: ['Hủy', 'Xóa'],
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const result = await (
            await fetch(`/api/v1/roles/${role.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ isLocked: btnId === '#btn-lock' }),
            })
          ).json();
          if (result.code === 200) {
            swal(`${btnId === '#btn-lock' ? 'KHOÁ' : 'MỞ KHOÁ'} thành công`, {
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

const handleDeleteRole = () => {
  let role;

  $(`#lockRoleTbl tbody`).on('click', '#btn-delete', async function () {
    role = $('#lockRoleTbl').DataTable().row($(this).parents('tr')).data();

    swal({
      title: 'Bạn có chắc chắn ?',
      text: `Muốn XOÁ quyền ${role.roleName}`,
      icon: 'warning',
      buttons: ['Hủy', 'Xóa'],
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const result = await (
            await fetch(`/api/v1/roles/${role.id}`, {
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

const handleUpdateRole = () => {
  const tblId = '#unlockRoleTbl';
  const modalId = '#updateRoleModal';
  const formId = '#updateRoleForm';
  let role;

  $(`${tblId} tbody`).on('click', '#btn-update', function () {
    role = $(tblId).DataTable().row($(this).parents('tr')).data();

    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      $(`${formId} [name='${field.name}']`).val(role[field.name]).change();
    });
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
        await fetch(`/api/v1/roles/${role.id}`, {
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
  configUnlockRoleTbl();
  configLockRoleTbl();
  handleEnterRoleName('#addRoleForm');
  handleEnterRoleName('#updateRoleForm');
  handleAddRole('addRole');
  handleChangeLock('#unlockRoleTbl', '#btn-lock');
  handleChangeLock('#lockRoleTbl', '#btn-unlock');
  handleDeleteRole();
  handleUpdateRole();
});
