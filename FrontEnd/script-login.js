const form = document.querySelector("#login-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#email");
  const mdp = document.querySelector("#mdp");

  const user = {
    email: email.value,
    password: mdp.value,
  };

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result); //ajouter local storage et redirection INDEX
      localStorage.setItem("adminToken", result.token);
      window.location.href = "index.html"
    } else {
      alert("Erreur dans l’identifiant ou le mot de passe");
    }
  } catch (error) {
    console.error("Erreur de requête API : ", error);
  }
});