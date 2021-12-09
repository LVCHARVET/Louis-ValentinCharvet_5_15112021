//on va chercher l'url

var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");

/**
 * Ajout d'un produit au pannier sans multiplier les articles de couleur et d'article identique
 */
function addToCart(product, quantity, color, storageKey) {
  // Selection de la couleur et ajout de la quantité
  product.color = color
  product.quantity = parseInt(quantity)

  // Initialisation ou récupération du panier
  let cart = localStorage.getItem(storageKey)
  if (cart == null) {
    cart = []
  } else {
    cart = JSON.parse(cart)
  }

  // Recherche du produit correspondant (id et couleur) dans le panier
  indexCart = cart.findIndex(x => x._id === product._id && x.color === product.color)

  if (indexCart !== -1) {
    // Modification de la quantité de l'article trouvé
    cart[indexCart].quantity += product.quantity
  } else {
    // Ajout du nouveau produit
    cart.push(product);
  }
  localStorage.setItem(storageKey, JSON.stringify(cart));
}


//on cherche l'API

fetch("http://localhost:3000/api/products/" + id)
  .then((res) => res.json())
  .then((product) => {

    //on pointe
    let itemImg = document.querySelector(".item__img");
    let itemName = document.querySelector("#title");
    let itemPrice = document.querySelector("#price");
    let itemDescription = document.querySelector("#description");
    let itemColors = document.querySelector("#colors");
    let itemQuantity = document.querySelector("#quantity");
    let itemAdd = document.querySelector("#addToCart");

    //on injecte

    //itemImg.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;

    let img = document.createElement('img')
    img.src = product.imageUrl
    img.alt = product.altTxt
    itemImg.appendChild(img)

    itemName.innerHTML = product.name
    itemPrice.innerHTML = product.price
    itemDescription.innerHTML = product.description

    for (let index = 0; index < product.colors.length; index++) {
      itemColors.innerHTML += `<option value="${product.colors[index]}">${product.colors[index]}</option>`;
    }

    // On écoute le clique commande
    itemAdd.addEventListener("click", () => {

      //On execute la fonction pour envoyer un produit au panier
      addToCart(product, itemQuantity.value, itemColors.value, "cart")
    });
  });