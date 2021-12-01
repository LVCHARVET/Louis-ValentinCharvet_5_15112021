//on cherche l'API

fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((datas) => {
    console.log(datas);

    //on pointe roger

    let roger = document.querySelector("#items");

    //créer des blocs dynamiqueS

    for (data of datas) {
      console.log(data);
      roger.insertAdjacentHTML(
        "beforeend",
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
  })
  .catch((error) => console.log(error));
