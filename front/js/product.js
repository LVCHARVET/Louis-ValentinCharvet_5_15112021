//on va chercher l'url

var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");
console.log(id);

//on cherche l'API

fetch("http://localhost:3000/api/products/" + id) 
    .then(res => res.json())
    .then(data => {
        console.log(data)

        //on pointe

        let itemImg = document.querySelector(".item__img")
        let itemName = document.querySelector("#title")
        let itemPrice = document.querySelector("#price")
        let itemDescription = document.querySelector("#description")
        let itemColors = document.querySelector("#colors")

        //on injecte

        itemImg.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`
        itemName.innerHTML = `${data.name}`
        itemPrice.innerHTML = `${data.price}`
        itemDescription.innerHTML = `${data.description}`

        for (let index = 0; index < data.colors.length; index++) {
            console.log(data.colors[index])
            itemColors.innerHTML += `<option value="${data.colors[index]}">${data.colors[index]}</option>`            
        }

    })