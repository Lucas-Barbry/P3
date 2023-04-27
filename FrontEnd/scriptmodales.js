const imageContainer = document.getElementById("image-container");

async function images() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();

    // Parcourir chaque travail
    for (let i = 0; i < data.length; i++) {
      const work = data[i];
      const title = work.title;
      const imageUrl = work.imageUrl;

      const figure = document.createElement("figure");
      figure.classList.add("image-editer")
      figure.setAttribute("id", work.id);

      const img = document.createElement("img");
      img.classList.add("img-container")
      img.src = imageUrl;
      img.alt = title;

      figure.appendChild(img);

      const figcaption = document.createElement("figcaption");
      figcaption.classList.add("figcaption-container");
      figcaption.textContent = "éditer";

      const containerI = document.createElement("div");
      containerI.classList.add("image-with-icon");

      figure.appendChild(figcaption);
      figure.appendChild(containerI)

      imageContainer.appendChild(figure);
    }

    const figuresModal = document.querySelectorAll(".image-editer");

    figuresModal.forEach((figure, index) => {
      figure.addEventListener("click", () => {
        const img = figure.querySelector(".img-container");
        const isClicked = figure.classList.contains("clicked");
        if (isClicked) {
          img.style.opacity = "1";
          figure.classList.remove("clicked");
          const figureId = figure.getAttribute("id");
          const figureGallery = document.querySelector(".gallery").querySelector(`.figure-${figureId}`);
          if (figureGallery) {
            figureGallery.style.display = "block";
          }

        } else {
          if (index % 2 === 0) {
            img.style.opacity = "0.5";
          } else {
            img.style.opacity = "0.5";
          }
          figure.classList.add("clicked");
          const figureId = figure.getAttribute("id");
          const figureGallery = document.querySelector(".gallery").querySelector(`.figure-${figureId}`);
          if (figureGallery) {
            figureGallery.style.display = "none";
          }
        }
      });
    });

  } catch (error) {
    console.error(error);
  }
}

images();
