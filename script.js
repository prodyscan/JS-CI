const products = [
  {
    name: "Sac tendance",
    price: "15 000 FCFA",
    image: "https://via.placeholder.com/300",
  },
  {
    name: "Chaussure stylée",
    price: "20 000 FCFA",
    image: "https://via.placeholder.com/300",
  }
];

const container = document.getElementById("products");

products.forEach(p => {
  const message = `Bonjour, je veux commander : ${p.name}`;
  const waLink = `https://wa.me/2250700000000?text=${encodeURIComponent(message)}`;

  container.innerHTML += `
    <div class="product">
      <img src="${p.image}" />
      <h3>${p.name}</h3>
      <p>Prix : ${p.price}</p>
      <a class="btn" href="${waLink}" target="_blank">Commander</a>
    </div>
  `;
});
