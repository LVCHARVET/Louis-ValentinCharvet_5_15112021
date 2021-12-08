/**
 * Ajout d'emplacement d'article sur la page index
 */
function createArticle(elem) {
  elem.insertAdjacentHTML("beforeend",
    `
          <a href="./product.html?id=${data._id}">
            <article>
              <img src="${data.imageUrl}"" alt="${data.altTxt}"">
              <h3 class="productName">${data.name}"</h3>
              <p class="productDescription">${data.description}"</p>
            </article>
          </a>
        `
  );
}

//on cherche l'API
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((datas) => {

    //on pointe roger

    let roger = document.querySelector("#items");

    //créer des blocs HTML dynamiqueS

    for (data of datas) {

      //On appel la fonction de création d'article
      createArticle(roger);
    }
  })
  .catch((error) => console.log(error));


