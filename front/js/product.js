//on va chercher l'url

var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");

//on cherche l'API

fetch("http://localhost:3000/api/products/" + id)
  .then((res) => res.json())
  .then((data) => {

    //on pointe

    let itemImg = document.querySelector(".item__img");
    let itemName = document.querySelector("#title");
    let itemPrice = document.querySelector("#price");
    let itemDescription = document.querySelector("#description");
    let itemColors = document.querySelector("#colors");
    let itemQuantity = document.querySelector("#quantity");
    let itemAdd = document.querySelector("#addToCart");

    //on injecte

    itemImg.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    itemName.innerHTML = `${data.name}`;
    itemPrice.innerHTML = `${data.price}`;
    itemDescription.innerHTML = `${data.description}`;

    for (let index = 0; index < data.colors.length; index++) {
      itemColors.innerHTML += `<option value="${data.colors[index]}">${data.colors[index]}</option>`;
    }

    // On écoute le clique commande

    itemAdd.addEventListener("click", () => {

        // On défini le panier

      let product = {
        id: data._id,
        color: itemColors.value,
        quantity: parseInt(itemQuantity.value),
      };

      let cart = [];

      // On gére les donnés présente dans le panier

      if (localStorage.getItem("cart") != null) {
        cart = JSON.parse(localStorage.getItem("cart"));
        for (prod of cart) {
          if (prod.id === product.id && prod.color === product.color) {
            cart.splice(cart.indexOf(prod), 1);
            product.quantity += prod.quantity;
          }
        }
      }
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });
