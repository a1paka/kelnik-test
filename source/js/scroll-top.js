'use strict'
const scrollToTop = document.querySelector(".page-main__scroll-top");

const trackScroll = () => {
  let scrolled = window.pageYOffset;
  let coords = document.documentElement.clientHeight;

  if (scrolled > coords) {
    scrollToTop.classList.add('page-main__scroll-top-show');
  }
  if (scrolled < coords) {
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