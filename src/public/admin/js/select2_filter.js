const doctorSelect2Filter = (id, options) => {
  let url = '/api/v1/doctors?populate=department';
  if (options) {
    for (let key in options) {
      url += `&${key}=${options[key]}`;
    }
  }
  $(id).select2({
    allowClear: true,
    ajax: {
      url: url,
      dataType: 'json',
      delay: 250,
      quietMillis: 100,
      data: function (params) {
        return {
          q: params.term, // search term
          page: params.page,
        };
      },
      processResults: function (data, params) {
        // parse the results into the format expected by Select2
        // since we are using custom formatting functions we do not need to
        // alter the remote JSON data, except to indicate that infinite
        // scrolling can be used
        params.page = params.page || 1;

        return {
          results: data.data,
          pagination: {
            more: params.page * data.limit < data.totalResults,
          },
        };
      },
      cache: true,
    },
    placeholder: 'Tìm kiếm theo tên bác sĩ',
    minimumInputLength: 1,
    templateResult: formatUser,
    templateSelection: formatUserSelection,
    escapeMarkup: function (m) {
      return m;
    },
  });

  function formatUser(doctor) {
    if (doctor.loading) {
      return doctor.text;
    }

    const $container = $(
      "<div class='select2-result-user'>" +
        "<div class='filter-user-avatar avatar avatar-lg'>" +
        `<img src='${doctor.avatar}' alt="Not Found">` +
        '</div>' +
        "<div class='filter-user-info'>" +
        `<div class='filter-user-fullName'>${doctor.name}</div>` +
        `<div class='filter-user-department'>${
          doctor.department?.name || 'None'
        }</div>` +
        '</div>' +
        '</div>',
    );

    return $container;
  }

  function formatUserSelection(doctor) {
    return doctor.name || doctor.text;
  }
};
