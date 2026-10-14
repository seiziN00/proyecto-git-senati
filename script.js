const container = document.querySelector(".image-container");

for (let i = 0; i < 20; i++) {
    const frame = document.createElement("div");
    frame.classList.add("image-frame");

    const img = document.createElement("img");

    const randomId = Math.floor(Math.random() * 1000);
    img.src = `https://picsum.photos/id/${randomId}/200/300`;
    img.alt = `Imagen aleatoria ${i + 1}`;

    frame.appendChild(img);
    container.appendChild(frame);
}
