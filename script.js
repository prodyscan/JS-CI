const SUPABASE_URL = "https://tziawijeohkvuqshkavi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Nar6wT4O1pbqX4MueWxoGQ_L8btLudE";
const WHATSAPP_NUMBER = "2250706273262";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let allProducts = [];

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
    const matchesSearch = product.name.toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === "all" || product.category === categoryValue;
    return matchesSearch && matchesCategory;
  });
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

    const message = `Bonjour, je veux commander : ${product.name}`;
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    return `
      <div class="product-card">
        <img id="main-img-${product.id}" class="main-image" src="${firstImage}" alt="${product.name}">
        <div class="thumbs">${thumbs}</div>
        <div class="category-badge">${product.category}</div>
        <h3>${product.name}</h3>
        <p class="price">Prix : ${formatPrice(product.price)}</p>
        <p>${product.description || ""}</p>
        <a class="btn" href="${waLink}" target="_blank">Commander</a>
      </div>
    `;
  }).join("");
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

  allProducts = data;
  renderProducts();
}

document.getElementById("searchInput").addEventListener("input", renderProducts);
document.getElementById("categoryFilter").addEventListener("change", renderProducts);

loadProducts();
