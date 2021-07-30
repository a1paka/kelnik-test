'use strict'
const showMoreButton = document.querySelector(".apartments__show-more");
const apartmentsList = document.querySelector(".apartments__list");
const pageSize = 20;
let currentOffset = 0;

showMoreButton.onclick = async () => {
  const response = await fetch("https://api.npoint.io/d042cc6d2866c71942b8");
  const content = await response.json();
  const data = content.slice(currentOffset, currentOffset + pageSize);

  currentOffset += pageSize;

  if (currentOffset >= content.length) {
    showMoreButton.style.display = "none";
  }

  const newResults = document.createDocumentFragment();
  
  for (const apartment of data) {
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
  apartmentsList.appendChild(newResults);
}