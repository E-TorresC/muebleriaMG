/* =========================
   Configuración general
========================= */

const WHATSAPP_NUMBER = "51999999999";
const IMAGE_URL = "https://res.cloudinary.com/do4l2xa3x/image/upload/v1763765149/devops_ryyzzq.png";

/* =========================
   Datos: productos (precio por medida)
========================= */

const PRODUCTS = [
  // Cocina
  {
    id: "coc-rep-alto",
    name: "Repostero alto",
    category: "cocina",
    img: IMAGE_URL,
    sizes: [
      { label: "60 × 70 × 30 cm", price: 100 },
      { label: "80 × 70 × 30 cm", price: 200 },
      { label: "100 × 70 × 30 cm", price: 300 },
    ],
    colors: ["Blanco", "Blanco alto brillo", "Gris ceniza", "Roble claro", "Nogal"],
  },
  {
    id: "coc-rep-bajo",
    name: "Repostero bajo",
    category: "cocina",
    img: IMAGE_URL,
    sizes: [
      { label: "60 × 85 × 60 cm", price: 100 },
      { label: "80 × 85 × 60 cm", price: 200 },
    ],
    colors: ["Blanco", "Blanco alto brillo", "Gris ceniza", "Roble claro", "Nogal"],
  },
  {
    id: "coc-alacena",
    name: "Alacena",
    category: "cocina",
    img: IMAGE_URL,
    sizes: [
      { label: "60 × 40 × 30 cm", price: 100 },
      { label: "80 × 40 × 30 cm", price: 200 },
      { label: "100 × 40 × 30 cm", price: 300 },
    ],
    colors: ["Blanco", "Gris claro", "Roble natural", "Almendra"],
  },
  {
    id: "coc-mesa",
    name: "Mesa de cocina",
    category: "cocina",
    img: IMAGE_URL,
    sizes: [
      { label: "120 × 85 × 60 cm", price: 100 },
      { label: "140 × 85 × 60 cm", price: 200 },
    ],
    colors: ["Blanco", "Gris claro", "Roble"],
  },

  // Dormitorio
  {
    id: "dor-ropero",
    name: "Ropero",
    category: "dormitorio",
    img: IMAGE_URL,
    sizes: [
      { label: "120 × 180 × 50 cm", price: 100 },
      { label: "150 × 180 × 50 cm", price: 200 },
      { label: "180 × 200 × 60 cm", price: 300 },
    ],
    colors: ["Blanco", "Blanco mate", "Roble", "Nogal", "Wengué"],
  },
  {
    id: "dor-comoda",
    name: "Cómoda",
    category: "dormitorio",
    img: IMAGE_URL,
    sizes: [
      { label: "80 × 80 × 45 cm", price: 100 },
      { label: "100 × 85 × 45 cm", price: 200 },
    ],
    colors: ["Blanco", "Roble claro", "Gris grafito", "Nogal"],
  },
  {
    id: "dor-zapatera",
    name: "Zapatera",
    category: "dormitorio",
    img: IMAGE_URL,
    sizes: [
      { label: "60 × 90 × 30 cm (12–16 pares)", price: 100 },
      { label: "80 × 100 × 30 cm (18–24 pares)", price: 200 },
    ],
    colors: ["Blanco", "Roble", "Gris claro"],
  },
  {
    id: "dor-tocador",
    name: "Tocador",
    category: "dormitorio",
    img: IMAGE_URL,
    sizes: [
      { label: "80 × 75 × 40 cm", price: 100 },
      { label: "100 × 80 × 45 cm", price: 200 },
    ],
    colors: ["Blanco", "Blanco alto brillo", "Roble claro"],
  },

  // Lavandería
  {
    id: "lav-planchador",
    name: "Planchador",
    category: "lavanderia",
    img: IMAGE_URL,
    sizes: [
      { label: "80 × 85 × 40 cm", price: 100 },
      { label: "100 × 90 × 45 cm", price: 200 },
    ],
    colors: ["Blanco", "Gris claro", "Roble"],
  },

  // Oficina
  {
    id: "ofi-librero",
    name: "Librero",
    category: "oficina",
    img: IMAGE_URL,
    sizes: [
      { label: "60 × 180 × 30 cm", price: 100 },
      { label: "80 × 180 × 30 cm", price: 200 },
      { label: "100 × 200 × 30 cm", price: 300 },
    ],
    colors: ["Blanco", "Roble", "Nogal", "Negro mate"],
  },

  // Despensa
  {
    id: "des-verdulero",
    name: "Verdulero",
    category: "despensa",
    img: IMAGE_URL,
    sizes: [
      { label: "40 × 90 × 40 cm", price: 100 },
      { label: "50 × 100 × 45 cm", price: 200 },
    ],
    colors: ["Blanco", "Roble", "Almendra"],
  },
  {
    id: "des-vitrina",
    name: "Vitrina",
    category: "despensa",
    img: IMAGE_URL,
    sizes: [
      { label: "80 × 180 × 40 cm", price: 100 },
      { label: "100 × 180 × 45 cm", price: 200 },
    ],
    colors: ["Blanco", "Blanco alto brillo", "Roble", "Nogal"],
  },
];

const CATEGORY_LABEL = {
  cocina: "Cocina",
  dormitorio: "Dormitorio",
  lavanderia: "Lavandería",
  oficina: "Estudio y Oficina",
  despensa: "Despensa",
};

/* =========================
   Estado
========================= */

let cart = new Map();
let currentFilter = "all";
let currentSearch = "";

let modalProduct = null;
let modalQty = 1;

/* Para combos: guardamos el índice seleccionado en sizes */
let selectedSizeIndex = -1;
let selectedColor = "";

/* =========================
   Toast
========================= */

const toastEl = document.getElementById("toast");
const toastMsgEl = document.getElementById("toastMsg");
let toastTimer = null;

function showToast(message) {
  toastMsgEl.textContent = message || "Acción realizada";
  toastEl.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastEl.hidden = true), 1600);
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
  for (const [, item] of cart) total += item.qty * item.unitPrice;
  return total;
}

function variantKey(productId, sizeLabel, color) {
  return `${productId}__${sizeLabel}__${color}`;
}

/* =========================
   WhatsApp
========================= */

function buildWhatsAppMessage() {
  const lines = [];
  lines.push("Hola, Mueblería MG. Quisiera realizar el siguiente pedido:");
  lines.push("");

  if (cart.size === 0) {
    lines.push("- (Sin productos en el carrito)");
  } else {
    for (const [, item] of cart) {
      const subtotal = item.qty * item.unitPrice;
      lines.push(
        `- ${item.qty} x ${item.name} | Medida: ${item.size} | Color: ${item.color} | Unit: ${money(item.unitPrice)} | Subtotal: ${money(subtotal)}`
      );
    }
  }

  lines.push("");
  lines.push(`Total: ${money(cartTotal())}`);
  lines.push("");
  lines.push("Datos para coordinar:");
  lines.push("- Nombre:");
  lines.push("- Distrito / Dirección referencial:");
  lines.push("- Referencias:");
  lines.push("- Observaciones:");

  return lines.join("\n");
}

function openWhatsApp() {
  const text = encodeURIComponent(buildWhatsAppMessage());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* =========================
   Render: Catálogo (sin precios)
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
        </div>
        <div class="card__actions">
          <button class="btn btn--primary" type="button" data-config="${p.id}">
            Agregar al carrito
          </button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  }

  productsGrid.querySelectorAll("[data-config]").forEach((btn) => {
    btn.addEventListener("click", () => openProductModal(btn.getAttribute("data-config")));
  });
}

/* =========================
   Carrito: UI
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

  for (const [key, item] of cart) {
    const row = document.createElement("div");
    row.className = "cartItem";

    const subtotal = item.qty * item.unitPrice;

    row.innerHTML = `
      <img src="${item.img}" alt="${item.name}" loading="lazy" />
      <div class="cartItem__info">
        <div class="cartItem__top">
          <p class="cartItem__name">${item.name}</p>
          <span class="cartItem__price">${money(subtotal)}</span>
        </div>

        <div class="cartItem__meta">
          Medida: <strong>${item.size}</strong><br/>
          Color: <strong>${item.color}</strong><br/>
          Unit: <strong>${money(item.unitPrice)}</strong>
        </div>

        <div class="cartItem__controls">
          <div class="qty" aria-label="Cantidad">
            <button type="button" aria-label="Disminuir" data-dec="${key}">−</button>
            <span aria-live="polite">${item.qty}</span>
            <button type="button" aria-label="Aumentar" data-inc="${key}">+</button>
          </div>

          <button type="button" class="removeBtn" data-rem="${key}">
            Eliminar
          </button>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(row);
  }

  cartItemsEl.querySelectorAll("[data-inc]").forEach((btn) => btn.addEventListener("click", () => incQty(btn.getAttribute("data-inc"))));
  cartItemsEl.querySelectorAll("[data-dec]").forEach((btn) => btn.addEventListener("click", () => decQty(btn.getAttribute("data-dec"))));
  cartItemsEl.querySelectorAll("[data-rem]").forEach((btn) => btn.addEventListener("click", () => removeFromCart(btn.getAttribute("data-rem"))));
}

function incQty(key) {
  const existing = cart.get(key);
  if (!existing) return;
  existing.qty += 1;
  syncCartUI();
}

function decQty(key) {
  const existing = cart.get(key);
  if (!existing) return;
  existing.qty -= 1;
  if (existing.qty <= 0) cart.delete(key);
  syncCartUI();
}

function removeFromCart(key) {
  cart.delete(key);
  syncCartUI();
}

function clearCart() {
  cart.clear();
  syncCartUI();
}

/* Drawer: abrir/cerrar */
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

/* =========================
   Modal: Combos (medida + color obligatorios)
========================= */

const productModal = document.getElementById("productModal");
const productModalBackdrop = document.getElementById("productModalBackdrop");
const closeProductModalBtn = document.getElementById("closeProductModalBtn");

const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalQtyEl = document.getElementById("modalQty");

const modalDecBtn = document.getElementById("modalDecBtn");
const modalIncBtn = document.getElementById("modalIncBtn");

const modalSizeSelect = document.getElementById("modalSizeSelect");
const modalColorSelect = document.getElementById("modalColorSelect");

const modalAddBtn = document.getElementById("modalAddBtn");
const modalError = document.getElementById("modalError");

function openProductModal(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  modalProduct = product;
  modalQty = 1;
  selectedSizeIndex = -1;
  selectedColor = "";

  modalImg.src = product.img;
  modalName.textContent = product.name;
  modalQtyEl.textContent = "1";
  modalPrice.textContent = "—";

  modalError.hidden = true;

  // Poblar combos
  fillSizeSelect(product);
  fillColorSelect(product);

  productModal.hidden = false;
  productModalBackdrop.hidden = false;
  closeProductModalBtn.focus();
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  productModal.hidden = true;
  productModalBackdrop.hidden = true;
  document.body.style.overflow = "";
}

function fillSizeSelect(product) {
  modalSizeSelect.innerHTML = `<option value="">Seleccione una medida...</option>`;
  product.sizes.forEach((s, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = `${s.label} — ${money(s.price)}`;
    modalSizeSelect.appendChild(opt);
  });
  modalSizeSelect.value = "";
}

function fillColorSelect(product) {
  modalColorSelect.innerHTML = `<option value="">Seleccione un color...</option>`;
  product.colors.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    modalColorSelect.appendChild(opt);
  });
  modalColorSelect.value = "";
}

modalSizeSelect.addEventListener("change", () => {
  modalError.hidden = true;
  const v = modalSizeSelect.value;
  if (!v) {
    selectedSizeIndex = -1;
    modalPrice.textContent = "—";
    return;
  }
  selectedSizeIndex = Number(v);
  const s = modalProduct.sizes[selectedSizeIndex];
  modalPrice.textContent = money(s.price);
});

modalColorSelect.addEventListener("change", () => {
  modalError.hidden = true;
  selectedColor = modalColorSelect.value || "";
});

modalDecBtn.addEventListener("click", () => {
  modalQty = Math.max(1, modalQty - 1);
  modalQtyEl.textContent = String(modalQty);
});
modalIncBtn.addEventListener("click", () => {
  modalQty += 1;
  modalQtyEl.textContent = String(modalQty);
});

closeProductModalBtn.addEventListener("click", closeProductModal);
productModalBackdrop.addEventListener("click", closeProductModal);

modalAddBtn.addEventListener("click", () => {
  if (!modalProduct) return;

  // Validación: medida y color obligatorios
  if (selectedSizeIndex < 0 || !selectedColor) {
    modalError.hidden = false;
    return;
  }

  const s = modalProduct.sizes[selectedSizeIndex];
  const key = variantKey(modalProduct.id, s.label, selectedColor);

  const existing = cart.get(key);
  if (existing) {
    existing.qty += modalQty;
  } else {
    cart.set(key, {
      productId: modalProduct.id,
      name: modalProduct.name,
      size: s.label,
      color: selectedColor,
      unitPrice: s.price,
      qty: modalQty,
      img: modalProduct.img,
    });
  }

  syncCartUI();
  closeProductModal();
  showToast("Producto agregado al carrito");
});

/* Escape */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!cartDrawer.hidden) closeCart();
    if (!productModal.hidden) closeProductModal();
  }
});

/* =========================
   Buscador + sugerencias
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
searchInput.addEventListener("focus", () => renderSuggestions(searchInput.value || ""));

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
   Botones WhatsApp / Vaciar
========================= */

document.getElementById("whatsBtn").addEventListener("click", openWhatsApp);
document.getElementById("whatsHeroBtn").addEventListener("click", openWhatsApp);
document.getElementById("whatsContactBtn").addEventListener("click", openWhatsApp);
document.getElementById("clearCartBtn").addEventListener("click", clearCart);

/* =========================
   Init
========================= */

document.getElementById("year").textContent = String(new Date().getFullYear());
renderProducts();
syncCartUI();
