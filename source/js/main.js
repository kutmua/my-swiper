document.addEventListener('DOMContentLoaded', function(){
  const swiperContainer = document.querySelector('.my-swiper'); /* главный контейнер свайпера */
  const swiperSliderContainer = document.querySelector('.my-swiper__line'); /* контейнер для перелистывания слайдов */
  const swiperSlides = document.querySelectorAll('.my-swiper__slide');  /* массив слайдов */
  const swiperSlidesCard = document.querySelectorAll('.card'); /* массив карточек слайдов */
  const btnPrev = document.querySelector('.btn-prev'); /* кнопка "предыдущий слайд" */ 
  const btnNext = document.querySelector('.btn-next'); /* кнопка "следующий слайд" */
  const navbarContainer = document.querySelector('.navbar__indicator'); /* контейнер бегунка */
  const navbarMarker = document.querySelector('.navbar__indicator-marker'); /* бегунок */
  let cardCopy; /* переменная для копии карточки  */
  let nextCardParent; /* переменная для родителя "некс" карточки */
  let nextCard; /* переменная для "некс" карточки */

  let adaptiveResolutions = [
    { 
      width:320,
      slidesVisible: 1,
      marginRight: 20
    },{
      width:640,
      slidesVisible: 2,
      marginRight: 30
    },{
      width: 960,
      slidesVisible: 4,
      marginRight: 40
    }]; 

  let slidesVisible = 4; /* колличество видимых слайдеров (можно установить) */ 
  let slidesVisibleDefault = 4;
  let marginRight = 40; /* margin-right между видимыми слайдами (можно установить) */ 
  let marginRightDefault = 10;
  let sliderWidth; /* переменная для расчета ширины слайда */ 
  let navbarMarkerWidth;
  let stepNavbarMarker = 0;
  let count = 0; /* для подсчета количества перелистаных слайдов */
  let step = 0; /* для подсчета шага перелистывания */
  
  /* функция расчета ширины слайдов и контейнера для перелистывания */
  function parametersСalculation () {
    sliderWidth = ((swiperContainer.offsetWidth - (marginRight * (slidesVisible-1))) / slidesVisible);
    swiperSliderContainer.style.width = ((sliderWidth * swiperSlides.length) + (marginRight * swiperSlides.length))+'px';
    navbarMarkerWidth = (navbarContainer.offsetWidth / swiperSlides.length);
    navbarMarker.style.width = navbarMarkerWidth + 'px';

    swiperSlides.forEach(slide => {
      slide.style.width = `${sliderWidth}px`;
      slide.style.height = 'auto';
      slide.style.marginRight = `${marginRight}px`
    })

    if (swiperSlides) {
      swiperSlides[0].classList.add('active')
    }
  }

  /* функция перелистывания следующего слайда */
  function prevSlide () {
    if (count <= 0) {
      return
    }
    else {
      swiperSlides[count].classList.remove('active');
      count--;
      swiperSlides[count].classList.add('active');
      step-=(sliderWidth + marginRight);
      stepNavbarMarker-=navbarMarkerWidth;

      swiperSliderContainer.style.transform = 'translateX('+ -step + 'px)';
      navbarMarker.style.transform = 'translateX('+ stepNavbarMarker + 'px)';
    }
  }

  /* функция перелистывания предыдущего слайда */
  function nextSlide () {
    ++count;
    step+=(sliderWidth + marginRight);
    stepNavbarMarker+=navbarMarkerWidth;

    if (count >= swiperSlides.length) {
      swiperSlides[count-1].classList.remove('active');
      swiperSlides[0].classList.add('active');
      count = 0;
      step = 0;
      stepNavbarMarker = 0;
    }

    swiperSliderContainer.style.transform = 'translateX(-'+ count*(sliderWidth + marginRight) + 'px)';
    navbarMarker.style.transform = 'translateX('+ count * navbarMarkerWidth + 'px)';
    
    if (count !== 0) {
      swiperSlides[count-1].classList.remove('active');
      swiperSlides[count].classList.add('active');
    }
  }

  /* функция для адаптивности слайдера */
  function adaptiveSlides() {
    for (let i = 0; i < adaptiveResolutions.length; i++) {
      if (swiperContainer.offsetWidth >= adaptiveResolutions[i].width) {
        slidesVisible = adaptiveResolutions[i].slidesVisible;
        marginRight = adaptiveResolutions[i].marginRight;
        parametersСalculation();
      }
    }
  }

  /* функция начала перетаскивания карточки */
  const dragStart = function () {
    cardCopy = this;
    this.classList.add('selected');
  }

  /* функция завершения перетаскивания карточки */
  const dragEnd = function () {
    this.classList.remove('selected');
    if (nextCard) {
      nextCard.classList.remove('next-card');
    }
    cardCopy = null;
    nextCard = null;
    nextCardParent = null;
  }

  /* функция для обнуления стандартного поведения */
  const dragOver = function (event) {
    event.preventDefault();
  }

  /* функция для нахождения следующей карточки */
  const dragEnter = function () {
    if (!this.classList.contains('selected')){
      nextCard = this;
      nextCardParent = nextCard.parentNode;
      nextCard.classList.add('next-card');
      return nextCard
    }
    else return
  }

  /* функция для удаления данных о покинутой карточке */
  const dragLeave = function () {
    if (!this.classList.contains('selected')) {
      if (this === nextCard) {
        this.classList.remove('next-card');
      }
    }
    else return
  }

  /* функция для переноса карточек */
  const dragDrop = function () {
    if (!this.classList.contains('selected')) {
      cardCopy.parentNode.append(nextCard)
      nextCardParent.append(cardCopy)
    }
    else return
  }

  /* цикл для обработчиков событий */
  for (const slide of swiperSlidesCard) {
    slide.draggable = true;

    slide.addEventListener('dragstart', dragStart);
    slide.addEventListener('dragleave', dragLeave);
    slide.addEventListener('dragover', dragOver);
    slide.addEventListener('dragenter', dragEnter);
    slide.addEventListener('drop', dragDrop);
    slide.addEventListener('dragend', dragEnd);
  }

  /* обработчик событий на кнопку "Предыдущий" */
  btnPrev.addEventListener('click', prevSlide);

  /* обработчик событий на кнопку "Предыдущий" */
  btnNext.addEventListener('click', nextSlide);

  setInterval(() => {
    nextSlide();
  }, 4000);

  window.addEventListener('resize', adaptiveSlides);

  /* для перерасчета размеров при изменении разрешения */
  window.addEventListener('resize', parametersСalculation);

  parametersСalculation();
  


});

