'use strict';

const KelnikTest = (() => {
  const defaultPrice = [5500000, 18900000];
  const defaultArea = [33, 123];

  const filters = {
    area_min: defaultArea[0],
    area_max: defaultArea[1],
    price_min: defaultPrice[0],
    price_max: defaultPrice[1]
  };

  const scrollToTop = document.querySelector(".page-main__scroll-top");

  const trackScroll = () => {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;
    if (scrolled > coords) {
      scrollToTop.classList.add('page-main__scroll-top-show');
    } else {
      scrollToTop.classList.remove('page-main__scroll-top-show');
    }
  }

  const backToTop = () => {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
      setTimeout(backToTop, 0);
    }
  }

  window.addEventListener('scroll', trackScroll);
  scrollToTop.addEventListener('click', backToTop);

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const sliderPriceElem = document.querySelector('.filters__price-slider');
  const sliderAreaElem = document.querySelector('.filters__area-slider')
  const resetButton = document.querySelector('.filters__reset');
  const sliders = [
    {
      filterName: "price",
      elem: sliderPriceElem,
      fromElem: sliderPriceElem.parentElement.querySelector(".filters__from-value"),
      toElem: sliderPriceElem.parentElement.querySelector(".filters__to-value"),
      range: [0, 30000000],
      start: defaultPrice,
      step: 100000
    },
    {
      filterName: "area",
      elem: sliderAreaElem,
      fromElem: sliderAreaElem.parentElement.querySelector(".filters__from-value"),
      toElem: sliderAreaElem.parentElement.querySelector(".filters__to-value"),
      range: [1, 200],
      start: defaultArea,
      step: 1
    }
  ];

  const disableSliders = () => {
    for (const slider of sliders) {
      slider.elem.setAttribute("disabled", true);
    }
  };

  const enableSliders = () => {
    for (const slider of sliders) {
      slider.elem.removeAttribute("disabled");
    }
  };

  const onUpdate = async (slider, min, max) => {
    const minName = `${slider.filterName}_min`;
    const maxName = `${slider.filterName}_max`;
    if (filters[minName] !== min || filters[maxName] !== max) {
      disableSliders();
      await fetchAndInsertResults({
        [minName]: min,
        [maxName]: max
      }, "replace");
      enableSliders();
    }
  };
  const debouncedOnUpdate = debounce(onUpdate);

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
      const min = parseInt(values[0], 10);
      const max = parseInt(values[1], 10)
      slider.fromElem.textContent = min;
      slider.toElem.textContent = max;
      debouncedOnUpdate(slider, min, max);
    });
  }

  resetButton.onclick = (e) => {
    e.preventDefault();
    sliderPriceElem.noUiSlider.reset();
    sliderAreaElem.noUiSlider.reset();
  };

  const showMoreButton = document.querySelector(".apartments__show-more");
  const apartmentsList = document.querySelector(".apartments__list");
  let currentOffset = 0;

  showMoreButton.onclick = async () => {
    await fetchAndInsertResults({}, "add");
  }

  function stringifyParams(params) {
    return Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&');
  }

  async function fetchAndInsertResults(params, mode, pageSize = 5) {
    filters.area_min = params.hasOwnProperty("area_min") ? params.area_min : filters.area_min;
    filters.area_max = params.hasOwnProperty("area_max") ? params.area_max : filters.area_max;
    filters.price_min = params.hasOwnProperty("price_min") ? params.price_min : filters.price_min;
    filters.price_max = params.hasOwnProperty("price_max") ? params.price_max : filters.price_max;
    const baseUrl = `https://api.npoint.io/d042cc6d2866c71942b8?${stringifyParams(filters)}`;
    let response, json;
    try {
      response = await fetch(baseUrl);
      json = await response.json();
    } catch (err) {
      alert(err.message);
      throw err;
    }
    let results;
    if (mode === "replace") {
      results = json.slice(0, pageSize);
      currentOffset = pageSize;
    } else if (mode === "add") {
      results = json.slice(currentOffset, currentOffset + pageSize);
      currentOffset += pageSize;
    }
    showMoreButton.style.display = currentOffset >= json.length ? "none" : "block";
    insertResults(results, mode);
  }

  function insertResults(apartments, mode) {
    const newResults = document.createDocumentFragment();
    for (const apartment of apartments) {
      const elem = document.createElement("div");
      elem.setAttribute("class", "apartments__flat");
      elem.innerHTML = `
        <div class="apartments__flat-wrapper">
          <div class="apartments__flat-description">
          <h2 class="apartments__flat-name">${apartment.name}</h2>
          <div class="apartments__flat-info">
              <p class="apartments__area">${apartment.area.replace("м²", " м²")}</p>
              <p class="apartments__floors">
              <span class="apartments__floor-number">${apartment.floor}</span>
              <span class="apartments__floors-text"> из 17 <span class="apartments__floor">этаж</span></span>
              </p>
              <p class="apartments__price">${apartment.price} <span class="apartments__price-p">₽</span></p>
          </div>
          </div>
          <div class="apartments__flat-pic">
          <img class="apartments__image" src="${apartment.img}" width="80" height="80" alt="Планировка квартиры">
          </div>
        </div>
      `;
      newResults.appendChild(elem);
    }
    if (mode === "add") {
      apartmentsList.appendChild(newResults);
    } else if (mode === "replace") {
      apartmentsList.innerHTML = "";
      apartmentsList.appendChild(newResults);
    }
  }

  // Загрузим первые результаты
  fetchAndInsertResults({}, "replace", 5);
})();