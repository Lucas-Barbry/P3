const buttons = document.querySelectorAll(".filtre > button");
const gallery = document.querySelector(".gallery");

// Affichage de la galerie. Fetch works & décompression réponse
async function displayWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();

    // Parcourir chaque travail
    for (let i = 0; i < data.length; i++) {
      const work = data[i];
      const title = work.title;
      const imageUrl = work.imageUrl;

      const figure = document.createElement("figure");

      figure.setAttribute("id", work.categoryId);
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      img.src = imageUrl;
      img.alt = title;
      figcaption.textContent = title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    }
  } catch (error) {
    console.error(error);
  }
}
displayWorks();

// LIGNE 36 ET 38
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const figures = gallery.querySelectorAll("figure");

    if (button.id === "tous") {
      figures.forEach((figure) => figure.classList.remove("hidden"));
    } else {
      figures.forEach((figure) => {
        if (figure.getAttribute("id") !== button.getAttribute("id")) {
          figure.classList.add("hidden");
        } else {
          figure.classList.remove("hidden");
        }
      });
    }
  });
});

let modal = null;
const loadedModals = {};

const openModal = async function (e) {
  e.preventDefault();
  // target = href d'aside
  const target = e.target.getAttribute("href");
  if (target.startsWith("#")) {
    modal = document.querySelector(target);
  } else {
    modal = await loadModal(target);
  }
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const loadModal = async function (url) {
  const target = "#" + url.split("#")[1];
  if (loadedModals[url]) {
    return loadedModals[url];
  }
  const html = await fetch(url).then((response) => response.text());
  const element = document
    .createRange()
    .createContextualFragment(html)
    .querySelector(target);
  if (element === null)
    throw `L'élément ${target} n'a pas été trouvé dans la page ${url}`;
  document.body.append(element);
  loadedModals[url] = element;
  return element;
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  const hideModal = function () {
    if (modal === null) return;
    modal.style.display = "none";
    modal.removeEventListener("animationend", hideModal);
    modal = null;
  };
  modal.addEventListener("animationend", hideModal);

  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

const adminToken = localStorage.getItem("adminToken");
const jsModal = document.querySelector(".js-modal");
const divFiltre = document.querySelector(".filtre")

const logoutLink = document.querySelector("#log");

if (adminToken !== null && adminToken !== "") {
  jsModal.style.display = "block";
  logoutLink.textContent = "logout";
  divFiltre.style.display = "none";

  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("adminToken");
    window.location.reload();
  });

} else {
  // si le token administrateur n'existe pas, masquer la section de l'interface d'administration
  jsModal.style.display = "none";
}
