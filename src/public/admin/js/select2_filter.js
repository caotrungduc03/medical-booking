const userFilter = (_id, queryOption) => {
  let userUrl = '/api/v1/users/filter?populate=roles,major,department,degree,academy_rank';
  if (queryOption) {
    for (let key in queryOption) {
      userUrl += `&${key}=${queryOption[key]}`;
    }
  }
  $(`#${_id}`).select2({
    allowClear: true,
    ajax: {
      url: userUrl,
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
    placeholder: 'Tìm kiếm theo tên tài khoản hoặc tên',
    minimumInputLength: 1,
    templateResult: formatUser,
    templateSelection: formatUserSelection,
    escapeMarkup: function (m) {
      return m;
    },
  });

  function formatUser(user) {
    if (user.loading) {
      return user.text;
    }

    const $container = $(
      "<div class='select2-result-user'>" +
        "<div class='filter-user-avatar avatar avatar-lg'>" +
        `<img src='${user.avatar}' alt="Not Found" onerror=this.src="/static/images/avatar/anonymous.png">` +
        '</div>' +
        "<div class='filter-user-info'>" +
        "<div class='filter-user-fullName'></div>" +
        "<div class='filter-user-username'></div>" +
        '</div>' +
        '</div>',
    );

    $container.find('.filter-user-fullName').text(user.fullName);
    $container.find('.filter-user-username').text(user.username);
    // $container.find('.select2-result-user__description').text(user.description);
    // $container.find('.select2-result-user__forks').append(user.forks_count + ' Forks');
    // $container.find('.select2-result-user__stargazers').append(user.stargazers_count + ' Stars');
    // $container.find('.select2-result-user__watchers').append(user.watchers_count + ' Watchers');

    return $container;
  }

  function formatUserSelection(user) {
    return user.fullName || user.text;
  }
};

const organizationFilter = (_id) => {
  let organizationUrl = '/api/v1/topics/filter/organization';
  $(`#${_id}`).select2({
    allowClear: true,
    ajax: {
      url: organizationUrl,
      dataType: 'json',
      delay: 350,
      quietMillis: 200,
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
    placeholder: 'Tìm kiếm theo email hoặc tên tổ chức',
    minimumInputLength: 1,
    templateResult: formatOrganization,
    templateSelection: formatOrganizationSelection,
    escapeMarkup: function (m) {
      return m;
    },
  });

  function formatOrganization(org) {
    if (org.loading) {
      return org.text;
    }

    const $container = $(
      "<div class='select2-result-org'>" +
        "<div class='filter-org-name'></div>" +
        "<div class='filter-org-email'></div>" +
        '</div>',
    );

    $container.find('.filter-org-name').text(org.name);
    $container.find('.filter-org-email').text(org.email);
    return $container;
  }

  function formatOrganizationSelection(org) {
    return `${org.name}` || org.text;
    // return `${org.name} - ${org.email}` || org.text;
  }
};

const termFilter = (_id, queryOption) => {
  let userUrl = '/api/v1/terms';
  if (queryOption) {
    for (let key in queryOption) {
      userUrl += `&${key}=${queryOption[key]}`;
    }
  }
  $(`#${_id}`).select2({
    ajax: {
      url: userUrl,
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
    placeholder: 'Tìm kiếm theo tên tài khoản hoặc tên',
    minimumInputLength: 1,
    templateResult: formatUser,
    templateSelection: formatUserSelection,
    escapeMarkup: function (m) {
      return m;
    },
  });

  function formatUser(user) {
    if (user.loading) {
      return user.text;
    }

    const $container = $(
      "<div class='select2-result-user'>" +
        "<div class='filter-user-avatar avatar avatar-lg'>" +
        `<img src='${user.avatar}' alt="Not Found" onerror=this.src="/static/images/avatar/anonymous.png">` +
        '</div>' +
        "<div class='filter-user-info'>" +
        "<div class='filter-user-fullName'></div>" +
        "<div class='filter-user-username'></div>" +
        '</div>' +
        '</div>',
    );

    $container.find('.filter-user-fullName').text(user.fullName);
    $container.find('.filter-user-username').text(user.username);
    // $container.find('.select2-result-user__description').text(user.description);
    // $container.find('.select2-result-user__forks').append(user.forks_count + ' Forks');
    // $container.find('.select2-result-user__stargazers').append(user.stargazers_count + ' Stars');
    // $container.find('.select2-result-user__watchers').append(user.watchers_count + ' Watchers');

    return $container;
  }

  function formatUserSelection(user) {
    return user.fullName || user.text;
  }
};
