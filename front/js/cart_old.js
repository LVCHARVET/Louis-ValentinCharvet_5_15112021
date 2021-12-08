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
        /*** GESTION DE LA SUPPRESSION D'ARTICLE DANS LE PANIER */
        let itemDelete = document.querySelectorAll(".cart__item__content__settings__delete");
        let currentArticle;

        for (iDelete of itemDelete) {
          currentArticle = iDelete.closest(":not(div)");
          iDelete.addEventListener("click", () => {
            console.log(i)
            console.log(cart)
            console.log(cart[i])
            if (currentArticle.dataset.id == cart[i].id && currentArticle.dataset.color == cart[i].color) {
              console.log(cart)
              
              //cart.splice(cart.indexOf(cart[i]), 1);     
              //cart.splice(i, 1)
              cart[i] = null


              console.log(currentArticle)
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


//on écoute le bouton Submit
let buttonSubmit = document.getElementById("order");

buttonSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let address = document.getElementById("address").value;
  let city = document.getElementById("city").value;
  let email = document.getElementById("email").value;

  //On test la value de l'utilisateur
  // if (!regMail.test(email) ||
  //   !regName.test(firstName) ||
  //   !regName.test(lastName) ||
  //   !regAdresse.test(address) ||
  //   !regCity.test(city)) {

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
    
  // }

  // Test si une erreur existe
  if(!parfait){
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
    products.push(cartContent[i].id);
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
      // Nettoyage du panier et go confirmation
      localStorage.removeItem('cart')
      window.location = "./confirmation.html?orderId=" + data.orderId
    })
    .catch((error) => {
      console.error(error);
    })
})