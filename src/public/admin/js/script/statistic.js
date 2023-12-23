const showChart = async () => {
  let data = [];
  let count = {};
  try {
    let result = await (await fetch(`/api/v1/medical-forms/getAll`)).json();
    if (result.code === 200) {
      result.data.forEach((item) => {
        count[item.medicalDepartment.name] =
          (count[item.medicalDepartment.name] || 0) + 1;
      });
    } else {
      notiError(result.message);
    }
  } catch (error) {
    notiError(error);
  }

  for (const [key, value] of Object.entries(count)) {
    data.push({ name: key, count: value });
  }

  new Chart($('#chartMedicalForm'), {
    type: 'bar',
    data: {
      labels: data.map((row) => row.name),
      datasets: [
        {
          label: 'Đơn khám bệnh',
          data: data.map((row) => row.count),
        },
      ],
    },
  });
};

$(document).ready(function () {
  showChart();
});
