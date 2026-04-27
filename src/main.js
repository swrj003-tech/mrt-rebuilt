import './style.css';
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from './fallback-data.js';

/**
 * MRTApp - Main application class for MRT International Storefront
 * Manages navigation, product rendering, Quick View modal, and testimonials.
 */
class MRTApp {
  constructor() {
    this.allProducts = [];
    this.activeCategory = new URLSearchParams(window.location.search).get('c');
    this.init();

    // Bind global functions for inline onclick handlers
    window.openQuickView = (id) => this.openQuickView(id);
    window.closeQuickView = () => this.closeQuickView();
  }

  async syncCollectionsGrid() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    try {
      const response = await fetch('/api/categories?_t=' + Date.now());
      const categories = await response.json();
      
      grid.innerHTML = categories.map(cat => `
        <a href="category.html?c=${cat.slug}" class="category-card-v2" id="cat-card-${cat.id}">
          <div class="category-card-v2-img">
            <img src="${cat.image || '/assets/placeholder-category.jpg'}" alt="${cat.name}" onerror="this.src='/assets/editorial_v3/discovery_bg.png'">
          </div>
          <div class="category-card-v2-content">
            <h3>${cat.name}</h3>
            <p>${cat.description || 'Discover our curated selection of ' + cat.name + ' products.'}</p>
            <div class="category-card-v2-footer">
              <span>EXPLORE</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>
        </a>
      `).join('');
    } catch (err) {
      console.error('Failed to sync collections grid:', err);
    }
  }

  async init() {
    // FORCE CACHE CLEAR FOR NEW VERSION
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
    }
    
    this.setupMobileMenu();
    this.setupContactForm();
    this.handleScroll();
    this.createQuickViewModal();
    this.syncGlobalNavigation(); // 👈 New: Auto-sync menus

    const categoriesGrid = document.getElementById('categories-grid');
    const homeGrid = document.getElementById('products-home-grid') || document.getElementById('featured-products');
    const categoryGrid = document.getElementById('category-products-container');
    const communityGrid = document.getElementById('community-grid');

    const blogGrid = document.getElementById('blog-posts-container');

    if (homeGrid) {
      await this.fetchAndRender(homeGrid, 8);
    } else if (categoryGrid) {
      await this.fetchAndRender(categoryGrid, 50);
      // If we're on a category page, fetch its metadata
      try {
        const res = await fetch('/api/categories');
        const cats = await res.json();
        const active = cats.find(c => c.slug === this.activeCategory);
        if (active) this.updateCategoryUI(active);
      } catch {}
    } else if (blogGrid) {
      await this.fetchAndRenderBlog(blogGrid);
    }

    if (communityGrid) {
      this.renderTestimonials(communityGrid);
    }
  }

  // ── Global Navigation Sync ──
  async fetchProducts(category = null) {
    try {
      // FORCE CACHE BYPASS: Fetch directly from database for immediate sync
      const url = category 
        ? `/api/products?category=${category}&_t=${Date.now()}&limit=100` 
        : `/api/products?_t=${Date.now()}&limit=100`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Handle unified response format
      this.products = data.products || (Array.isArray(data) ? data : []);
      this.renderProducts();
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  }

  async syncGlobalNavigation() {
    try {
      const response = await fetch('/api/categories?_t=' + Date.now());
      const categories = await response.json();
      if (!categories || categories.length === 0) return;

      // 1. Sync Desktop Dropdown
      const navDropdown = document.getElementById('nav-categories-dropdown');
      if (navDropdown) {
        navDropdown.innerHTML = categories.map(c => `
          <a href="category.html?c=${c.slug}" class="nav-dropdown-item">${c.name}</a>
        `).join('');
      }

      // 2. Sync Mobile Menu
      const mobileList = document.getElementById('mobile-categories-list');
      if (mobileList) {
        mobileList.innerHTML = categories.map(c => `
          <a href="category.html?c=${c.slug}">
            <span class="material-symbols-outlined" style="font-size:18px;">label</span> ${c.name}
          </a>
        `).join('');
      }

      // 3. Sync Categories Grid (if on categories.html)
      const categoriesGrid = document.getElementById('categories-grid');
      if (categoriesGrid) {
        categoriesGrid.innerHTML = categories.map(cat => `
          <a href="category.html?c=${cat.slug}" class="avory-cat-card">
            <div class="cat-img-wrapper">
              <img src="${cat.image || '/assets/editorial_v3/hero.png'}" alt="${cat.name}" class="cat-img">
            </div>
            <div class="cat-meta">
              <h3 class="cat-title">${cat.name}</h3>
              <p class="cat-subtitle">${cat.theme?.subtitle || cat.description || 'Explore our curated selection.'}</p>
            </div>
          </a>
        `).join('');
      }
    } catch (err) {
      console.warn('[MRT] Navigation sync failed:', err);
    }
  }

  setupMobileMenu() {
    const menuBtn   = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const closeBtn  = document.getElementById('mobileNavClose');
    const backdrop  = document.getElementById('mobileNavBackdrop');

    if (menuBtn && mobileNav && closeBtn && backdrop) {
      menuBtn.addEventListener('click', () => {
        mobileNav.style.display = 'flex';
        setTimeout(() => mobileNav.classList.add('open'), 10);
      });

      const close = () => {
        mobileNav.classList.remove('open');
        setTimeout(() => mobileNav.style.display = 'none', 300);
      };

      closeBtn.addEventListener('click', close);
      backdrop.addEventListener('click', close);
    }
  }

  setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const originalText = button?.textContent || 'SEND MESSAGE';
      if (button) {
        button.disabled = true;
        button.textContent = 'SENDING...';
      }
      if (status) {
        status.style.display = 'block';
        status.textContent = 'Sending your message...';
      }

      try {
        const payload = Object.fromEntries(new FormData(form).entries());
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data.success === false) {
          throw new Error(data.error || 'Unable to send message');
        }
        form.reset();
        if (status) status.textContent = 'Message sent. We will get back to you soon.';
      } catch (error) {
        if (status) status.textContent = error.message || 'Message failed. Please email us directly.';
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    });
  }

  handleScroll() {
    const nav = document.querySelector('.mrt-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ── Quick View Modal ──
  createQuickViewModal() {
    if (document.getElementById('quickViewModal')) return;
    const modal = document.createElement('div');
    modal.id = 'quickViewModal';
    modal.className = 'qv-overlay';
    modal.innerHTML = `
      <div class="qv-panel">
        <button class="qv-close" onclick="closeQuickView()">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="qv-body">
          <div class="qv-image-col">
            <img id="qv-image" src="" alt="Product">
          </div>
          <div class="qv-info-col">
            <span class="qv-badge" id="qv-badge"></span>
            <h2 class="qv-title" id="qv-title"></h2>
            <div class="qv-rating" id="qv-rating"></div>
            <p class="qv-price" id="qv-price"></p>
            <p class="qv-description" id="qv-description"></p>
            <div class="qv-benefits" id="qv-benefits"></div>
            <a id="qv-buy-btn" href="#" target="_blank" class="qv-buy-btn">
              <span class="material-symbols-outlined">shopping_bag</span>
              Buy Now
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeQuickView();
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeQuickView();
    });
  }

  openQuickView(productId) {
    const product = this.allProducts.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    document.getElementById('qv-image').src = product.image || '';
    document.getElementById('qv-title').textContent = product.name || '';
    
    const badgeEl = document.getElementById('qv-badge');
    if (product.badge) {
      badgeEl.textContent = product.badge;
      badgeEl.style.display = 'inline-block';
    } else {
      badgeEl.style.display = 'none';
    }

    // Rating stars
    const rating = product.ratingValue || 5;
    const starsHtml = Array(Math.round(rating))
      .fill('<span class="material-symbols-outlined testimonial-star">star</span>')
      .join('');
    document.getElementById('qv-rating').innerHTML = starsHtml + `<span class="qv-rating-text">${rating.toFixed(1)}</span>`;

    // Price
    const priceEl = document.getElementById('qv-price');
    if (product.price && product.price > 0) {
      priceEl.textContent = `$${product.price.toFixed(2)}`;
      priceEl.style.display = 'block';
    } else {
      priceEl.style.display = 'none';
    }

    // Description
    document.getElementById('qv-description').textContent = product.description || product.shortBenefit || 'Discover this premium curated product.';

    // Key benefits
    const benefitsEl = document.getElementById('qv-benefits');
    const benefits = Array.isArray(product.keyBenefits) ? product.keyBenefits : [];
    if (benefits.length > 0) {
      benefitsEl.innerHTML = benefits.map(b =>
        `<div class="qv-benefit-item"><span class="material-symbols-outlined">check_circle</span>${b}</div>`
      ).join('');
      benefitsEl.style.display = 'block';
    } else {
      benefitsEl.style.display = 'none';
    }

    // Buy button
    const buyBtn = document.getElementById('qv-buy-btn');
    const isAffiliate = product.affiliateUrl && product.affiliateUrl.length > 5;
    buyBtn.href = isAffiliate ? product.affiliateUrl : `#`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ── Data Fetching ──
  async fetchAndRenderCategories(container) {
    try {
      this.showLoading(container);
      const response = await fetch('/api/categories?_t=' + Date.now());
      const categories = await response.json();

      if (!categories || categories.length === 0) {
        container.innerHTML = '<p class="no-products">No categories found in database.</p>';
        return;
      }

      container.innerHTML = categories.map(cat => `
        <a href="category.html?c=${cat.slug}" class="avory-cat-card group">
          <div class="avory-cat-bg" style="background-image: url('${cat.image || '/assets/editorial_v3/hero.png'}');"></div>
          <div class="avory-cat-overlay"></div>
          <div class="avory-cat-content">
            <h3 class="avory-cat-title">${cat.name}</h3>
            <p class="avory-cat-desc">${cat.theme?.seoIntro || cat.description || 'Explore our curated selection.'}</p>
            <span class="avory-cat-btn">Explore Now</span>
          </div>
        </a>
      `).join('');
    } catch (err) {
      console.error('[MRT] Categories sync failed:', err);
      container.innerHTML = '<p class="no-products">Database Syncing...</p>';
    }
  }

  async fetchAndRender(container, limit = 50) {
    try {
      this.showLoading(container);
      
      let url = '/api/products';
      const params = new URLSearchParams();
      if (this.activeCategory) params.append('category', this.activeCategory);
      params.append('_t', Date.now());
      url += '?' + params.toString();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API returned non-JSON response');
        }

        const data = await res.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        if (products.length > 0) {
          this.allProducts = products;
          this.renderProducts(container, products.slice(0, limit));
        } else {
          throw new Error('No products in DB');
        }
      } catch (innerErr) {
        console.warn('[MRT] API Failed:', innerErr.message);
        container.innerHTML = '<p class="no-products">Database connectivity issue. Please check back later.</p>';
      }

    } catch (err) {
      console.error('MRT CMS Error:', err);
      container.innerHTML = '<p class="no-products">Connection Error.</p>';
    }
  }

  showLoading(container) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 100px 0; text-align: center; opacity: 0.4;">
        <span class="material-symbols-outlined animate-spin" style="font-size: 48px; margin-bottom: 20px;">refresh</span>
        <p style="font-weight: 500;">Curating your collection...</p>
      </div>
    `;
  }

  renderProducts(container, products) {
    if (this.activeCategory && container.id === 'category-products-container') {
      // 3-SECTION LAYOUT for Category Pages
      const topPicks = products.filter(p => p.badge === 'Top Pick');
      const trending = products.filter(p => p.badge === 'Trending Now');
      const editor   = products.filter(p => p.badge === "Editor's Choice");
      const others   = products.filter(p => !['Top Pick', 'Trending Now', "Editor's Choice"].includes(p.badge));

      let html = '';

      if (topPicks.length > 0) {
        html += `<div class="category-section-title">⭐ Top Picks</div>`;
        html += `<div class="products-grid">${topPicks.map(p => this.createProductCard(p)).join('')}</div>`;
      }

      if (trending.length > 0) {
        html += `<div class="category-section-title">🔥 Trending Now</div>`;
        html += `<div class="products-grid">${trending.map(p => this.createProductCard(p)).join('')}</div>`;
      }

      if (editor.length > 0) {
        html += `<div class="category-section-title">💡 Editor’s Choice</div>`;
        html += `<div class="products-grid">${editor.map(p => this.createProductCard(p)).join('')}</div>`;
      }

      if (others.length > 0 && html === '') {
        html += `<div class="products-grid">${others.map(p => this.createProductCard(p)).join('')}</div>`;
      }

      container.innerHTML = html || '<p class="no-products">No products found in this selection.</p>';
    } else {
      // Standard grid for homepage
      container.innerHTML = `<div class="products-grid">${products.map(p => this.createProductCard(p)).join('')}</div>`;
    }
  }

  updateCategoryUI(categoryData) {
    const titleEl = document.getElementById('category-title-display');
    const descEl = document.getElementById('category-desc-display');
    const hero = document.getElementById('category-hero');

    if (categoryData) {
      if (titleEl) {
        titleEl.innerText = categoryData.theme?.title || categoryData.name;
        titleEl.classList.add('seo-title');
      }
      if (descEl) {
        descEl.innerText = categoryData.theme?.seoIntro || categoryData.description || 'Explore our curated selection.';
        descEl.classList.add('seo-intro');
      }
      if (hero && categoryData.image) {
        hero.style.backgroundImage = `url('${categoryData.image}')`;
      }
    }
  }

  // ── Product Card (Affiliate Style) ──
  createProductCard(p) {
    const buyUrl = p.affiliateUrl || '#';
    const secondaryUrl = p.secondaryUrl || buyUrl;
    const ratingText = p.ratingText || '4.8/5 Recommended';
    
    const badgeHtml = p.badge 
      ? `<span class="pc-badge ${p.badge.toLowerCase().replace(/\s+/g, '-')}">${p.badge}</span>` 
      : '';
      
    const benefits = Array.isArray(p.keyBenefits) ? p.keyBenefits : [];
    const benefitsHtml = benefits.length > 0 
      ? `<ul class="pc-benefits-list">
          ${benefits.map(b => `<li><span class="material-symbols-outlined">check_circle</span> ${b}</li>`).join('')}
         </ul>`
      : '';
      
    const imageUrl = p.image || '/assets/placeholder-product.jpg';

    return `
      <article class="pc-card affiliate-card" data-id="${p.id}">
        <div class="pc-img-wrap">
          <img src="${imageUrl}" alt="${p.name}" loading="lazy" onerror="this.src='/assets/placeholder-product.jpg';this.onerror=null;">
          ${badgeHtml}
        </div>
        <div class="pc-info">
          <div class="pc-header">
            <div class="pc-rating-tag">⭐ ${ratingText}</div>
            <h3 class="pc-name">${p.name}</h3>
          </div>
          
          <p class="pc-description">${p.shortDescription || ''}</p>
          
          ${benefitsHtml}
          
          <div class="pc-actions">
            ${p.price && p.price > 0 ? `<div class="pc-price-row"><span class="pc-price">$${Number(p.price).toFixed(2)}</span><span class="pc-price-note">via Amazon</span></div>` : ''}
            <a href="${buyUrl}" target="_blank" rel="noopener" class="pc-btn primary-btn">
              Check Latest Price
              <span class="material-symbols-outlined">open_in_new</span>
            </a>
            <a href="${secondaryUrl}" target="_blank" rel="noopener" class="pc-btn secondary-btn">
              View Deal
            </a>
          </div>
          
          <p class="pc-disclaimer">Price and availability may vary. As an Amazon Associate, we earn from qualifying purchases.</p>
        </div>
      </article>
    `;
  }

  async fetchAndRenderBlog(container) {
    try {
      this.showLoading(container);
      const res = await fetch('/api/blog?_t=' + Date.now());
      const posts = await res.json();
      
      if (!posts || posts.length === 0) {
        const emptyEl = document.getElementById('blogEmpty');
        if (emptyEl) emptyEl.style.display = 'flex';
        container.innerHTML = '';
        return;
      }

      container.innerHTML = `
        <div class="blog-grid">
          ${posts.map((post, idx) => {
            const isFeature = idx === 0 && posts.length > 2;
            const dateStr = post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
            const author = post.author || 'MRT Editorial';
            const tag = post.tag || post.category || 'Editorial';
            return `
            <article class="blog-card${isFeature ? ' blog-card-featured' : ''}">
              <div class="blog-card-img">
                ${post.coverImage
                  ? `<img src="${post.coverImage}" alt="${post.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'blog-card-img-placeholder\\'><span class=\\'material-symbols-outlined\\'>article</span></div>'">`
                  : `<div class="blog-card-img-placeholder"><span class="material-symbols-outlined">article</span></div>`
                }
                <span class="blog-card-tag">${tag}</span>
              </div>
              <div class="blog-card-body">
                <div class="blog-card-meta">
                  <span class="blog-card-author">${author}</span>
                  <span class="blog-card-dot">·</span>
                  <span>${dateStr}</span>
                </div>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt || ''}</p>
                <a href="blog-post.html?slug=${post.slug}" class="blog-card-cta">
                  Read Story <span class="material-symbols-outlined" style="font-size:16px;">arrow_forward</span>
                </a>
              </div>
            </article>`;
          }).join('')}
        </div>
      `;
    } catch (err) {
      console.error('Blog Fetch Error:', err);
      container.innerHTML = '<p class="no-products">Connection issue. Please try again later.</p>';
    }
  }

  // ── Testimonials ──
  async renderTestimonials(container) {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();

      if (data && data.length > 0) {
        const usTestimonials = data.filter(t => t.region === 'us');
        const uaeTestimonials = data.filter(t => t.region === 'ae');

        let html = '';

        if (usTestimonials.length > 0) {
          html += `
            <div class="testimonial-region">
              <h3 class="region-header">🇺🇸 United States Customers</h3>
              <div class="testimonial-grid">
                ${usTestimonials.map(t => this.createTestimonialCard(t)).join('')}
              </div>
            </div>
          `;
        }

        if (uaeTestimonials.length > 0) {
          html += `
            <div class="testimonial-region">
              <h3 class="region-header">🇦🇪 United Arab Emirates Customers</h3>
              <div class="testimonial-grid">
                ${uaeTestimonials.map(t => this.createTestimonialCard(t)).join('')}
              </div>
            </div>
          `;
        }

        container.innerHTML = html;
        container.classList.remove('testimonial-grid');
      }
    } catch (err) {
      console.error('Testimonials Error:', err);
    }
  }

  createTestimonialCard(t) {
    const flags = { 'us': '🇺🇸', 'ae': '🇦🇪', 'uk': '🇬🇧', 'ca': '🇨🇦' };
    const flag = flags[(t.region || '').toLowerCase()] || '🌍';
    const stars = Array(t.rating || 5)
      .fill('<span class="material-symbols-outlined testimonial-star">star</span>')
      .join('');

    const quoteHtml = t.quote && t.quote !== 'null' ? `<p class="testimonial-quote">"${t.quote}"</p>` : '';
    const textHtml = t.text && t.text !== 'null' ? `<p class="testimonial-text">${t.text}</p>` : '';

    return `
      <div class="testimonial-card">
        <div class="testimonial-badge">
          <span class="material-symbols-outlined" style="font-size: 14px;">verified</span>
          Verified Buyer
        </div>
        <div class="testimonial-stars-wrap">${stars}</div>
        ${quoteHtml}
        ${textHtml}
        <div class="testimonial-author">
          <div class="author-flag">${flag}</div>
          <div class="author-info">
            <h4>${t.name || 'Anonymous'}</h4>
            <p>${t.location || ''}</p>
          </div>
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MRTApp();
});
