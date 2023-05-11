const buttons = document.querySelectorAll(".filtre > button");
const gallery = document.querySelector(".gallery");

const form = document.querySelector('.adminForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();
});
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
      figure.classList.add("figure-" + work.id);
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

const loadModal = ajaxChargerModal1();

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
const jsModals = document.querySelectorAll(".js-modal");
const divFiltre = document.querySelector(".filtre");
const logoutLink = document.querySelector("#log");
const divProjets = document.querySelector(".projets");
const adminForm = document.querySelector(".adminForm");
const indexBody = document.querySelector("body");

if (adminToken !== null && adminToken !== "") {
  jsModals.forEach((modal) => (modal.style.display = "block"));
  logoutLink.textContent = "logout";
  divFiltre.style.display = "none";
  divProjets.classList.add("admin");
  indexBody.classList.add("overflow-padding");

  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("adminToken");
    window.location.reload();
  });
} else {
  adminForm.style.display = "none";
}

const adminUpdate = document.querySelector(".admin");
adminUpdate.onclick = async function(e) {
  e.preventDefault();
  

  const gallery = document.querySelector(".gallery");
  const figuresToAdd = gallery.querySelectorAll(".attente-validation");
  const figuresToDelete = gallery.querySelectorAll(".delete");
  const adminToken = localStorage.getItem("adminToken");

  const totalRequests = figuresToAdd.length + figuresToDelete.length;
  let completedRequests = 0;

  const handleRequestCompletion = function () {
    completedRequests++;
    if (completedRequests === totalRequests) {
      displayWorks();
    }
  };

  if (totalRequests === 0) {
    displayWorks();
  } else {
    for (const figure of figuresToAdd) {
      const imageInput = figure.querySelector("img");
      const titleInput = figure.querySelector("figcaption");
      const categoryInput = figure.getAttribute("id");

      try {
        const formData = new FormData();

        const response = await fetch(imageInput.src);
        const imageBlob = await response.blob();

        formData.append("image", imageBlob, "image.png");
        formData.append("title", titleInput.textContent);
        formData.append("category", categoryInput);

        await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: formData,
        });
        handleRequestCompletion();
      } catch (error) {
        console.error(error);
      }
    }

    for (const figure of figuresToDelete) {
      const figureClass = figure.getAttribute("class");
      if (!figureClass.includes("delete")) {
        continue;
      }
      const idNumber = figureClass.match(/figure-(\d+)/)[1];

      try {
        await fetch(`http://localhost:5678/api/works/${idNumber}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        handleRequestCompletion();
      } catch (error) {
        console.error(error);
      }
    }
  }

  gallery.innerHTML = "";

  const imageContainer = document.querySelector("#image-container");
  imageContainer.innerHTML = "";
  images();
}

function ajaxChargerModal1() {
  return async function (url) {
    const target = "#" + url.split("#")[1];
    if (loadedModals[url]) {
      return loadedModals[url];
    }
    console.log("fetch");
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
}
