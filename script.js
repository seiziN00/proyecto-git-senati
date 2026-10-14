const container = document.querySelector(".image-container");
const containerLikes = document.querySelector(".likes-container");
const STORAGE_KEY = "meGusta";

// Lee los likes guardados en localStorage
function getLikes() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveLikes(likes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likes));
}

const likes = getLikes();

const uniqueIds = new Set();
while (uniqueIds.size < 50) {
    uniqueIds.add(Math.floor(Math.random() * 1000));
}

for (const randomId of uniqueIds) {
    const frame = document.createElement("div");
    frame.classList.add("image-frame");

    const img = document.createElement("img");
    img.alt = "";

    // Si la imagen no carga, no mostrarla
    img.addEventListener("error", () => {
        frame.remove();
    });

    img.src = `https://picsum.photos/id/${randomId}/200/300`;

    frame.appendChild(img);

    // Botón de "me gusta"
    const likeBtn = document.createElement("button");
    likeBtn.classList.add("like-btn");
    likeBtn.innerHTML = `<img src="icons/like.svg" alt="Me gusta" />`;
    // Si la imagen ya estaba likeada, se muestra activa
    if (likes.includes(img.src)) {
        likeBtn.classList.add("liked");
    }

    likeBtn.addEventListener("click", () => {
        let currentLikes = getLikes();
        if (currentLikes.includes(img.src)) {
            // Quitar de favoritos
            currentLikes = currentLikes.filter((src) => src !== img.src);
        } else {
            // Agregar a favoritos
            currentLikes.push(img.src);
        }

        saveLikes(currentLikes);

        likeBtn.classList.toggle("liked", currentLikes.includes(img.src));

        renderLikedImages();
    });

    frame.appendChild(likeBtn);
    container.appendChild(frame);
}

const misMeGusta = getLikes();

if (misMeGusta.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "Todavía no has dado me gusta a ninguna imagen.";
    containerLikes.appendChild(msg);
}

misMeGusta.forEach((src) => {
    const frame = document.createElement("div");
    frame.classList.add("image-frame");

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Imagen que te gusta";
    frame.appendChild(img);

    // Botón con confirmación inline de 2 segundos
    const btn = document.createElement("button");
    btn.classList.add("like-btn");
    btn.innerHTML = `<img src="icons/like.svg" alt="Me gusta" />`;

    let timer = null;

    btn.addEventListener("click", () => {
        if (timer) {
            // Segundo click: confirmar y quitar el like
            clearTimeout(timer);
            timer = null;
            saveLikes(getLikes().filter((s) => s !== src));
            frame.remove();
        } else {
            // Primer click: mostrar confirmación
            btn.textContent = "¿Quitar?";
            btn.classList.add("confirming");
            timer = setTimeout(() => {
                btn.innerHTML = `<img src="icons/like.svg" alt="Me gusta" />`;
                btn.classList.remove("confirming");
                timer = null;
            }, 2000);
        }
    });

    frame.appendChild(btn);
    containerLikes.appendChild(frame);
});

/* ========= Switcher de nav-contenido ========= */
const inicioBtn = document.getElementById("inicio-button");
const meGustaBtn = document.getElementById("me-gusta-button");
const navTitle = document.getElementById("nav-title");

inicioBtn.addEventListener("click", () => {
    container.style.display = "flex";
    containerLikes.style.display = "none";
    navTitle.textContent = "Inicio";
});

meGustaBtn.addEventListener("click", () => {
    container.style.display = "none";
    containerLikes.style.display = "flex";
    navTitle.textContent = "Mis Me Gusta";
    renderLikedImages();
});

function renderLikedImages() {
    const containerLikes = document.querySelector(".likes-container");
    containerLikes.innerHTML = "";

    const likes = getLikes();

    if (likes.length === 0) {
        containerLikes.textContent = "Todavía no tienes imágenes favoritas.";
        return;
    }

    likes.forEach((src) => {
        const frame = document.createElement("div");
        frame.classList.add("image-frame");

        const img = document.createElement("img");
        img.src = src;
        img.alt = "Imagen favorita";
        frame.appendChild(img);

        // Botón con confirmación inline de 2 segundos
        const btn = document.createElement("button");
        btn.classList.add("like-btn", "liked");
        btn.innerHTML = `<img src="icons/like.svg" alt="Me gusta" />`;

        let timer = null;

        btn.addEventListener("click", () => {
            if (timer) {
                // Segundo clic: confirmar y quitar el like
                clearTimeout(timer);
                timer = null;

                // Filtramos el localStorage y actualizamos la vista
                const updatedLikes = getLikes().filter((s) => s !== src);
                saveLikes(updatedLikes);

                renderLikedImages();
            } else {
                // Primer clic: mostrar confirmación
                btn.textContent = "¿Quitar?";
                btn.classList.add("confirming");

                timer = setTimeout(() => {
                    btn.innerHTML = `<img src="icons/like.svg" alt="Me gusta" />`;
                    btn.classList.remove("confirming");
                    timer = null;
                }, 2000);
            }
        });

        frame.appendChild(btn);
        containerLikes.appendChild(frame);
    });
}
