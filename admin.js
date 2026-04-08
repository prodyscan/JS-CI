const SUPABASE_URL = "https://tziawijeohkvuqshkavi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Nar6wT4O1pbqX4MueWxoGQ_L8btLudE";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let editingProductId = null;

async function uploadImage(file) {
  if (!file) return "";

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabaseClient.storage
    .from("product-images")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabaseClient.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

async function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value) || 0;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();

  const file1 = document.getElementById("image1").files[0];
  const file2 = document.getElementById("image2").files[0];
  const file3 = document.getElementById("image3").files[0];
  const file4 = document.getElementById("image4").files[0];
  const file5 = document.getElementById("image5").files[0];

  const result = document.getElementById("result");
  result.innerHTML = "Envoi en cours...";

  if (!name || !price || !category) {
    result.innerHTML = "Remplis le nom, le prix et la catégorie.";
    return;
  }

  try {
    let payload = {
      name,
      price,
      category,
      description
    };

    if (file1) payload.image_1 = await uploadImage(file1);
    if (file2) payload.image_2 = await uploadImage(file2);
    if (file3) payload.image_3 = await uploadImage(file3);
    if (file4) payload.image_4 = await uploadImage(file4);
    if (file5) payload.image_5 = await uploadImage(file5);

    let error;

    if (editingProductId) {
      ({ error } = await supabaseClient
        .from("products")
        .update(payload)
        .eq("id", editingProductId));
    } else {
      ({ error } = await supabaseClient
        .from("products")
        .insert(payload));
    }

    if (error) {
      result.innerHTML = "Erreur : " + error.message;
      return;
    }

    result.innerHTML = editingProductId
      ? "Produit modifié avec succès ✅"
      : "Produit ajouté avec succès ✅";

    clearForm();
    loadProducts();
  } catch (e) {
    result.innerHTML = "Erreur upload : " + e.message;
  }
}

function clearForm() {
  editingProductId = null;
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("description").value = "";
  document.getElementById("image1").value = "";
  document.getElementById("image2").value = "";
  document.getElementById("image3").value = "";
  document.getElementById("image4").value = "";
  document.getElementById("image5").value = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("saveBtn").textContent = "Ajouter le produit";
}

async function editProduct(id) {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    alert("Erreur chargement produit.");
    return;
  }

  editingProductId = id;
  document.getElementById("name").value = data.name || "";
  document.getElementById("price").value = data.price || "";
  document.getElementById("category").value = data.category || "";
  document.getElementById("description").value = data.description || "";
  document.getElementById("saveBtn").textContent = "Mettre à jour le produit";
  window.scrollTo({ top: 0, behavior: "smooth" });
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
      Catégorie : ${p.category}<br><br>
      <button onclick="editProduct(${p.id})">Modifier</button>
      <button onclick="deleteProduct(${p.id})">Supprimer</button>
    </div>
  `).join("");
}

loadProducts();
