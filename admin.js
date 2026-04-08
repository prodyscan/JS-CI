const SUPABASE_URL = "https://tziawijeohkvuqshkavi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Nar6wT4O1pbqX4MueWxoGQ_L8btLudE";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value) || 0;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();

  const image_1 = document.getElementById("image1").value.trim();
  const image_2 = document.getElementById("image2").value.trim();
  const image_3 = document.getElementById("image3").value.trim();
  const image_4 = document.getElementById("image4").value.trim();
  const image_5 = document.getElementById("image5").value.trim();

  const result = document.getElementById("result");
  result.innerHTML = "";

  if (!name || !price || !category) {
    result.innerHTML = "Remplis au moins le nom, le prix et la catégorie.";
    return;
  }

  const { error } = await supabaseClient
    .from("products")
    .insert({
      name,
      price,
      category,
      description,
      image_1,
      image_2,
      image_3,
      image_4,
      image_5
    });

  if (error) {
    result.innerHTML = "Erreur : " + error.message;
    return;
  }

  result.innerHTML = "Produit ajouté avec succès ✅";

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("description").value = "";
  document.getElementById("image1").value = "";
  document.getElementById("image2").value = "";
  document.getElementById("image3").value = "";
  document.getElementById("image4").value = "";
  document.getElementById("image5").value = "";

  loadProducts();
}

async function deleteProduct(id) {
  const { error } = await supabaseClient
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Erreur suppression : " + error.message);
    return;
  }

  loadProducts();
}

async function loadProducts() {
  const productList = document.getElementById("productList");

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    productList.innerHTML = "Erreur : " + error.message;
    return;
  }

  if (!data.length) {
    productList.innerHTML = "Aucun produit.";
    return;
  }

  productList.innerHTML = data.map(p => `
    <div class="admin-product">
      <strong>${p.name}</strong><br>
      Prix : ${Number(p.price).toLocaleString("fr-FR")} FCFA<br>
      Catégorie : ${p.category}<br>
      <button onclick="deleteProduct(${p.id})">Supprimer</button>
    </div>
  `).join("");
}

loadProducts();
