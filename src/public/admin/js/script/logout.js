const handleLogout = () => {
  $('#btn-logout').on('click', function () {
    swal({
      title: 'Bạn chắc chắn muốn đăng xuất ?',
      text: 'Kết thúc phiên đăng nhập hiện tại',
      icon: 'warning',
      buttons: ['Hủy', 'Đăng xuất'],
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const result = await (await fetch('/api/v1/auth/logout')).json();
          if (result.code === 200) {
            localStorage.setItem('isLogin', 'false');
            window.location.href = '/';
          } else {
            notiError(result.message);
          }
        }
      })
      .catch((error) => {
        notiError(error);
      });
  });
};

$(document).ready(function () {
  handleLogout();
});
