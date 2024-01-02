const updateTbl = () => {
  $('#allOrderTbl').DataTable().ajax.reload();
  $('#notApproveOrderTbl').DataTable().ajax.reload();
  $('#approveOrderTbl').DataTable().ajax.reload();
  $('#unApproveOrderTbl').DataTable().ajax.reload();
};

$.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
  notiError('Lỗi Server');
};

const configAllOrderTbl = () => {
  $('#allOrderTbl').dataTable({
    autoWidth: false,
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: '/api/v1/medical-forms/me?populate=medicalDepartment,shift,doctor,patient&status=0&status=1&status=2',
      dataSrc: function (json) {
        $('#allOrderNav span').html(`(${json.data.length})`);

        json.data.forEach((element) => {
          element.name = `
            <div>
              <small style="color: #0052cc;">
                <b>${element.patient?.patientCode || ''}</b>
              </small>
              <p>${element.fullName}</p>
            </div>
          `;
          element.time = `
            <div>
              ${element.shift.time} 
              <br>
              (${moment(element.medicalDay).format('DD-MM-YYYY')})
            </div>
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
      { data: null, defaultContent: '', width: '4%' },
      { data: 'name', width: '*' },
      {
        data: 'medicalDepartment',
        width: '20%',
        render: (item) => {
          return item.name;
        },
      },
      {
        data: 'doctor',
        width: '16%',
        render: (item) => {
          return item.name;
        },
      },
      { data: 'time', width: '16%' },
      {
        data: 'createdAd',
        width: '12%',
        render: (value) => moment(value).format('DD-MM-YYYY'),
      },
      { data: 'method', className: 'text-center', width: '12%' },
      { data: 'createdAt' },
    ],
    columnDefs: [
      {
        searchable: true,
        targets: 1,
      },
      {
        orderable: false,
        targets: [0, 6],
      },
      {
        visible: false,
        targets: 7,
      },
    ],
    order: [[7, 'desc']],
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
  $('#notApproveOrderTbl').dataTable({
    autoWidth: false,
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: '/api/v1/medical-forms/me?populate=medicalDepartment,shift,doctor,patient&status=0',
      dataSrc: function (json) {
        $('#notApproveOrderNav span').html(`(${json.data.length})`);

        json.data.forEach((element) => {
          element.name = `
            <div>
              <small style="color: #0052cc;">
                element.patient?.patientCode || ''}</b>
              </small>
              <p>${element.fullName}</p>
            </div>
          `;
          element.time = `
            <div>
              ${element.shift.time} 
              <br>
              (${moment(element.medicalDay).format('DD-MM-YYYY')})
            </div>
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
      { data: null, defaultContent: '', width: '4%' },
      { data: 'name', width: '*' },
      {
        data: 'medicalDepartment',
        width: '20%',
        render: (item) => {
          return item.name;
        },
      },
      {
        data: 'doctor',
        width: '16%',
        render: (item) => {
          return item.name;
        },
      },
      { data: 'time', width: '16%' },
      {
        data: 'createdAd',
        width: '12%',
        render: (value) => moment(value).format('DD-MM-YYYY'),
      },
      { data: 'method', className: 'text-center', width: '12%' },
      { data: 'createdAt' },
    ],
    columnDefs: [
      {
        searchable: true,
        targets: 1,
      },
      {
        orderable: false,
        targets: [0, 6],
      },
      {
        visible: false,
        targets: 7,
      },
    ],
    order: [[7, 'desc']],
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
  $('#approveOrderTbl').dataTable({
    autoWidth: false,
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: '/api/v1/medical-forms/me?populate=medicalDepartment,shift,doctor,patient&status=1',
      dataSrc: function (json) {
        $('#approveOrderNav span').html(`(${json.data.length})`);

        json.data.forEach((element) => {
          element.name = `
            <div>
              <small style="color: #0052cc;">
              <b>${element.patient?.patientCode || ''}</b>
              </small>
              <p>${element.fullName}</p>
            </div>
          `;
          element.time = `
            <div>
              ${element.shift.time} 
              <br>
              (${moment(element.medicalDay).format('DD-MM-YYYY')})
            </div>
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
      { data: null, defaultContent: '', width: '4%' },
      { data: 'name', width: '*' },
      {
        data: 'medicalDepartment',
        width: '20%',
        render: (item) => {
          return item.name;
        },
      },
      {
        data: 'doctor',
        width: '16%',
        render: (item) => {
          return item.name;
        },
      },
      { data: 'time', width: '16%' },
      {
        data: 'createdAd',
        width: '12%',
        render: (value) => moment(value).format('DD-MM-YYYY'),
      },
      { data: 'method', className: 'text-center', width: '12%' },
      { data: 'createdAt' },
    ],
    columnDefs: [
      {
        searchable: true,
        targets: 1,
      },
      {
        orderable: false,
        targets: [0, 6],
      },
      {
        visible: false,
        targets: 7,
      },
    ],
    order: [[7, 'desc']],
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
  $('#unApproveOrderTbl').dataTable({
    autoWidth: false,
    processing: true,
    serverSide: true,
    ajax: {
      type: 'GET',
      url: '/api/v1/medical-forms/me?populate=medicalDepartment,shift,doctor,patient&status=2',
      dataSrc: function (json) {
        $('#unApproveOrderNav span').html(`(${json.data.length})`);

        json.data.forEach((element) => {
          element.name = `
            <div>
                <small style="color: #0052cc;"><b>${
                  element.patient?.patientCode || ''
                }</b></small>
              <p>${element.fullName}</p>
            </div>
          `;
          element.time = `
            <div>
              ${element.shift.time} 
              <br>
              (${moment(element.medicalDay).format('DD-MM-YYYY')})
            </div>
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
      { data: null, defaultContent: '', width: '4%' },
      { data: 'name', width: '*' },
      {
        data: 'medicalDepartment',
        width: '12%',
        render: (item) => {
          return item.name;
        },
      },
      {
        data: 'doctor',
        width: '12%',
        render: (item) => {
          return item.name;
        },
      },
      { data: 'time', width: '12%' },
      {
        data: 'createdAd',
        width: '12%',
        render: (value) => moment(value).format('DD-MM-YYYY'),
      },
      { data: 'deniedReason', width: '12%', render: (value) => value || '' },
      { data: 'method', className: 'text-center', width: '12%' },
      { data: 'createdAt' },
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
        visible: false,
        targets: 8,
      },
    ],
    order: [[8, 'desc']],
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
      if (['medicalDay'].includes(field.name)) {
        $(`${formId} [name='${field.name}']`)
          .val(moment(order[field.name]).format('YYYY-MM-DD'))
          .change();
      } else if (field.name === 'medicalDepartment') {
        $(`${formId} [name='medicalDepartment']`).val(
          order.medicalDepartment.name,
        );
      } else if (field.name === 'medicalHour') {
        $(`${formId} [name='medicalHour']`).val(order.shift.time);
      } else if (field.name === 'doctor') {
        $(`${formId} [name='doctor']`).val(order.doctor.name);
      } else {
        $(`${formId} [name='${field.name}']`).val(order[field.name]).change();
      }
    });
    $(`${formId} #cccd`).attr('src', order.cccd);
    $(`${formId} #bhyt`).attr('src', order.bhyt);
  });
};

$(document).ready(function () {
  configAllOrderTbl();
  configNotApproveOrderTbl();
  configApproveOrderTbl();
  configUnApproveOrderTbl();
  handleDetail();
});
