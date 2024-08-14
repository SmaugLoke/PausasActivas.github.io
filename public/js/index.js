// Código original para manejar la barra de navegación
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

// Código original para manejar la funcionalidad de las "Pausas Activas"
document.querySelectorAll('.day-card button').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir la recarga de la página

        const card = this.closest('.day-card');
        const usuario_id = document.querySelector('input[name="usuario_id"]').value;
        const dia = card.querySelector('input[name="dia"]').value;
        const video = card.querySelector('input[name="video"]').value;

        fetch('/guardarPausaActiva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `usuario_id=${usuario_id}&dia=${dia}&video=${video}`
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Mostrar mensaje de éxito
        })
        .catch(error => console.error('Error:', error));
    });
});

// Código nuevo para manejar el cierre de sesión con JWT
document.getElementById("logout-btn").addEventListener("click", () => {
    // Elimina la cookie JWT
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = "/login"; // Redirige al login
});
