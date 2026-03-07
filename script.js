/* =========================
   BASE DONNEES LOCALE
========================= */
let orders = JSON.parse(localStorage.getItem("epic_orders")) || [];

/* =========================
   ADMIN ACCOUNTS
========================= */
const ADMIN_ACCOUNTS = [
  { username: "015_fonda", password: "014_FONDA2026", role: "superadmin" },
  { username: "06_staff", password: "05_STAFF2026", role: "admin" }
];
let currentAdmin = null;

/* =========================
   PRODUITS
========================= */
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
  {id:10,name:"Titan Pack",coins:15000,role:"Titan",price:79.99}
];

/* =========================
   AFFICHAGE DYNAMIQUE
========================= */
const container = document.querySelector('.packs');
products.forEach(p => {
  const div = document.createElement('div');
  div.classList.add('card','product');
  div.innerHTML = `
    <h2>${p.name}</h2>
    <p>${p.coins} Coins + Rôle ${p.role}</p>
    <p class="price">${p.price.toFixed(2)} €</p>
    <div id="paypal-button-${p.id}"></div>
    <p style="font-size:0.8rem;color:#0ff;">Après paiement, les coins seront ajoutés manuellement par un admin.</p>
  `;
  container.appendChild(div);

  // PayPal Button
  paypal.Buttons({
    style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'paypal' },
    createOrder: (data, actions) => actions.order.create({
      purchase_units: [{ amount: { value: p.price.toFixed(2) }, description:`${p.name} EPIC FA` }]
    }),
    onApprove: (data, actions) => actions.order.capture().then(details => {
      alert(`Paiement réussi pour ${p.name} !\nUn admin ajoutera les coins manuellement.`);
      // Ajouter à l'historique local
      orders.push({
        player: details.payer.name.given_name || details.payer.email_address,
        pack: p.name,
        amount: p.price,
        date: new Date().toLocaleString()
      });
      localStorage.setItem("epic_orders",JSON.stringify(orders));
      renderOrders();
      updateAdminStats();
    })
  }).render(`#paypal-button-${p.id}`);
});

/* =========================
   ADMIN PANEL
========================= */
function openAdmin(){ document.getElementById("adminLogin").style.display="flex"; }
function closeAdmin(){ document.getElementById("adminPanel").style.display="none"; }

function checkLogin(){
  const username = document.getElementById("adminUser").value;
  const password = document.getElementById("adminPassword").value;
  const account = ADMIN_ACCOUNTS.find(a=>a.username===username && a.password===password);
  if(!account){ document.getElementById("loginError").textContent="Identifiants invalides"; return; }
  currentAdmin = account;
  document.getElementById("adminLogin").style.display="none";
  document.getElementById("adminPanel").style.display="flex";
  updateAdminStats(); renderOrders();
}

/* =========================
   HISTORIQUE & STATS
========================= */
function renderOrders(){
  const table = document.getElementById("ordersTable");
  if(!table) return;
  table.innerHTML="";
  orders.forEach(o=>{
    const row = document.createElement("tr");
    row.innerHTML=`<td>${o.player}</td><td>${o.pack}</td><td>${o.amount} €</td><td>${o.date}</td>`;
    table.appendChild(row);
  });
}

function updateAdminStats(){
  const totalRevenue = orders.reduce((sum,o)=>sum+parseFloat(o.amount),0);
  document.getElementById("adminRevenue").textContent=totalRevenue.toFixed(2)+" €";
  document.getElementById("adminOrders").textContent=orders.length;
}

function addCoinsManually(){
  const player = prompt("Nom du joueur:");
  const coins = prompt("Nombre de coins à ajouter:");
  alert(`Coins ajoutés à ${player}: ${coins}`);
}

/* =========================
   Loader
========================= */
window.addEventListener("load",()=>document.getElementById("loader").style.display="none");
renderOrders(); updateAdminStats();
