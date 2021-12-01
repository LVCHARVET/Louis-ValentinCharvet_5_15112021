let cart = [];
let cartItems = document.querySelector("#cart__items");
let totalQuantityTag = document.querySelector("#totalQuantity");
let totalPriceTag = document.querySelector("#totalPrice");
var totalQuantity = 0;
var totalPrice = 0;

cart = JSON.parse(localStorage.getItem("cart"));

for (let i = 0; i < cart.length; i++) {
  fetch("http://localhost:3000/api/products/" + cart[i].id)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(cart[i]);

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
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
                                      cart[i].quantity
                                    }">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                            </div>
                            </article>
                        `
      );
    });
}
