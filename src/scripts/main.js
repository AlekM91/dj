import '../styles/styles.scss';
import musicApp from './MusicApp';
import Glide from '@glidejs/glide'

// import music
import infinity from '../assets/music/infinity.mp3'


if(module.hot) {
    module.hot.accept();
}

function menuFunctionality() {
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    const nav = document.querySelectorAll('.nav');
    const body = document.querySelector('body');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('hamburger-active');
        mainNav.classList.toggle('main-nav-active')
        body.classList.toggle('js-no-scroll')
    })

    function closeMenu() {
        hamburger.classList.remove('hamburger-active');
        mainNav.classList.remove('main-nav-active')
        body.classList.remove('js-no-scroll')
    }

    nav.forEach(n => {
        n.addEventListener('click', function(e) {
            e.preventDefault();
            if (e.target.classList.contains('nav-link')) {
                closeMenu();
            }

            const id = e.target.getAttribute('href');
            document.querySelector(id).scrollIntoView({
                behavior: 'smooth'
            })
        })
    })
}

menuFunctionality();

new Glide('.glide').mount()


musicApp()
// View the music app from the localhost due to CORS policy -- npm run dev


