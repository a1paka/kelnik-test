'use strict'
const sliderPrice = document.querySelector('.filters__price-slider');
const sliderArea = document.querySelector('.filters__area-slider');
const resetButton = document.querySelector('.filters__reset');

document.addEventListener("DOMContentLoaded", () => {
  noUiSlider.create(sliderPrice, {
    start: [5500000, 18900000],
    step: 100000,
    range: {
      'min': 0,
      'max': 30000000
    }
  });

  const sliders = [
    {
      elem: sliderPrice,
      fromElem: sliderPrice.parentElement.querySelector(".filters__from-value"),
      toElem: sliderPrice.parentElement.querySelector(".filters__to-value"),
    }
  ];
  
  for (const slider of sliders) {
    slider.elem.noUiSlider.on("update", (values) => {
      slider.fromElem.textContent = parseInt(values[0], 10);
      slider.toElem.textContent = parseInt(values[1], 10);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  noUiSlider.create(sliderArea, {
    start: [33, 123],
    step: 1,
    range: {
      'min': 1,
      'max': 250
    }
  });

  const sliders = [
    {
      elem: sliderArea,
      fromElem: sliderArea.parentElement.querySelector(".filters__from-value"),
      toElem: sliderArea.parentElement.querySelector(".filters__to-value"),
    }
  ];

  for (const slider of sliders) {
    slider.elem.noUiSlider.on("update", (values) => {
      slider.fromElem.textContent = parseInt(values[0], 10);
      slider.toElem.textContent = parseInt(values[1], 10);
    });
  }
});