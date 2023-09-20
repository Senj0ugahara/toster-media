document.addEventListener('DOMContentLoaded', () => {
  setInterval(countdownTimer, 1000);

  const swiperThumbs = new Swiper('.card-swiper-thumbs', {
    loop: true,
    spaceBetween: 12,
    slidesPerView: 4,
  });

  const swiper = new Swiper('.card-swiper', {
    loop: true,
    thumbs: {
      swiper: swiperThumbs,
    }
  });

  select();
})

function countdownTimer() {
  const deadline = new Date('Sep 29, 2023 21:00:00').getTime();

  const diff = deadline - new Date().getTime();

  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.querySelector('.hero-time__hours').textContent = hours < 10 ? '0' + hours : hours;
  document.querySelector('.hero-time__minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
  document.querySelector('.hero-time__seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
}

let select = function() {
  let selectHeader = document.querySelectorAll('.custom-select__header');
  let selectItem = document.querySelectorAll('.custom-select__item');

  selectHeader.forEach(item => {
    item.addEventListener('click', selectToggle);
  });

  selectItem.forEach(item => {
    item.addEventListener('click', selectChoose)
  });

  function selectToggle() {
    this.parentElement.classList.toggle('is-active');
  }

  function selectChoose() {
    let text = this.innerText,
      select = this.closest('.custom-select'),
      currentText = select.querySelector('.custom-select__current');
    currentText.innerText = text;
    select.classList.remove('is-active');

  }
}