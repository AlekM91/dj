import '../styles/styles.scss';

if(module.hot) {
    module.hot.accept();
}

let hamburger = document.querySelector('.hamburger');
let mainNav = document.querySelector('.main-nav');
let body = document.querySelector('body');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('hamburger-active');
    mainNav.classList.toggle('main-nav-active')
    body.classList.toggle('js-no-scroll')

})
