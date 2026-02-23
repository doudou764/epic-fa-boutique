/* ============================
   BASE DONNÉES LOCALE
============================ */

let orders = JSON.parse(localStorage.getItem("epic_orders")) || [];

/* ============================
   ANTI SPAM PAIEMENT
============================ */

const PAYMENT_COOLDOWN = 60000; // 60 secondes
let lastPaymentTime = localStorage.getItem("last_payment_time") || 0;

/* ============================
   STATS ADMIN
============================ */

function updateAdminStats() {

  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.amount), 0);
  const totalOrders = orders.length;

  const revenueEl = document.getElementById("adminRevenue");
  const ordersEl = document.getElementById("adminOrders");

  if (revenueEl) revenueEl.textContent = totalRevenue.toFixed(2) + " €";
  if (ordersEl) ordersEl.textContent = totalOrders;
}


/* ============================
   TABLE HISTORIQUE
============================ */

function renderOrders() {

  const table = document.getElementById("ordersTable");
  if (!table) return;

  table.innerHTML = "";

  orders.forEach(o => {
    const row = `
      <tr>
        <td>${o.player}</td>
        <td>${o.amount} €</td>
        <td>${o.date}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}


/* ============================
   LOGIN ADMIN SECURISE
============================ */

const ADMIN_PASSWORD = "06_EPIC2026"; // change ton mot de passe ici

function openAdmin() {
  document.getElementById("adminLogin").style.display = "flex";
}

function checkLogin() {

  const input = document.getElementById("adminPassword").value;

  if (input === ADMIN_PASSWORD) {

    document.getElementById("adminLogin").style.display = "none";
    document.getElementById("adminPanel").style.display = "flex";

    updateAdminStats();
    renderOrders();

  } else {
    document.getElementById("loginError").textContent = "Mot de passe incorrect";
  }

}

function closeAdmin() {
  document.getElementById("adminPanel").style.display = "none";
}


/* ============================
   PAYPAL PACKS
============================ */

const packs = [
  { id: "paypal-button-500", price: "3.99" },
  { id: "paypal-button-1500", price: "9.99" },
  { id: "paypal-button-3000", price: "17.99" },
  { id: "paypal-button-4000", price: "24.99" },
];

packs.forEach(pack => {

  paypal.Buttons({

    createOrder: (data, actions) => {

  const now = Date.now();

  if (now - lastPaymentTime < PAYMENT_COOLDOWN) {
    alert("Paiement trop rapide. Attends 1 minute.");
    return;
  }

  localStorage.setItem("last_payment_time", now);
  lastPaymentTime = now;

  return actions.order.create({
    purchase_units: [{
      amount: { value: pack.price },
      description: `Pack ${pack.price}€ EPIC RP`
    }]
  });

},

    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {

        const player = details.payer.name.given_name;
        const amount = pack.price;

        alert("Paiement réussi ! Merci " + player);

        const order = {
          player: player,
          amount: amount,
          date: new Date().toLocaleString()
        };

        orders.push(order);
        localStorage.setItem("epic_orders", JSON.stringify(orders));

        updateAdminStats();
        renderOrders();

      });
    },

    onError: err => {
      console.error(err);
      alert("Erreur de paiement");
    }

  }).render(`#${pack.id}`);

});


/* ============================
   LOADER
============================ */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});


