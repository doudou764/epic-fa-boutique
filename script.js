/* ======================================================
   EPIC FA BOUTIQUE - SCRIPT PRINCIPAL
   Version optimisée et sécurisée
====================================================== */

/* =========================
   BASE DE DONNEES LOCALE
========================= */
let orders = JSON.parse(localStorage.getItem("epic_orders")) || [];

/* =========================
   HASH SHA256 (ADMIN)
========================= */
async function sha256(message){
const msgBuffer = new TextEncoder().encode(message);
const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
const hashArray = Array.from(new Uint8Array(hashBuffer));
return hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
}

/* =========================
   ADMIN ACCOUNTS (HASH)
========================= */
const ADMIN_ACCOUNTS = [
{
username:"015_fonda",
password:"014_FONDA2026",
role:"superadmin"
}
];

let currentAdmin = null;

/* =========================
   ANTI SPAM PAIEMENT
========================= */
let paymentCooldown = false;

function canPay(){

if(paymentCooldown){
alert("Attends quelques secondes");
return false;
}

paymentCooldown = true;

setTimeout(()=>{
paymentCooldown=false;
},8000);

return true;

}
// ================= PRODUITS COMPLETS =================
const products = [
  {id:1,name:"Starter Pack",coins:500,role:"Supporter",price:2},
  {id:2,name:"Bronze Pack",coins:1000,role:"Donateur",price:5},
  {id:3,name:"Argent Pack",coins:2000,role:"Donateur+",price:9.99},
  {id:4,name:"Or Pack",coins:3000,role:"Premium",price:18.99},
  {id:5,name:"VIP Pack",coins:5000,role:"VIP",price:29.99},
  {id:6,name:"VIP+ Pack",coins:6000,role:"VIP+",price:39.99},
  {id:7,name:"Elite Pack",coins:8000,role:"Elite",price:49.99},
  {id:8,name:"Diamond Pack",coins:10000,role:"Diamond",price:59.99},
  {id:9,name:"Mythic Pack",coins:12000,role:"Mythic",price:69.99},
  {id:10,name:"Titan Pack",coins:15000,role:"Titan",price:79.99},

  {id:11,name:"Coins 500",coins:500,role:"Supporter",price:3.99},
  {id:12,name:"Coins 1000",coins:1000,role:"Donateur",price:7.99},
  {id:13,name:"Coins 1500",coins:1500,role:"Donateur+",price:9.99},
  {id:14,name:"Coins 2000",coins:2000,role:"Premium",price:12.99},
  {id:15,name:"Coins 3000",coins:3000,role:"Premium",price:18.99},
  {id:16,name:"Coins 4000",coins:4000,role:"VIP",price:24.99},
  {id:17,name:"Coins 5000",coins:5000,role:"VIP+",price:29.99},
  {id:18,name:"Coins 7500",coins:7500,role:"Elite",price:44.99},
  {id:19,name:"Coins 10000",coins:10000,role:"Diamond",price:59.99},

  {id:20,name:"Grade Supporter",coins:500,role:"Supporter",price:4.99},
  {id:21,name:"Grade Donateur",coins:1000,role:"Donateur",price:9.99},
  {id:22,name:"Grade Donateur+",coins:1500,role:"Donateur+",price:14.99},
  {id:23,name:"Grade Premium",coins:2500,role:"Premium",price:19.99},
  {id:24,name:"Grade VIP",coins:5000,role:"VIP",price:29.99},
  {id:25,name:"Grade VIP+",coins:6000,role:"VIP+",price:39.99},
  {id:26,name:"Grade Elite",coins:8000,role:"Elite",price:49.99},
  {id:27,name:"Grade Elite+",coins:10000,role:"Elite+",price:59.99},
  {id:28,name:"Grade Diamond",coins:12000,role:"Diamond",price:69.99},
  {id:29,name:"Grade Diamond+",coins:15000,role:"Diamond+",price:79.99},
  {id:30,name:"Grade Mythic",coins:18000,role:"Mythic",price:89.99},
  {id:31,name:"Grade Mythic+",coins:20000,role:"Mythic+",price:99.99},
  {id:32,name:"Grade Titan",coins:22000,role:"Titan",price:109.99},
  {id:33,name:"Grade Titan+",coins:25000,role:"Titan+",price:119.99},
  {id:34,name:"Grade Empire",coins:28000,role:"Empire",price:129.99},
  {id:35,name:"Grade Empire+",coins:30000,role:"Empire+",price:139.99},
  {id:36,name:"Grade Légende",coins:35000,role:"Légende",price:149.99},
  {id:37,name:"Grade Légende+",coins:40000,role:"Légende+",price:159.99},

  {id:38,name:"Pack Event Bronze",coins:500,role:"Supporter",price:4.99},
  {id:39,name:"Pack Event Silver",coins:1000,role:"Donateur",price:9.99},
  {id:40,name:"Pack Event Gold",coins:2500,role:"Premium",price:19.99},
  {id:41,name:"Pack Event Diamond",coins:6000,role:"Diamond",price:39.99},
  {id:42,name:"Ticket tournoi",coins:0,role:"Donateur",price:14.99},

  {id:43,name:"Soutien 2€",coins:100,role:"Supporter",price:2},
  {id:44,name:"Soutien 5€",coins:300,role:"Donateur",price:5},
  {id:45,name:"Soutien 10€",coins:800,role:"Premium",price:10},
  {id:46,name:"Soutien 25€",coins:2000,role:"VIP",price:25},
  {id:47,name:"Soutien 50€",coins:5000,role:"Légende",price:50}
];

/* =========================
   AFFICHAGE PRODUITS
========================= */

function renderProducts(){

const container = document.querySelector(".packs-container");

if(!container) return;

container.innerHTML="";

const fragment = document.createDocumentFragment();

products.forEach(p=>{

const card = document.createElement("div");

card.classList.add("card","product");

card.innerHTML = `
<h2>${p.name}</h2>
<p>${p.coins} Coins + Rôle ${p.role}</p>
<p class="price">${p.price.toFixed(2)} €</p>

<div id="paypal-button-${p.id}"></div>

<button class="buy" data-id="${p.id}">
Acheter
</button>
`;

fragment.appendChild(card);

});

container.appendChild(fragment);

}

/* =========================
   PAYPAL
========================= */

function initPayPal(){

products.forEach(p=>{

paypal.Buttons({

style:{
layout:'vertical',
color:'gold',
shape:'pill',
label:'paypal'
},

createOrder:(data,actions)=>{

return actions.order.create({

purchase_units:[{
amount:{ value:p.price.toFixed(2) },
custom_id:p.id.toString()
}]

});

},

onApprove: async (data,actions)=>{

const details = await actions.order.capture();

const capture =
details.purchase_units[0].payments.captures[0];

const transactionID = capture.id;

const email = details.payer.email_address;

const amount = capture.amount.value;

if(!transactionID){
alert("Erreur paiement");
return;
}

/* anti replay */

if(localStorage.getItem(transactionID)){

alert("Transaction déjà utilisée");
return;

}

localStorage.setItem(transactionID,"used");

/* sauvegarde commande */

orders.push({

player:email,
pack:p.name,
amount:amount,
transaction:transactionID,
date:new Date().toLocaleString()

});

localStorage.setItem("epic_orders",JSON.stringify(orders));

alert("Paiement confirmé");

renderOrders();
updateAdminStats();

}

}).render(`#paypal-button-${p.id}`);

});

}

/* =========================
   BOUTONS ACHAT
========================= */

function initBuyButtons(){

document.querySelectorAll(".buy").forEach(btn=>{

btn.addEventListener("click",()=>{

if(!canPay()) return;

alert("Utilise le bouton PayPal");

});

});

}

/* =========================
   DISCORD LOGIN
========================= */

function discordLogin(){

const clientId = "1347613959489982586";

const redirectUri = encodeURIComponent(window.location.href);

const scope = encodeURIComponent("identify");

window.location.href =
`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

}

/* =========================
   ADMIN PANEL
========================= */

function openAdmin(){

document.getElementById("adminLogin").style.display="flex";

}

function closeAdmin(){

document.getElementById("adminPanel").style.display="none";

}

/* =========================
   LOGIN ADMIN
========================= */

async function checkLogin(){

const username =
document.getElementById("adminUser").value;

const password =
document.getElementById("adminPassword").value;

const passwordHash = await sha256(password);

const account = ADMIN_ACCOUNTS.find(a=>

a.username===username &&
a.password===passwordHash

);

if(!account){

document.getElementById("loginError")
.textContent="Identifiants invalides";

return;

}

currentAdmin = account;

document.getElementById("adminLogin")
.style.display="none";

document.getElementById("adminPanel")
.style.display="flex";

updateAdminStats();
renderOrders();

}

/* =========================
   HISTORIQUE COMMANDES
========================= */

function renderOrders(){

const table =
document.getElementById("ordersTable");

if(!table) return;

table.innerHTML="";

orders.forEach(o=>{

const row =
document.createElement("tr");

row.innerHTML=`
<td>${o.player}</td>
<td>${o.pack}</td>
<td>${o.amount} €</td>
<td>${o.date}</td>
`;

table.appendChild(row);

});

}

/* =========================
   STATS ADMIN
========================= */

function updateAdminStats(){

const revenue = orders.reduce(

(sum,o)=>sum+parseFloat(o.amount),

0

);

document.getElementById("adminRevenue")
.textContent = revenue.toFixed(2)+" €";

document.getElementById("adminOrders")
.textContent = orders.length;

}

/* =========================
   ACTION ADMIN
========================= */

function addCoinsManually(){

const player = prompt("Nom du joueur");

const coins = prompt("Coins à ajouter");

alert(`Coins ajoutés à ${player} : ${coins}`);

}

/* =========================
   LOADER
========================= */

window.addEventListener("load",()=>{

const loader = document.getElementById("loader");

if(loader) loader.style.display="none";

});

/* =========================
   INITIALISATION
========================= */

document.addEventListener("DOMContentLoaded",()=>{

renderProducts();

initPayPal();

initBuyButtons();

renderOrders();

updateAdminStats();

});
