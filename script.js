const WHATSAPP_NUMBER = "2250706273262";

const products = [
  {
    id: 1,
    name: "Sac tendance",
    price: 15000,
    images: [
      "https://via.placeholder.com/600x600?text=Sac+1",
      "https://via.placeholder.com/600x600?text=Sac+2",
      "https://via.placeholder.com/600x600?text=Sac+3",
      "https://via.placeholder.com/600x600?text=Sac+4",
      "https://via.placeholder.com/600x600?text=Sac+5"
    ]
  },
  {
    id: 2,
    name: "Chaussure stylée",
    price: 20000,
    images: [
      "https://via.placeholder.com/600x600?text=Chaussure+1",
      "https://via.placeholder.com/600x600?text=Chaussure+2",
      "https://via.placeholder.com/600x600?text=Chaussure+3",
      "https://via.placeholder.com/600x600?text=Chaussure+4",
      "https://via.placeholder.com/600x600?text=Chaussure+5"
    ]
  }
];

const cart = {};

function formatPrice(value) {
  return value.toLocaleString("fr-FR") + " FCFA";
}

function changeMainImage(productId, imageUrl) {
  const mainImg = document.getElementById(`main-img-${productId}`);
  if (mainImg) mainImg.src = imageUrl;
}

function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  renderCart();
}

function increaseQty(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  renderCart();
}

function decreaseQty(productId) {
  if (!cart[productId]) return;
  cart[productId] -= 1;
  if (cart[productId] <= 0) delete cart[productId];
  renderCart();
}

function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach((product) => {
    const thumbs = product.images.map((img) => `
      <img src="${img}" class="thumb" onclick="changeMainImage(${product.id}, '${img}')" />
    `).join("");

    container.innerHTML += `
      <div class="product-card">
        <img id="main-img-${product.id}" class="main-image" src="${product.images[0]}" alt="${product.name}">
        <div class="thumbs">${thumbs}</div>
        <h3>${product.name}</h3>
        <p class="price">Prix : ${formatPrice(product.price)}</p>
        <button class="btn" onclick="addToCart(${product.id})">Ajouter au panier</button>
      </div>
    `;
  });
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const orderBtn = document.getElementById("orderBtn");

  const productIds = Object.keys(cart);

  if (!productIds.length) {
    cartItems.innerHTML = "Votre panier est vide.";
    cartTotal.textContent = "Total : 0 FCFA";
    orderBtn.removeAttribute("href");
    orderBtn.classList.add("disabled");
    return;
  }

  let total = 0;
  let message = "Bonjour, je veux commander :\n\n";

  cartItems.innerHTML = productIds.map((id) => {
    const product = products.find((p) => p.id === Number(id));
    const qty = cart[id];
    const subtotal = product.price * qty;
    total += subtotal;
    message += `- ${product.name} x${qty} = ${formatPrice(subtotal)}\n`;

    return `
      <div class="cart-item">
        <div>
          <strong>${product.name}</strong><br>
          <span>${formatPrice(product.price)}</span>
        </div>
        <div class="qty-box">
          <button class="qty-btn" onclick="decreaseQty(${product.id})">-</button>
          <span>${qty}</span>
          <button class="qty-btn" onclick="increaseQty(${product.id})">+</button>
        </div>
      </div>
    `;
  }).join("");

  cartTotal.textContent = `Total : ${formatPrice(total)}`;
  message += `\nTotal : ${formatPrice(total)}`;

  orderBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  orderBtn.classList.remove("disabled");
}

renderProducts();
renderCart();
