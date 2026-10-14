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

    const randomId = Math.floor(Math.random() * 1000);
    img.src = `https://picsum.photos/id/${randomId}/200/300`;
    img.alt = `Imagen aleatoria ${i + 1}`;

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
