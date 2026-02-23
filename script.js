const packs = [
  { id: "paypal-button-500", price: "3.99" },
  { id: "paypal-button-1500", price: "9.99" },
  { id: "paypal-button-3000", price: "18.99" },
  { id: "paypal-button-4000", price: "27.99" }
   { id: "paypal-button-test", price: "0,30" }
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
        alert("Paiement réussi ! Merci " + details.payer.name.given_name);
      });
    },

    onError: err => {
      console.error(err);
      alert("Erreur de paiement");
    }

  }).render(`#${pack.id}`);
});


// enlever le loader quand la page est chargée
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});

