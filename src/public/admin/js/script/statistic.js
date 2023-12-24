let allOrderChart, notOrderChart, approveOrderChart, unApproveOrderChart;

const configAllOrderChart = (counts = []) => {
  allOrderChart = new Chart($('#allOrderChart'), {
    type: 'bar',
    data: getData(counts),
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Số đơn khám',
          },
          min: 0,
          ticks: {
            // forces step size to be 1 units
            stepSize: 1,
          },
        },
      },
    },
  });
};
const configNotOrderChart = (counts = []) => {
  notOrderChart = new Chart($('#notOrderChart'), {
    type: 'bar',
    data: getData(counts),
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Số đơn khám',
          },
          min: 0,
          ticks: {
            // forces step size to be 1 units
            stepSize: 1,
          },
        },
      },
    },
  });
};
const configApproveOrderChart = (counts = []) => {
  approveOrderChart = new Chart($('#approveOrderChart'), {
    type: 'bar',
    data: getData(counts),
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Số đơn khám',
          },
          min: 0,
          ticks: {
            // forces step size to be 1 units
            stepSize: 1,
          },
        },
      },
    },
  });
};
const configUnApproveOrderChart = (counts = []) => {
  unApproveOrderChart = new Chart($('#unApproveOrderChart'), {
    type: 'bar',
    data: getData(counts),
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Số đơn khám',
          },
          min: 0,
          ticks: {
            // forces step size to be 1 units
            stepSize: 1,
          },
        },
      },
    },
  });
};

const fetchData = async (dateValue) => {
  let data = [];
  let url = '/api/v1/medical-forms/getAll';
  if (dateValue) url += '?date=' + dateValue;
  try {
    let result = await (await fetch(url)).json();
    if (result.code === 200) {
      data = result.data;
    } else {
      notiError(result.message);
    }
  } catch (error) {
    notiError(error);
  }

  reDrawChart(data);
};

const reDrawChart = (data) => {
  updateChart(allOrderChart, data, [0, 1, 2]);
  updateChart(notOrderChart, data, [0]);
  updateChart(approveOrderChart, data, [1]);
  updateChart(unApproveOrderChart, data, [2]);
};

const updateChart = (chart, data, status) => {
  let counts = [];
  const departmentCounts = data.reduce((counts, item) => {
    counts[item.medicalDepartment.name] =
      (counts[item.medicalDepartment.name] || 0) + status.includes(item.status);
    return counts;
  }, {});

  for (const [key, value] of Object.entries(departmentCounts)) {
    counts.push({ name: key, count: value });
  }

  chart.data = getData(counts);
  chart.update();
};

const getData = (counts) => {
  return {
    labels: counts.map((row) => row.name),
    datasets: [
      {
        label: 'Đơn khám bệnh',
        data: counts.map((row) => row.count),
      },
    ],
  };
};

const handleFilter = () => {
  $('#btn-filter').on('click', (e) => {
    const dateValue = $('.dateFilter').val();
    fetchData(dateValue);
  });
};

$(document).ready(function () {
  configAllOrderChart();
  configNotOrderChart();
  configApproveOrderChart();
  configUnApproveOrderChart();
  fetchData();
  handleFilter();
});
