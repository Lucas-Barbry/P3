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
      figure.classList.add("image-editer");
      figure.setAttribute("id", work.id);

      const img = document.createElement("img");
      img.classList.add("img-container");
      img.src = imageUrl;
      img.alt = title;

      figure.appendChild(img);

      const figcaption = document.createElement("figcaption");
      figcaption.classList.add("figcaption-container");
      figcaption.textContent = "éditer";

      const containerI = document.createElement("div");
      containerI.classList.add("image-with-icon");

      figure.appendChild(figcaption);
      figure.appendChild(containerI);

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
          const figureGallery = document
            .querySelector(".gallery")
            .querySelector(`.figure-${figureId}`);
          if (figureGallery) {
            figureGallery.style.display = "block";
            figureGallery.classList.remove("delete");
          }
        } else {
          if (index % 2 === 0) {
            img.style.opacity = "0.5";
          } else {
            img.style.opacity = "0.5";
          }
          figure.classList.add("clicked");
          const figureId = figure.getAttribute("id");
          const figureGallery = document
            .querySelector(".gallery")
            .querySelector(`.figure-${figureId}`);
          if (figureGallery) {
            figureGallery.style.display = "none";
            figureGallery.classList.add("delete");
          }
        }
      });
    });

    const deleteModale = document.querySelector(".delete-modale");
    deleteModale.addEventListener("click", () => {
      figuresModal.forEach((figure) => {
        figure.classList.add("clicked");
        const img = figure.querySelector(".img-container");
        img.style.opacity = "0.5";
        const figureId = figure.getAttribute("id");
        const figureGallery = document
          .querySelector(".gallery")
          .querySelector(`.figure-${figureId}`);
        if (figureGallery) {
          figureGallery.style.display = "none";
          figureGallery.classList.add("delete");
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
  closeButton.innerHTML =
    '<i class="fas fa-arrow-left" aria-hidden="true"></i><i class="fa-solid fa-xmark"></i>';

  const arrowLeftIcon = closeButton.querySelector(".fa-arrow-left");
  arrowLeftIcon.addEventListener("click", () => {
    modal.remove();
    const modalApparitionDisparation = document.querySelector(".modal");
    modalApparitionDisparation.classList.remove("hidden");
  });

  const xMarkIcon = closeButton.querySelector(".fa-xmark");
  xMarkIcon.addEventListener("click", () => {
    const closeButton = document.querySelector(".js-modal-close.first");
    const modalApparitionDisparation = document.querySelector(".modal");
    modal.remove();
    closeButton.click();
    modalApparitionDisparation.classList.add("opacity0");
    modalApparitionDisparation.classList.remove("hidden");
    setTimeout(() => {
      modalApparitionDisparation.classList.remove("opacity0");
    }, 600);
  });

  const modalTitle = document.createElement("p");
  modalTitle.classList.add("galerie-modale");
  modalTitle.textContent = "Ajout Photo";

  const modalForm = document.createElement("form");
  modalForm.classList.add("modal-form-photo");
  modalForm.setAttribute("enctype", "multipart/form-data");
  modalForm.innerHTML = `
    <div class="position-form container-img">
    <img id="img" src="" alt="">
    <i class="fa-regular fa-image"></i>
    <label class="container-ajout-img" id="ajout" for="image"><span class="required">+ Ajouter photo</span></label>
    <span class="regle-ajout">jpg, png : 4mo max</span>
    <input id="image" type="file" accept="image/*" name="image" style="display: none">
  </div>
    </div>
    <div class="position-form">
      <label for="title">Titre</label>
      <input class="ui-form" type="text" id="title" name="title" required>
    </div>
    <div class="position-form">
    <p>Catégorie</p>
<select class="ui-form" name="categoryId">
    <option value="1">Objets</option>
    <option value="2">Appartements</option>
    <option value="3">Hôtels et restaurants</option>
  </select>
    </div>
    <div class="trait"></div>
    <input type="submit" value="Valider" class="submit-image" disabled>
  `;

  modalWrapper.appendChild(closeButton);
  modalWrapper.appendChild(modalTitle);
  modalWrapper.appendChild(modalForm);

  modal.appendChild(modalWrapper);
  document.body.appendChild(modal);

  const ajout = document.querySelector("#ajout");
  const file = document.querySelector("#image");
  const img = document.querySelector("#img");
  const conditionImage = document.querySelector(".regle-ajout");
  const faLogo = document.querySelector(".fa-image");

  file.addEventListener("input", () => {
    let src = URL.createObjectURL(file.files[0]);
    console.log("src", src);
    img.src = src;
    ajout.style.display = "none";
    conditionImage.style.display = "none";
    faLogo.style.display = "none";

    img.classList.add("img-uploaded");
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
      const modalApparitionDisparation = document.querySelector(".modal");
      modalApparitionDisparation.classList.remove("hidden");
    }
  });

  modalForm.addEventListener("submit", async (event) => {
    modal.remove();
    e.preventDefault();
    const modalApparitionDisparation = document.querySelector(".modal");
    modalApparitionDisparation.classList.remove("hidden");
  });

  const addWorkLocal = document.querySelector(".submit-image");
  addWorkLocal.addEventListener("click", async (e) => {
    e.preventDefault();

    const imageInput = document.getElementById("image");
    const titleInput = document.getElementById("title");
    const categoryInput = document.querySelector('select[name="categoryId"]');

    try {
      const formData = new FormData();
      formData.append("image", imageInput.files[0]);
      formData.append("title", titleInput.value);
      formData.append("category", categoryInput.value);

      // Créer la figure
      const selectedOption = categoryInput.options[categoryInput.selectedIndex];
      const figure = document.createElement("figure");
      figure.setAttribute("id", selectedOption.value);
      figure.classList.add("attente-validation");

      // Créer l'image et l'ajouter à la figure
      const img = document.createElement("img");
      img.setAttribute("src", window.URL.createObjectURL(imageInput.files[0]));
      img.setAttribute("alt", titleInput.value);
      figure.appendChild(img);

      // Créer la légende et l'ajouter à la figure
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = titleInput.value;
      figure.appendChild(figcaption);

      // Ajouter la figure à la galerie
      const gallery = document.querySelector(".gallery");
      gallery.appendChild(figure);

      // Créer la figure pour la modale
      const imageContainer = document.getElementById("image-container");
      const figureModalePending = document.createElement("figure");
      figureModalePending.classList.add("image-editer");
      figureModalePending.classList.add("pending");

      // Ajouter l'image à la figure pour la galerie en attente de validation
      const imgGalleryPending = document.createElement("img");
      imgGalleryPending.classList.add("img-container");
      imgGalleryPending.setAttribute(
        "src",
        window.URL.createObjectURL(imageInput.files[0])
      );
      imgGalleryPending.setAttribute("alt", titleInput.value);
      figureModalePending.appendChild(imgGalleryPending);

      // Ajouter la légende à la figure pour la galerie en attente de validation
      const figcaptionGalleryPending = document.createElement("figcaption");
      figcaptionGalleryPending.classList.add("figcaption-container");
      figcaptionGalleryPending.textContent = "pending";
      figureModalePending.appendChild(figcaptionGalleryPending);

      // Ajouter la figureen attente de validation à la section appropriée
      imageContainer.appendChild(figureModalePending);


      const arrowLeftReturnAfterSubmit = document.querySelector(
        "aside.modal-photo button.js-modal-close i.fas.fa-arrow-left"
      );

      arrowLeftReturnAfterSubmit.click();
      alert("Projet ajouté avec succès ! Finalisez l'ajout en cliquant sur le bouton 'Publier les changements' en haut de page.");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du projet local");

    }
  });

  const formAjoutPhoto = document.querySelector(".modal-form-photo");

  formAjoutPhoto.addEventListener("input", () => {
    const imageInput = document.getElementById("image").files[0];
    const titleInput = document.getElementById("title");
    const categoryInput = document.querySelector('select[name="categoryId"]');
    if (imageInput && titleInput && categoryInput) {
      if (formAjoutPhoto.checkValidity()) {
        addWorkLocal.disabled = false;
        addWorkLocal.classList.add("form-valid");
      } else {
        addWorkLocal.disabled = true;
        addWorkLocal.classList.remove("form-valid");
      }
    } else {
      addWorkLocal.disabled = true;
      addWorkLocal.classList.remove("form-valid");
    }
  });
});
