const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

const modal = document.getElementById('video-modal');
const modalClose = document.querySelector('.close');
const videoPlayer = document.getElementById('video-player');
const buttons = document.querySelectorAll('.day-card button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const videoSource = button.getAttribute('data-video');
        videoPlayer.src = videoSource;
        modal.style.display = 'block';
    });
});

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    videoPlayer.pause();  // Detener el video cuando se cierra el modal
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
        videoPlayer.pause();  // Detener el video cuando se cierra el modal
    }
});
