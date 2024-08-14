// Código original para manejar la barra de navegación
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

// Código nuevo para manejar el login con JWT
const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = e.target.children.user.value;
    const password = e.target.children.password.value;

    const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user,
            password
        })
    });

    if (!res.ok) return mensajeError.classList.toggle("escondido", false);

    const resJson = await res.json();
    
    if (resJson.token) {
        // Almacena el token JWT en una cookie
        document.cookie = `jwt=${resJson.token}; Path=/;`;
        window.location.href = resJson.redirect;
    } else {
        mensajeError.classList.toggle("escondido", false);
    }
});
