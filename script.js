const container = document.querySelector(".image-container");
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

for (let i = 0; i < 50; i++) {
    const frame = document.createElement("div");
    frame.classList.add("image-frame");

    const img = document.createElement("img");
    img.alt = "";

    // Si la imagen no carga, no mostrarla
    img.addEventListener("error", () => {
        frame.remove();
    });

    const randomId = Math.floor(Math.random() * 1000);

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
        const currentLikes = getLikes();
        if (currentLikes.includes(img.src)) {
            // Quitar el like
            saveLikes(currentLikes.filter((src) => src !== img.src));
            likeBtn.classList.remove("liked");
        } else {
            // Agregar el like
            currentLikes.push(img.src);
            saveLikes(currentLikes);
            likeBtn.classList.add("liked");
        }
    });

    frame.appendChild(likeBtn);
    container.appendChild(frame);
}

const containerLikes = document.querySelector(".likes-container");
const misMeGusta = JSON.parse(localStorage.getItem("meGusta")) || [];

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
    containerLikes.appendChild(frame);
});
