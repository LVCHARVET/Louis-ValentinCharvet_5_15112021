//On récupére l'orderId
var str = window.location.href;
var url = new URL(str);
var orderId = url.searchParams.get("orderId");

//On inject l'orderId dans le html
if (orderId) {
  document.getElementById("orderId").innerHTML = orderId
}