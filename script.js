/* ===================== BASE ===================== */
let orders = JSON.parse(localStorage.getItem("epic_orders")) || [];

/* ===================== HASH ===================== */
async function sha256(msg){
    const buf = new TextEncoder().encode(msg);
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

/* ===================== ADMIN ===================== */
const ADMIN_ACCOUNTS = [
    {username:"015_fonda", password:"014_FONDA", role:"superadmin"},
    {username:"06_staff", password:"05_STAFF", role:"admin"}
];
let currentAdmin = null;

/* ===================== COOLDOWN ===================== */
let paymentCooldown=false;
function canPay(){
    if(paymentCooldown){alert("Attends quelques secondes."); return false;}
    paymentCooldown=true;
    setTimeout(()=>{paymentCooldown=false;},10000);
    return true;
}

// ================= PRODUITS COMPLETS =================
const products = [
  {id:1,name:"Starter Pack",coins:500,role:"Supporter",price:2, category:"Pack"},
  {id:2,name:"Bronze Pack",coins:1000,role:"Donateur",price:5, category:"Pack"},
  {id:3,name:"Argent Pack",coins:2000,role:"Donateur+",price:9.99, category:"Pack"},
  {id:4,name:"Or Pack",coins:3000,role:"Premium",price:18.99, category:"Pack"},
  {id:5,name:"VIP Pack",coins:5000,role:"VIP",price:29.99, subscription: true, category:"VIP"},
  {id:6,name:"VIP+ Pack",coins:6000,role:"VIP+",price:39.99, subscription: true, category:"VIP"},
  {id:7,name:"Elite Pack",coins:8000,role:"Elite",price:49.99, category:"Pack"},
  {id:8,name:"Diamond Pack",coins:10000,role:"Diamond",price:59.99, category:"Pack"},
  {id:9,name:"Mythic Pack",coins:12000,role:"Mythic",price:69.99, category:"Pack"},
  {id:10,name:"Titan Pack",coins:15000,role:"Titan",price:79.99, category:"Pack"},

  {id:11,name:"Coins 500",coins:500,role:"Supporter",price:3.99, category:"Coins"},
  {id:12,name:"Coins 1000",coins:1000,role:"Donateur",price:7.99, category:"Coins"},
  {id:13,name:"Coins 1500",coins:1500,role:"Donateur+",price:9.99, category:"Coins"},
  {id:14,name:"Coins 2000",coins:2000,role:"Premium",price:12.99, category:"Coins"},
  {id:15,name:"Coins 3000",coins:3000,role:"Premium",price:18.99, category:"Coins"},
  {id:18,name:"Coins 7500",coins:7500,role:"Elite",price:44.99, category:"Coins"},
  {id:19,name:"Coins 10000",coins:10000,role:"Diamond",price:59.99, category:"Coins"},

  {id:20,name:"Grade Supporter",coins:500,role:"Supporter",price:4.99, category:"Grade"},
  {id:21,name:"Grade Donateur",coins:1000,role:"Donateur",price:9.99, category:"Grade"},
  {id:22,name:"Grade Donateur+",coins:1500,role:"Donateur+",price:14.99, category:"Grade"},
  {id:23,name:"Grade Premium",coins:2500,role:"Premium",price:19.99, category:"Grade"},
  {id:26,name:"Grade Elite",coins:8000,role:"Elite",price:49.99, category:"Grade"},
  {id:27,name:"Grade Elite+",coins:10000,role:"Elite+",price:59.99, category:"Grade"},
  {id:28,name:"Grade Diamond",coins:12000,role:"Diamond",price:69.99, category:"Grade"},
  {id:29,name:"Grade Diamond+",coins:15000,role:"Diamond+",price:79.99, category:"Grade"},
  {id:30,name:"Grade Mythic",coins:18000,role:"Mythic",price:89.99, category:"Grade"},
  {id:31,name:"Grade Mythic+",coins:20000,role:"Mythic+",price:99.99, category:"Grade"},
  {id:32,name:"Grade Titan",coins:22000,role:"Titan",price:109.99, category:"Grade"},
  {id:33,name:"Grade Titan+",coins:25000,role:"Titan+",price:119.99, category:"Grade"},
  {id:34,name:"Grade Empire",coins:28000,role:"Empire",price:129.99, category:"Grade"},
  {id:35,name:"Grade Empire+",coins:30000,role:"Empire+",price:139.99, category:"Grade"},
  {id:36,name:"Grade Légende",coins:35000,role:"Légende",price:149.99, category:"Grade"},
  {id:37,name:"Grade Légende+",coins:40000,role:"Légende+",price:159.99, category:"Grade"},

  {id:38,name:"Pack Event Bronze",coins:500,role:"Supporter",price:4.99, category:"Pack"},
  {id:39,name:"Pack Event Silver",coins:1000,role:"Donateur",price:9.99, category:"Pack"},
  {id:40,name:"Pack Event Gold",coins:2500,role:"Premium",price:19.99, category:"Pack"},
  {id:41,name:"Pack Event Diamond",coins:6000,role:"Diamond",price:39.99, category:"Pack"},
  {id:42,name:"Ticket tournoi",coins:0,role:"Donateur",price:14.99, category:"Pack"},

  {id:43,name:"Soutien 2€",coins:100,role:"Supporter",price:2, category:"Soutien"},
  {id:44,name:"Soutien 5€",coins:300,role:"Donateur",price:5, category:"Soutien"},
  {id:45,name:"Soutien 10€",coins:800,role:"Premium",price:10, category:"Soutien"},
  {id:46,name:"Soutien 25€",coins:2000,role:"VIP",price:25, category:"Soutien"},
  {id:47,name:"Soutien 50€",coins:5000,role:"Légende",price:50, category:"Soutien"},
  {id:48,name:"Soutien 100€",coins:7000,role:"Légende+",price:100, category:"Soutien"},
  {id:49,name:"Soutien 150€",coins:9500,role:"Légende+ / Don 150€",price:150, category:"Soutien"},
  {id:50,name:"Soutien 200€",coins:12000,role:"Légende+ / Don 200€",price:200, category:"Soutien"},

  {id:51,name:"Unban",coins:0,role:"Unban",price:15, category:"Unban"},

  {id:52,name:"Modérateur",coins:5000,role:"Modérateur",price:40, category:"Main Team"},
  {id:53,name:"Administrateur",coins:10000,role:"Administrateur",price:80, category:"Main Team"},
  {id:54,name:"Owner",coins:15000,role:"Owner",price:150, category:"Main Team"},

  {id:55,name:"Achat serveur",coins:0,role:"Propriétaire",price:10000}
];


/* ===================== AFFICHAGE PACKS ===================== */
const container=document.getElementById("packs");
function renderPacks(){
    container.innerHTML="";
    products.forEach(p=>{
        const div=document.createElement("div");
        div.className="card product";
        div.innerHTML=`
            <h2>${p.name}</h2>
            <p>${p.coins} Coins + Rôle ${p.role}</p>
            <p class="price">${p.price.toFixed(2)} €</p>
            <div id="paypal-button-${p.id}"></div>
            <button class="buy-btn" data-id="${p.id}">Acheter</button>
        `;
        container.appendChild(div);

        // PayPal : abonnement VIP / achat classique
if(p.subscription){
    // Bouton pour abonnement mensuel
    paypal.Buttons({
        style:{layout:'vertical',color:'blue',shape:'pill',label:'subscribe'},
        createSubscription:(data,actions)=>{
            return actions.subscription.create({
                plan_id: p.id === 5 ? "P-7M816397WK677023ENGWV45I" : "P-2XN14669TF811411ENGWV7SY" // Remplace par tes Plan IDs PayPal
            });
        },
        onApprove:(data,actions)=>{
            alert(`Abonnement ${p.name} activé ! Les coins et le rôle seront attribués chaque mois par un admin.`);
            // Ici tu peux stocker data.subscriptionID pour suivi
        }
    }).render(`#paypal-button-${p.id}`);
}else{
    // Bouton classique pour les autres packs
    paypal.Buttons({
        style:{layout:'vertical',color:'gold',shape:'pill',label:'paypal'},
        createOrder:(data,actions)=>actions.order.create({
            purchase_units:[{amount:{value:p.price.toFixed(2)},description:`${p.name} EPIC RP`}]
        }),
        onApprove:(data,actions)=>actions.order.capture().then(details=>{
            alert(`Paiement confirmé pour ${p.name} ! Coins ajoutés manuellement par admin.`);
            orders.push({
                player:details.payer.name.given_name || details.payer.email_address,
                pack:p.name,
                amount:p.price,
                date:new Date().toLocaleString()
            });
            localStorage.setItem("epic_orders",JSON.stringify(orders));
            renderOrders();
            updateAdminStats();
        })
    }).render(`#paypal-button-${p.id}`);
}

        div.querySelector(".buy-btn").addEventListener("click",()=>{
            if(!canPay()) return;
            alert("Utilise le bouton PayPal pour confirmer ton achat !");
        });
    });
}
renderPacks(); // <-- ici, les produits sont déjà affichés

/* ===================== FILTRES BOUTIQUE ===================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        productCards.forEach(card => {
            if (card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

/* ===================== ADMIN ===================== */
function openAdmin(){document.getElementById("adminLogin").style.display="flex";}
function closeAdmin(){document.getElementById("adminPanel").style.display="none";}
async function checkLogin(){
    const username=document.getElementById("adminUser").value;
    const password=document.getElementById("adminPassword").value;
    const hash=await sha256(password);
    const account=ADMIN_ACCOUNTS.find(a=>a.username===username && a.password===hash);
    if(!account){document.getElementById("loginError").textContent="Identifiants invalides"; return;}
    currentAdmin=account;
    document.getElementById("adminLogin").style.display="none";
    document.getElementById("adminPanel").style.display="flex";
    renderOrders();
    updateAdminStats();
}
function addCoinsManually(){
    const player=prompt("Nom du joueur:");
    const coins=prompt("Nombre de coins à ajouter:");
    alert(`Coins ajoutés à ${player}: ${coins}`);
}

/* ===================== HISTORIQUE ===================== */
function renderOrders(){
    const table=document.getElementById("ordersTable");
    if(!table) return;
    table.innerHTML="";
    orders.forEach(o=>{
        const row=document.createElement("tr");
        row.innerHTML=`<td>${o.player}</td><td>${o.pack}</td><td>${o.amount} €</td><td>${o.date}</td>`;
        table.appendChild(row);
    });
}
function updateAdminStats(){
    const totalRevenue=orders.reduce((sum,o)=>sum+parseFloat(o.amount),0);
    document.getElementById("adminRevenue").textContent=totalRevenue.toFixed(2)+" €";
    document.getElementById("adminOrders").textContent=orders.length;
}

/* ===================== LOADER ===================== */
window.addEventListener("load",()=>document.getElementById("loader").style.display="none");

/* ===================== SCROLL PACKS ===================== */
function scrollToPacks(){document.getElementById("packs").scrollIntoView({behavior:"smooth"});}










