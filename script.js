const SUPABASE_URL = "https://tziawijeohkvuqshkavi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Nar6wT4O1pbqX4MueWxoGQ_L8btLudE";
const WHATSAPP_NUMBER = "2250706273262";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let allProducts = [];
let cart = {};

function formatPrice(value) {
  return Number(value).toLocaleString("fr-FR") + " FCFA";
}

function changeMainImage(productId, imageUrl) {
  const mainImg = document.getElementById(`main-img-${productId}`);
  if (mainImg) mainImg.src = imageUrl;
}

function getFilteredProducts() {
  const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
  const categoryValue = document.getElementById("categoryFilter").value;

  return allProducts.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchValue) ||
      (product.description || "").toLowerCase().includes(searchValue);

    const matchesCategory =
      categoryValue === "all" || product.category === categoryValue;

    return matchesSearch && matchesCategory;
  });
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
  if (cart[productId] <= 0) {
    delete cart[productId];
  }
  renderCart();
}

function renderProducts() {
  const container = document.getElementById("products");
  const filteredProducts = getFilteredProducts();

  if (!filteredProducts.length) {
    container.innerHTML = `<div class="product-card"><h3>Aucun produit trouvé</h3></div>`;
    return;
  }

  container.innerHTML = filteredProducts.map(product => {
    const images = [
      product.image_1,
      product.image_2,
      product.image_3,
      product.image_4,
      product.image_5
    ].filter(Boolean);

    const firstImage = images[0] || "https://via.placeholder.com/600x600?text=Produit";

    const thumbs = images.map(img => `
      <img src="${img}" class="thumb" onclick="changeMainImage(${product.id}, '${img}')" />
    `).join("");

    const qty = cart[product.id] || 0;

    return `
      <div class="product-card">
        <img id="main-img-${product.id}" class="main-image" src="${firstImage}" alt="${product.name}">
        <div class="thumbs">${thumbs}</div>
        <div class="category-badge">${product.category}</div>
        <h3>${product.name}</h3>
        <p class="price">Prix : ${formatPrice(product.price)}</p>
        <p>${product.description || ""}</p>

        ${
          qty > 0
            ? `
            <div class="qty-box product-qty">
              <button class="qty-btn" onclick="decreaseQty(${product.id})">-</button>
              <span>${qty}</span>
              <button class="qty-btn" onclick="increaseQty(${product.id})">+</button>
            </div>
            `
            : `
            <button class="btn" onclick="addToCart(${product.id})">Ajouter au panier</button>
            `
        }
      </div>
    `;
  }).join("");
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
    renderProducts();
    return;
  }

  let total = 0;
  let message = "Bonjour, je veux commander :\n\n";

  cartItems.innerHTML = productIds.map(id => {
    const product = allProducts.find(p => p.id === Number(id));
    const qty = cart[id];
    const subtotal = Number(product.price) * qty;
    total += subtotal;

    const productLink = `${window.location.origin}/product.html?id=${product.id}`;

    message += `- ${product.name} x${qty} = ${formatPrice(subtotal)}\n`;
    message += `  Lien : ${productLink}\n\n`;

    return `
      <div class="cart-item">
        <div class="cart-item-info">
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

  renderProducts();
}

async function loadProducts() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    document.getElementById("products").innerHTML = "Erreur : " + error.message;
    return;
  }

  allProducts = data || [];
  renderProducts();
  renderCart();
}

document.getElementById("searchInput").addEventListener("input", renderProducts);
document.getElementById("categoryFilter").addEventListener("change", renderProducts);

loadProducts();
