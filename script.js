const products = [
  { id: 1, name: "T-shirt graphique Yalys", category: "Vêtements", price: 24.99, cost: 5.97, icon: "👕", tag: "Tendance" },
  { id: 2, name: "Hoodie oversize Yalys", category: "Vêtements", price: 44.99, cost: 13.18, icon: "🧥", tag: "Best-seller" },
  { id: 3, name: "Pantalon cargo streetwear", category: "Vêtements", price: 39.99, cost: 7.79, icon: "👖", tag: "Streetwear" },
  { id: 4, name: "Chemise coton-lin", category: "Vêtements", price: 34.99, cost: 11.28, icon: "👔", tag: "Nouveau" },
  { id: 5, name: "Casquette streetwear", category: "Accessoires", price: 19.99, cost: 2.99, icon: "🧢", tag: "Tendance" },
  { id: 6, name: "Ceinture boucle automatique", category: "Accessoires", price: 24.99, cost: 1.94, icon: "🪢", tag: "Petit prix" },
  { id: 7, name: "Écharpe légère Yalys", category: "Accessoires", price: 19.99, cost: 2.28, icon: "🧣", tag: "Nouveau" },
  { id: 8, name: "Bracelet perles élégant", category: "Accessoires", price: 14.99, cost: 0.80, icon: "📿", tag: "Tendance" },
  { id: 9, name: "Boucles d'oreilles élégantes", category: "Accessoires", price: 16.99, cost: 0.78, icon: "✨", tag: "Nouveau" },
  { id: 10, name: "Chaussettes sport", category: "Accessoires", price: 12.99, cost: 1.05, icon: "🧦", tag: "Petit prix" },
  { id: 11, name: "Lunettes tendance", category: "Accessoires", price: 17.99, cost: 3.50, icon: "🕶️", tag: "Tendance" },
  { id: 12, name: "Sac tendance", category: "Accessoires", price: 29.99, cost: 8.00, icon: "👜", tag: "Best-seller" }
];

let cart = JSON.parse(localStorage.getItem("yalysCart") || "[]");
const productsEl = document.getElementById("products");
const cartEl = document.getElementById("cart");
const overlay = document.getElementById("overlay");

const euro = value => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function renderProducts(category = "Tous") {
  const list = category === "Tous" ? products : products.filter(p => p.category === category);
  productsEl.innerHTML = list.map(p => `
    <article class="product">
      <div class="product-image" aria-hidden="true">${p.icon}</div>
      <div class="product-info">
        <p class="product-category">${p.category} · ${p.tag}</p>
        <h3>${p.name}</h3>
        <div class="product-bottom">
          <span class="price">${euro(p.price)}</span>
          <button class="add" data-id="${p.id}">Ajouter</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".add").forEach(button => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.id)));
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function saveCart() {
  localStorage.setItem("yalysCart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = euro(total);

  document.getElementById("cartItems").innerHTML = cart.length ? cart.map(item => `
    <div class="cart-item">
      <div class="cart-thumb">${item.icon}</div>
      <div><h4>${item.name}</h4><small>${item.quantity} × ${euro(item.price)}</small></div>
      <button class="remove" data-id="${item.id}">Suppr.</button>
    </div>
  `).join("") : '<p class="empty">Ton panier est vide.</p>';

  document.querySelectorAll(".remove").forEach(button => {
    button.addEventListener("click", () => removeFromCart(Number(button.dataset.id)));
  });
}

function openCart() { cartEl.classList.add("open"); overlay.classList.add("open"); }
function closeCart() { cartEl.classList.remove("open"); overlay.classList.remove("open"); }

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    renderProducts(button.dataset.category);
  });
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) return alert("Ton panier est vide.");
  alert("Le paiement sécurisé sera connecté à l'étape suivante.");
});

renderProducts();
renderCart();
