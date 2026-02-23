/* ============================
   BASE DONNÉES LOCALE
============================ */

let orders = JSON.parse(localStorage.getItem("epic_orders")) || [];


/* ============================
   ANTI SPAM PAIEMENT
============================ */

const PAYMENT_COOLDOWN = 60000; // 60 sec
let lastPaymentTime = parseInt(localStorage.getItem("last_payment_time")) || 0;


/* ============================
   STATS ADMIN
============================ */

function updateAdminStats() {

  const totalRevenue = orders.reduce((sum, o) => {
    const value = parseFloat(o.amount);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

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

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${o.player}</td>
      <td>${o.amount} €</td>
      <td>${o.date}</td>
    `;

    table.appendChild(row);
  });
}


/* ============================
   LOGIN ADMIN SECURISE
============================ */

const ADMIN_PASSWORD = "06_EPIC2026";

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

    /* ============================
       CREATION COMMANDE
    ============================= */
    createOrder: (data, actions) => {

      const now = Date.now();

      if (now - lastPaymentTime < PAYMENT_COOLDOWN) {
        alert("Paiement trop rapide. Attends 1 minute.");
        return Promise.reject("Cooldown actif");
      }

      lastPaymentTime = now;
      localStorage.setItem("last_payment_time", now);

      return actions.order.create({
        purchase_units: [{
          amount: { value: pack.price },
          description: `Pack ${pack.price}€ EPIC RP`
        }]
      });
    },


    /* ============================
       PAIEMENT VALIDE
    ============================= */
    onApprove: (data, actions) => {

      return actions.order.capture().then(details => {

        const player =
          details?.payer?.name?.given_name ||
          details?.payer?.email_address ||
          "Joueur";

        const order = {
          player: player,
          amount: pack.price,
          date: new Date().toLocaleString()
        };

        orders.push(order);
        localStorage.setItem("epic_orders", JSON.stringify(orders));

        alert("Paiement réussi ! Merci " + player);

        updateAdminStats();
        renderOrders();
      });
    },


    /* ============================
       ERREUR PAYPAL
    ============================= */
    onError: err => {
      console.error("PayPal Error:", err);
      alert("Erreur de paiement. Réessaie.");
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
