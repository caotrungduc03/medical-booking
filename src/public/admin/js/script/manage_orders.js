let allOrderTbl, notApproveOrderTbl, approveOrderTbl, unApproveOrderTbl;
let currentTbl;

const updateTbl = () => {
  $('#allOrderTbl').DataTable().ajax.reload();
  $('#notApproveOrderTbl').DataTable().ajax.reload();
  $('#approveOrderTbl').DataTable().ajax.reload();
  $('#unApproveOrderTbl').DataTable().ajax.reload();
};

const configAllOrderTbl = () => {
  allOrderTbl = $('#allOrderTbl').dataTable({
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
      url: '/api/v1/medical-forms?populate=medicalDepartment,shift&status=0&status=1&status=2',
      dataSrc: function (json) {
        $('#allOrderNav span').html(`(${json.data.length})`);

        json.data.forEach((element, index) => {
          element.index = index + 1;
          element.time = `
            ${element.shift.time} (${moment(element.medicalDay).format(
            'YYYY-MM-DD',
          )})
          `;
          element.method = `
          <div class="div_icon">
            <span title="Thông tin" id="btn-detail" class="model_img mr-1" data-toggle="modal" data-target="#infoOrderModal"><i class="mdi mdi-file-document" style="font-size: 18px"></i></span>
          </div>
          `;
        });

        return json.data;
      },
    },
    columns: [
      { data: 'index', width: '4%' },
      { data: 'fullName', width: '*' },
      { data: 'cardId', width: '10%' },
      { data: 'gender', width: '10%' },
      {
        data: 'birthday',
        width: '12%',
        render: (value) => moment(value).format('YYYY-MM-DD'),
      },
      {
        data: 'medicalDepartment',
        width: '20%',
        render: (item) => {
          return item.name;
        },
      },
      { data: 'time', width: '12%' },
      { data: 'method', className: 'text-center', width: '10%' },
    ],
    columnDefs: [
      {
        searchable: true,
        targets: 1,
      },
      {
        orderable: false,
        targets: [0, 7],
      },
      {
        className: 'export-col',
        targets: [0, 1, 2, 3, 4, 5, 6],
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
      sSearch: 'Tìm kiếm theo họ và tên:',
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

const configNotApproveOrderTbl = () => {
  notApproveOrderTbl = $('#notApproveOrderTbl').dataTable({
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
      url: '/api/v1/medical-forms?populate=medicalDepartment,shift&status=0',
      dataSrc: function (json) {
        $('#notApproveOrderNav span').html(`(${json.data.length})`);

        json.data.forEach((element, index) => {
          element.index = index + 1;
          element.time = `
            ${element.shift.time} (${moment(element.medicalDay).format(
            'YYYY-MM-DD',
          )})
          `;
          element.method = `
          <div class="div_icon">
            <span title="Thông tin" id="btn-detail" class="model_img mr-1" data-toggle="modal" data-target="#infoOrderModal"><i class="mdi mdi-file-document" style="font-size: 18px"></i></span>
            <span title="Đủ điều kiện" id="btn-approve" class="model_img mr-1" style="font-size: 18px"><i class="fa fa-fw fa-check" aria-hidden="true"></i></span>
            <span title="Không đủ điều kiện" id="btn-unApprove" class="model_img mr-1" style="font-size: 18px"><i class="fa fa-times" aria-hidden="true"></i></span>
          </div>
          `;
        });

        return json.data;
      },
    },
    columns: [
      { data: 'index', width: '4%' },
      { data: 'fullName', width: '*' },
      { data: 'cardId', width: '10%' },
      { data: 'gender', width: '10%' },
      {
        data: 'birthday',
        width: '12%',
        render: (value) => moment(value).format('YYYY-MM-DD'),
      },
      {
        data: 'medicalDepartment',
        width: '20%',
        render: (item) => {
          return item.name;
        },
      },
      { data: 'time', width: '12%' },
      { data: 'method', className: 'text-center', width: '10%' },
    ],
    columnDefs: [
      {
        searchable: true,
        targets: 1,
      },
      {
        orderable: false,
        targets: [0, 7],
      },
      {
        className: 'export-col',
        targets: [0, 1, 2, 3, 4, 6],
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
      sSearch: 'Tìm kiếm theo họ và tên:',
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

const configApproveOrderTbl = () => {
  approveOrderTbl = $('#approveOrderTbl').dataTable({
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
      url: '/api/v1/medical-forms?populate=medicalDepartment,shift&status=1',
      dataSrc: function (json) {
        $('#approveOrderNav span').html(`(${json.data.length})`);

        json.data.forEach((element, index) => {
          element.index = index + 1;
          element.time = `
            ${element.shift.time} (${moment(element.medicalDay).format(
            'YYYY-MM-DD',
          )})
          `;
          element.method = `
          <div class="div_icon">
            <span title="Thông tin" id="btn-detail" class="model_img mr-1" data-toggle="modal" data-target="#infoOrderModal"><i class="mdi mdi-file-document" style="font-size: 18px"></i></span>
          </div>
          `;
        });

        return json.data;
      },
    },
    columns: [
      { data: 'index', width: '4%' },
      { data: 'fullName', width: '*' },
      { data: 'cardId', width: '10%' },
      { data: 'gender', width: '10%' },
      {
        data: 'birthday',
        width: '12%',
        render: (value) => moment(value).format('YYYY-MM-DD'),
      },
      {
        data: 'medicalDepartment',
        width: '20%',
        render: (item) => {
          return item.name;
        },
      },
      { data: 'time', width: '12%' },
      { data: 'method', className: 'text-center', width: '10%' },
    ],
    columnDefs: [
      {
        searchable: true,
        targets: 1,
      },
      {
        orderable: false,
        targets: [0, 7],
      },
      {
        className: 'export-col',
        targets: [0, 1, 2, 3, 4, 5, 6],
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
      sSearch: 'Tìm kiếm theo họ và tên:',
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

const configUnApproveOrderTbl = () => {
  unApproveOrderTbl = $('#unApproveOrderTbl').dataTable({
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
      url: '/api/v1/medical-forms?populate=medicalDepartment,shift&status=2',
      dataSrc: function (json) {
        $('#unApproveOrderNav span').html(`(${json.data.length})`);

        json.data.forEach((element, index) => {
          element.index = index + 1;
          element.time = `
            ${element.shift.time} (${moment(element.medicalDay).format(
            'YYYY-MM-DD',
          )}) 
          `;
          element.method = `
          <div class="div_icon">
            <span title="Thông tin" id="btn-detail" class="model_img mr-1" data-toggle="modal" data-target="#infoOrderModal"><i class="mdi mdi-file-document" style="font-size: 18px"></i></span>
          </div>
          `;
        });

        return json.data;
      },
    },
    columns: [
      { data: 'index', width: '4%' },
      { data: 'fullName', width: '*' },
      { data: 'cardId', width: '10%' },
      { data: 'gender', width: '10%' },
      {
        data: 'birthday',
        width: '12%',
        render: (value) => moment(value).format('YYYY-MM-DD'),
      },
      {
        data: 'medicalDepartment',
        width: '20%',
        render: (item) => {
          return item.name;
        },
      },
      { data: 'time', width: '12%' },
      { data: 'method', className: 'text-center', width: '10%' },
    ],
    columnDefs: [
      {
        searchable: true,
        targets: 1,
      },
      {
        orderable: false,
        targets: [0, 7],
      },
      {
        className: 'export-col',
        targets: [0, 1, 2, 3, 4, 5, 6],
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
      sSearch: 'Tìm kiếm theo họ và tên:',
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

const getCurrentTabId = () => {
  const topicsOrders = $('.manage-orders');

  for (let i = 0; i < topicsOrders.length; i++) {
    let node = topicsOrders[i];
    while (!$(node).hasClass('tab-pane')) {
      node = node.parentNode;
    }
    if ($(node).hasClass('active')) return '#' + node.id;
  }

  return null;
};

const handleDetail = () => {
  const formId = '#infoOrderForm';
  let order;
  $('.manage-orders').on('click', '#btn-detail', function () {
    const tabId = getCurrentTabId();
    order = $(`${tabId} table`).DataTable().row($(this).parents('tr')).data();

    const formFields = $(formId).serializeArray();
    formFields.forEach((field) => {
      if (['birthday', 'medicalDay'].includes(field.name)) {
        $(`${formId} [name='${field.name}']`)
          .val(moment(order[field.name]).format('YYYY-MM-DD'))
          .change();
      } else if (field.name === 'medicalDepartment') {
        $(`${formId} [name='medicalDepartment']`).val(
          order.medicalDepartment.name,
        );
      } else if (field.name === 'medicalHour') {
        $(`${formId} [name='medicalHour']`).val(order.shift.time);
      } else {
        $(`${formId} [name='${field.name}']`).val(order[field.name]).change();
      }
    });
    $('#cccd').attr('src', order.cccd);
    $('#bhyt').attr('src', order.bhyt);
  });
};

const handleChangeStatus = () => {
  let order;
  $('.manage-orders').on('click', '#btn-approve', function () {
    const tabId = getCurrentTabId();
    order = $(`${tabId} table`).DataTable().row($(this).parents('tr')).data();

    swal({
      title: 'Bạn có chắc chắn ?',
      text: `Đơn khám đủ điều kiện`,
      icon: 'warning',
      buttons: ['Hủy', 'Cập nhật'],
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const result = await (
            await fetch(`/api/v1/medical-forms/status/${order.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: 1 }),
            })
          ).json();
          if (result.code === 200) {
            swal('Cập nhật thành công', {
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

  $('.manage-orders').on('click', '#btn-unApprove', function () {
    const tabId = getCurrentTabId();
    order = $(`${tabId} table`).DataTable().row($(this).parents('tr')).data();

    const span = document.createElement('span');
    span.innerHTML = `
      <div class="" style="display: flex; align-items: center; justify-content: space-between">
        <label style="margin: 0"><b>Lý do: </b></label> 
        <textarea id="deniedReason" style="width: 88%" type="text"  placeholder="Không phù hợp" class="form-control" required="" data-validation-required-message="Trường này là bắt buộc"></textarea>
      </div>
    `;

    swal({
      title: 'Đơn khám chưa đủ điều kiện',
      content: span,
      icon: 'warning',
      buttons: ['Hủy', 'Cập nhật'],
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const deniedReason = $('#deniedReason').val();

          const result = await (
            await fetch(`/api/v1/medical-forms/status/${order.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: 2, deniedReason }),
            })
          ).json();
          if (result.code === 200) {
            swal('Cập nhật thành công', {
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

const handleCheckCurrentTbl = () => {
  const elementId = $('.tab-pane.fade.active.show table').attr('id');
  if (elementId === 'allOrderTbl') currentTbl = allOrderTbl;
  else if (elementId === 'notApproveOrderTbl') currentTbl = notApproveOrderTbl;
  else if (elementId === 'approveOrderTbl') currentTbl = approveOrderTbl;
  else if (elementId === 'unApproveOrderTbl') currentTbl = unApproveOrderTbl;
};

const handleFilter = () => {
  $('#btn-filter').on('click', (e) => {
    handleCheckCurrentTbl();

    const departmentValue = $('.departmentFilter').val();
    const dateValue = $('.dateFilter').val();
    currentTbl
      .api()
      .column(0)
      .search(departmentValue)
      .column(1)
      .search(dateValue)
      .draw();
  });
};

const handleClearFilter = () => {
  $('#btn-clear').on('click', (e) => {
    handleCheckCurrentTbl();

    $('.departmentFilter').val('').change();
    $('.dateFilter').val('');
    currentTbl.api().column(0).search('').column(1).search('').draw();
  });
};

$(document).ready(function () {
  configAllOrderTbl();
  configNotApproveOrderTbl();
  configApproveOrderTbl();
  configUnApproveOrderTbl();
  handleDetail();
  handleChangeStatus();
  handleFilter();
  handleClearFilter();
});
