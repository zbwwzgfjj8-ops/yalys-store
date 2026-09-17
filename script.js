const products = [
  { id: 1, name: "T-shirt graphique Yalys", category: "Vêtements", price: 24.99, cost: 5.97, icon: "👕", tag: "Tendance", sizes: "S · M · L · XL", description: "T-shirt graphique au style streetwear, facile à porter avec un jean ou un pantalon cargo." },
  { id: 2, name: "Hoodie oversize Yalys", category: "Vêtements", price: 44.99, cost: 13.18, icon: "🧥", tag: "Best-seller", sizes: "S · M · L · XL", description: "Hoodie oversize confortable avec une coupe moderne pour un look décontracté." },
  { id: 3, name: "Pantalon cargo streetwear", category: "Vêtements", price: 39.99, cost: 7.79, icon: "👖", tag: "Streetwear", sizes: "S · M · L · XL", description: "Pantalon cargo avec poches pratiques et coupe streetwear polyvalente." },
  { id: 4, name: "Chemise coton-lin", category: "Vêtements", price: 34.99, cost: 11.28, icon: "👔", tag: "Nouveau", sizes: "S · M · L · XL", description: "Chemise légère au style propre et moderne, adaptée aux tenues décontractées ou habillées." },
  { id: 5, name: "Casquette streetwear", category: "Accessoires", price: 19.99, cost: 2.99, icon: "🧢", tag: "Tendance", sizes: "Taille réglable", description: "Casquette streetwear réglable pour compléter facilement une tenue Yalys." },
  { id: 6, name: "Ceinture boucle automatique", category: "Accessoires", price: 24.99, cost: 1.94, icon: "🪢", tag: "Petit prix", sizes: "Taille réglable", description: "Ceinture moderne à boucle automatique, pensée pour être simple à porter au quotidien." },
  { id: 7, name: "Écharpe légère Yalys", category: "Accessoires", price: 19.99, cost: 2.28, icon: "🧣", tag: "Nouveau", sizes: "Taille unique", description: "Écharpe légère et facile à associer avec différentes tenues." },
  { id: 8, name: "Bracelet perles élégant", category: "Accessoires", price: 14.99, cost: 0.80, icon: "📿", tag: "Tendance", sizes: "Taille ajustable", description: "Bracelet à perles au style discret pour apporter une petite touche à une tenue." },
  { id: 9, name: "Boucles d'oreilles élégantes", category: "Accessoires", price: 16.99, cost: 0.78, icon: "✨", tag: "Nouveau", sizes: "Taille unique", description: "Boucles d'oreilles au style élégant pour compléter une tenue de tous les jours." },
  { id: 10, name: "Chaussettes sport", category: "Accessoires", price: 12.99, cost: 1.05, icon: "🧦", tag: "Petit prix", sizes: "36–44", description: "Chaussettes sport confortables pour accompagner les tenues du quotidien." },
  { id: 11, name: "Lunettes tendance", category: "Accessoires", price: 17.99, cost: 3.50, icon: "🕶️", tag: "Tendance", sizes: "Taille unique", description: "Lunettes tendance à porter comme accessoire de style." },
  { id: 12, name: "Sac tendance", category: "Accessoires", price: 29.99, cost: 8.00, icon: "👜", tag: "Best-seller", sizes: "Taille unique", description: "Sac tendance pratique pour compléter une tenue et transporter les essentiels." }
];

let cart = JSON.parse(localStorage.getItem("yalysCart") || "[]");
let selectedProductId = null;
let activeCategory = "Tous";
let searchTerm = "";
let sortMode = "default";

const productsEl = document.getElementById("products");
const cartEl = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("productModal");
const checkoutModal = document.getElementById("checkoutModal");
const euro = value => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function getVisibleProducts() {
  let list = activeCategory === "Tous" ? [...products] : products.filter(p => p.category === activeCategory);
  if (searchTerm) list = list.filter(p => `${p.name} ${p.category} ${p.tag}`.toLowerCase().includes(searchTerm));
  if (sortMode === "priceAsc") list.sort((a, b) => a.price - b.price);
  if (sortMode === "priceDesc") list.sort((a, b) => b.price - a.price);
  if (sortMode === "name") list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return list;
}

function renderProducts() {
  const list = getVisibleProducts();
  document.getElementById("resultCount").textContent = `${list.length} produit${list.length > 1 ? "s" : ""}`;
  document.getElementById("noResults").hidden = list.length !== 0;
  productsEl.innerHTML = list.map(p => `
    <article class="product">
      <button class="product-image" data-details="${p.id}" aria-label="Voir ${p.name}"><span>${p.icon}</span><small>Voir le produit</small></button>
      <div class="product-info"><p class="product-category">${p.category} · ${p.tag}</p><h3>${p.name}</h3><div class="product-bottom"><span class="price">${euro(p.price)}</span><div class="product-actions"><button class="details" data-details="${p.id}">Détails</button><button class="add" data-id="${p.id}">Ajouter</button></div></div></div>
    </article>`).join("");
  document.querySelectorAll(".add").forEach(button => button.addEventListener("click", () => addToCart(Number(button.dataset.id))));
  document.querySelectorAll("[data-details]").forEach(button => button.addEventListener("click", () => openProduct(Number(button.dataset.details))));
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1; else cart.push({ ...product, quantity: 1 });
  saveCart();
  openCart();
}
function changeQuantity(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(p => p.id !== id);
  saveCart();
}
function removeFromCart(id) { cart = cart.filter(item => item.id !== id); saveCart(); }
function saveCart() { localStorage.setItem("yalysCart", JSON.stringify(cart)); renderCart(); }

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = euro(total);
  document.getElementById("cartItems").innerHTML = cart.length ? cart.map(item => `
    <div class="cart-item"><div class="cart-thumb">${item.icon}</div><div><h4>${item.name}</h4><small>${euro(item.price)} · quantité ${item.quantity}</small><div class="qty"><button data-minus="${item.id}" aria-label="Diminuer">−</button><strong>${item.quantity}</strong><button data-plus="${item.id}" aria-label="Augmenter">+</button></div></div><button class="remove" data-remove="${item.id}">Suppr.</button></div>`).join("") : '<p class="empty">Ton panier est vide.</p>';
  document.querySelectorAll("[data-minus]").forEach(b => b.addEventListener("click", () => changeQuantity(Number(b.dataset.minus), -1)));
  document.querySelectorAll("[data-plus]").forEach(b => b.addEventListener("click", () => changeQuantity(Number(b.dataset.plus), 1)));
  document.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => removeFromCart(Number(b.dataset.remove))));
}

function openCart() { cartEl.classList.add("open"); overlay.classList.add("open"); }
function closeCart() { cartEl.classList.remove("open"); overlay.classList.remove("open"); }

function openProduct(id) {
  const p = products.find(item => item.id === id); if (!p) return;
  selectedProductId = id;
  document.getElementById("modalIcon").textContent = p.icon;
  document.getElementById("modalCategory").textContent = `${p.category} · ${p.tag}`;
  document.getElementById("modalName").textContent = p.name;
  document.getElementById("modalDescription").textContent = p.description;
  document.getElementById("modalPrice").textContent = euro(p.price);
  document.getElementById("modalSizes").textContent = p.sizes;
  modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
}
function closeProduct() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); selectedProductId = null; }

function openCheckout() {
  if (!cart.length) return alert("Ton panier est vide.");
  document.getElementById("orderPreview").innerHTML = `<strong>Récapitulatif</strong>${cart.map(i => `<div>${i.quantity} × ${i.name} — ${euro(i.price * i.quantity)}</div>`).join("")}<hr><strong>Total : ${euro(cart.reduce((s, i) => s + i.price * i.quantity, 0))}</strong>`;
  checkoutModal.classList.add("open"); checkoutModal.setAttribute("aria-hidden", "false");
}
function closeCheckout() { checkoutModal.classList.remove("open"); checkoutModal.setAttribute("aria-hidden", "true"); }

function prepareOrder(form) {
  const data = new FormData(form);
  const orderNumber = `YALYS-${Date.now().toString().slice(-8)}`;
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const lines = cart.map(i => `${i.quantity} × ${i.name} — ${euro(i.price * i.quantity)}`).join("\n");
  const summary = `Commande ${orderNumber}\n\nClient : ${data.get("firstName")} ${data.get("lastName")}\nEmail : ${data.get("email")}\nAdresse : ${data.get("address")}, ${data.get("postalCode")} ${data.get("city")}\n\nProduits :\n${lines}\n\nTotal : ${euro(total)}`;
  localStorage.setItem("yalysLastOrder", summary);
  navigator.clipboard?.writeText(summary).catch(() => {});
  alert(`Commande ${orderNumber} préparée. Le récapitulatif a été copié si ton navigateur l'autorise. Aucun paiement n'a été encaissé.`);
  closeCheckout();
}

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("closeModal").addEventListener("click", closeProduct);
modal.addEventListener("click", e => { if (e.target === modal) closeProduct(); });
document.getElementById("modalAdd").addEventListener("click", () => { if (selectedProductId) { addToCart(selectedProductId); closeProduct(); } });
document.getElementById("checkoutButton").addEventListener("click", openCheckout);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);
checkoutModal.addEventListener("click", e => { if (e.target === checkoutModal) closeCheckout(); });
document.getElementById("checkoutForm").addEventListener("submit", e => { e.preventDefault(); prepareOrder(e.target); });

document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".filter").forEach(b => b.classList.remove("active")); button.classList.add("active"); activeCategory = button.dataset.category; renderProducts();
}));
document.getElementById("searchInput").addEventListener("input", e => { searchTerm = e.target.value.trim().toLowerCase(); renderProducts(); });
document.getElementById("sortSelect").addEventListener("change", e => { sortMode = e.target.value; renderProducts(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeProduct(); closeCheckout(); closeCart(); } });

renderProducts();
renderCart();