const API = '/api';
let token = localStorage.getItem('mrt_admin_token');
let currentView = 'dashboard';

// === API Helper (FIXED: Handles 204 No Content for DELETE + Added Timeout) ===
async function api(path, opts = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let finalPath = path;
  const needsCacheBust = path.includes('/products') || path.includes('/categories') || path.includes('/stats') || path.includes('/reviews') || path.includes('/messages');

  if ((!opts.method || opts.method === 'GET') && needsCacheBust) {
    finalPath += (path.includes('?') ? '&' : '?') + `_t=${Date.now()}`;
  }

  try {
    const res = await fetch(`${API}${finalPath}`, { 
      ...opts, 
      headers,
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    
    if (res.status === 401) { logout(); return null; }

    // CRITICAL FIX: Handle empty responses (204 No Content, typical for DELETE)
    if (res.status === 204) return { success: true };
    const contentLength = res.headers.get('content-length');
    if (contentLength === '0') return res.ok ? { success: true } : { error: 'Request failed' };

    const text = await res.text();
    if (!text || text.trim() === '') return res.ok ? { success: true } : { error: 'Empty response' };

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.ok ? { success: true } : { error: text };
    }

    if (!res.ok) {
      console.error(`API Error [${res.status}]:`, data);
      return data;
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.error(`API Timeout [${path}]`);
      return { error: 'Request timed out. Please check your connection or server status.' };
    }
    console.error(`API Fetch Error [${path}]:`, err);
    return { error: 'Network or parse error' };
  }
}

function toast(msg, type = 'success') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'error'}</span> ${msg}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// === Router ===
function navigate(view) {
  currentView = view;
  render();
}

function logout() {
  token = null;
  localStorage.removeItem('mrt_admin_token');
  render();
}

// === Main Render ===
function render() {
  const app = document.getElementById('app');
  if (!token) { renderLogin(app); return; }
  renderLayout(app);
}

// === Login ===
function renderLogin(app) {
  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <h1>MRT Admin</h1>
        <p>Sign in to manage your affiliate platform</p>
        <form id="login-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="login-email" placeholder="admin@example.com" required autocomplete="email">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:0.875rem;">
            <span class="material-symbols-outlined">login</span> Sign In
          </button>
        </form>
      </div>
    </div>
  `;
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<div class="loading-spinner"></div>';
    try {
      const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      if (data?.token) {
        token = data.token;
        localStorage.setItem('mrt_admin_token', token);
        toast('Welcome back!');
        render();
      } else {
        toast(data?.error || 'Login failed', 'error');
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined">login</span> Sign In';
      }
    } catch {
      toast('Connection error', 'error');
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined">login</span> Sign In';
    }
  });
}

// === Layout ===
function renderLayout(app) {
  if (app.querySelector('.admin-layout')) {
    updateSidebar();
    renderView();
    return;
  }

  app.innerHTML = `
    <div class="admin-layout">
      <div class="admin-overlay" id="admin-overlay"></div>
      <button class="mobile-nav-toggle" id="mobile-nav-toggle" aria-label="Toggle Menu">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <aside class="admin-sidebar" id="admin-sidebar"></aside>
      <main class="main-content" id="main-content"></main>
    </div>
  `;
  updateSidebar();
  renderView();

  const toggle = document.getElementById('mobile-nav-toggle');
  const overlay = document.getElementById('admin-overlay');
  const sidebar = document.getElementById('admin-sidebar');

  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    });
  }
}

function updateSidebar() {
  const container = document.getElementById('admin-sidebar');
  if (!container) return;
  container.innerHTML = `
    <div class="sidebar-logo">
      <div class="logo-icon">M</div>
      <span>MRT Admin</span>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-title">Overview</div>
      <a class="nav-item ${currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
        <span class="material-symbols-outlined">dashboard</span> Dashboard
      </a>
      <a class="nav-item ${currentView === 'analytics' ? 'active' : ''}" data-view="analytics">
        <span class="material-symbols-outlined">analytics</span> Analytics
      </a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-title">Content</div>
      <a class="nav-item ${currentView === 'blog' ? 'active' : ''}" data-view="blog">
        <span class="material-symbols-outlined">article</span> Blog
      </a>
      <a class="nav-item ${currentView === 'products' ? 'active' : ''}" data-view="products">
        <span class="material-symbols-outlined">inventory_2</span> Products
      </a>
      <a class="nav-item ${currentView === 'categories' ? 'active' : ''}" data-view="categories">
        <span class="material-symbols-outlined">category</span> Categories
      </a>
      <a class="nav-item ${currentView === 'reviews' ? 'active' : ''}" data-view="reviews">
        <span class="material-symbols-outlined">rate_review</span> Reviews
      </a>
      <a class="nav-item ${currentView === 'testimonials' ? 'active' : ''}" data-view="testimonials">
        <span class="material-symbols-outlined">reviews</span> Testimonials
      </a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-title">Marketing</div>
      <a class="nav-item ${currentView === 'messages' ? 'active' : ''}" data-view="messages">
        <span class="material-symbols-outlined">forum</span> Messages
      </a>
      <a class="nav-item ${currentView === 'newsletter' ? 'active' : ''}" data-view="newsletter">
        <span class="material-symbols-outlined">mail</span> Newsletter
      </a>
    </div>
    <div class="sidebar-section" style="margin-top:auto;padding-top:1rem;border-top:1px solid var(--border);">
      <a class="nav-item" data-view="logout">
        <span class="material-symbols-outlined">logout</span> Sign Out
      </a>
      <a class="nav-item" href="/" target="_blank">
        <span class="material-symbols-outlined">open_in_new</span> View Site
      </a>
    </div>
  `;

  container.querySelectorAll('.nav-item[data-view]').forEach(el => {
    el.addEventListener('click', () => {
      const view = el.dataset.view;
      if (view === 'logout') { logout(); return; }
      navigate(view);
      
      // Auto-close on mobile
      container.classList.remove('show');
      const overlay = document.getElementById('admin-overlay');
      if (overlay) overlay.classList.remove('show');
    });
  });
}

async function renderView() {
  const main = document.getElementById('main-content');
  if (!main) return;

  let viewContainer = document.getElementById(`view-${currentView}`);
  if (!viewContainer) {
    viewContainer = document.createElement('div');
    viewContainer.id = `view-${currentView}`;
    viewContainer.className = 'view-container';
    main.appendChild(viewContainer);
  }

  document.querySelectorAll('.view-container').forEach(el => el.style.display = 'none');
  viewContainer.style.display = 'block';
  viewContainer.innerHTML = '<div class="text-center mt-2"><div class="loading-spinner"></div></div>';

  switch (currentView) {
    case 'dashboard': await renderDashboard(viewContainer); break;
    case 'blog': await renderBlog(viewContainer); break;
    case 'products': await renderProducts(viewContainer); break;
    case 'categories': await renderCategories(viewContainer); break;
    case 'testimonials': await renderTestimonials(viewContainer); break;
    case 'analytics': await renderAnalytics(viewContainer); break;
    case 'reviews': await renderReviews(viewContainer); break;
    case 'messages': await renderMessages(viewContainer); break;
    case 'newsletter': await renderNewsletter(viewContainer); break;
    default: await renderDashboard(viewContainer);
  }
}

// === Dashboard ===
async function renderDashboard(main) {
  const stats = await api('/admin/stats');
  if (!stats) return;

  main.innerHTML = `
    <div class="page-header">
      <div><h2>Dashboard</h2><div class="subtitle">Welcome to MRT International Admin</div></div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">inventory_2</span></div>
        <div class="stat-label">Total Products</div>
        <div class="stat-value">${stats.productCount || 0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">category</span></div>
        <div class="stat-label">Categories</div>
        <div class="stat-value">${stats.categoryCount || 0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">ads_click</span></div>
        <div class="stat-label">Affiliate Clicks</div>
        <div class="stat-value">${stats.clickCount || 0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">mail</span></div>
        <div class="stat-label">Subscribers</div>
        <div class="stat-value">${stats.subscriberCount || 0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">forum</span></div>
        <div class="stat-label">Messages</div>
        <div class="stat-value">${stats.messageCount || 0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">reviews</span></div>
        <div class="stat-label">Testimonials</div>
        <div class="stat-value">${stats.testimonialCount || 0}</div>
      </div>
    </div>
    <div class="table-container">
      <div class="table-header">
        <h3>Recent Activity</h3>
      </div>
      <table>
        <thead><tr><th>Product</th><th>Event</th><th>Time</th></tr></thead>
        <tbody>
          ${(stats.recentClicks || []).map(c => `
            <tr>
              <td>
                <div class="flex gap-1" style="align-items:center">
                  <img src="${c.productImage || c.product?.image || 'https://placehold.co/150x150?text=No+Image'}" class="product-thumb" alt="" onerror="this.src='https://placehold.co/150x150?text=No+Image'">
                  <span>${c.productName || c.product?.name || 'Unknown'}</span>
                </div>
              </td>
              <td><span class="badge badge-info">Affiliate Click</span></td>
              <td class="text-muted text-sm">${new Date(c.clickedAt || c.createdAt).toLocaleString()}</td>
            </tr>
          `).join('') || '<tr><td colspan="3" class="text-center text-muted" style="padding:2rem">No recent activity</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

// === Products ===
async function renderProducts(main) {
  const data = await api('/products?limit=1000');
  const cats = await api('/categories');
  if (!data) return;
  const products = data.products || [];
  window._allProducts = products; // Essential for global delegator

  main.innerHTML = `
    <div class="page-header">
      <div><h2>Products</h2><div class="subtitle">${data.total || 0} products total</div></div>
      <button class="btn btn-primary" id="btn-add-product"><span class="material-symbols-outlined">add</span> Add Product</button>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th></th><th>Name</th><th class="hide-xs">Category</th><th class="hide-xs">Price</th><th class="hide-sm">Badge</th><th class="hide-sm">Rating</th><th>Actions</th></tr></thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td><img src="${p.image || 'https://placehold.co/150x150?text=No+Image'}" class="product-thumb" alt="${p.name}" onerror="this.src='https://placehold.co/150x150?text=No+Image'"></td>
              <td>
                <strong>${p.name}</strong>
                <br><span class="text-muted text-sm">${p.slug}</span>
                <div class="mobile-meta hide-desktop">
                  <span class="badge badge-info" style="margin-right:4px">${p.category?.name || p.categoryId}</span>
                  <span style="font-size:0.8rem;color:var(--accent)">$${p.price}</span>
                </div>
              </td>
              <td class="hide-xs"><span class="badge badge-info">${p.category?.name || p.categoryId}</span></td>
              <td class="hide-xs">
                ${p.price
                  ? `<span style="font-weight:700">${({USD:'$',INR:'₹',AED:'د.إ',EUR:'€',GBP:'£',SAR:'﷼',JPY:'¥',CAD:'CA$',AUD:'A$',SGD:'S$'}[p.currency]||'$')}${p.price}</span>
                     ${p.originalPrice && p.originalPrice > p.price ? `<br><span style="font-size:0.75rem;text-decoration:line-through;opacity:0.45">${({USD:'$',INR:'₹',AED:'د.إ',EUR:'€',GBP:'£',SAR:'﷼',JPY:'¥',CAD:'CA$',AUD:'A$',SGD:'S$'}[p.currency]||'$')}${p.originalPrice}</span>` : ''}`
                  : '<span style="opacity:0.5;font-size:0.8rem">Ask for price</span>'
                }
              </td>
              <td class="hide-sm"><span class="badge badge-warning">${p.badge || '-'}</span></td>
              <td class="hide-sm">${p.ratingValue || '-'}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-sm btn-secondary btn-edit-product" data-id="${p.id}" title="Edit"><span class="material-symbols-outlined">edit</span></button>
                  <button class="btn btn-sm btn-danger btn-delete-product" data-id="${p.id}" title="Delete"><span class="material-symbols-outlined">delete</span></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Listeners moved to global delegator
}

function showProductModal(product, categories) {
  const isEdit = !!product;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${isEdit ? 'Edit Product' : 'Add Product'}</h3>
        <button class="modal-close-btn" id="modal-close-x" type="button">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <form id="product-form">
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" value="${product?.name || ''}" required placeholder="Product name">
        </div>

        <!-- PRICING SECTION -->
        <h4 class="section-divider">Pricing & Currency</h4>
        <div class="grid-2">
          <div class="form-group">
            <label>Currency</label>
            <select name="currency">
              <option value="USD" ${(product?.currency||'USD')==='USD'?'selected':''}>$ USD — US Dollar</option>
              <option value="INR" ${product?.currency==='INR'?'selected':''}>₹ INR — Indian Rupee</option>
              <option value="AED" ${product?.currency==='AED'?'selected':''}>د.إ AED — UAE Dirham</option>
              <option value="EUR" ${product?.currency==='EUR'?'selected':''}>€ EUR — Euro</option>
              <option value="GBP" ${product?.currency==='GBP'?'selected':''}>£ GBP — British Pound</option>
              <option value="SAR" ${product?.currency==='SAR'?'selected':''}>﷼ SAR — Saudi Riyal</option>
              <option value="JPY" ${product?.currency==='JPY'?'selected':''}>¥ JPY — Japanese Yen</option>
              <option value="CAD" ${product?.currency==='CAD'?'selected':''}>CA$ CAD — Canadian Dollar</option>
              <option value="AUD" ${product?.currency==='AUD'?'selected':''}>A$ AUD — Australian Dollar</option>
              <option value="SGD" ${product?.currency==='SGD'?'selected':''}>S$ SGD — Singapore Dollar</option>
            </select>
          </div>
          <div class="form-group">
            <label>Sale Price <span style="opacity:0.5;font-weight:400">(leave blank = "Ask for price")</span></label>
            <input type="number" name="price" value="${product?.price || ''}" step="0.01" min="0" placeholder="0.00" id="sale-price-input">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label>Original Price <span style="opacity:0.5;font-weight:400">(for discount — optional)</span></label>
            <input type="number" name="originalPrice" value="${product?.originalPrice || ''}" step="0.01" min="0" placeholder="Higher original price" id="original-price-input">
          </div>
          <div class="form-group">
            <label>Discount Preview</label>
            <div id="discount-preview" style="padding:0.75rem 1rem;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.875rem;color:var(--text-secondary);min-height:44px;display:flex;align-items:center">
              —
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Category</label>
            <select name="categoryId" required>
              ${(Array.isArray(categories) ? categories : []).map(c => `<option value="${c.id}" ${product?.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Badge</label>
            <select name="badge">
              <option value="">None</option>
              <option value="Top Pick" ${product?.badge === 'Top Pick' ? 'selected' : ''}>Top Pick</option>
              <option value="Trending Now" ${product?.badge === 'Trending Now' ? 'selected' : ''}>Trending Now</option>
              <option value="Editor's Choice" ${product?.badge === "Editor's Choice" ? 'selected' : ''}>Editor's Choice</option>
              <option value="Best Deal" ${product?.badge === 'Best Deal' ? 'selected' : ''}>Best Deal</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Short Description</label>
          <input type="text" name="shortDescription" value="${product?.shortDescription || ''}" placeholder="One-line selling point">
        </div>

        <!-- ENHANCED IMAGE SECTION with URL Fetch + Upload -->
        <div class="form-group">
          <label>Image</label>
          <div class="image-section">
            <div class="image-url-row">
              <input type="text" name="image" id="product-image-path" value="${product?.image || ''}" placeholder="https://example.com/image.jpg or /assets/uploads/image.jpg">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-fetch-image" title="Preview image from URL">
                <span class="material-symbols-outlined">preview</span>
                <span class="btn-label">Preview</span>
              </button>
            </div>
            <div id="image-preview-wrap" style="display:none;margin:0.5rem 0;">
              <img id="preview-img" style="max-height:90px;max-width:180px;border-radius:8px;border:1px solid var(--border);object-fit:contain;background:var(--bg-secondary);" alt="Preview">
            </div>
            <div id="product-dropzone" class="dropzone dropzone-wide">
              <span class="material-symbols-outlined">upload_file</span>
              <span>Or drag &amp; drop / click to upload a file</span>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Affiliate URL</label>
            <input type="url" name="affiliateUrl" value="${product?.affiliateUrl || ''}" placeholder="https://amazon.com/...">
          </div>
          <div class="form-group">
            <label>Rating Value</label>
            <input type="number" name="ratingValue" value="${product?.ratingValue || ''}" step="0.1" max="5" placeholder="4.8">
          </div>
        </div>
        <div class="form-group">
          <label>Key Benefits (one per line)</label>
          <textarea name="keyBenefits" placeholder="Fast charging&#10;Compact design&#10;Universal compatibility">${(() => {
            let b = product?.keyBenefits || [];
            if (typeof b === 'string' && b.startsWith('[')) { try { b = JSON.parse(b); } catch(e) { b = [b]; } }
            return Array.isArray(b) ? b.join('\n') : b;
          })()}</textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" id="modal-submit">
            <span class="material-symbols-outlined">${isEdit ? 'save' : 'add_circle'}</span>
            ${isEdit ? 'Update' : 'Create'} Product
          </button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('#modal-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#modal-close-x').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  // Fetch/Preview image from URL
  const imgInput = overlay.querySelector('#product-image-path');
  const previewWrap = overlay.querySelector('#image-preview-wrap');
  const previewImg = overlay.querySelector('#preview-img');

  overlay.querySelector('#btn-fetch-image').addEventListener('click', () => {
    const url = imgInput.value.trim();
    if (!url) { toast('Enter an image URL first', 'error'); return; }
    previewImg.src = url;
    previewImg.onerror = () => {
      toast('Could not load image — check URL or CORS policy', 'error');
      previewWrap.style.display = 'none';
    };
    previewImg.onload = () => {
      previewWrap.style.display = 'block';
      toast('Image preview loaded');
    };
  });

  // Auto-preview if value already exists on edit
  if (product?.image) {
    previewImg.src = product.image;
    previewImg.onload = () => { previewWrap.style.display = 'block'; };
  }

  // Drag & Drop upload
  const dropzone = overlay.querySelector('#product-dropzone');
  initDragAndDrop(dropzone, (url) => {
    imgInput.value = url;
    previewImg.src = url;
    previewImg.onload = () => { previewWrap.style.display = 'block'; };
    toast('Image uploaded successfully');
  });

  // ── Live Discount Preview ─────────────────────────────────────────
  const salePriceInput    = overlay.querySelector('#sale-price-input');
  const originalPriceInput = overlay.querySelector('#original-price-input');
  const discountPreview   = overlay.querySelector('#discount-preview');

  function updateDiscountPreview() {
    const sale = parseFloat(salePriceInput?.value) || 0;
    const orig = parseFloat(originalPriceInput?.value) || 0;
    if (!discountPreview) return;
    if (sale > 0 && orig > sale) {
      const pct = Math.round((1 - sale / orig) * 100);
      discountPreview.innerHTML = `<span style="color:var(--success);font-weight:700;font-size:1rem">${pct}% OFF</span>&nbsp;<span style="color:var(--text-muted)">· Save ${(orig - sale).toFixed(2)}</span>`;
    } else if (sale > 0 && orig > 0 && orig <= sale) {
      discountPreview.innerHTML = `<span style="color:var(--warning)">Original price must be higher than sale price</span>`;
    } else if (sale === 0) {
      discountPreview.innerHTML = `<span style="color:var(--accent)">"Ask for price" card shown to visitors</span>`;
    } else {
      discountPreview.innerHTML = `<span style="color:var(--text-muted)">Set Original Price above to show discount</span>`;
    }
  }

  salePriceInput?.addEventListener('input', updateDiscountPreview);
  originalPriceInput?.addEventListener('input', updateDiscountPreview);
  updateDiscountPreview(); // run on open

  overlay.querySelector('#product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = overlay.querySelector('#modal-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="loading-spinner" style="width:16px;height:16px"></div> Saving...';

    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    body.keyBenefits = body.keyBenefits.split('\n').filter(Boolean);
    body.price        = body.price ? parseFloat(body.price) : null;
    body.originalPrice = body.originalPrice ? parseFloat(body.originalPrice) : null;
    body.ratingValue  = parseFloat(body.ratingValue) || 0;
    body.currency     = body.currency || 'USD';

    let res;
    if (isEdit) {
      res = await api(`/products/${product.id}`, { method: 'PUT', body: JSON.stringify(body) });
      if (res?.error) { toast(res.error, 'error'); submitBtn.disabled = false; submitBtn.innerHTML = '<span class="material-symbols-outlined">save</span> Update Product'; return; }
      toast('Product updated');
    } else {
      res = await api('/products', { method: 'POST', body: JSON.stringify(body) });
      if (res?.error) { toast(res.error, 'error'); submitBtn.disabled = false; submitBtn.innerHTML = '<span class="material-symbols-outlined">add_circle</span> Create Product'; return; }
      toast('Product created');
    }
    overlay.remove();
    setTimeout(() => renderView(), 100);
  });
}


// === Categories ===
async function renderCategories(main) {
  const cats = await api('/categories');
  if (!cats) return;

  main.innerHTML = `
    <div class="page-header">
      <div><h2>Categories</h2><div class="subtitle">${cats.length} categories</div></div>
      <button class="btn btn-primary" id="btn-add-cat"><span class="material-symbols-outlined">add</span> Add Category</button>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Name</th><th class="hide-xs">Slug</th><th>Products</th><th class="hide-sm">Theme</th><th>Actions</th></tr></thead>
        <tbody>
          ${cats.map(c => `
            <tr>
              <td><strong>${c.name}</strong></td>
              <td class="text-muted hide-xs">${c.slug}</td>
              <td><span class="badge badge-info">${c._count?.products || 0}</span></td>
              <td class="hide-sm"><span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${c.theme?.primary || '#999'};vertical-align:middle"></span></td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-sm btn-secondary btn-edit-cat" data-id="${c.id}" title="Edit"><span class="material-symbols-outlined">edit</span></button>
                  <button class="btn btn-sm btn-danger btn-delete-cat" data-id="${c.id}" title="Delete"><span class="material-symbols-outlined">delete</span></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('btn-add-cat')?.addEventListener('click', () => showCategoryModal(null));
  document.querySelectorAll('.btn-edit-cat').forEach(b => b.addEventListener('click', () => {
    const c = cats.find(x => String(x.id) === String(b.dataset.id));
    if (c) showCategoryModal(c);
  }));

  // FIXED: Category delete with proper error handling
  document.querySelectorAll('.btn-delete-cat').forEach(b => b.addEventListener('click', async () => {
    if (!confirm('Delete this category? This will also remove all associated products.')) return;
    const catId = b.dataset.id;
    b.disabled = true;
    b.innerHTML = '<div class="loading-spinner" style="width:14px;height:14px"></div>';
    const res = await api(`/categories/${catId}`, { method: 'DELETE' });
    if (res?.error) {
      toast('Delete failed: ' + res.error, 'error');
      b.disabled = false;
      b.innerHTML = '<span class="material-symbols-outlined">delete</span>';
      return;
    }
    toast('Category deleted');
    await renderView();
  }));
}

function showCategoryModal(cat) {
  const isEdit = !!cat;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${isEdit ? 'Edit Category' : 'Add Category'}</h3>
        <button class="modal-close-btn" id="modal-close-x" type="button">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <form id="cat-form">
        <div class="grid-2">
          <div class="form-group"><label>Name</label><input type="text" name="name" value="${cat?.name || ''}" required placeholder="Category name"></div>
          <div class="form-group"><label>Slug</label><input type="text" name="slug" value="${cat?.slug || ''}" placeholder="auto-generated"></div>
        </div>
        <div class="form-group">
          <label>Image & Media</label>
          <div class="image-section">
            <div class="image-url-row">
              <input type="text" name="image" id="cat-image-path" value="${cat?.image || ''}" placeholder="https://example.com/image.jpg or /assets/uploads/image.jpg">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-fetch-cat-image" title="Preview image from URL">
                <span class="material-symbols-outlined">preview</span>
                <span class="btn-label">Preview</span>
              </button>
            </div>
            <div id="cat-image-preview-wrap" style="display:none;margin:0.5rem 0;">
              <img id="cat-preview-img" style="max-height:80px;max-width:160px;border-radius:8px;border:1px solid var(--border);object-fit:contain;background:var(--bg-secondary);" alt="Preview">
            </div>
            <div id="cat-dropzone" class="dropzone dropzone-wide">
              <span class="material-symbols-outlined">upload_file</span>
              <span>Or drag &amp; drop / click to upload</span>
            </div>
          </div>
        </div>
        <div class="form-group"><label>Description</label><textarea name="description" placeholder="Category description...">${cat?.description || ''}</textarea></div>
        <h4 class="section-divider">Theme</h4>
        <div class="grid-2">
          <div class="form-group"><label>Primary Color</label><input type="text" name="primary" value="${cat?.theme?.primary || '#914d00'}" placeholder="#914d00"></div>
          <div class="form-group"><label>Secondary Color</label><input type="text" name="secondary" value="${cat?.theme?.secondary || '#f28c28'}" placeholder="#f28c28"></div>
        </div>
        <div class="grid-2">
          <div class="form-group"><label>Theme Title</label><input type="text" name="title" value="${cat?.theme?.title || ''}" placeholder="Category title"></div>
          <div class="form-group"><label>Subtitle</label><input type="text" name="subtitle" value="${cat?.theme?.subtitle || ''}" placeholder="Category subtitle"></div>
        </div>
        <h4 class="section-divider">SEO</h4>
        <div class="form-group"><label>SEO Title</label><input type="text" name="seoTitle" value="${cat?.theme?.seoTitle || ''}"></div>
        <div class="form-group"><label>SEO Intro</label><textarea name="seoIntro" placeholder="SEO-friendly intro text...">${cat?.theme?.seoIntro || ''}</textarea></div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Category</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#modal-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#modal-close-x').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  const catImgInput = overlay.querySelector('#cat-image-path');
  const catPreviewWrap = overlay.querySelector('#cat-image-preview-wrap');
  const catPreviewImg = overlay.querySelector('#cat-preview-img');

  overlay.querySelector('#btn-fetch-cat-image').addEventListener('click', () => {
    const url = catImgInput.value.trim();
    if (!url) { toast('Enter an image URL first', 'error'); return; }
    catPreviewImg.src = url;
    catPreviewImg.onerror = () => { toast('Could not load image from URL', 'error'); catPreviewWrap.style.display = 'none'; };
    catPreviewImg.onload = () => { catPreviewWrap.style.display = 'block'; toast('Image preview loaded'); };
  });

  if (cat?.image) {
    catPreviewImg.src = cat.image;
    catPreviewImg.onload = () => { catPreviewWrap.style.display = 'block'; };
  }

  const dropzone = overlay.querySelector('#cat-dropzone');
  initDragAndDrop(dropzone, (url) => {
    catImgInput.value = url;
    catPreviewImg.src = url;
    catPreviewImg.onload = () => { catPreviewWrap.style.display = 'block'; };
    toast('Category image uploaded');
  });

  overlay.querySelector('#cat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const d = Object.fromEntries(fd.entries());
    const body = {
      name: d.name, slug: d.slug, image: d.image, description: d.description,
      theme: { primary: d.primary, secondary: d.secondary, title: d.title || d.name, subtitle: d.subtitle, seoTitle: d.seoTitle, seoIntro: d.seoIntro },
    };
    if (isEdit) {
      await api(`/categories/${cat.id}`, { method: 'PUT', body: JSON.stringify(body) });
      toast('Category updated');
    } else {
      await api('/categories', { method: 'POST', body: JSON.stringify(body) });
      toast('Category created');
    }
    overlay.remove();
    renderView();
  });
}

// === Blog ===
async function renderBlog(main) {
  const data = await api('/blog/admin/all');
  if (!data) return;
  
  main.innerHTML = `
    <div class="page-header">
      <div><h2>Blog Posts</h2><div class="subtitle">${data.length} posts total</div></div>
      <button class="btn btn-primary" id="btn-add-blog"><span class="material-symbols-outlined">add</span> Add Post</button>
    </div>
    <div class="admin-blog-list">
      ${data.map(p => `
        <div class="admin-blog-card">
          <div class="admin-blog-img">
            <img src="${p.coverImage || ''}" alt="" onerror="this.style.opacity='0.2'">
          </div>
          <div class="admin-blog-content">
            <div class="admin-blog-main">
              <div class="admin-blog-info">
                <h3 class="admin-blog-title">${p.title}</h3>
                <div class="admin-blog-meta">
                  <span class="badge ${p.isPublished ? 'badge-success' : 'badge-warning'}">${p.isPublished ? 'Published' : 'Draft'}</span>
                  <span class="text-muted text-sm">${new Date(p.createdAt).toLocaleDateString()}</span>
                  <span class="text-muted text-sm">· By ${p.author}</span>
                </div>
                <p class="admin-blog-excerpt">${p.content ? p.content.replace(/<[^>]*>?/gm, '') : (p.excerpt || 'No content provided.')}</p>
              </div>
              <div class="action-btns">
                <button class="btn btn-sm btn-secondary btn-edit-blog" data-id="${p.id}" title="Edit"><span class="material-symbols-outlined">edit</span> <span class="btn-label">Edit</span></button>
                <button class="btn btn-sm btn-danger btn-delete-blog" data-id="${p.id}" title="Delete"><span class="material-symbols-outlined">delete</span></button>
              </div>
            </div>
          </div>
        </div>
      `).join('') || '<div class="text-center text-muted" style="padding:4rem">No posts yet</div>'}
    </div>
  `;

  // Listeners moved to global delegator
}

function showBlogModal(post) {
  const isEdit = !!post;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="max-width:800px; width:95%;">
      <div class="modal-header">
        <h3>${isEdit ? 'Edit Blog Post' : 'Add Blog Post'}</h3>
        <button class="modal-close-btn" id="modal-close-x" type="button"><span class="material-symbols-outlined">close</span></button>
      </div>
      <form id="blog-form">
        <div class="grid-2">
          <div class="form-group"><label>Title</label><input type="text" name="title" value="${post?.title || ''}" required></div>
          <div class="form-group"><label>Slug</label><input type="text" name="slug" value="${post?.slug || ''}" placeholder="auto-generated"></div>
        </div>
        <div class="form-group">
          <label>Cover Image URL</label>
          <input type="text" name="coverImage" value="${post?.coverImage || ''}" placeholder="https://example.com/image.jpg">
        </div>
        <div class="grid-2">
          <div class="form-group"><label>Author</label><input type="text" name="author" value="${post?.author || 'MRT Editorial'}"></div>
          <div class="form-group" style="display:flex;align-items:center;gap:0.5rem;padding-top:2rem">
            <input type="checkbox" id="isPublished" name="isPublished" ${post?.isPublished ? 'checked' : ''} style="width:auto;height:auto;transform:scale(1.2)">
            <label for="isPublished" style="margin:0;font-weight:700;color:var(--ink)">Published & Visible on Site</label>
          </div>
        </div>
        <div class="form-group"><label>Excerpt</label><textarea name="excerpt" style="height:60px">${post?.excerpt || ''}</textarea></div>
        <div class="form-group"><label>HTML Content</label><textarea name="content" required style="height:350px;font-family:monospace;font-size:13px">${post?.content || ''}</textarea></div>
        
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Post</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#modal-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#modal-close-x').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#blog-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    body.isPublished = e.target.querySelector('#isPublished').checked;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="loading-spinner" style="width:16px;height:16px"></div> Saving...';

    let res;
    if (isEdit) {
      res = await api(`/blog/${post.id}`, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      res = await api('/blog', { method: 'POST', body: JSON.stringify(body) });
    }
    
    if (res?.error) { toast(res.error, 'error'); submitBtn.disabled = false; submitBtn.innerHTML = isEdit ? 'Update Post' : 'Create Post'; return; }
    toast(`Post ${isEdit ? 'updated' : 'created'}`);
    overlay.remove();
    renderView();
  });
}

// === Testimonials ===
async function renderTestimonials(main) {
  const items = await api('/testimonials');
  if (!items) return;

  main.innerHTML = `
    <div class="page-header">
      <div><h2>Testimonials</h2><div class="subtitle">${items.length} reviews</div></div>
      <button class="btn btn-primary" id="btn-add-test"><span class="material-symbols-outlined">add</span> Add</button>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Name</th><th class="hide-xs">Location</th><th>Region</th><th class="hide-sm">Text</th><th>Actions</th></tr></thead>
        <tbody>
          ${items.map(t => `
            <tr>
              <td><strong>${t.name}</strong></td>
              <td class="text-muted hide-xs">${t.location}</td>
              <td><span class="badge badge-info">${t.region.toUpperCase()}</span></td>
              <td class="text-sm hide-sm" style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.text}</td>
              <td><button class="btn btn-sm btn-danger btn-del-test" data-id="${t.id}"><span class="material-symbols-outlined">delete</span></button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Listeners moved to global delegator
}

function showTestimonialModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Add Testimonial</h3>
        <button class="modal-close-btn" id="modal-close-x" type="button"><span class="material-symbols-outlined">close</span></button>
      </div>
      <form id="test-form">
        <div class="grid-2">
          <div class="form-group"><label>Name</label><input type="text" name="name" required placeholder="John Doe"></div>
          <div class="form-group"><label>Location</label><input type="text" name="location" required placeholder="Dubai, UAE"></div>
        </div>
        <div class="grid-2">
          <div class="form-group"><label>Region</label><select name="region"><option value="us">US</option><option value="ae">UAE</option></select></div>
          <div class="form-group"><label>Quote Title</label><input type="text" name="quote" placeholder="Great product!"></div>
        </div>
        <div class="form-group"><label>Review Text</label><textarea name="text" required placeholder="Customer's review text..."></textarea></div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#modal-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#modal-close-x').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('#test-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target).entries());
    await api('/testimonials', { method: 'POST', body: JSON.stringify(body) });
    toast('Created'); overlay.remove(); renderView();
  });
}

// === Newsletter ===
async function renderNewsletter(main) {
  const data = await api('/newsletter/subscribers');
  if (!data) return;
  const subscribers = data.subscribers || data || [];

  main.innerHTML = `
    <div class="page-header">
      <div><h2>Newsletter</h2><div class="subtitle">${subscribers.length} subscribers</div></div>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Email</th><th class="hide-xs">Date</th><th>Actions</th></tr></thead>
        <tbody>
          ${subscribers.map(s => `
            <tr>
              <td>${s.email}</td>
              <td class="text-muted text-sm hide-xs">${new Date(s.createdAt || s.date).toLocaleDateString()}</td>
              <td><button class="btn btn-sm btn-danger btn-del-sub" data-id="${s.id}"><span class="material-symbols-outlined">delete</span></button></td>
            </tr>
          `).join('') || '<tr><td colspan="3" class="text-center text-muted" style="padding:2rem">No subscribers yet</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  document.querySelectorAll('.btn-del-sub').forEach(b => b.addEventListener('click', async () => {
    if (!confirm('Remove subscriber?')) return;
    const res = await api(`/newsletter/subscribers/${b.dataset.id}`, { method: 'DELETE' });
    if (res?.error) { toast('Remove failed', 'error'); return; }
    toast('Subscriber removed'); renderView();
  }));
}

async function loadMessages() {
  const messages = await api('/admin/messages');
  return Array.isArray(messages) ? messages : [];
}

async function renderMessages(main) {
  const messages = await loadMessages();

  main.innerHTML = `
    <div class="page-header">
      <div><h2>Messages</h2><div class="subtitle">${messages.length} contact submissions</div></div>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Name</th><th class="hide-xs">Contact</th><th class="hide-sm">Subject</th><th>Status</th><th>Date</th><th class="hide-sm">Message</th></tr></thead>
        <tbody id="messages-table-body">
          ${messages.map(msg => `
            <tr>
              <td>
                <strong>${msg.name}</strong>
                <br><span class="text-muted text-sm">${msg.email}</span>
              </td>
              <td class="hide-xs">${msg.phone || '-'}</td>
              <td class="hide-sm">${msg.subject || '-'}</td>
              <td><span class="badge badge-info">${msg.status || 'new'}</span></td>
              <td class="text-muted text-sm">${new Date(msg.createdAt).toLocaleString()}</td>
              <td class="hide-sm" style="max-width:320px;white-space:normal;line-height:1.5">${msg.message}</td>
            </tr>
          `).join('') || '<tr><td colspan="6" class="text-center text-muted" style="padding:2rem">No messages yet</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

// === Analytics ===
async function renderAnalytics(main) {
  const data = await api('/admin/analytics');
  const stats = await api('/admin/stats');
  if (!data || !stats) return;

  main.innerHTML = `
    <div class="page-header">
      <div><h2>Analytics</h2><div class="subtitle">Platform performance & engagement metrics</div></div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">ads_click</span></div>
        <div class="stat-label">Total Affiliate Clicks</div>
        <div class="stat-value">${stats.clickCount || 0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">rate_review</span></div>
        <div class="stat-label">Product Reviews</div>
        <div class="stat-value">${stats.reviewCount || 0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">mail</span></div>
        <div class="stat-label">Conversion Rate</div>
        <div class="stat-value">${((stats.clickCount / (stats.productCount || 1)) * 100).toFixed(1)}%</div>
      </div>
    </div>

    <div class="stat-card" style="margin-bottom:1.5rem">
      <h3 style="font-size:1rem;opacity:0.6;margin-bottom:1.5rem">Category Distribution</h3>
      <div class="chart-container" style="height:200px;display:flex;align-items:flex-end;gap:1rem;padding-bottom:1rem;border-bottom:1px solid var(--border);overflow-x:auto">
        ${(data.categoryDistribution || []).map(c => `
          <div class="chart-bar-group" style="flex:1;min-width:40px;display:flex;flex-direction:column;align-items:center;gap:0.5rem">
            <div class="chart-bar" style="width:100%;background:var(--primary);height:${(c._count / (stats.productCount || 1)) * 180}px;border-radius:4px 4px 0 0;min-height:4px;transition:height 1s ease"></div>
            <span style="font-size:9px;text-transform:uppercase;letter-spacing:-0.02em;opacity:0.4;text-align:center;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.categoryId}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="table-container">
      <div class="table-header"><h3>Click Stream (Recent)</h3></div>
      <table>
        <thead><tr><th>Product</th><th class="hide-xs">Source</th><th class="hide-sm">User Agent</th><th>Time</th></tr></thead>
        <tbody>
          ${(data.clicks || []).slice(0, 10).map(c => `
            <tr>
              <td><strong>${c.product?.name || 'Unknown'}</strong></td>
              <td class="hide-xs"><span class="badge badge-info">${c.source || 'Direct'}</span></td>
              <td class="text-xs hide-sm" style="opacity:0.5;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.userAgent || '-'}</td>
              <td class="text-xs">${new Date(c.clickedAt || c.createdAt).toLocaleString()}</td>
            </tr>
          `).join('') || '<tr><td colspan="4" class="text-center text-muted" style="padding:2rem">No clicks recorded</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

// === Reviews ===
async function renderReviews(main) {
  const reviews = await api('/admin/reviews');
  if (!reviews) return;

  main.innerHTML = `
    <div class="page-header">
      <div><h2>Reviews</h2><div class="subtitle">${reviews.length} customer reviews total</div></div>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Product</th><th class="hide-xs">User</th><th>Rating</th><th class="hide-sm">Comment</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${reviews.map(r => `
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:0.5rem">
                  <img src="${r.product?.image || ''}" class="product-thumb" style="width:30px;height:30px" onerror="this.style.opacity='0.2'">
                  <span class="text-sm font-bold">${r.product?.name || 'Unknown'}</span>
                </div>
              </td>
              <td class="hide-xs"><strong>${r.userName}</strong></td>
              <td><span class="badge badge-warning">${r.rating}/5</span></td>
              <td class="text-sm hide-sm" style="font-style:italic;opacity:0.8;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r.comment}">"${r.comment}"</td>
              <td><span class="badge ${r.isVerified ? 'badge-success' : 'badge-info'}">${r.isVerified ? 'Verified' : 'Pending'}</span></td>
              <td>
                <div class="action-btns">
                  ${!r.isVerified ? `<button class="btn btn-sm btn-primary btn-verify-review" data-id="${r.id}" title="Verify"><span class="material-symbols-outlined">verified</span></button>` : ''}
                  <button class="btn btn-sm btn-danger btn-delete-review" data-id="${r.id}" title="Delete"><span class="material-symbols-outlined">delete</span></button>
                </div>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="6" class="text-center text-muted" style="padding:2rem">No reviews to manage</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  document.querySelectorAll('.btn-verify-review').forEach(b => b.addEventListener('click', async () => {
    await api(`/admin/reviews/${b.dataset.id}/verify`, { method: 'POST' });
    toast('Review verified'); renderView();
  }));

  document.querySelectorAll('.btn-delete-review').forEach(b => b.addEventListener('click', async () => {
    if (!confirm('Delete this review?')) return;
    const res = await api(`/reviews/${b.dataset.id}`, { method: 'DELETE' });
    if (res?.error) { toast('Delete failed', 'error'); return; }
    toast('Review deleted'); renderView();
  }));
}

// === Drag & Drop Upload Support ===
function initDragAndDrop(dropzone, onUpload) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => { e.preventDefault(); e.stopPropagation(); });
  });

  dropzone.addEventListener('dragover', () => dropzone.classList.add('drag-active'));
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-active'));
  dropzone.addEventListener('drop', async (e) => {
    dropzone.classList.remove('drag-active');
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    dropzone.innerHTML = '<div class="loading-spinner"></div>';

    try {
      const res = await fetch(`${API}/media/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data && data[0]) onUpload(data[0].url);
      else toast('Upload failed', 'error');
    } catch (err) {
      toast('Upload error', 'error');
    } finally {
      dropzone.innerHTML = `<span class="material-symbols-outlined">upload_file</span><span>Upload Completed ✓</span>`;
    }
  });

  dropzone.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('files', file);
      dropzone.innerHTML = '<div class="loading-spinner"></div>';
      try {
        const res = await fetch(`${API}/media/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const data = await res.json();
        if (data && data[0]) onUpload(data[0].url);
      } catch (err) { toast('Upload error', 'error'); }
      finally { dropzone.innerHTML = `<span class="material-symbols-outlined">upload_file</span><span>Upload Completed ✓</span>`; }
    };
    input.click();
  });
}

// === CUSTOM ASYNC CONFIRM MODAL ===
function customConfirm(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.zIndex = '2000';
    overlay.innerHTML = `
      <div class="modal" style="max-width: 400px; text-align: center; padding: 2rem;">
        <div class="stat-icon" style="background: var(--bg-secondary); margin: 0 auto 1.5rem; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
          <span class="material-symbols-outlined" style="font-size: 32px; color: var(--accent);">help</span>
        </div>
        <h3 style="margin-bottom: 1rem;">Confirm Action</h3>
        <p style="margin-bottom: 2rem; color: var(--text-secondary); line-height: 1.6;">${message}</p>
        <div class="modal-actions" style="justify-content: center; gap: 1rem;">
          <button class="btn btn-secondary" id="confirm-cancel">Cancel</button>
          <button class="btn btn-danger" id="confirm-yes">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const cleanup = (val) => {
      overlay.remove();
      resolve(val);
    };

    overlay.querySelector('#confirm-cancel').addEventListener('click', () => cleanup(false));
    overlay.querySelector('#confirm-yes').addEventListener('click', () => cleanup(true));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(false); });
  });
}

// === Global Event Delegator (Ensures listeners are never lost) ===
document.addEventListener('click', async (e) => {
  const target = e.target;
  
  try {
    // 1. PRODUCT ACTIONS
    const editProdBtn = target.closest('.btn-edit-product');
    if (editProdBtn) {
      const productId = editProdBtn.dataset.id;
      const p = (window._allProducts || []).find(x => String(x.id) === String(productId));
      if (p) {
        const cats = await api('/categories');
        if (cats && !cats.error) {
          showProductModal(p, cats);
        } else {
          toast('Failed to load categories', 'error');
        }
      } else {
        console.warn('Product not found in window._allProducts:', productId);
      }
      return;
    }

    const deleteProdBtn = target.closest('.btn-delete-product');
    if (deleteProdBtn) {
      if (!await customConfirm('Are you sure you want to delete this product?')) return;
      deleteProdBtn.disabled = true;
      const res = await api(`/products/${deleteProdBtn.dataset.id}`, { method: 'DELETE' });
      if (res?.error) { toast(res.error, 'error'); deleteProdBtn.disabled = false; return; }
      toast('Product deleted');
      renderView();
      return;
    }

    const addProdBtn = target.closest('#btn-add-product');
    if (addProdBtn) {
      const cats = await api('/categories');
      if (cats && !cats.error) {
        showProductModal(null, cats);
      } else {
        toast('Failed to load categories', 'error');
      }
      return;
    }

    // 2. CATEGORY ACTIONS
    const editCatBtn = target.closest('.btn-edit-cat');
    if (editCatBtn) {
      const cats = await api('/categories');
      const c = (Array.isArray(cats) ? cats : []).find(x => String(x.id) === String(editCatBtn.dataset.id));
      if (c) showCategoryModal(c);
      return;
    }

    const deleteCatBtn = target.closest('.btn-delete-cat');
    if (deleteCatBtn) {
      if (!await customConfirm('Delete this category? This will also remove all associated products.')) return;
      deleteCatBtn.disabled = true;
      const res = await api(`/categories/${deleteCatBtn.dataset.id}`, { method: 'DELETE' });
      if (res?.error) { toast(res.error, 'error'); deleteCatBtn.disabled = false; return; }
      toast('Category deleted');
      renderView();
      return;
    }

    const addCatBtn = target.closest('#btn-add-cat');
    if (addCatBtn) {
      showCategoryModal(null);
      return;
    }

    // 3. BLOG ACTIONS
    const editBlogBtn = target.closest('.btn-edit-blog');
    if (editBlogBtn) {
      const posts = await api('/blog/admin/all');
      const p = (posts || []).find(x => String(x.id) === String(editBlogBtn.dataset.id));
      if (p) showBlogModal(p);
      return;
    }

    const deleteBlogBtn = target.closest('.btn-delete-blog');
    if (deleteBlogBtn) {
      if (!await customConfirm('Are you sure you want to delete this blog post?')) return;
      deleteBlogBtn.disabled = true;
      const res = await api(`/blog/${deleteBlogBtn.dataset.id}`, { method: 'DELETE' });
      if (res?.error) { toast(res.error, 'error'); deleteBlogBtn.disabled = false; return; }
      toast('Post deleted');
      renderView();
      return;
    }

    const addBlogBtn = target.closest('#btn-add-blog');
    if (addBlogBtn) {
      showBlogModal(null);
      return;
    }

    // 4. TESTIMONIAL ACTIONS
    const deleteTestBtn = target.closest('.btn-del-test');
    if (deleteTestBtn) {
      if (!await customConfirm('Delete this testimonial?')) return;
      deleteTestBtn.disabled = true;
      const res = await api(`/testimonials/${deleteTestBtn.dataset.id}`, { method: 'DELETE' });
      if (res?.error) { toast(res.error, 'error'); deleteTestBtn.disabled = false; return; }
      toast('Testimonial deleted');
      renderView();
      return;
    }

    const addTestBtn = target.closest('#btn-add-test');
    if (addTestBtn) {
      // Inline show modal logic or separate function
      showTestimonialModal();
      return;
    }

    // 5. REVIEW ACTIONS
    const verifyReviewBtn = target.closest('.btn-verify-review');
    if (verifyReviewBtn) {
      const res = await api(`/admin/reviews/${verifyReviewBtn.dataset.id}/verify`, { method: 'POST' });
      if (res?.error) return toast(res.error, 'error');
      toast('Review verified');
      renderView();
      return;
    }

    const deleteReviewBtn = target.closest('.btn-delete-review');
    if (deleteReviewBtn) {
      if (!await customConfirm('Delete this review?')) return;
      const res = await api(`/reviews/${deleteReviewBtn.dataset.id}`, { method: 'DELETE' });
      if (res?.error) return toast(res.error, 'error');
      toast('Review deleted');
      renderView();
      return;
    }
  } catch (err) {
    console.error('Global Click Delegator Error:', err);
    toast('An unexpected error occurred', 'error');
  }
});

// Boot
render();
