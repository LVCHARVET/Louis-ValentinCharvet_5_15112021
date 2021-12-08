let cart = [];
let cartItems = document.querySelector("#cart__items");
let totalQuantityTag = document.querySelector("#totalQuantity");
let totalPriceTag = document.querySelector("#totalPrice");
var totalQuantity = 0;
var totalPrice = 0;

cart = JSON.parse(localStorage.getItem("cart"));

/**
 *  Ajout du bloc HTML lié a l'article
  */
function setCartItem(item) {
  item.insertAdjacentHTML("beforeend",
    `
            <article class="cart__item" data-id="${article._id}" data-color="${article.color}">
              <div class="cart__item__img">
                <img src="${article.imageUrl}" alt="${article.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${article.name}</h2>
                  <p>${article.color}</p>
                  <p>${article.price * article.quantity}€</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>
          `
  );
}

/**
 * Ajout des gestionnaires d'évennement pour la suppression et la modification de quantité
 */
let startCartHandle = () => {
  /******************************************************/
  /*** GESTION DE LA SUPPRESSION D'ARTICLE DANS LE PANIER */
  let itemDelete = document.querySelectorAll(".cart__item__content__settings__delete");
  let currentArticle;

  for (iDelete of itemDelete) {
    iDelete.addEventListener("click", (e) => {
      currentArticle = e.target.closest("article");
      indexCart = cart.findIndex(x => x._id === currentArticle.dataset.id && x.color === currentArticle.dataset.color)

      // Suppression du panier et suppression du DOM
      cart.splice(indexCart, 1)
      currentArticle.remove()

      if (cart.length === 0) {
        localStorage.removeItem("cart");
      } else {
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    });
  }


  /********************************************/
  /*** GESTION DE LA MODIFICATION DE QUANTITE */
  let itemChangeQuantity = document.querySelectorAll(".itemQuantity");
  let articleQuantity;
  let actualArticleId;
  let actualArticleValue;
  let actualColor;

  // Branchement event sur bouton supprimé
  for (elem of itemChangeQuantity) {
    elem.addEventListener('change', (e) => {
      // Récupération des informations initiales
      actualArticleValue = e.target.closest("article");
      actualArticleId = actualArticleValue.dataset.id
      actualColor = actualArticleValue.dataset.color;
      articleQuantity = parseInt(e.target.value);

      indexCart = cart.findIndex(x => x._id === actualArticleId && x.color === actualColor)

      // Modification de la quantité de l'article
      cart[indexCart].quantity = articleQuantity

      // Sauvegarde en localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
    })
  }
}

/**
 * On envois les données, on récupére le bon de commande et on redirige vers Confirmation.html
 */
function sendOrder(contact, products) {
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
      // Nettoyage du panier et go confirmation
      localStorage.removeItem('cart');
      window.location = "./confirmation.html?orderId=" + data.orderId;
    })
    .catch((error) => {
      console.error(error);
    });
}

let startFormHandle = () => {
  //On défini les regex
  let regMail = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  let regName = /^[a-z ,.'-]+$/i;
  let regAdresse = /^[a-zA-Z0-9\s,'-]*$/;
  let regCity = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;


  //on écoute le bouton Submit
  document.getElementById("order").addEventListener("click", (e) => {
    e.preventDefault();

    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;

    //On test la value de l'utilisateur
    // Flag de test pour le formulaire
    let parfait = true

    if (!regMail.test(email)) {
      document.getElementById("emailErrorMsg").innerHTML = "Adresse mail invalide !";
      parfait = false
    }
    if (!regName.test(firstName)) {
      document.getElementById("firstNameErrorMsg").innerHTML = "Prénom invalide !";
      parfait = false
    }
    if (!regName.test(lastName)) {
      document.getElementById("lastNameErrorMsg").innerHTML = "Nom de famille invalide !";
      parfait = false
    }
    if (!regAdresse.test(address)) {
      document.getElementById("addressErrorMsg").innerHTML = "Adresse introuvable !";
      parfait = false
    }
    if (!regCity.test(city)) {
      document.getElementById("cityErrorMsg").innerHTML = "Ville introuvable !";
      parfait = false
    };

    // Test si une erreur existe
    if (!parfait) {
      return false
    }

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
      products.push(cartContent[i]._id);
    }

    // On appell la fonction d'envois
    sendOrder(contact, products);
  })
}


if (cart && cart.length > 0) {

  //for (let i = 0; i < cart.length; i++) {
  for (article of cart) {

    totalPrice += article.price * article.quantity;
    totalQuantity += article.quantity;
    totalQuantityTag.innerHTML = totalQuantity;
    totalPriceTag.innerHTML = totalPrice;

    setCartItem(cartItems)
  }

  startCartHandle()
  startFormHandle()
}


