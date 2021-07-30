'use strict'

document.addEventListener("DOMContentLoaded", () => {
  const sliderPriceElem = document.querySelector('.filters__price-slider');
  const sliderAreaElem = document.querySelector('.filters__area-slider')
  const resetButton = document.querySelector('.filters__reset');
  const sliders = [
    {
      elem: sliderPriceElem,
      fromElem: sliderPriceElem.parentElement.querySelector(".filters__from-value"),
      toElem: sliderPriceElem.parentElement.querySelector(".filters__to-value"),
      range: [0, 30000000],
      start: [5500000, 18900000],
      step: 100000
    }, 
    {
      elem: sliderAreaElem,
      fromElem: sliderAreaElem.parentElement.querySelector(".filters__from-value"),
      toElem: sliderAreaElem.parentElement.querySelector(".filters__to-value"),
      range: [1, 200],
      start: [33, 123],
      step: 1
    }
  ];

  for (const slider of sliders) {
    noUiSlider.create(slider.elem, {
      start: [slider.start[0], slider.start[1]],
      connect: true,
      step: slider.step,
      range: {
        "min": slider.range[0],
        "max": slider.range[1]
      }
    });

    slider.elem.noUiSlider.on("update", (values) => {
      slider.fromElem.textContent = parseInt(values[0], 10);
      slider.toElem.textContent = parseInt(values[1], 10);
    });
  }

  resetButton.onclick = (e) => {
    e.preventDefault();
    sliderPriceElem.noUiSlider.reset();
    sliderAreaElem.noUiSlider.reset();
   };
  
  // При изменении состояния необходимо блокировать изменение фильтра и отправлять запрос на сервер. 

  // если ползунок меняет состояние -> изменения (ползунок) блокируются
  //                      slider.step             sliderPriceElem.setAttribute('disabled', true);
  //                                              sliderAreaElem.setAttribute('disabled', true);;
  // отправляется запрос на сервер
  // появляются нужные данные на странице (?)
});
