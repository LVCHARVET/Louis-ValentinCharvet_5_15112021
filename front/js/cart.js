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

        cartItems.insertAdjacentHTML(
          "beforeend",
          `
                            <article class="cart__item" data-id="${
                              cart[i].id
                            }" data-color="${cart[i].color}">
                                <div class="cart__item__img">
                                    <img src="${data.imageUrl}" alt="${
            data.altTxt
          }">
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
            if (currentArticle.dataset.id == cart[i].id &&currentArticle.dataset.color == cart[i].color) {
              cart.splice(cart.indexOf(cart[i]), 1);

              if (cart.length === 0) {
                localStorage.removeItem("cart");
              } else {
                localStorage.setItem("cart", JSON.stringify(cart));
              }
            }
          });
        }

        // for (let index = 0; index < itemDelete.length; index++) {
        //   currentArticle = itemDelete[index].closest(":not(div)");
        //   itemDelete[index].addEventListener("click", () => {
        //     if (
        //       currentArticle.dataset.id == cart[i].id &&
        //       currentArticle.dataset.color == cart[i].color
        //     ) {
        //       cart.splice(cart.indexOf(cart[i]), 1);

        //       if (cart.length === 0) {
        //         localStorage.removeItem("cart");
        //       } else {
        //         localStorage.setItem("cart", JSON.stringify(cart));
        //       }
        //     }
        //   });
        // }

        /********************************************/
        /*** GESTION DE LA MODIFICATION DE QUANTITE */        
        let itemChangeQuantity = document.querySelectorAll(".itemQuantity");
        let articleQuantity;
        let actualArticleId;
        let actualArticleTag;
        let actualColor;

        // [
        //   0: {id, color, quantity}
        //   1: {id, color, quantity}
        //   2: {id, color, quantity}
        // ]

        // Branchement event sur bouton supprimé
        for(elem of itemChangeQuantity){
          elem.addEventListener('change', (e) => {
            // Récupération des informations initiales
            actualArticleTag = e.target.closest("article");
            actualArticleId = actualArticleTag.dataset.id
            actualColor = actualArticleTag.dataset.color;
            articleQuantity = parseInt(e.target.value);

            // Modification de la quantité de l'article
            if (actualArticleId == cart[i].id && actualColor == cart[i].color) {
              console.log("before", cart[i].quantity);
              cart[i].quantity = articleQuantity;
              console.log("after", cart[i].quantity);
            }

            // Sauvegarde en localStorage
            console.log(cart);
            localStorage.setItem("cart", JSON.stringify(cart));
          })
        }


        // for (let j = 0; j < itemChangeQuantity.length; j++) {
        //   actualArticleTag = itemChangeQuantity[j].closest("article");
        //   console.log(actualArticleTag);
        //   actualArticle = actualArticleTag.dataset.id;
        //   actualColor = actualArticleTag.dataset.color;
        //   itemChangeQuantity[j].addEventListener("change", (value) => {
        //     articleQuantity = parseInt(value.target.value);
        //     console.log(articleQuantity);
        //     console.log(actualArticle);
        //     console.log(cart[i].id);
        //     if (actualArticle == cart[i].id && actualColor == cart[i].color) {
        //       console.log("before", cart[i].quantity);
        //       cart[i].quantity = articleQuantity;
        //       console.log("after", cart[i].quantity);
        //     }
        //   });
        // }
      });
  }
  /*for (let ind = 0; ind < itemChangeQuantity.length; ind++) {
    actualArticle = itemChangeQuantity[ind].closest("article");
    console.log(itemChangeQuantity.length)
    console.log("actuel article :", actualArticle);
    itemChangeQuantity[ind].addEventListener("change", (e) => {
      articleQuantity = parseInt(e.target.value);
      console.log(articleQuantity);
      if (
        actualArticle.dataset.id == cart[i].id &&
        actualArticle.dataset.color == cart[i].color
      ) {
        console.log(cart[i].id)
        cart[i].quantity = articleQuantity;
      }
      console.log(cart);
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  }*/
}
