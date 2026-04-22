export class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("mrt_cart")) || [];
    this.drawer = document.getElementById("cart-drawer");
    this.backdrop = document.getElementById("drawer-backdrop");
    this.itemsContainer = document.getElementById("cart-items");
    this.countBadge = document.getElementById("cart-count");
    this.totalEl = document.getElementById("cart-total");

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    const btn = document.getElementById("cart-button");
    const close = document.getElementById("close-cart");

    if (btn) btn.addEventListener("click", () => this.toggle(true));
    if (close) close.addEventListener("click", () => this.toggle(false));
    if (this.backdrop)
      this.backdrop.addEventListener("click", () => this.toggle(false));

    // Delegate add to cart events
    document.addEventListener("click", (e) => {
      const addBtn = e.target.closest("[data-add-to-cart]");
      if (addBtn) {
        const product = JSON.parse(addBtn.dataset.addToCart);
        this.addItem(product);
        this.toggle(true);
      }

      const removeBtn = e.target.closest("[data-remove-item]");
      if (removeBtn) {
        const id = removeBtn.dataset.removeItem;
        this.removeItem(id);
      }
    });
  }

  toggle(isOpen) {
    if (!this.drawer || !this.backdrop) return;

    if (isOpen) {
      this.drawer.classList.remove("translate-x-full");
      this.backdrop.classList.add("opacity-100", "pointer-events-auto");
    } else {
      this.drawer.classList.add("translate-x-full");
      this.backdrop.classList.remove("opacity-100", "pointer-events-auto");
    }
  }

  addItem(product) {
    const existing = this.items.find((item) => item.id === product.id);
    if (!existing) {
      this.items.push(product);
      this.save();
      this.updateUI();
    }
  }

  removeItem(id) {
    this.items = this.items.filter((item) => String(item.id) !== String(id));
    this.save();
    this.updateUI();
  }

  save() {
    localStorage.setItem("mrt_cart", JSON.stringify(this.items));
  }

  updateUI() {
    if (!this.itemsContainer || !this.countBadge || !this.totalEl) return;

    // Update Badge
    const count = this.items.length;
    this.countBadge.textContent = count;
    this.countBadge.classList.toggle("opacity-0", count === 0);
    this.countBadge.classList.toggle("scale-0", count === 0);

    // Update Items
    if (count === 0) {
      this.itemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center opacity-40 py-20">
          <span class="material-symbols-outlined text-6xl mb-4">shopping_basket</span>
          <p class="serif italic">Your interest list is empty.</p>
        </div>
      `;
      this.totalEl.textContent = "$0.00";
      return;
    }

    let total = 0;
    this.itemsContainer.innerHTML = this.items
      .map((item) => {
        total += parseFloat(item.price || 0);
        return `
        <div class="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-outline-variant/10 shadow-sm group">
          <div class="w-16 h-16 bg-surface-container-low rounded-xl overflow-hidden p-2 flex-shrink-0">
            <img src="${item.image || "/assets/products/placeholder.png"}" alt="${item.name}" class="w-full h-full object-contain">
          </div>
          <div class="flex-grow">
            <h4 class="text-sm font-bold text-on-surface line-clamp-1">${item.name}</h4>
            <p class="text-xs text-primary font-bold">$${item.price}</p>
          </div>
          <button data-remove-item="${item.id}" class="p-2 hover:bg-surface-container-high rounded-full transition-colors opacity-0 group-hover:opacity-100">
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      `;
      })
      .join("");

    this.totalEl.textContent = `$${total.toFixed(2)}`;
  }
}
