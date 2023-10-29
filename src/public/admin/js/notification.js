const noti = (
  //   domElement,
  heading,
  text,
  position,
  loaderBg,
  icon,
  hideAfter,
  stack,
) => {
  //   $(domElement).on("click", function () {
  $.toast({
    heading,
    text,
    position,
    loaderBg,
    icon,
    hideAfter,
    stack,
  });
  //   });
};

const notiSuccess = (text) => {
  $.toast({
    heading: 'Thành công',
    text,
    position: 'top-right',
    loaderBg: '#ff6849',
    icon: 'success',
    hideAfter: 4000,
    stack: 6,
  });
};

const notiError = (text) => {
  $.toast({
    heading: 'Thất bại',
    text,
    position: 'top-right',
    loaderBg: '#ff6849',
    icon: 'error',
    hideAfter: 4000,
    stack: 6,
  });
};
