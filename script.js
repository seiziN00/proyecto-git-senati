const homeContainer = document.querySelector("#home-view .image-container");
const likesContainer = document.querySelector(".likes-container");
const homeView = document.getElementById("home-view");
const likesView = document.getElementById("likes-view");

const inicioBtn = document.getElementById("inicio-button");
const meGustaBtn = document.getElementById("me-gusta-button");
const brandBtn = document.getElementById("brand-button");
const themeBtn = document.getElementById("theme-toggle");
const themeIcon = themeBtn.querySelector("img");
const navTitle = document.getElementById("nav-title");
const likesCount = document.getElementById("likes-count");

const STORAGE_KEY = "meGusta";
const THEME_KEY = "temaOscuro";
const TOTAL_IMAGES = 50;

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

function updateLikesCount() {
    const total = getLikes().length;
    likesCount.textContent = total;
    likesCount.hidden = total === 0;
}

function createImageCard(src, isFavoritesView = false) {
    const frame = document.createElement("article");
    frame.className = "image-frame";

    const img = document.createElement("img");
    img.src = src;
    img.alt = isFavoritesView
        ? "Imagen favorita de KrakenGram"
        : "Imagen de KrakenGram";
    img.loading = "lazy";

    img.addEventListener("error", () => frame.remove());

    const likeBtn = document.createElement("button");
    likeBtn.type = "button";
    likeBtn.className = "like-btn";
    likeBtn.setAttribute("aria-label", "Marcar como favorita");

    const isLiked = getLikes().includes(src);
    if (isLiked) {
        likeBtn.classList.add("liked");
        likeBtn.setAttribute("aria-label", "Quitar de favoritos");
    }

    likeBtn.innerHTML = `<img src="${isLiked ? "icons/like-red.svg" : "icons/like.svg"}" alt="" />`;

    let confirmationTimer = null;

    likeBtn.addEventListener("click", () => {
        const currentLikes = getLikes();
        const alreadyLiked = currentLikes.includes(src);

        if (isFavoritesView && alreadyLiked) {
            if (confirmationTimer) {
                clearTimeout(confirmationTimer);
                saveLikes(currentLikes.filter((item) => item !== src));
                renderLikedImages();
                syncHomeLikes();
                return;
            }

            likeBtn.textContent = "¿Quitar?";
            likeBtn.classList.add("confirming");

            confirmationTimer = setTimeout(() => {
                confirmationTimer = null;
                likeBtn.classList.remove("confirming");
                likeBtn.innerHTML = `<img src="icons/like-red.svg" alt="" />`;
            }, 2000);

            return;
        }

        const updatedLikes = alreadyLiked
            ? currentLikes.filter((item) => item !== src)
            : [...currentLikes, src];

        saveLikes(updatedLikes);
        syncHomeLikes();
    });

    frame.append(img, likeBtn);
    return frame;
}

function renderHomeImages() {
    const uniqueIds = new Set();

    while (uniqueIds.size < TOTAL_IMAGES) {
        uniqueIds.add(Math.floor(Math.random() * 1000));
    }

    const fragment = document.createDocumentFragment();

    uniqueIds.forEach((id) => {
        const src = `https://picsum.photos/id/${id}/400/600`;
        fragment.appendChild(createImageCard(src));
    });

    homeContainer.appendChild(fragment);
}

function renderLikedImages() {
    likesContainer.innerHTML = "";
    const likes = getLikes();

    if (likes.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.innerHTML = `
            <div>
                <strong>Aún no tienes favoritos.</strong>
                <p>Vuelve a Inicio y pulsa el corazón de las imágenes que te gusten.</p>
            </div>
        `;
        likesContainer.appendChild(emptyState);
        return;
    }

    const fragment = document.createDocumentFragment();

    likes.forEach((src) => {
        fragment.appendChild(createImageCard(src, true));
    });

    likesContainer.appendChild(fragment);
}

function syncHomeLikes() {
    homeContainer.querySelectorAll(".image-frame").forEach((frame) => {
        const img = frame.querySelector(":scope > img");
        const btn = frame.querySelector(".like-btn");
        const icon = btn.querySelector("img");
        const liked = getLikes().includes(img.src);

        btn.classList.toggle("liked", liked);
        btn.setAttribute(
            "aria-label",
            liked ? "Quitar de favoritos" : "Marcar como favorita",
        );

        if (icon) {
            icon.src = liked ? "icons/like-red.svg" : "icons/like.svg";
        }
    });
}

function showView(view) {
    const showHome = view === "home";

    homeView.hidden = !showHome;
    likesView.hidden = showHome;

    inicioBtn.classList.toggle("active", showHome);
    meGustaBtn.classList.toggle("active", !showHome);
    navTitle.textContent = showHome ? "Inicio" : "Mis Me Gusta";

    if (!showHome) {
        renderLikedImages();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "1" : "0");
    themeIcon.src = isDark ? "icons/dark.svg" : "icons/light.svg";
}

inicioBtn.addEventListener("click", () => showView("home"));
brandBtn.addEventListener("click", () => showView("home"));
meGustaBtn.addEventListener("click", () => showView("likes"));

themeBtn.addEventListener("click", () => {
    applyTheme(!document.body.classList.contains("dark"));
});

const savedTheme = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

applyTheme(savedTheme !== null ? savedTheme === "1" : prefersDark);
renderHomeImages();
updateLikesCount();
