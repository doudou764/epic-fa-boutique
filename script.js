/* ============================
   BASE DONNÉES LOCALE
============================ */

let orders = JSON.parse(localStorage.getItem("epic_orders")) || [];


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
   ADMIN PANEL OPEN / CLOSE
============================ */

function openAdmin() {
  document.getElementById("adminPanel").style.display = "flex";
  updateAdminStats();
  renderOrders();
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

        /* ============================
           ENREGISTRER COMMANDE
        ============================ */

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
