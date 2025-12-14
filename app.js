/* =========================
   Configuración general
========================= */

// Reemplace este número por el número real de Mueblería MG (incluya código de país, sin + ni espacios).
// Ejemplo Perú: 51XXXXXXXXX
const WHATSAPP_NUMBER = "51955857588";

// URL obligatoria para TODAS las imágenes
const IMAGE_URL = "https://res.cloudinary.com/do4l2xa3x/image/upload/v1763765149/devops_ryyzzq.png";

/* Catálogo referencial (demo) */
const PRODUCTS = [
  { id: "rep-001", name: "Repostero de cocina", category: "cocina", price: 499.0, img: IMAGE_URL },
  { id: "ala-001", name: "Alacena superior", category: "cocina", price: 299.0, img: IMAGE_URL },
  { id: "mes-001", name: "Mesa cocina (parte baja)", category: "cocina", price: 389.0, img: IMAGE_URL },
  { id: "rop-001", name: "Ropero 3 puertas", category: "dormitorio", price: 799.0, img: IMAGE_URL },
  { id: "com-001", name: "Cómoda 4 cajones", category: "dormitorio", price: 429.0, img: IMAGE_URL },
  { id: "toc-001", name: "Tocador con espejo", category: "dormitorio", price: 459.0, img: IMAGE_URL },
  { id: "lib-001", name: "Librero moderno", category: "oficina", price: 379.0, img: IMAGE_URL },
  { id: "pla-001", name: "Planchador multiuso", category: "organizacion", price: 259.0, img: IMAGE_URL },
  { id: "zap-001", name: "Zapatera compacta", category: "organizacion", price: 219.0, img: IMAGE_URL },
  { id: "vit-001", name: "Vitrina exhibidora", category: "oficina", price: 649.0, img: IMAGE_URL },
  { id: "ver-001", name: "Verdulero organizador", category: "cocina", price: 239.0, img: IMAGE_URL },
];

const CATEGORY_LABEL = {
  cocina: "Cocina",
  dormitorio: "Dormitorio",
  oficina: "Oficina",
  organizacion: "Organización",
};

/* Carrito en memoria (demo) */
let cart = new Map(); // key: productId, value: { product, qty }

/* Estado de UI */
let currentFilter = "all";
let currentSearch = "";

/* =========================
   Toast (popup)
========================= */

const toastEl = document.getElementById("toast");
const toastMsgEl = document.getElementById("toastMsg");
let toastTimer = null;

function showToast(message = "Producto agregado al carrito") {
  if (!toastEl || !toastMsgEl) return;

  toastMsgEl.textContent = message;
  toastEl.hidden = false;

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, 1600);
}

/* =========================
   Helpers
========================= */

function money(value) {
  const v = Number(value || 0);
  return `S/ ${v.toFixed(2)}`;
}

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getFilteredProducts() {
  const q = normalize(currentSearch);

  return PRODUCTS.filter((p) => {
    const byFilter = currentFilter === "all" ? true : p.category === currentFilter;
    const bySearch = q.length === 0 ? true : normalize(p.name).includes(q);
    return byFilter && bySearch;
  });
}

function cartCount() {
  let total = 0;
  for (const [, item] of cart) total += item.qty;
  return total;
}

function cartTotal() {
  let total = 0;
  for (const [, item] of cart) total += item.qty * item.product.price;
  return total;
}

function buildWhatsAppMessage() {
  const items = [];
  for (const [, item] of cart) {
    items.push(`- ${item.qty} x ${item.product.name} (${money(item.product.price)})`);
  }

  const lines = [
    "Hola, Mueblería MG. Quisiera realizar el siguiente pedido:",
    "",
    ...(items.length ? items : ["- (Sin productos en el carrito)"]),
    "",
    `Total: ${money(cartTotal())}`,
    "",
    "Datos para coordinar:",
    "- Nombre:",
    "- Distrito / Dirección referencial:",
    "- Medidas (si aplica):",
    "- Color (si aplica):",
  ];

  return lines.join("\n");
}

function openWhatsApp() {
  const text = encodeURIComponent(buildWhatsAppMessage());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* =========================
   Render: Catálogo
========================= */

const productsGrid = document.getElementById("productsGrid");

function renderProducts() {
  const list = getFilteredProducts();

  productsGrid.innerHTML = "";

  if (list.length === 0) {
    productsGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1;">
        <div class="card__body">
          <h3 class="card__title">Sin resultados</h3>
          <div style="color: rgba(230,230,230,.72); line-height: 1.5; font-size: 13.5px;">
            No se encontraron productos con el criterio actual. Pruebe con otro término de búsqueda.
          </div>
        </div>
      </div>
    `;
    return;
  }

  for (const p of list) {
    const categoryTag = CATEGORY_LABEL[p.category] || "Mueble";

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img class="card__img" src="${p.img}" alt="${p.name}" loading="lazy" />
      <div class="card__body">
        <h3 class="card__title">${p.name}</h3>
        <div class="card__meta">
          <span class="tag">${categoryTag}</span>
          <span class="price">${money(p.price)}</span>
        </div>
        <div class="card__actions">
          <button class="btn btn--primary" type="button" data-add="${p.id}">
            Agregar al carrito
          </button>
        </div>
      </div>
    `;

    productsGrid.appendChild(card);
  }

  // listeners de "Agregar"
  productsGrid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-add");
      addToCart(id);
      showToast("Producto agregado al carrito");
    });
  });
}

/* =========================
   Render: Carrito
========================= */

const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountBadge = document.getElementById("cartCountBadge");

function syncCartUI() {
  const count = cartCount();
  cartCountBadge.textContent = String(count);

  cartTotalEl.textContent = money(cartTotal());

  const hasItems = count > 0;
  cartEmptyEl.style.display = hasItems ? "none" : "block";
  cartItemsEl.style.display = hasItems ? "flex" : "none";

  if (!hasItems) {
    cartItemsEl.innerHTML = "";
    return;
  }

  cartItemsEl.innerHTML = "";

  for (const [, item] of cart) {
    const row = document.createElement("div");
    row.className = "cartItem";
    row.innerHTML = `
      <img src="${item.product.img}" alt="${item.product.name}" loading="lazy" />
      <div class="cartItem__info">
        <div class="cartItem__top">
          <p class="cartItem__name">${item.product.name}</p>
          <span class="cartItem__price">${money(item.product.price)}</span>
        </div>

        <div class="cartItem__controls">
          <div class="qty" aria-label="Cantidad">
            <button type="button" aria-label="Disminuir" data-dec="${item.product.id}">−</button>
            <span aria-live="polite">${item.qty}</span>
            <button type="button" aria-label="Aumentar" data-inc="${item.product.id}">+</button>
          </div>

          <button type="button" class="removeBtn" data-rem="${item.product.id}">
            Eliminar
          </button>
        </div>
      </div>
    `;

    cartItemsEl.appendChild(row);
  }

  // listeners de controles del carrito
  cartItemsEl.querySelectorAll("[data-inc]").forEach((btn) => {
    btn.addEventListener("click", () => {
      incQty(btn.getAttribute("data-inc"));
    });
  });
  cartItemsEl.querySelectorAll("[data-dec]").forEach((btn) => {
    btn.addEventListener("click", () => {
      decQty(btn.getAttribute("data-dec"));
    });
  });
  cartItemsEl.querySelectorAll("[data-rem]").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.getAttribute("data-rem"));
    });
  });
}

/* =========================
   Acciones: Carrito
========================= */

function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.get(productId);
  if (existing) existing.qty += 1;
  else cart.set(productId, { product, qty: 1 });

  syncCartUI();
}

function incQty(productId) {
  const existing = cart.get(productId);
  if (!existing) return;
  existing.qty += 1;
  syncCartUI();
}

function decQty(productId) {
  const existing = cart.get(productId);
  if (!existing) return;
  existing.qty -= 1;
  if (existing.qty <= 0) cart.delete(productId);
  syncCartUI();
}

function removeFromCart(productId) {
  cart.delete(productId);
  syncCartUI();
}

function clearCart() {
  cart.clear();
  syncCartUI();
}

/* =========================
   Drawer: abrir/cerrar
========================= */

const openCartBtn = document.getElementById("openCartBtn");
const openCartBtn2 = document.getElementById("openCartBtn2");
const closeCartBtn = document.getElementById("closeCartBtn");

function openCart() {
  cartDrawer.hidden = false;
  cartBackdrop.hidden = false;

  closeCartBtn.focus();
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.hidden = true;
  cartBackdrop.hidden = true;

  document.body.style.overflow = "";
}

openCartBtn.addEventListener("click", openCart);
openCartBtn2.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !cartDrawer.hidden) closeCart();
});

/* =========================
   Buscador: visual + sugerencias
========================= */

const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const suggestionsEl = document.getElementById("searchSuggestions");

function getSuggestions(query) {
  const q = normalize(query);
  if (!q) return [];

  return PRODUCTS
    .filter((p) => normalize(p.name).includes(q))
    .slice(0, 6)
    .map((p) => p.name);
}

function renderSuggestions(query) {
  const suggestions = getSuggestions(query);
  suggestionsEl.innerHTML = "";

  if (!suggestions.length) {
    suggestionsEl.classList.remove("is-open");
    return;
  }

  suggestionsEl.classList.add("is-open");

  suggestions.forEach((text) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "suggestion";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      searchInput.value = text;
      currentSearch = text;
      suggestionsEl.classList.remove("is-open");
      renderProducts();
    });
    suggestionsEl.appendChild(btn);
  });
}

searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value || "";
  renderSuggestions(currentSearch);
  renderProducts();
});

searchInput.addEventListener("focus", () => {
  renderSuggestions(searchInput.value || "");
});

document.addEventListener("click", (e) => {
  const isInside = e.target.closest(".search");
  if (!isInside) suggestionsEl.classList.remove("is-open");
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  currentSearch = "";
  suggestionsEl.classList.remove("is-open");
  renderProducts();
  searchInput.focus();
});

/* =========================
   Filtros (chips)
========================= */

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");

    currentFilter = chip.getAttribute("data-filter") || "all";
    renderProducts();
  });
});

/* =========================
   WhatsApp
========================= */

const whatsBtn = document.getElementById("whatsBtn");
const whatsHeroBtn = document.getElementById("whatsHeroBtn");
const whatsContactBtn = document.getElementById("whatsContactBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

whatsBtn.addEventListener("click", openWhatsApp);
whatsHeroBtn.addEventListener("click", openWhatsApp);
whatsContactBtn.addEventListener("click", openWhatsApp);

clearCartBtn.addEventListener("click", () => {
  clearCart();
});

/* =========================
   Init
========================= */

document.getElementById("year").textContent = String(new Date().getFullYear());

renderProducts();
syncCartUI();
