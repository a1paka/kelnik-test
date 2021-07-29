'use strict'

let list = document.querySelector(".apartments__list");

async function getResponse() {
  let response = await fetch("https://api.npoint.io/d042cc6d2866c71942b8");
  let content = await response.json();
  content = content.splice(0, 0); //изначально 5 квартир

  let key;
  for (key in content) {
    list.innerHTML += `
    <div class="apartments__flat">
      <div class="apartments__flat-wrapper">
        <div class="apartments__flat-description">
          <h2 class="apartments__flat-name">${content[key].name}</h2>
          <div class="apartments__flat-info">
            <p class="apartments__area">${content[key].area} <span class="apartments__area-m">м²</span></p>
            <p class="apartments__floor-number">${content[key].floor}</p>
            <p class="apartments__floors">из 17 <span class="apartments__floors-text">этаж</span></p>
            <p class="apartments__price">${content[key].price}<span class="apartments__price-p">₽</span></p>
          </div>
        </div>
        <div class="apartments__flat-pic">
          <img class="apartments__image" src="${content[key].img}" width="80" height="80" alt="Планировка квартиры">
        </div>
      </div>
    </div>
    `
  }
}
getResponse();

//при нажатии на кнопку подгружаются еще 20ть

//если загрузились все -> кнопка скрывается