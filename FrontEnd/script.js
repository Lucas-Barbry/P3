const buttons = document.querySelectorAll('.filtre > button');
const gallery = document.querySelector('.gallery');

// Affichage de la galerie. Fetch works & décompression réponse
async function displayWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const data = await response.json();
  
    // Parcourir chaque travail
    for (let i = 0; i < data.length; i++) {
      const work = data[i];
      const title = work.title;
      const imageUrl = work.imageUrl;

      // Créer les éléments HTML pour chaque taff
      const figure = document.createElement('figure');
      // setAttribute pour un filtre
      figure.setAttribute('id', work.categoryId)
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      // Ajouter les attributs et éléments html
      img.src = imageUrl;
      img.alt = title;
      figcaption.textContent = title;

      // Ajouter les éléments HTML à figure
      figure.appendChild(img);
      figure.appendChild(figcaption);

      // Ajouter figure à galerie
      gallery.appendChild(figure);
    }
  } catch (error) {
    console.error(error);
  }
}

displayWorks();



buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const figures = gallery.querySelectorAll('figure');

    if (button.id === 'tous') {
      // Si le bouton "Tous" est cliqué, affichez toutes les figures
      figures.forEach(figure => figure.classList.remove('hidden'));
    } else {
      // Sinon, cachez toutes les figures qui ne correspondent pas à l'id filtré
      figures.forEach(figure => {
        if (figure.getAttribute('id') !== button.getAttribute('id')) {
          figure.classList.add('hidden');
        } else {
          figure.classList.remove('hidden');
        }
      });
    }
  });
});