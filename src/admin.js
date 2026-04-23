import './style.css';

const SVG_LOGO = `
  <svg viewBox="0 0 240 60" class="h-8 w-auto" aria-label="MRT International">
    <text x="0" y="45" font-family="Manrope, sans-serif" font-weight="800" font-size="40" fill="#003366" letter-spacing="-1.5">MR</text>
    <text x="68" y="45" font-family="Manrope, sans-serif" font-weight="800" font-size="40" fill="#ff8c00" letter-spacing="-1.5">T</text>
    <path d="M98 15L112 5L126 15" fill="none" stroke="#ff8c00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M112 5V22" fill="none" stroke="#ff8c00" stroke-width="5" stroke-linecap="round"/>
  </svg>
`;

class MRTCMS {
    constructor() {
        this.token = localStorage.getItem('mrt_admin_token');
        this.currentTab = 'dashboard';
        this.categories = [];
        this.products = [];

        this.init();
    }

    async init() {
        this.injectLogos();
        this.bindAuthEvents();
        
        if (this.token) {
            document.getElementById('login-overlay').classList.add('hidden');
            await this.loadInitialData();
            this.bindTabEvents();
            this.bindCRUDEvents();
            this.renderDashboard();
        }
    }

    injectLogos() {
        ['admin-logo-login', 'admin-logo-sidebar'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = SVG_LOGO;
        });
    }

    /* ── AUTHENTICATION ────────────────────────────────────────── */
    bindAuthEvents() {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: username, password })
                });

                if (res.ok) {
                    const { token } = await res.json();
                    this.token = token;
                    localStorage.setItem('mrt_admin_token', token);
                    window.location.reload();
                } else {
                    document.getElementById('login-error').classList.remove('hidden');
                }
            } catch (err) {
                console.error('Login failed:', err);
            }
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('mrt_admin_token');
            window.location.reload();
        });
    }

    async api(path, options = {}) {
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${this.token}`
        };
        if (!(options.body instanceof FormData) && options.body) {
            headers['Content-Type'] = 'application/json';
        }

        const res = await fetch(path, { ...options, headers });
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('mrt_admin_token');
            window.location.reload();
        }
        return res;
    }

    /* ── DATA LOADING ──────────────────────────────────────────── */
    async loadInitialData() {
        try {
            const [catsRes, prodsRes] = await Promise.all([
                this.api('/api/categories'),
                this.api('/api/products')
            ]);
            this.categories = await catsRes.json();
            this.products = await prodsRes.json();

            // Also load testimonials
            try {
                const testRes = await this.api('/api/testimonials');
                this.testimonials = await testRes.json();
            } catch { this.testimonials = []; }
            
            this.populateCategorySelects();
        } catch (err) {
            this.notify('Failed to sync with server', 'error');
        }
    }

    populateCategorySelects() {
        const selects = ['filter-category', 'categoryId'];
        selects.forEach(id => {
            const el = document.querySelector(`[name="${id}"]`) || document.getElementById(id);
            if (!el) return;
            el.innerHTML = (id === 'filter-category' ? '<option value="">All Collections</option>' : '') + 
                this.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        });
    }

    /* ── TABS ──────────────────────────────────────────────────── */
    bindTabEvents() {
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tab) {
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`${tab}-tab`).classList.add('active');

        const titles = {
            dashboard: 'Dashboard Overview',
            categories: 'Collection Management',
            products: 'Inventory Management',
            testimonials: 'Global Feedback'
        };
        document.getElementById('tab-title').textContent = titles[tab];
        
        this.currentTab = tab;
        if (tab === 'dashboard') this.renderDashboard();
        if (tab === 'categories') this.renderCategories();
        if (tab === 'products') this.renderProducts();
        if (tab === 'testimonials') this.renderTestimonials();
    }

    /* ── DASHBOARD ─────────────────────────────────────────────── */
    renderDashboard() {
        document.getElementById('stat-products').textContent = this.products.length;
        document.getElementById('stat-categories').textContent = this.categories.length;
    }

    /* ── CATEGORIES ────────────────────────────────────────────── */
    renderCategories() {
        const list = document.getElementById('categories-list');
        list.innerHTML = this.categories.map(cat => `
            <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                <div class="w-full aspect-video rounded-[2rem] bg-gray-50 mb-6 overflow-hidden border border-gray-100">
                    <img src="${cat.image || '/assets/categories/placeholder.png'}" class="w-full h-full object-cover">
                </div>
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-xl font-serif italic text-primary">${cat.name}</h4>
                        <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">/${cat.slug}</p>
                    </div>
                    <span class="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">${cat.icon || 'category'}</span>
                </div>
                <div class="flex justify-between items-center pt-6 border-t border-gray-50">
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">${cat._count?.products || 0} Products</span>
                    <div class="flex space-x-2">
                        <button onclick="window.mrtcms.editCategory('${cat.id}')" class="p-2 hover:bg-gray-50 rounded-full text-primary transition-all"><span class="material-symbols-outlined text-lg">edit</span></button>
                        <button onclick="window.mrtcms.deleteCategory('${cat.id}')" class="p-2 hover:bg-red-50 rounded-full text-red-500 transition-all"><span class="material-symbols-outlined text-lg">delete</span></button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    editCategory(id) {
        const cat = this.categories.find(c => String(c.id) === String(id));
        if (!cat) return;
        const form = document.getElementById('category-form');
        form.id.value = cat.id;
        form.name.value = cat.name;
        form.slug.value = cat.slug;
        form.icon.value = cat.icon || '';
        form.image.value = cat.image || '';
        document.getElementById('category-image-preview').src = cat.image || '/assets/categories/placeholder.png';
        document.getElementById('category-modal-title').textContent = 'Edit Collection';
        document.getElementById('category-modal').classList.remove('hidden');
    }

    async deleteCategory(id) {
        if (!confirm('This will delete the collection and potentially disconnect its products. Continue?')) return;
        const res = await this.api(`/api/categories/${id}`, { method: 'DELETE' });
        if (res.ok) {
            this.notify('Collection liquidated.');
            await this.loadInitialData();
            this.renderCategories();
        }
    }

    /* ── PRODUCTS ──────────────────────────────────────────────── */
    renderProducts() {
        const query = document.getElementById('search-products').value.toLowerCase();
        const catFilter = document.getElementById('filter-category').value;
        
        let filtered = this.products;
        if (query) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.categoryName.toLowerCase().includes(query));
        }
        if (catFilter) {
            filtered = filtered.filter(p => p.categoryId === catFilter);
        }

        const list = document.getElementById('products-list');
        list.innerHTML = filtered.map(p => `
            <tr class="group hover:bg-gray-50/50 transition-all">
                <td class="px-8 py-6">
                    <div class="flex items-center space-x-6">
                        <div class="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                            <img src="${p.image || '/assets/products/placeholder.png'}" class="w-full h-full object-contain mix-blend-multiply">
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-800 text-sm tracking-tight mb-1">${p.name}</h4>
                            <span class="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded">${p.categoryName}</span>
                        </div>
                    </div>
                </td>
                <td class="px-8 py-6">
                    <div class="flex flex-col">
                        <span class="text-xs font-bold text-gray-500">${p.badge}</span>
                        <span class="text-[10px] text-gray-400 italic">${p.isFeatured ? '★ Featured Selection' : 'Standard In-Stock'}</span>
                    </div>
                </td>
                <td class="px-8 py-6">
                    <span class="font-bold text-sm text-gray-900">$${p.price.toFixed(2)}</span>
                </td>
                <td class="px-8 py-6 text-right">
                    <div class="flex justify-end space-x-1">
                        <button onclick="window.mrtcms.editProduct('${p.id}')" class="p-3 hover:bg-white hover:shadow-md rounded-xl text-primary transition-all"><span class="material-symbols-outlined text-lg">edit</span></button>
                        <button onclick="window.mrtcms.deleteProduct('${p.id}')" class="p-3 hover:bg-white hover:shadow-md rounded-xl text-red-500 transition-all"><span class="material-symbols-outlined text-lg">delete</span></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    editProduct(id) {
        const p = this.products.find(prod => String(prod.id) === String(id));
        if (!p) return;
        const form = document.getElementById('product-form');
        form.id.value = p.id;
        form.name.value = p.name;
        form.categoryId.value = p.categoryId;
        form.price.value = p.price;
        form.badge.value = p.badge || '';
        form.shortDescription.value = p.shortDescription || '';
        form.keyBenefits.value = typeof p.keyBenefits === 'object' ? JSON.stringify(p.keyBenefits, null, 2) : p.keyBenefits;
        form.affiliateUrl.value = p.affiliateUrl || '';
        form.secondaryUrl.value = p.secondaryUrl || '';
        form.image.value = p.image || '';
        document.getElementById('product-image-preview').src = p.image || '/assets/products/placeholder.png';
        document.getElementById('product-modal-title').textContent = 'Edit Luxury Asset';
        document.getElementById('product-modal').classList.remove('hidden');
    }

    async deleteProduct(id) {
        if (!confirm('Liquidate this product from the inventory?')) return;
        const res = await this.api(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            this.notify('Product liquidated.');
            await this.loadInitialData();
            this.renderProducts();
        }
    }

    /* ── TESTIMONIALS ──────────────────────────────────────────── */
    renderTestimonials() {
        const list = document.getElementById('testimonials-list');
        if (!list) return;

        if (!this.testimonials || this.testimonials.length === 0) {
            list.innerHTML = '<p class="col-span-full text-center italic font-serif opacity-40 py-20">No testimonials yet.</p>';
            return;
        }

        list.innerHTML = this.testimonials.map(t => `
            <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                <div class="flex mb-4">
                    ${Array(5).fill('<span class="material-symbols-outlined text-sm text-secondary">star</span>').join('')}
                </div>
                <p class="text-xl font-serif italic mb-4 leading-relaxed">"${t.text}"</p>
                <p class="text-sm font-bold text-primary mb-1">${t.quote}</p>
                <div class="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-60 mt-4 pt-4 border-t border-gray-50">
                    <span>${t.name} — ${t.location}</span>
                    <span class="uppercase text-[10px] tracking-widest">${t.region === 'us' ? '🇺🇸 USA' : '🇦🇪 UAE'}</span>
                </div>
                <div class="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-50">
                    <button onclick="window.mrtcms.editTestimonial('${t.id}')" class="p-2 hover:bg-gray-50 rounded-full text-primary transition-all"><span class="material-symbols-outlined text-lg">edit</span></button>
                    <button onclick="window.mrtcms.deleteTestimonial('${t.id}')" class="p-2 hover:bg-red-50 rounded-full text-red-500 transition-all"><span class="material-symbols-outlined text-lg">delete</span></button>
                </div>
            </div>
        `).join('');
    }

    editTestimonial(id) {
        const t = this.testimonials.find(item => item.id === id);
        if (!t) return;
        const form = document.getElementById('testimonial-form');
        form.id.value = t.id;
        form.name.value = t.name;
        form.location.value = t.location;
        form.quote.value = t.quote;
        form.text.value = t.text;
        form.region.value = t.region;
        document.getElementById('testimonial-modal-title').textContent = 'Edit Testimonial';
        document.getElementById('testimonial-modal').classList.remove('hidden');
    }

    async deleteTestimonial(id) {
        if (!confirm('Remove this testimonial?')) return;
        const res = await this.api(`/api/testimonials/${id}`, { method: 'DELETE' });
        if (res.ok) {
            this.notify('Testimonial removed.');
            await this.loadInitialData();
            this.renderTestimonials();
        }
    }

    /* ── CRUD LOGIC ────────────────────────────────────────────── */
    bindCRUDEvents() {
        // Modal toggles
        document.querySelectorAll('.open-category-modal').forEach(b => b.addEventListener('click', () => {
            const form = document.getElementById('category-form');
            form.reset();
            form.id.value = '';
            document.getElementById('category-image-preview').src = '/assets/categories/placeholder.png';
            document.getElementById('category-modal-title').textContent = 'New Collection';
            document.getElementById('category-modal').classList.remove('hidden');
        }));
        document.querySelectorAll('.open-product-modal').forEach(b => b.addEventListener('click', () => {
            const form = document.getElementById('product-form');
            form.reset();
            form.id.value = '';
            document.getElementById('product-image-preview').src = '/assets/products/placeholder.png';
            document.getElementById('product-modal-title').textContent = 'Add Global Sourcing';
            document.getElementById('product-modal').classList.remove('hidden');
        }));
        document.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', () => {
            document.querySelectorAll('[id$="-modal"]').forEach(m => m.classList.add('hidden'));
        }));

        // Testimonial modal
        document.querySelectorAll('.open-testimonial-modal').forEach(b => b.addEventListener('click', () => {
            const form = document.getElementById('testimonial-form');
            if (form) {
                form.reset();
                form.id.value = '';
                document.getElementById('testimonial-modal-title').textContent = 'New Testimonial';
                document.getElementById('testimonial-modal').classList.remove('hidden');
            }
        }));

        // Image Uploads
        this.setupImageUpload('category-image-input', 'category-image-preview', 'category-form');
        this.setupImageUpload('product-image-input', 'product-image-preview', 'product-form');

        // Form submissions
        document.getElementById('category-form').addEventListener('submit', (e) => this.handleFormSubmit(e, 'category'));
        document.getElementById('product-form').addEventListener('submit', (e) => this.handleFormSubmit(e, 'product'));

        // Testimonial form
        const testimonialForm = document.getElementById('testimonial-form');
        if (testimonialForm) {
            testimonialForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const id = form.id.value;
                const data = {
                    name: form.name.value,
                    location: form.location.value,
                    quote: form.quote.value,
                    text: form.text.value,
                    region: form.region.value
                };
                const method = id ? 'PUT' : 'POST';
                const url = id ? `/api/testimonials/${id}` : '/api/testimonials';
                const res = await this.api(url, {
                    method,
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    this.notify('Testimonial saved.');
                    document.getElementById('testimonial-modal').classList.add('hidden');
                    await this.loadInitialData();
                    this.renderTestimonials();
                } else {
                    this.notify('Operation failed.', 'error');
                }
            });
        }

        // Search & Filter
        document.getElementById('search-products').addEventListener('input', () => this.renderProducts());
        document.getElementById('filter-category').addEventListener('change', () => this.renderProducts());
    }

    setupImageUpload(inputId, previewId, formId) {
        document.getElementById(inputId).addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            this.notify('Optimizing asset...', 'info');
            const res = await this.api('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const { url } = await res.json();
                document.getElementById(previewId).src = url;
                document.getElementById(formId).image.value = url;
                this.notify('Asset optimized and stored.');
            } else {
                this.notify('Upload failed.', 'error');
            }
        });
    }

    async handleFormSubmit(e, type) {
        e.preventDefault();
        const form = e.target;
        const id = form.id.value;
        const data = Object.fromEntries(new FormData(form));

        // Handle types
        if (type === 'product') {
            try { data.keyBenefits = JSON.parse(data.keyBenefits || '[]'); } catch { data.keyBenefits = []; }
            data.isFeatured = form.isFeatured.checked;
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/${type}s/${id}` : `/api/${type}s`;

        const res = await this.api(url, {
            method,
            body: JSON.stringify(data)
        });

        if (res.ok) {
            this.notify(`${type === 'product' ? 'Product recorded' : 'Collection saved'}.`);
            document.getElementById(`${type}-modal`).classList.add('hidden');
            await this.loadInitialData();
            this.switchTab(`${type}s`);
        } else {
            this.notify('Operation failed.', 'error');
        }
    }

    /* ── UI HELPERS ────────────────────────────────────────────── */
    notify(message, type = 'success') {
        const toast = document.getElementById('toast');
        const icon = document.getElementById('toast-icon');
        const msg = document.getElementById('toast-message');

        icon.textContent = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
        msg.textContent = message;
        
        toast.className = `fixed bottom-10 right-10 z-[110] transition-all duration-500 flex ${type === 'error' ? 'bg-red-500' : 'bg-primary'} text-white px-8 py-5 rounded-[2rem] shadow-2xl items-center space-x-4`;
        
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.mrtcms = new MRTCMS();
});
