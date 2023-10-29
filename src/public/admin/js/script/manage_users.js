const updateTbl = () => {
  $('#unlockUserTbl').DataTable().ajax.reload();
  $('#lockUserTbl').DataTable().ajax.reload();
};

const configUnlockUserTbl = () => {
  $('#unlockUserTbl').dataTable({
    autoWidth: false,
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: '/api/v1/users?isLocked=false',
      dataSrc: function (json) {
        $('#unlockUserNav').html(
          `<span>Không khoá (${json.data.length})</span>`,
        );

        json.data.forEach((element, index) => {
          element.index = index + 1;
          element.fullName = element.lastName + ' ' + element.firstName;
          element.contact = `
            <div>
              <p>Email: ${element.email}</p>
              <p>SĐT: ${element.phone ?? 'Chưa cập nhật'}</p>
            </div>
          `;
          element.address = element.address ?? 'Chưa cập nhật';
          element.method = `
          <div class="div_icon">
            <a href="#" id="btn-update" title="Sửa" data-toggle="modal" data-target="#" class="mr-1"><i class="ti-pencil-alt"></i></a>
            <span id="btn-lock" class="model_img mr-1" title="Khoá"><i class="ti-lock"></i></span>
          </div>
          `;
        });

        return json.data;
      },
    },
    columns: [
      { data: 'index', width: '10%' },
      { data: 'fullName', width: '*' },
      { data: 'cardId', width: '12%' },
      { data: 'contact', width: '20%' },
      { data: 'address', width: '20%' },
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

const configLockUserTbl = () => {
  $('#lockUserTbl').dataTable({
    autoWidth: false,
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: '/api/v1/users?isLocked=true',
      dataSrc: function (json) {
        $('#lockUserNav').html(`<span>Khoá (${json.data.length})</span>`);

        json.data.forEach((element, index) => {
          element.index = index + 1;
          element.fullName = element.lastName + ' ' + element.firstName;
          element.contact = `
            <div>
              <p>Email: ${element.email}</p>
              <p>SĐT: ${element.phone ?? 'Chưa cập nhật'}</p>
            </div>
          `;
          element.address = element.address ?? 'Chưa cập nhật';
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
      { data: 'fullName', width: '*' },
      { data: 'cardId', width: '12%' },
      { data: 'contact', width: '20%' },
      { data: 'address', width: '20%' },
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

const handleEnterUserName = (formId) => {
  $(`${formId} #roleName`).on('input', function () {
    $(`${formId} #roleIndex`).val(convertToSlug(this.value.trim()));
  });
};

const handleAddUser = (id) => {
  const modalId = `#${id}Modal`;
  const formId = `#${id}Form`;

  $(formId).on('submit', async function (e) {
    e.preventDefault();
    const data = {};
    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      data[field.name] = field.value;
    });

    data.roles = [];
    $('#roles input:checked:not(:disabled)').each((index, element) => {
      data.roles.push($(element).val());
    });

    if (!data.email.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)) {
      return notiError('Email không hợp lệ');
    }
    if (!data.password?.match(/\d/) || !data.password?.match(/[a-zA-Z]/)) {
      return notiError(
        'Mật khẩu cần tối thiểu 8 kí tự, gồm cả chữ cái và chữ số',
      );
    }

    try {
      let result = await (
        await fetch(`/api/v1/users`, {
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
  let user;
  $(`${tblId} tbody`).on('click', btnId, async function () {
    user = $(tblId).DataTable().row($(this).parents('tr')).data();

    swal({
      title: 'Bạn có chắc chắn ?',
      text: `Muốn ${btnId === '#btn-lock' ? 'KHOÁ' : 'MỞ KHOÁ'} tài khoản ${
        user.fullName
      }`,
      icon: 'warning',
      buttons: ['Hủy', btnId === '#btn-lock' ? 'Khoá' : 'Mở khoá'],
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const result = await (
            await fetch(`/api/v1/users/${user.id}`, {
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

const handleDeleteUser = () => {
  let user;

  $(`#lockUserTbl tbody`).on('click', '#btn-delete', async function () {
    user = $('#lockUserTbl').DataTable().row($(this).parents('tr')).data();

    swal({
      title: 'Bạn có chắc chắn ?',
      text: `Muốn XOÁ tài khoản ${user.fullName}`,
      icon: 'warning',
      buttons: ['Hủy', 'Xóa'],
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const result = await (
            await fetch(`/api/v1/users/${user.id}`, {
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

const handleUpdateUser = () => {
  const tblId = '#unlockUserTbl';
  const modalId = '#updateUserModal';
  const formId = '#updateUserForm';
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
  configUnlockUserTbl();
  configLockUserTbl();
  handleEnterUserName('#addUserForm');
  handleEnterUserName('#updateUserForm');
  handleAddUser('addUser');
  handleChangeLock('#unlockUserTbl', '#btn-lock');
  handleChangeLock('#lockUserTbl', '#btn-unlock');
  handleDeleteUser();
  handleUpdateUser();
});
