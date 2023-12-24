const updateTbl = () => {
  $('#unlockUserTbl').DataTable().ajax.reload();
  $('#lockUserTbl').DataTable().ajax.reload();
};

const configUnlockUserTbl = () => {
  $('#unlockUserTbl').dataTable({
    dom: 'Blfrtip',
    buttons: [
      // 'copy',
      // 'csv',
      {
        text: '<i class="fa fa-file-excel-o"></i> Xuất excel',
        exportOptions: {
          modifier: {
            page: 'current',
          },
          columns: '.export-col',
        },
        extend: 'excelHtml5',
        filename:
          'Danh_sach_nguoi_dung_khong_khoa_' +
          new Date().getDate() +
          '_' +
          (new Date().getMonth() + 1) +
          '_' +
          new Date().getFullYear(),
        title: '',
        action: newexportaction,
        customize: function (xlsx) {
          var sheet = xlsx.xl.worksheets['sheet1.xml'];
          var lastCol = sheet.getElementsByTagName('col').length - 1;
          var colRange = createCellPos(lastCol) + '1';
          //Has to be done this way to avoid creation of unwanted namespace atributes.
          var afSerializer = new XMLSerializer();
          var xmlString = afSerializer.serializeToString(sheet);
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(xmlString, 'text/xml');
          var xlsxFilter = xmlDoc.createElementNS(
            'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
            'autoFilter',
          );
          var filterAttr = xmlDoc.createAttribute('ref');
          filterAttr.value = 'A1:' + colRange;
          xlsxFilter.setAttributeNode(filterAttr);
          sheet.getElementsByTagName('worksheet')[0].appendChild(xlsxFilter);
        },
        // message:
        //   'Any message for header inside the file. I am not able to put message in next row in excel file but you can use \n' +
        //   'test' +
        //   '1',
        render: function (data, type, full, meta) {
          return data;
        },
        // },
      },
      // 'pdf',
      // 'print',
    ],
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
              <p>SĐT: ${element.phone || 'Chưa cập nhật'}</p>
            </div>
          `;
          element.method = `
          <div class="div_icon">
            <a href="#" id="btn-update" title="Sửa" data-toggle="modal" data-target="#updateUserModal" class="mr-1"><i class="ti-pencil-alt"></i></a>
            <span id="btn-lock" class="model_img mr-1" title="Khoá"><i class="ti-lock"></i></span>
          </div>
          `;
        });

        return json.data;
      },
    },
    columns: [
      { data: 'index', width: '4%' },
      { data: 'fullName', width: '*' },
      { data: 'cardId', width: '12%' },
      { data: 'contact', width: '20%' },
      {
        data: 'address',
        width: '20%',
        render: (value) => value || 'Chưa cập nhật',
      },
      {
        data: 'lastLogin',
        width: '16%',
        render: (value) => {
          if (!value) return 'Chưa bao giờ';
          return moment(value).format('HH:mm:ss, DD-MM-YYYY');
        },
      },
      { data: 'method', className: 'text-center', width: '8%' },
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
        className: 'export-col',
        targets: [0, 1, 2, 3, 4, 5],
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
    dom: 'Blfrtip',
    buttons: [
      // 'copy',
      // 'csv',
      {
        text: '<i class="fa fa-file-excel-o"></i> Xuất excel',
        exportOptions: {
          modifier: {
            page: 'current',
          },
          columns: '.export-col',
        },
        extend: 'excelHtml5',
        filename:
          'Danh_sach_nguoi_dung_bi_khoa_' +
          new Date().getDate() +
          '_' +
          (new Date().getMonth() + 1) +
          '_' +
          new Date().getFullYear(),
        title: '',
        action: newexportaction,
        customize: function (xlsx) {
          var sheet = xlsx.xl.worksheets['sheet1.xml'];
          var lastCol = sheet.getElementsByTagName('col').length - 1;
          var colRange = createCellPos(lastCol) + '1';
          //Has to be done this way to avoid creation of unwanted namespace atributes.
          var afSerializer = new XMLSerializer();
          var xmlString = afSerializer.serializeToString(sheet);
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(xmlString, 'text/xml');
          var xlsxFilter = xmlDoc.createElementNS(
            'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
            'autoFilter',
          );
          var filterAttr = xmlDoc.createAttribute('ref');
          filterAttr.value = 'A1:' + colRange;
          xlsxFilter.setAttributeNode(filterAttr);
          sheet.getElementsByTagName('worksheet')[0].appendChild(xlsxFilter);
        },
        // message:
        //   'Any message for header inside the file. I am not able to put message in next row in excel file but you can use \n' +
        //   'test' +
        //   '1',
        render: function (data, type, full, meta) {
          return data;
        },
        // },
      },
      // 'pdf',
      // 'print',
    ],
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
              <p>SĐT: ${element.phone || 'Chưa cập nhật'}</p>
            </div>
          `;
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
      { data: 'index', width: '4%' },
      { data: 'fullName', width: '*' },
      { data: 'cardId', width: '12%' },
      { data: 'contact', width: '20%' },
      {
        data: 'address',
        width: '20%',
        render: (value) => value || 'Chưa cập nhật',
      },
      {
        data: 'lastLogin',
        width: '16%',
        render: (value) => {
          if (!value) return 'Chưa bao giờ';
          return moment(value).format('HH:mm:ss, DD-MM-YYYY');
        },
      },
      { data: 'method', className: 'text-center', width: '8%' },
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
        className: 'export-col',
        targets: [0, 1, 2, 3, 4, 5],
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
    $(`${formId} #roles input:checked`).each((index, element) => {
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
    if (data.password !== data.confirmPassword) {
      return notiError('Xác nhận mật khẩu không trùng khớp');
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
  let user;

  $(`${tblId} tbody`).on('click', '#btn-update', function () {
    user = $(tblId).DataTable().row($(this).parents('tr')).data();

    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      $(`${formId} [name='${field.name}']`)
        .val(
          field.name === 'birthday'
            ? moment(user['birthday']).format('YYYY-MM-DD')
            : user[field.name],
        )
        .change();
    });

    $(`${formId} #roles input:not(:disabled)`).each((index, element) => {
      const e = $(element);
      if (user.roles.includes(e.val())) {
        e.prop('checked', true);
      }
    });
  });

  $(formId).on('submit', async function (e) {
    e.preventDefault();
    const data = {};
    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      data[field.name] = field.value;
    });

    data.roles = [];
    $(`${formId} #roles input:checked`).each(function () {
      data.roles.push($(this).val());
    });

    if (
      data.password &&
      (!data.password?.match(/\d/) || !data.password?.match(/[a-zA-Z]/))
    ) {
      return notiError(
        'Mật khẩu cần tối thiểu 8 kí tự, gồm cả chữ cái và chữ số',
      );
    }
    if (data?.password !== data?.confirmPassword) {
      return notiError('Xác nhận mật khẩu không trùng khớp');
    }

    try {
      let result = await (
        await fetch(`/api/v1/users/${user.id}`, {
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
