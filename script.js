const homeContainer = document.querySelector("#home-view .image-container");

const likesContainer = document.querySelector(".likes-container");

const homeView = document.getElementById("home-view");

const likesView = document.getElementById("likes-view");

/* Botones del header */

const inicioBtn = document.getElementById("inicio-button");

const meGustaBtn = document.getElementById("me-gusta-button");

const brandBtn = document.getElementById("brand-button");

const themeBtn = document.getElementById("theme-toggle");

const themeIcon = themeBtn.querySelector("img");

const navTitle = document.getElementById("nav-title");

const likesCount = document.getElementById("likes-count");

/* Modal */

const imageModal = document.getElementById("image-modal");

const modalImage = document.getElementById("modal-image");

const modalClose = document.getElementById("modal-close");

/*   CONFIGURACIÓN  */

const STORAGE_KEY = "meGusta";

const THEME_KEY = "temaOscuro";

const TOTAL_IMAGES = 50;

/* LOCAL STORAGE */

function getLikes() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveLikes(likes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likes));

    updateLikesCount();
}

/* CONTADOR DE FAVORITOS*/

function updateLikesCount() {
    const total = getLikes().length;

    likesCount.textContent = total;

    likesCount.hidden = total === 0;
}

/* MODAL */

function openImageModal(src) {
    modalImage.src = src;

    imageModal.classList.add("active");

    imageModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}

function closeImageModal() {
    imageModal.classList.remove("active");

    imageModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    setTimeout(() => {
        modalImage.src = "";
    }, 250);
}

/* CREAR TARJETA DE IMAGEN */

function createImageCard(src, isFavoritesView = false) {
    /* Tarjeta */

    const frame = document.createElement("article");

    frame.className = "image-frame";

    /* Imagen */

    const img = document.createElement("img");

    img.src = src;

    img.alt = isFavoritesView
        ? "Imagen favorita de KrakenGram"
        : "Imagen de KrakenGram";

    img.loading = "lazy";

    /* Abrir imagen */

    img.addEventListener("click", () => {
        openImageModal(src);
    });

    /* Eliminar tarjeta si falla la imagen */

    img.addEventListener("error", () => {
        frame.remove();
    });

    /* Botón like */

    const likeBtn = document.createElement("button");

    likeBtn.type = "button";

    likeBtn.className = "like-btn";

    /* Verificar favorito */

    const isLiked = getLikes().includes(src);

    updateLikeButton(likeBtn, isLiked);

    /* Confirmación para favoritos */

    let confirmationTimer = null;

    /* Evento like */

    likeBtn.addEventListener("click", () => {
        const currentLikes = getLikes();

        const alreadyLiked = currentLikes.includes(src);

        /*
         * Si estamos en favoritos,
         * pedimos confirmación antes
         * de eliminar.
         */

        if (isFavoritesView && alreadyLiked) {
            if (confirmationTimer) {
                clearTimeout(confirmationTimer);

                confirmationTimer = null;

                const updatedLikes = currentLikes.filter(
                    (item) => item !== src,
                );

                saveLikes(updatedLikes);

                renderLikedImages();

                syncHomeLikes();

                return;
            }

            likeBtn.textContent = "¿Quitar?";

            likeBtn.classList.add("confirming");

            confirmationTimer = setTimeout(() => {
                confirmationTimer = null;

                likeBtn.classList.remove("confirming");

                updateLikeButton(likeBtn, true);
            }, 2000);

            return;
        }

        /*
         * Agregar o quitar favorito
         */

        let updatedLikes;

        if (alreadyLiked) {
            updatedLikes = currentLikes.filter((item) => item !== src);
        } else {
            updatedLikes = [...currentLikes, src];
        }

        saveLikes(updatedLikes);

        syncHomeLikes();
    });

    /* Agregar elementos */

    frame.append(img, likeBtn);

    return frame;
}

/*ACTUALIZAR BOTÓN LIKE*/

function updateLikeButton(button, liked) {
    button.classList.toggle("liked", liked);

    button.setAttribute(
        "aria-label",
        liked ? "Quitar de favoritos" : "Marcar como favorita",
    );

    button.innerHTML = `
        <img
            src="${liked ? "icons/like-red.svg" : "icons/like.svg"}"
            alt=""
        />
    `;
}

/* GENERAR IMÁGENES DE INICIO */

function renderHomeImages() {
    const uniqueIds = new Set();

    /*
     * Generamos IDs únicos
     */

    while (uniqueIds.size < TOTAL_IMAGES) {
        const randomId = Math.floor(Math.random() * 1000);

        uniqueIds.add(randomId);
    }

    /*
     * Fragment evita insertar
     * elementos uno por uno.
     */

    const fragment = document.createDocumentFragment();

    uniqueIds.forEach((id) => {
        const src = `https://picsum.photos/id/${id}/400/600`;

        const card = createImageCard(src);

        fragment.appendChild(card);
    });

    homeContainer.appendChild(fragment);
}

/* MOSTRAR FAVORITOS */

function renderLikedImages() {
    likesContainer.innerHTML = "";

    const likes = getLikes();

    /*
     * Sin favoritos
     */

    if (likes.length === 0) {
        const emptyState = document.createElement("div");

        emptyState.className = "empty-state";

        emptyState.innerHTML = `
            <div>
                <strong>
                    Aún no tienes favoritos
                </strong>

                <p>
                    Vuelve a Inicio y pulsa
                    el corazón de las imágenes
                    que te gusten.
                </p>
            </div>
        `;

        likesContainer.appendChild(emptyState);

        return;
    }

    /*
     * Mostrar favoritos
     */

    const fragment = document.createDocumentFragment();

    likes.forEach((src) => {
        const card = createImageCard(src, true);

        fragment.appendChild(card);
    });

    likesContainer.appendChild(fragment);
}

/*SINCRONIZAR LIKES DEL INICIO*/

function syncHomeLikes() {
    const likes = getLikes();

    const cards = homeContainer.querySelectorAll(".image-frame");

    cards.forEach((frame) => {
        const img = frame.querySelector(":scope > img");

        const button = frame.querySelector(".like-btn");

        const liked = likes.includes(img.src);

        updateLikeButton(button, liked);
    });
}

/*CAMBIAR ENTRE VISTAS */

function showView(view) {
    const showHome = view === "home";

    homeView.hidden = !showHome;

    likesView.hidden = showHome;

    inicioBtn.classList.toggle("active", showHome);

    meGustaBtn.classList.toggle("active", !showHome);

    navTitle.textContent = showHome ? "Inicio" : "Mis Me Gusta";

    /*
     * Actualizar favoritos
     */

    if (!showHome) {
        renderLikedImages();
    }

    /*
     * Volver arriba
     */

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

/* MODO CLARO / OSCURO*/

function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark);

    localStorage.setItem(THEME_KEY, isDark ? "1" : "0");

    themeIcon.src = isDark ? "icons/dark.svg" : "icons/light.svg";
}

/* EVENTOS DE NAVEGACIÓN */

inicioBtn.addEventListener("click", () => {
    showView("home");
});

brandBtn.addEventListener("click", () => {
    showView("home");
});

meGustaBtn.addEventListener("click", () => {
    showView("likes");
});

/*EVENTO MODO OSCURO */

themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");

    applyTheme(!isDark);
});

/*EVENTOS DEL MODAL*/

/* Botón X */

modalClose.addEventListener("click", closeImageModal);

/* Clic fuera de la imagen */

imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) {
        closeImageModal();
    }
});

/* Tecla ESC */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && imageModal.classList.contains("active")) {
        closeImageModal();
    }
});

/* INICIAR APLICACIÓN */

const savedTheme = localStorage.getItem(THEME_KEY);

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const initialTheme = savedTheme !== null ? savedTheme === "1" : prefersDark;

applyTheme(initialTheme);

renderHomeImages();

updateLikesCount();
