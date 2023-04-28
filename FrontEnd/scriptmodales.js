const imageContainer = document.getElementById("image-container");
const submitButton = document.querySelector(".submit-modale");

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

submitButton.addEventListener("click", () => {
  const modal = document.createElement("aside");
  modal.classList.add("modal-photo");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-labelledby", "titlemodal");
  modal.setAttribute("aria-modal", "true");
  const modalApparitionDisparation = document.querySelector(".modal");
  modalApparitionDisparation.classList.add("hidden");

  const modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal-wrapper", "js-modal-stop");

  const closeButton = document.createElement("button");
  closeButton.classList.add("js-modal-close");
  closeButton.innerHTML = '<i class="fas fa-arrow-left" aria-hidden="true"></i><i class="fa-solid fa-xmark"></i>';
  closeButton.addEventListener("click", () => {
    modal.remove();
    const modalApparitionDisparation = document.querySelector(".modal");
    modalApparitionDisparation.classList.remove("hidden");
  });

  const modalTitle = document.createElement("p");
  modalTitle.classList.add("galerie-modale");
  modalTitle.textContent = "Ajout Photo";

  const modalForm = document.createElement("form");
  modalForm.classList.add("modal-form-photo");
  modalForm.setAttribute("method", "POST");
  modalForm.setAttribute("enctype", "multipart/form-data");
  modalForm.innerHTML = `
    <div class="position-form">
      <label for="image">Image</label>
      <input type="file" id="image" name="image" required>
    </div>
    <div class="position-form">
      <label for="title">Titre</label>
      <input type="text" id="title" name="title" required>
    </div>
    <div class="position-form">
      <label for="category">Catégorie</label>
      <input type="text" id="category" name="category">
    </div>
    <div class="trait"></div>
    <input type="submit" value="Valider" class="submit-image">
  `;

  modalWrapper.appendChild(closeButton);
  modalWrapper.appendChild(modalTitle);
  modalWrapper.appendChild(modalForm);

  modal.appendChild(modalWrapper);
  document.body.appendChild(modal);

  closeButton.addEventListener("click", () => {
    modal.remove();
    const modalApparitionDisparation = document.querySelector(".modal");
    modalApparitionDisparation.classList.remove("hidden");
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
      const modalApparitionDisparation = document.querySelector(".modal");
      modalApparitionDisparation.classList.remove("hidden");
    }
  });

  modalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // code pour ajouter l'image...

    modal.remove();
    const modalApparitionDisparation = document.querySelector(".modal");
    modalApparitionDisparation.classList.remove("hidden");
  });
});

