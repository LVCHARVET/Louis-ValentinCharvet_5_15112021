let cart = [];
let cartItems = document.querySelector("#cart__items");
let totalQuantityTag = document.querySelector("#totalQuantity");
let totalPriceTag = document.querySelector("#totalPrice");
var totalQuantity = 0;
var totalPrice = 0;

cart = JSON.parse(localStorage.getItem("cart"));

if (cart && cart.length > 0) {

  for (let i = 0; i < cart.length; i++) {

    fetch("http://localhost:3000/api/products/" + cart[i].id)

      .then((res) => res.json())
      .then((data) => {

        totalPrice += data.price * cart[i].quantity;
        totalQuantity += cart[i].quantity;
        totalQuantityTag.innerHTML = totalQuantity;
        totalPriceTag.innerHTML = totalPrice;

        cartItems.insertAdjacentHTML("beforeend",
          `
            <article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
              <div class="cart__item__img">
                <img src="${data.imageUrl}" alt="${data.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${data.name}</h2>
                  <p>${cart[i].color}</p>
                  <p>${data.price * cart[i].quantity}€</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>
          `
        );

        /******************************************************/
        /*** GESTION DE LA SUPPRESION D'ARTICLE DANS LE PANIER */
        let itemDelete = document.querySelectorAll(".cart__item__content__settings__delete");
        let currentArticle;

        for (iDelete of itemDelete) {
          currentArticle = iDelete.closest(":not(div)");
          iDelete.addEventListener("click", () => {
            if (currentArticle.dataset.id == cart[i].id && currentArticle.dataset.color == cart[i].color) {
              cart.splice(cart.indexOf(cart[i]), 1);

              if (cart.length === 0) {
                localStorage.removeItem("cart");
              } else {
                localStorage.setItem("cart", JSON.stringify(cart));
              }
            }
          });
        }

        /********************************************/
        /*** GESTION DE LA MODIFICATION DE QUANTITE */
        let itemChangeQuantity = document.querySelectorAll(".itemQuantity");
        let articleQuantity;
        let actualArticleId;
        let actualArticleTag;
        let actualColor;

        // Branchement event sur bouton supprimé
        for (elem of itemChangeQuantity) {
          elem.addEventListener('change', (e) => {
            // Récupération des informations initiales
            actualArticleTag = e.target.closest("article");
            actualArticleId = actualArticleTag.dataset.id
            actualColor = actualArticleTag.dataset.color;
            articleQuantity = parseInt(e.target.value);

            // Modification de la quantité de l'article
            if (actualArticleId == cart[i].id && actualColor == cart[i].color) {
              cart[i].quantity = articleQuantity;
            }

            // Sauvegarde en localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
          })
        }
      });
  }
}

//On défini les regex
let regMail = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
let regName = /^[a-z ,.'-]+$/i;
let regAdresse = /^[a-zA-Z0-9\s,'-]*$/;
let regCity = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

let buttonSubmit = document.getElementById("order");

//on écoute le bouton Submit
buttonSubmit.addEventListener("click", (e) => {
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let address = document.getElementById("address").value;
  let city = document.getElementById("city").value;
  let email = document.getElementById("email").value;

  //On créer l'objet contact et l'objet products
  let contact = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  }

  let products = [];

  cartContent = JSON.parse(localStorage.getItem("cart"));

  for (let i = 0; i < cartContent.length; i++) {
    products.push(cartContent[i].id);
  }

  //On test la value de l'utilisateur
  if (!regMail.test(email) ||
    !regName.test(firstName) ||
    !regName.test(lastName) ||
    !regAdresse.test(address) ||
    !regCity.test(city)) {

    e.preventDefault();

    if (!regMail.test(email)) {
      document.getElementById("emailErrorMsg").innerHTML = "Adresse mail invalide !";
    }
    if (!regName.test(firstName)) {
      document.getElementById("firstNameErrorMsg").innerHTML = "Prénom invalide !";
    }
    if (!regName.test(lastName)) {
      document.getElementById("lastNameErrorMsg").innerHTML = "Nom de famille invalide !";
    }
    if (!regAdresse.test(address)) {
      document.getElementById("addressErrorMsg").innerHTML = "Adresse introuvable !";
    }
    if (!regCity.test(city)) {
      document.getElementById("cityErrorMsg").innerHTML = "Ville introuvable !";
    };
    return;
  }

  //On envois les données, on récupére le bon de commande et on redirige vers Confirmation.html
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contact,
      products
    })
  }).then((res) => res.json())
    .then((data) => {
      window.location = "./confirmation.html?orderId=" + data.orderId
    })
    .catch((error) => {
      console.error(error);
    })
})