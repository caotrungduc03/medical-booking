$(document).ready(function () {
  $('.doctor-items').slick({
    prevArrow: `<button type='button' class='slick-prev pull-left slick-arrow'><ion-icon name="chevron-back-outline"></ion-icon></button>`,
    nextArrow: `<button type='button' class='slick-next pull-right slick-arrow'><ion-icon name="chevron-forward-outline"></ion-icon></button>`,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
});
